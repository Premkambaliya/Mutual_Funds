import mongoose from 'mongoose';

const fundSchema = new mongoose.Schema({
  scheme_code: { type: Number, required: true, unique: true },
  scheme_name: { type: String },
  fund_house: { type: String },
  scheme_type: { type: String },
  scheme_category: { type: String },
  isin: { type: String },
  latest_nav: { type: Number },
  latest_nav_date: { type: String }, // store as MFAPI date string
  raw_meta: { type: Object },
  last_updated: { type: Date, default: Date.now },
});

export default mongoose.models.Fund || mongoose.model('Fund', fundSchema);
