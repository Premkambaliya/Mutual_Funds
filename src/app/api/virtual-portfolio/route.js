// import { dbConnect } from '../../../lib/dbConnect';
// import VirtualPortfolio from '../../../../src/models/virtual_portfolio';
// import axios from 'axios';

// // Helpers
// function parseNavDate(ddmmyyyy) {
//   // MFAPI returns dates as dd-mm-yyyy
//   if (!ddmmyyyy) return null;
//   const parts = ddmmyyyy.split('-');
//   if (parts.length !== 3) return null;
//   const [dd, mm, yyyy] = parts;
//   return new Date(`${yyyy}-${mm}-${dd}`);
// }

// function findNavOnOrBefore(navHistory, targetDate) {
//   // navHistory expected as array of { date: 'dd-mm-yyyy', nav: number } with newest-first order
//   if (!navHistory || !navHistory.length) return null;
//   for (const rec of navHistory) {
//     const rd = parseNavDate(rec.date);
//     if (!rd) continue;
//     if (rd <= targetDate) return rec;
//   }
//   return null;
// }

// async function fetchSchemeNavHistory(scheme_code) {
//   try {
//     const res = await axios.get(`https://api.mfapi.in/mf/${scheme_code}`);
//     const data = res.data;
//     // map to {date, nav} newest-first (mfapi returns newest-first already)
//     return (data.data || []).map(i => ({ date: i.date, nav: parseFloat(i.nav) }));
//   } catch (err) {
//     console.error('fetchSchemeNavHistory error', err.message || err);
//     return [];
//   }
// }

// // simple in-memory cache to reduce MFAPI calls during one request cycle
// const navCache = new Map();
// async function fetchSchemeNavHistoryCached(scheme_code) {
//   const key = String(scheme_code);
//   if (navCache.has(key)) return navCache.get(key);
//   const data = await fetchSchemeNavHistory(scheme_code);
//   navCache.set(key, data);
//   return data;
// }

// async function computePortfolioStats(portfolio) {
//   // returns a copy enriched with per-sip computed and portfolio totals
//   const p = JSON.parse(JSON.stringify(portfolio));
//   let totalInvested = 0;
//   let totalCurrentValue = 0;
//   if (p.sips && p.sips.length) {
//     for (let i = 0; i < p.sips.length; i++) {
//       const s = p.sips[i];
//       // use cached fetch
//       const navHistory = await fetchSchemeNavHistoryCached(s.scheme_code);
//       // compute using existing computeSipStats but adapt to reuse navHistory
//       // small inline variant to avoid extra MFAPI calls
//       const start = new Date(s.startDate);
//       const today = new Date();
//       let currentDate = new Date(start);
//       let totalUnits = 0;
//       let installments = 0;
//       const installmentRecords = [];
//       while (currentDate <= today) {
//         // find nav on or before currentDate from navHistory
//         const rec = navHistory.find(r => {
//           const rd = parseNavDate(r.date);
//           return rd && rd <= currentDate;
//         });
//         if (rec) {
//           const units = Number((s.amount / rec.nav).toFixed(6));
//           totalUnits += units;
//           installments += 1;
//           installmentRecords.push({ date: currentDate.toISOString().slice(0,10), units, nav: rec.nav });
//         }
//         currentDate = advanceDateByFrequency(currentDate, s.frequency || 'monthly');
//         if (installments > 1000) break;
//       }

//       const latestNav = navHistory.length ? navHistory[0].nav : 0;
//       const invested = installments * (s.amount || 0);
//       const currentValue = totalUnits * latestNav;
//       const roi = invested > 0 ? ((currentValue - invested) / invested) * 100 : 0;

//       p.sips[i].computed = { totalUnits, installments, invested, currentValue, roi, latestNav, installmentRecords };
//       totalInvested += invested;
//       totalCurrentValue += currentValue;
//     }
//   }

//   p.portfolioSummary = {
//     totalInvested,
//     totalCurrentValue,
//     totalROI: totalInvested > 0 ? ((totalCurrentValue - totalInvested) / totalInvested) * 100 : 0,
//   };
//   return p;
// }

// function advanceDateByFrequency(d, frequency) {
//   const nd = new Date(d);
//   if (frequency === 'monthly') nd.setMonth(nd.getMonth() + 1);
//   else if (frequency === 'quarterly') nd.setMonth(nd.getMonth() + 3);
//   else if (frequency === 'yearly') nd.setFullYear(nd.getFullYear() + 1);
//   else nd.setMonth(nd.getMonth() + 1);
//   return nd;
// }

// async function computeSipStats(sip) {
//   // sip: { scheme_code, startDate, amount, frequency }
//   const navHistory = await fetchSchemeNavHistory(sip.scheme_code);
//   const start = new Date(sip.startDate);
//   const today = new Date();
//   let currentDate = new Date(start);
//   let totalUnits = 0;
//   let installments = 0;
//   const installmentRecords = [];

