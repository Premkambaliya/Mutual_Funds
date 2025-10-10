// app/api/mf/route.js
import axios from 'axios';

let cachedSchemes = null;
let cacheTime = null;
const CACHE_DURATION = 1000 * 60 * 10; // 10 minutes

export async function GET() {
  try {
    // Use cache if available and not expired
    if (cachedSchemes && cacheTime && (Date.now() - cacheTime < CACHE_DURATION)) {
      return new Response(JSON.stringify(cachedSchemes), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Fetch from MFAPI
    const response = await axios.get('https://api.mfapi.in/mf');
    const schemes = response.data; // array of schemes

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
