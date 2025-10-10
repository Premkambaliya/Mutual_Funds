// app/api/scheme/[code]/route.js
import axios from 'axios';

let cache = {}; // { [schemeCode]: { data, timestamp } }
const CACHE_DURATION = 1000 * 60 * 10; // 10 minutes

export async function GET(request, { params }) {
  const { code } = params;

  try {
    // Return cached data if available and not expired
    if (cache[code] && (Date.now() - cache[code].timestamp < CACHE_DURATION)) {
      return new Response(JSON.stringify(cache[code].data), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Fetch scheme NAV & metadata from MFAPI
    const response = await axios.get(`https://api.mfapi.in/mf/${code}`);
    const schemeData = response.data;

    // Extract metadata and NAV history
    const result = {
      meta: {
        fundHouse: schemeData.meta.fund_house,
        schemeName: schemeData.meta.scheme_name,
        schemeType: schemeData.meta.scheme_type,
        schemeCategory: schemeData.meta.scheme_category,
        isin: schemeData.meta.isin,
      },
      navHistory: schemeData.data.map(item => ({
        date: item.date,
        nav: parseFloat(item.nav),
      })),
    };

    // Cache it
    cache[code] = { data: result, timestamp: Date.now() };

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching scheme:', error.message);
    return new Response(JSON.stringify({ error: 'Failed to fetch scheme data' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
