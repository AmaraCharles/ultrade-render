const mongoose = require("mongoose");

const UsersSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  
kycApprovedAt: { type: Date },
kycRejectedAt: { type: Date },
kycRejectionReason: { type: String },

// KYC Survey — Contact & Address
survey_houseNo: { type: String },
survey_streetAddress: { type: String },
survey_city: { type: String },
survey_province: { type: String },
survey_zipCode: { type: String },
survey_country: { type: String },

// KYC Survey — Trading Experience
survey_yearsOfExperience: { type: String },
survey_tradingFrequency: { type: String },
survey_instrumentsTraded: { type: String },
survey_knowledgeLevel: { type: String },
survey_preferredMarkets: { type: String },
survey_tradingPlatforms: { type: String },

// KYC Survey — Annual Earnings
survey_annualIncome: { type: String },
survey_primaryIncomeSource: { type: String },
survey_taxResidency: { type: String },

surveyCompleted: { type: Boolean, default: false },

  copytrading: {
    type: String,
    
  },
  phone: {
    type: String,
    
  },
  trader: {
    type: String,
    
  },
  condition: {
    type: String,
    
  },
  kyc: {
    type: String,
    
  },


  email: {
    type: String,
    required: true,
    unique: true,
  },
  referralCode:{
    type:String,
  },
  referredUsers:{
    type:Array,
  },
  planHistory:{
    type:Array,
  },
  referredBy:{
    type:String,
  },
  plan:{
    type:Array,
  },
 
  country: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    min: 6,
    max: 50,
  },
  amountDeposited: {
    type: String,
  },
  profit: {
    type: Number,
  },
  balance: {
    type: Number,
  },
  referalBonus: {
    type: String,
  },
  transactions: {
    type: Array,
  },
  accounts: {
    type: Object,
  },
 withdrawals: [
  {
    amount: {
      type: Number,
      required: true,
    },
    method: {
      type: String,
    },
    status: {
      type: String,
      default: "Pending",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
],
   rewards: {
    type: Array,
  },
  copyTradingActive: {
    type: Array,
  },
  profitHistory: {
    type: Array,
    default: [],
  },
  verified: {
    type: Boolean,
  },
  isDisabled: {
    type: Boolean,
  },
});

module.exports = mongoose.model("users", UsersSchema);