// app/api/mf/route.js
import { dbConnectCompany, getCompanyFundModel } from '../../../lib/dbConnect';

let cachedSchemes = null;
let cacheTime = null;
const CACHE_DURATION = 1000 * 60 * 10; // 10 minutes

function normalizeFundDoc(doc) {
  return {
    ...doc,
    scheme_code: doc.scheme_code ?? doc.schemeCode ?? doc.code ?? null,
    scheme_name: doc.scheme_name ?? doc.schemeName ?? doc.name ?? '',
    fund_house: doc.fund_house ?? doc.fundHouse ?? '',
    scheme_category: doc.scheme_category ?? doc.schemeCategory ?? '',
  };
}

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

    const Fund = await getCompanyFundModel();
    const todayStr = todayDateString();
    let funds = await Fund.find({ latest_nav_date: todayStr }).lean();

    // If today's NAV isn't present yet, fall back to the latest available records.
    if (!funds.length) {
      funds = await Fund.find({}).sort({ last_updated: -1 }).lean();
    }

    // Some datasets may live in a differently named collection.
    if (!funds.length) {
      const companyDb = await dbConnectCompany();
      const collectionCandidates = [
        'funds',
        'fund',
        'mutualfund',
        'mutualfunds',
        'companies',
        'companydata',
      ];

      for (const collectionName of collectionCandidates) {
        const docs = await companyDb.collection(collectionName).find({}).limit(5000).toArray();
        if (!docs.length) continue;

        funds = docs.map(normalizeFundDoc);
        break;
      }
    }

    // Final fallback: discover data in other databases from the same cluster.
    if (!funds.length) {
      const companyDb = await dbConnectCompany();
      const dbList = await companyDb.client.db().admin().listDatabases();
      const skipDbs = new Set(['admin', 'local', 'config']);

      for (const dbInfo of dbList.databases || []) {
        const dbName = dbInfo.name;
        if (skipDbs.has(dbName)) continue;

        const db = companyDb.client.db(dbName);
        const collections = await db.listCollections().toArray();
        const likelyCollections = collections
          .map((c) => c.name)
          .filter((name) => /fund|scheme|mf|company/i.test(name));

        for (const collectionName of likelyCollections) {
          const docs = await db.collection(collectionName).find({}).limit(5000).toArray();
          if (!docs.length) continue;
          funds = docs.map(normalizeFundDoc);
          break;
        }

        if (funds.length) break;
      }
    }

    // Return latest cached dataset for quick repeated calls
    cachedSchemes = funds;
    cacheTime = Date.now();

    return new Response(JSON.stringify(funds), {
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
