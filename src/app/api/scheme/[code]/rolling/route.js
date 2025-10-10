// app/api/scheme/[code]/rolling/route.js
import axios from 'axios';

let cache = {}; // { [schemeCode]: { navHistory, timestamp } }
const CACHE_DURATION = 1000 * 60 * 10; // 10 minutes

function parseDate(str) {
  return new Date(str + 'T00:00:00');
}

function calculateRollingReturns(navHistory, periodMonths) {
  const sortedNAV = navHistory
    .slice()
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const results = [];

  for (let i = 0; i < sortedNAV.length; i++) {
    const startEntry = sortedNAV[i];
    const startDate = parseDate(startEntry.date);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + periodMonths);

    // Find NAV at end date or closest before
    const endEntry = sortedNAV.slice(i).find(e => parseDate(e.date) >= endDate);
    if (!endEntry) break;

    const simpleReturn = ((endEntry.nav - startEntry.nav) / startEntry.nav) * 100;
    const durationDays = (parseDate(endEntry.date) - startDate) / (1000 * 60 * 60 * 24);
    const annualizedReturn = durationDays >= 30 ? ((1 + simpleReturn / 100) ** (365 / durationDays) - 1) * 100 : null;

    results.push({
      startDate: startEntry.date,
      endDate: endEntry.date,
      startNAV: startEntry.nav,
      endNAV: endEntry.nav,
      simpleReturn: parseFloat(simpleReturn.toFixed(2)),
      annualizedReturn: annualizedReturn ? parseFloat(annualizedReturn.toFixed(2)) : null,
    });
  }

  return results;
}

export async function GET(request, { params }) {
  const { code } = params;
  const url = new URL(request.url);
  const period = url.searchParams.get('period'); // e.g., 12 months for 1 year rolling

  if (!period) {
    return new Response(JSON.stringify({ error: 'Provide period in months' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const periodMonths = parseInt(period);

  try {
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

    const results = calculateRollingReturns(navHistory, periodMonths);

    return new Response(JSON.stringify(results), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error calculating rolling returns:', error.message);
    return new Response(JSON.stringify({ error: 'Failed to calculate rolling returns' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
