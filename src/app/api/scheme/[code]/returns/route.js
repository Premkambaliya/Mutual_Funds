import axios from "axios";

let cache = {}; // { [schemeCode]: { navHistory, timestamp } }
const CACHE_DURATION = 1000 * 60 * 10; // 10 minutes

// Convert "DD-MM-YYYY" to Date
function parseDate(str) {
  const [dd, mm, yyyy] = str.split("-");
  return new Date(`${yyyy}-${mm}-${dd}T00:00:00`);
}

function calculateReturns(navHistory, startDate, endDate) {
  // NAV is oldest first
  const startEntry = [...navHistory].reverse().find(e => parseDate(e.date) <= startDate);
  const endEntry = [...navHistory].reverse().find(e => parseDate(e.date) <= endDate);

  if (!startEntry || !endEntry) {
    return { error: "No NAV data for given period" };
  }

  const startNAV = startEntry.nav;
  const endNAV = endEntry.nav;

  const simpleReturn = ((endNAV - startNAV) / startNAV) * 100;

  const durationDays = (endDate - startDate) / (1000 * 60 * 60 * 24);
  const annualizedReturn =
    durationDays >= 30
      ? ((1 + simpleReturn / 100) ** (365 / durationDays) - 1) * 100
      : null;

  return {
    startDate: startEntry.date,
    endDate: endEntry.date,
    startNAV,
    endNAV,
    simpleReturn: parseFloat(simpleReturn.toFixed(2)),
    annualizedReturn: annualizedReturn ? parseFloat(annualizedReturn.toFixed(2)) : null,
  };
}

export async function GET(request, { params }) {
  const { code } = params;
  const url = new URL(request.url);
  const period = url.searchParams.get("period");
  const from = url.searchParams.get("from");
  const to = url.searchParams.get("to");

  try {
    // Cache
    if (!cache[code] || Date.now() - cache[code].timestamp > CACHE_DURATION) {
      const response = await axios.get(`https://api.mfapi.in/mf/${code}`);
      // Reverse → oldest first
      const navHistory = response.data.data
        .map(item => ({
          date: item.date,
          nav: parseFloat(item.nav),
        }))
        .reverse();
      cache[code] = { navHistory, timestamp: Date.now() };
    }

    const navHistory = cache[code].navHistory;

    let startDate, endDate;

    // use last available NAV date as endDate
    const lastEntry = navHistory[navHistory.length - 1];
    endDate = parseDate(lastEntry.date);

    if (period) {
      switch (period) {
        case "1m":
          startDate = new Date(endDate);
          startDate.setMonth(startDate.getMonth() - 1);
          break;
        case "2m":
          startDate = new Date(endDate);
          startDate.setMonth(startDate.getMonth() - 2);
          break;
        case "3m":
          startDate = new Date(endDate);
          startDate.setMonth(startDate.getMonth() - 3);
          break;
        case "6m":
          startDate = new Date(endDate);
          startDate.setMonth(startDate.getMonth() - 6);
          break;
        case "1y":
          startDate = new Date(endDate);
          startDate.setFullYear(startDate.getFullYear() - 1);
          break;
        default:
          return new Response(JSON.stringify({ error: "Invalid period" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
      }
    } else if (from && to) {
      startDate = new Date(from);
      endDate = new Date(to);
    } else {
      return new Response(JSON.stringify({ error: "Provide period or from/to dates" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Filter NAV history for the given duration
    const filteredData = navHistory.filter(entry => {
      const entryDate = parseDate(entry.date);
      return entryDate >= startDate && entryDate <= endDate;
    });

    if (filteredData.length === 0) {
      return new Response(JSON.stringify({ error: "No NAV data found for given period" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Calculate returns using first + last entry in filtered data
    const returns = calculateReturns(filteredData, startDate, endDate);

    return new Response(JSON.stringify({
      schemeCode: code,
      ...returns,
      count: filteredData.length,
      navHistory: filteredData
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error calculating returns:", error.message);
    return new Response(JSON.stringify({ error: "Failed to calculate returns" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
