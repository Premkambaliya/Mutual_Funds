// import mongoose from 'mongoose';

// const watchlistSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, required: false },
//   email: { type: String, required: false },
//   scheme_code: { type: Number, required: true },
//   addedAt: { type: Date, default: Date.now },
// });

// export default mongoose.models.Watchlist || mongoose.model('Watchlist', watchlistSchema);


// models/watchlist.js
import mongoose from "mongoose";

const watchlistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  funds: [
    {
      schemeCode: { type: String, required: true },
      schemeName: { type: String },
      addedAt: { type: Date, default: Date.now },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Watchlist || mongoose.model("Watchlist", watchlistSchema);