// app/api/scheme/[code]/swp/route.js
import axios from 'axios';

let cache = {}; // { [schemeCode]: { navHistory, timestamp } }
const CACHE_DURATION = 1000 * 60 * 10; // 10 minutes

function parseDate(str) {
  return new Date(str + 'T00:00:00');
}

function calculateSWP(navHistory, initialAmount, withdrawalAmount, frequency, fromDate, toDate) {
  const sortedNAV = navHistory.slice().sort((a, b) => new Date(a.date) - new Date(b.date));

  let totalUnits = initialAmount / sortedNAV[0].nav;
  let totalWithdrawn = 0;

  let currentDate = new Date(fromDate);

  while (currentDate <= toDate && totalUnits > 0) {
    // Find NAV for current date or next available
    const navEntry = sortedNAV.find(e => parseDate(e.date) >= currentDate);
    if (!navEntry) break;

    const availableAmount = totalUnits * navEntry.nav;

    const withdrawal = Math.min(withdrawalAmount, availableAmount);
    totalUnits -= withdrawal / navEntry.nav;
    totalWithdrawn += withdrawal;

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
  }

  const latestNAV = sortedNAV[sortedNAV.length - 1].nav;
  const remainingValue = totalUnits * latestNAV;

  const absoluteReturn = ((remainingValue + totalWithdrawn - initialAmount) / initialAmount) * 100;
  const durationDays = (toDate - fromDate) / (1000 * 60 * 60 * 24);
  const annualizedReturn = durationDays >= 30 ? ((1 + absoluteReturn / 100) ** (365 / durationDays) - 1) * 100 : null;

  return {
    initialAmount: parseFloat(initialAmount.toFixed(2)),
    totalWithdrawn: parseFloat(totalWithdrawn.toFixed(2)),
    remainingValue: parseFloat(remainingValue.toFixed(2)),
    absoluteReturn: parseFloat(absoluteReturn.toFixed(2)),
    annualizedReturn: annualizedReturn ? parseFloat(annualizedReturn.toFixed(2)) : null,
  };
}

export async function POST(request, { params }) {
  const { code } = params;

  try {
    const body = await request.json();
    const { initialAmount, withdrawalAmount, frequency, from, to } = body;

    if (!initialAmount || !withdrawalAmount || !frequency || !from || !to) {
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

    const result = calculateSWP(navHistory, initialAmount, withdrawalAmount, frequency, fromDate, toDate);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error calculating SWP:', error.message);
    return new Response(JSON.stringify({ error: 'Failed to calculate SWP' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
