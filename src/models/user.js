// const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//     trim: true,
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//     trim: true,
//     lowercase: true,
//   },
//   password: {
//     type: String,
//     required: true,
//   },
//   avatar: {
//     type: String,
//     default: null,
//   },
//   mobileNumber: {
//     type: String,
//     default: null,
//   },
//   panNumber: {
//     type: String,
//     default: null,
//   },
//   dateOfBirth: {
//     type: Date,
//     default: null,
//   },
//   address: {
//     type: String,
//     default: null,
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// module.exports = mongoose.models.User || mongoose.model("User", userSchema);    



const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    default: null,
  },
  mobileNumber: {
    type: String,
    default: null,
  },
  panNumber: {
    type: String,
    default: null,
  },
  dateOfBirth: {
    type: Date,
    default: null,
  },
  address: {
    type: String,
    default: null,
  },
  watchlist: [
    {
      schemeCode: { type: String, required: true },
      schemeName: { type: String },
      addedAt: { type: Date, default: Date.now },
    },
  ],
  virtualPortfolio: [
    {
      name: { type: String, required: true, trim: true },
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
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.models.User || mongoose.model("User", userSchema);