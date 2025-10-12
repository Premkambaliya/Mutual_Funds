// import { dbConnect } from '../../../lib/dbConnect';
// import Watchlist from '../../../../src/models/watchlist';

// export async function GET(request) {
//   try {
//     await dbConnect();
//     const items = await Watchlist.find({}).lean();
//     return new Response(JSON.stringify(items), { status: 200, headers: { 'Content-Type': 'application/json' } });
//   } catch (err) {
//     console.error('Watchlist GET error', err.message || err);
//     return new Response(JSON.stringify({ error: 'Failed to fetch watchlist' }), { status: 500 });
//   }
// }

// export async function POST(request) {
//   try {
//     await dbConnect();
//     const body = await request.json();
//     const { scheme_code, email } = body;
//     if (!scheme_code) return new Response(JSON.stringify({ error: 'scheme_code required' }), { status: 400 });
//     const existing = await Watchlist.findOne({ scheme_code, email });
//     if (existing) return new Response(JSON.stringify(existing), { status: 200 });
//     const created = await Watchlist.create({ scheme_code, email });
//     return new Response(JSON.stringify(created), { status: 201 });
//   } catch (err) {
//     console.error('Watchlist POST error', err.message || err);
//     return new Response(JSON.stringify({ error: 'Failed to add to watchlist' }), { status: 500 });
//   }
// }

// export async function DELETE(request) {
//   try {
//     await dbConnect();
//     const { searchParams } = new URL(request.url);
//     const scheme_code = Number(searchParams.get('scheme_code'));
//     const email = searchParams.get('email') || null;
//     if (!scheme_code) return new Response(JSON.stringify({ error: 'scheme_code required' }), { status: 400 });
//     await Watchlist.deleteMany({ scheme_code, email });
//     return new Response(JSON.stringify({ ok: true }), { status: 200 });
//   } catch (err) {
//     console.error('Watchlist DELETE error', err.message || err);
//     return new Response(JSON.stringify({ error: 'Failed to remove from watchlist' }), { status: 500 });
//   }
// }


import { dbConnect } from "@/lib/dbConnect";
import Watchlist from "@/models/watchlist";
import jwt from "jsonwebtoken";

export async function GET(req) {
  try {
    await dbConnect();
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return Response.json({ message: "Authorization token required" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback-secret");
    const watchlist = await Watchlist.findOne({ userId: decoded.id }).lean();

    return Response.json({ watchlist: watchlist || { funds: [] } }, { status: 200 });
  } catch (error) {
    console.error("GET /api/watchlist error:", error.message, error.stack);
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
    const { schemeCode, schemeName } = await req.json();

    if (!schemeCode) {
      return Response.json({ message: "schemeCode is required" }, { status: 400 });
    }

    let watchlist = await Watchlist.findOne({ userId: decoded.id });
    if (!watchlist) {
      watchlist = new Watchlist({ userId: decoded.id, funds: [] });
    }

    if (!watchlist.funds.some(fund => fund.schemeCode === schemeCode)) {
      watchlist.funds.push({ schemeCode, schemeName: schemeName || "" });
      await watchlist.save();
    }

    return Response.json({ message: "Fund added to watchlist", watchlist }, { status: 200 });
  } catch (error) {
    console.error("POST /api/watchlist error:", error.message, error.stack);
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
    const { schemeCode } = await req.json();

    if (!schemeCode) {
      return Response.json({ message: "schemeCode is required" }, { status: 400 });
    }

    const watchlist = await Watchlist.findOne({ userId: decoded.id });
    if (watchlist) {
      watchlist.funds = watchlist.funds.filter(fund => fund.schemeCode !== schemeCode);
      await watchlist.save();
    }

    return Response.json({ message: "Fund removed from watchlist", watchlist }, { status: 200 });
  } catch (error) {
    console.error("DELETE /api/watchlist error:", error.message, error.stack);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}