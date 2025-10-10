// app/api/scheme/[code]/lumpsum/route.js
import axios from 'axios';

let cache = {}; // { [schemeCode]: { navHistory, timestamp } }
const CACHE_DURATION = 1000 * 60 * 10; // 10 minutes

function parseDate(str) {
  return new Date(str + 'T00:00:00');
}

function calculateLumpsum(navHistory, amount, fromDate, toDate) {
  const sortedNAV = navHistory.slice().sort((a, b) => new Date(a.date) - new Date(b.date));

  // Find NAV at start date or next available
  const startEntry = sortedNAV.find(e => parseDate(e.date) >= fromDate);
  // Latest NAV or closest before end date
  const endEntry = sortedNAV.slice().reverse().find(e => parseDate(e.date) <= toDate);

  if (!startEntry || !endEntry) {
    return { error: 'No NAV data for given period' };
  }

  const units = amount / startEntry.nav;
  const currentValue = units * endEntry.nav;

  const absoluteReturn = ((currentValue - amount) / amount) * 100;

  const durationDays = (toDate - fromDate) / (1000 * 60 * 60 * 24);
  const annualizedReturn =
    durationDays >= 30 ? ((1 + absoluteReturn / 100) ** (365 / durationDays) - 1) * 100 : null;

  return {
    investedAmount: parseFloat(amount.toFixed(2)),
    currentValue: parseFloat(currentValue.toFixed(2)),
    absoluteReturn: parseFloat(absoluteReturn.toFixed(2)),
    annualizedReturn: annualizedReturn ? parseFloat(annualizedReturn.toFixed(2)) : null,
    units: parseFloat(units.toFixed(4)),
    startDate: startEntry.date,
    endDate: endEntry.date,
  };
}

export async function POST(request, { params }) {
  const { code } = params;

  try {
    const body = await request.json();
    const { amount, from, to } = body;

    if (!amount || !from || !to) {
      return new Response(JSON.stringify({ error: 'Missing parameters' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Fetch NAV history (cached)
    if (!cache[code] || Date.now() - cache[code].timestamp > CACHE_DURATION) {
      const response = await axios.get(`https://api.mfapi.in/mf/${code}`);
      const navHistory = response.data.data.map(item => ({
        date: item.date,
        nav: parseFloat(item.nav),
      }));
      cache[code] = { navHistory, timestamp: Date.now() };
    }

    const navHistory = cache[code].navHistory;

    const fromDate = parseDate(from);
    const toDate = parseDate(to);

    const result = calculateLumpsum(navHistory, amount, fromDate, toDate);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error calculating Lumpsum:', error.message);
    return new Response(JSON.stringify({ error: 'Failed to calculate Lumpsum' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
