/*
  Script to fetch mutual funds from mfapi and store active funds with latest NAV into MongoDB.
  Usage: node src/scripts/updateFunds.js
  Requires MONGODB_URI env var.
*/
import axios from 'axios';
import mongoose from 'mongoose';
import Fund from '../../src/models/fund';

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('MONGODB_URI required');
  process.exit(1);
}

async function main() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  const listResp = await axios.get('https://api.mfapi.in/mf');
  const schemes = listResp.data;

  for (const s of schemes) {
    try {
      const code = s.schemeCode || s.scheme_code || s.sc_code || s.schemeCode;
      const res = await axios.get(`https://api.mfapi.in/mf/${code}`);
      const data = res.data;
      if (!data || !data.data || !data.data.length) continue;
      const latest = data.data[0];
      const latestNav = parseFloat(latest.nav);
      const latestDate = latest.date;

      // Only consider funds that have a valid latest NAV
      if (isNaN(latestNav)) continue;

      await Fund.updateOne(
        { scheme_code: Number(data.meta.scheme_code || code) },
        {
          scheme_code: Number(data.meta.scheme_code || code),
          scheme_name: data.meta.scheme_name,
          fund_house: data.meta.fund_house,
          scheme_type: data.meta.scheme_type,
          scheme_category: data.meta.scheme_category,
          isin: data.meta.isin,
          latest_nav: latestNav,
          latest_nav_date: latestDate,
          raw_meta: data.meta,
          last_updated: new Date(),
        },
        { upsert: true }
      );
    } catch (err) {
      // Skip failures per scheme
      console.warn('Failed scheme update', s, err.message || err);
    }
  }

  console.log('Update complete');
  process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); });
