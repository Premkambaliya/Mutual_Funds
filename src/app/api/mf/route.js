// app/api/mf/route.js
import axios from 'axios';
import { dbConnect } from '../../../lib/dbConnect';
import Fund from '../../../../src/models/fund';

let cachedSchemes = null;
let cacheTime = null;
const CACHE_DURATION = 1000 * 60 * 10; // 10 minutes

function todayDateString() {
  const d = new Date();
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}

export async function GET() {
  try {
    // Use cache if available and not expired
    if (cachedSchemes && cacheTime && (Date.now() - cacheTime < CACHE_DURATION)) {
      return new Response(JSON.stringify(cachedSchemes), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Try DB first
    try {
      await dbConnect();
      const todayStr = todayDateString();
      const funds = await Fund.find({ latest_nav_date: todayStr }).lean();
      if (funds && funds.length) {
        cachedSchemes = funds;
        cacheTime = Date.now();
        return new Response(JSON.stringify(funds), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    } catch (dbErr) {
      // If DB fails, fall back to external API
      console.warn('DB unavailable, falling back to mfapi:', dbErr.message || dbErr);
    }

    // Fetch from MFAPI as fallback
    const response = await axios.get('https://api.mfapi.in/mf');
    const schemes = response.data; // array of schemes

    // Filter schemes to only those with today's NAV value if available (mfapi returns metadata only here)
    // We'll return the list as-is since MFAPI /mf endpoint doesn't include NAV date per scheme. Client-side should fetch per-scheme NAV.

    // Cache the response
    cachedSchemes = schemes;
    cacheTime = Date.now();

    return new Response(JSON.stringify(schemes), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching schemes:', error.message);
    return new Response(JSON.stringify({ error: 'Failed to fetch schemes' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
