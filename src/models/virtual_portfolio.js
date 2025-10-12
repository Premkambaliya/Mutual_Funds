// import mongoose from 'mongoose';


// const sipSchema = new mongoose.Schema({
//   scheme_code: { type: Number, required: true },
//   startDate: { type: Date, required: true },
//   amount: { type: Number, required: true },
//   frequency: { type: String, enum: ['monthly','quarterly','yearly'], default: 'monthly' },
//   unitsAccumulated: { type: Number, default: 0 },
// });

// const transactionSchema = new mongoose.Schema({
//   type: { type: String, enum: ['buy','sell','sip','deposit','withdraw'], required: true },
//   symbol: { type: String, default: null },
//   scheme_code: { type: Number, default: null },
//   units: { type: Number, default: 0 },
//   price: { type: Number, default: 0 },
//   amount: { type: Number, default: 0 },
//   date: { type: Date, default: Date.now },
// });

// const coinHoldingSchema = new mongoose.Schema({
//   symbol: { type: String, required: true },
//   units: { type: Number, default: 0 },
// });

// const virtualPortfolioSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, required: false },
//   email: { type: String, required: false },
//   name: { type: String, default: 'My Virtual Portfolio' },
//   cash: { type: Number, default: 100000 }, // virtual money
//   sips: [sipSchema],
//   coins: [coinHoldingSchema],
//   transactions: [transactionSchema],
//   createdAt: { type: Date, default: Date.now },
// });

// export default mongoose.models.VirtualPortfolio || mongoose.model('VirtualPortfolio', virtualPortfolioSchema);




// models/virtual_portfolio.js
import mongoose from "mongoose";

const virtualPortfolioSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  investments: [
    {
      schemeCode: { type: String, required: true },
      schemeName: { type: String },
      type: { type: String, enum: ["SIP", "Lumpsum", "SWP"], required: true },
      amount: { type: Number, required: true },
      date: { type: Date, required: true },
      units: { type: Number },
      performance: { type: Number },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.VirtualPortfolio || mongoose.model("VirtualPortfolio", virtualPortfolioSchema);
