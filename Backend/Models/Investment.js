// models/Investment.js
const mongoose = require('mongoose');

const InvestmentSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  username: { type: String, required: true },
  userEmail : {type : String , required  :true},
  tradingPair: { type: String, required: true },
  investmentAmount: { type: Number, required: true },
  expectedProfit: { type: String, required: true },
  withdrawalDate: { type: String, required: true },
  proofFile: { type: String, required: true }, 
  createdAt: { type: Date, default: Date.now },
  status : { type : String , default : "pending"}
});

module.exports = mongoose.model('Investment', InvestmentSchema);