//   while (currentDate <= today) {
//     const rec = findNavOnOrBefore(navHistory, currentDate);
//     if (rec) {
//       const units = Number((sip.amount / rec.nav).toFixed(6));
//       totalUnits += units;
//       installments += 1;
//       installmentRecords.push({ date: currentDate.toISOString().slice(0,10), units, nav: rec.nav });
//     }
//     currentDate = advanceDateByFrequency(currentDate, sip.frequency || 'monthly');
//     // safety: avoid infinite loops
//     if (installments > 1000) break;
//   }

//   const latestNav = navHistory.length ? navHistory[0].nav : 0;
//   const invested = installments * (sip.amount || 0);
//   const currentValue = totalUnits * latestNav;
//   const roi = invested > 0 ? ((currentValue - invested) / invested) * 100 : 0;

//   return { totalUnits, installments, invested, currentValue, roi, latestNav, installmentRecords };
// }

// export async function GET(request) {
//   try {
//     await dbConnect();
//     const portfolios = await VirtualPortfolio.find({}).lean();

//     // enrich portfolios with computed SIP stats (async)
//     const enriched = await Promise.all(portfolios.map(async (p) => {
//       const copy = { ...p };
//       if (copy.sips && copy.sips.length) {
//         copy.sips = await Promise.all(copy.sips.map(async (s) => {
//           const sip = { ...s };
//           try {
//             const stats = await computeSipStats(sip);
//             sip.computed = stats;
//           } catch (err) {
//             sip.computed = { error: 'compute_failed' };
//           }
//           return sip;
//         }));
//       }
//       return copy;
//     }));

//     return new Response(JSON.stringify(enriched), { status: 200, headers: { 'Content-Type': 'application/json' } });
//   } catch (err) {
//     console.error('VirtualPortfolio GET error', err.message || err);
//     return new Response(JSON.stringify({ error: 'Failed to fetch portfolios' }), { status: 500 });
//   }
// }

// export async function POST(request) {
//   try {
//     await dbConnect();
//     const body = await request.json();
//     const created = await VirtualPortfolio.create(body);
//     // return enriched portfolio
//     const enriched = await computePortfolioStats(created.toObject());
//     return new Response(JSON.stringify(enriched), { status: 201, headers: { 'Content-Type': 'application/json' } });
//   } catch (err) {
//     console.error('VirtualPortfolio POST error', err.message || err);
//     return new Response(JSON.stringify({ error: 'Failed to create portfolio' }), { status: 500 });
//   }
// }

// export async function PATCH(request) {
//   try {
//     await dbConnect();
//     const body = await request.json();
//     const { id, action, payload } = body;
//     if (!id) return new Response(JSON.stringify({ error: 'id required' }), { status: 400 });
//     const doc = await VirtualPortfolio.findById(id);
//     if (!doc) return new Response(JSON.stringify({ error: 'not found' }), { status: 404 });

//     if (action === 'addSip') {
//       // normalize payload
//       const sipPayload = {
//         scheme_code: Number(payload.scheme_code),
//         startDate: new Date(payload.startDate),
//         amount: Number(payload.amount),
//         frequency: payload.frequency || 'monthly',
//         unitsAccumulated: 0,
//       };

//       // compute units and create transactions for each installment
//       const stats = await computeSipStats(sipPayload);
//       sipPayload.unitsAccumulated = stats.totalUnits;
//       doc.sips.push(sipPayload);

//       // add transactions for the SIP installments
//       if (stats.installmentRecords && stats.installmentRecords.length) {
//         for (const it of stats.installmentRecords) {
//           doc.transactions.push({ type: 'sip', scheme_code: sipPayload.scheme_code, units: it.units, price: it.nav, amount: Number((it.units * it.nav).toFixed(2)), date: new Date(it.date) });
//         }
//       }
//     } else if (action === 'updateCash') {
//       doc.cash = payload.cash;
//     } else if (action === 'buyCoin') {
//       // payload: { symbol, units, price }
//       const { symbol, units, price } = payload;
//       const cost = units * price;
//       if (cost > doc.cash) return new Response(JSON.stringify({ error: 'insufficient cash' }), { status: 400 });
//       // deduct cash
//       doc.cash -= cost;
//       // add coin holding
//       const ch = doc.coins.find(c => c.symbol === symbol);
//       if (ch) ch.units += units; else doc.coins.push({ symbol, units });
//       // add transaction
//       doc.transactions.push({ type: 'buy', symbol, units, price, amount: cost, date: new Date() });
//     } else if (action === 'sellCoin') {
//       const { symbol, units, price } = payload;
//       const ch = doc.coins.find(c => c.symbol === symbol);
//       if (!ch || ch.units < units) return new Response(JSON.stringify({ error: 'insufficient units' }), { status: 400 });
//       ch.units -= units;
//       const proceeds = units * price;
//       doc.cash += proceeds;
//       doc.transactions.push({ type: 'sell', symbol, units, price, amount: proceeds, date: new Date() });
//     }

//     await doc.save();
//     // compute enriched portfolio to return
//     const enriched = await computePortfolioStats(doc.toObject());
//     return new Response(JSON.stringify(enriched), { status: 200, headers: { 'Content-Type': 'application/json' } });
//   } catch (err) {
//     console.error('VirtualPortfolio PATCH error', err.message || err);
//     return new Response(JSON.stringify({ error: 'Failed to update portfolio' }), { status: 500 });
//   }
// }


























