// app/api/scheme/[code]/stepup/route.js
import axios from 'axios';

let cache = {}; // { [schemeCode]: { navHistory, timestamp } }
const CACHE_DURATION = 1000 * 60 * 10; // 10 minutes

function parseDate(str) {
  return new Date(str + 'T00:00:00');
}

function calculateStepUpSIP(navHistory, initialAmount, frequency, stepUpPercent, fromDate, toDate) {
  const sortedNAV = navHistory.slice().sort((a, b) => new Date(a.date) - new Date(b.date));

  let totalUnits = 0;
  let totalInvested = 0;

  let currentDate = new Date(fromDate);
  let currentAmount = initialAmount;
  let lastStepUpYear = currentDate.getFullYear();

  while (currentDate <= toDate) {
    // Find NAV for current date or next available
    const navEntry = sortedNAV.find(e => parseDate(e.date) >= currentDate);
    if (!navEntry) break;

    totalUnits += currentAmount / navEntry.nav;
    totalInvested += currentAmount;

    // Increment date based on frequency
    switch (frequency) {
      case 'monthly':
        currentDate.setMonth(currentDate.getMonth() + 1);
        break;
      case 'quarterly':
        currentDate.setMonth(currentDate.getMonth() + 3);
        break;
      case 'weekly':
        currentDate.setDate(currentDate.getDate() + 7);
        break;
      default:
        throw new Error('Invalid frequency');
    }

    // Apply step-up annually
    if (currentDate.getFullYear() > lastStepUpYear) {
      currentAmount *= 1 + stepUpPercent / 100;
      lastStepUpYear = currentDate.getFullYear();
    }
  }

  const latestNAV = sortedNAV[sortedNAV.length - 1].nav;
  const currentValue = totalUnits * latestNAV;

  const absoluteReturn = ((currentValue - totalInvested) / totalInvested) * 100;
  const durationDays = (toDate - fromDate) / (1000 * 60 * 60 * 24);
  const annualizedReturn = durationDays >= 30 ? ((1 + absoluteReturn / 100) ** (365 / durationDays) - 1) * 100 : null;

  return {
    totalInvested: parseFloat(totalInvested.toFixed(2)),
    currentValue: parseFloat(currentValue.toFixed(2)),
    totalUnits: parseFloat(totalUnits.toFixed(4)),
    absoluteReturn: parseFloat(absoluteReturn.toFixed(2)),
    annualizedReturn: annualizedReturn ? parseFloat(annualizedReturn.toFixed(2)) : null,
  };
}

export async function POST(request, { params }) {
  const { code } = params;

  try {
    const body = await request.json();
    const { amount, frequency, stepUpPercent, from, to } = body;

    if (!amount || !frequency || !stepUpPercent || !from || !to) {
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

    const result = calculateStepUpSIP(navHistory, amount, frequency, stepUpPercent, fromDate, toDate);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error calculating Step-up SIP:', error.message);
    return new Response(JSON.stringify({ error: 'Failed to calculate Step-up SIP' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