// import { dbConnect } from "@/lib/dbConnect";
// import VirtualPortfolio from "@/models/virtual_portfolio";
// import jwt from "jsonwebtoken";

// export async function GET(req) {
//   try {
//     await dbConnect();

//     const token = req.headers.get("authorization")?.split(" ")[1];
//     if (!token) {
//       return Response.json({ message: "Authorization token required" }, { status: 401 });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const portfolio = await VirtualPortfolio.findOne({ userId: decoded.id });

//     return Response.json({ portfolio: portfolio || { investments: [] } }, { status: 200 });
//   } catch (error) {
//     console.error("Portfolio fetch error:", error);
//     return Response.json({ message: "Error fetching portfolio" }, { status: 500 });
//   }
// }

// export async function POST(req) {
//   try {
//     await dbConnect();

//     const token = req.headers.get("authorization")?.split(" ")[1];
//     if (!token) {
//       return Response.json({ message: "Authorization token required" }, { status: 401 });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const { schemeCode, schemeName, type, amount, date } = await req.json();

//     let portfolio = await VirtualPortfolio.findOne({ userId: decoded.id });
//     if (!portfolio) {
//       portfolio = new VirtualPortfolio({ userId: decoded.id, investments: [] });
//     }

//     portfolio.investments.push({ schemeCode, schemeName, type, amount, date });
//     await portfolio.save();

//     return Response.json({ message: "Investment added to portfolio", portfolio }, { status: 200 });
//   } catch (error) {
//     console.error("Portfolio add error:", error);
//     return Response.json({ message: "Error adding to portfolio" }, { status: 500 });
//   }
// }

// export async function DELETE(req) {
//   try {
//     await dbConnect();

//     const token = req.headers.get("authorization")?.split(" ")[1];
//     if (!token) {
//       return Response.json({ message: "Authorization token required" }, { status: 401 });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const { investmentId } = await req.json(); // Assume deleting by _id of investment

//     const portfolio = await VirtualPortfolio.findOne({ userId: decoded.id });
//     if (portfolio) {
//       portfolio.investments = portfolio.investments.filter(inv => inv._id.toString() !== investmentId);
//       await portfolio.save();
//     }

//     return Response.json({ message: "Investment removed from portfolio", portfolio }, { status: 200 });
//   } catch (error) {
//     console.error("Portfolio remove error:", error);
//     return Response.json({ message: "Error removing from portfolio" }, { status: 500 });
//   }
// }










import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/user";
import jwt from "jsonwebtoken";

export async function GET(req) {
  try {
    await dbConnect();
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return Response.json({ message: "Authorization token required" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback-secret");
    const user = await User.findById(decoded.id, "virtualPortfolio").lean();

    if (!user) {
      return Response.json({ message: "User not found" }, { status: 404 });
    }

    return Response.json({ portfolios: user.virtualPortfolio || [] }, { status: 200 });
  } catch (error) {
    console.error("GET /api/virtual-portfolio error:", error.message, error.stack);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return Response.json({ message: "Authorization token required" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback-secret");
    const { portfolioName, schemeCode, schemeName, type, amount, date } = await req.json();

    if (!portfolioName) {
      return Response.json({ message: "portfolioName is required" }, { status: 400 });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return Response.json({ message: "User not found" }, { status: 404 });
    }

    let portfolio = user.virtualPortfolio.find(p => p.name === portfolioName);
    if (!portfolio) {
      portfolio = { name: portfolioName, investments: [], createdAt: new Date() };
      user.virtualPortfolio.push(portfolio);
    }

    if (schemeCode && type && amount && date) {
      portfolio.investments.push({ schemeCode, schemeName: schemeName || "", type, amount, date });
    }

    await user.save();
    return Response.json({ message: "Portfolio updated", portfolios: user.virtualPortfolio }, { status: 200 });
  } catch (error) {
    console.error("POST /api/virtual-portfolio error:", error.message, error.stack);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    await dbConnect();
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return Response.json({ message: "Authorization token required" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback-secret");
    const { portfolioName, investmentId } = await req.json();

    if (!portfolioName) {
      return Response.json({ message: "portfolioName is required" }, { status: 400 });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return Response.json({ message: "User not found" }, { status: 404 });
    }

    const portfolioIndex = user.virtualPortfolio.findIndex(p => p.name === portfolioName);
    if (portfolioIndex === -1) {
      return Response.json({ message: "Portfolio not found" }, { status: 404 });
    }

    if (investmentId) {
      user.virtualPortfolio[portfolioIndex].investments = user.virtualPortfolio[portfolioIndex].investments.filter(
        inv => inv._id.toString() !== investmentId
      );
    } else {
      user.virtualPortfolio.splice(portfolioIndex, 1);
    }

    await user.save();
    return Response.json({ message: "Portfolio updated", portfolios: user.virtualPortfolio }, { status: 200 });
  } catch (error) {
    console.error("DELETE /api/virtual-portfolio error:", error.message, error.stack);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}