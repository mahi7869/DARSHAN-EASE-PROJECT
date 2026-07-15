const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    temple: { type: mongoose.Schema.Types.ObjectId, ref: "Temple", required: true },
    amount: { type: Number, required: [true, "Donation amount is required"], min: 1 },
    purpose: {
      type: String,
      enum: ["ANNADANAM", "TEMPLE_MAINTENANCE", "POOJA_SEVA", "GENERAL"],
      default: "GENERAL",
    },
    donorName: { type: String },
    panNumber: { type: String },
    paymentStatus: {
      type: String,
      enum: ["PENDING", "SUCCESS", "FAILED"],
      default: "SUCCESS",
    },
    receiptNumber: { type: String, unique: true },
  },
  { timestamps: true }
);

donationSchema.pre("save", function (next) {
  if (!this.receiptNumber) {
    this.receiptNumber =
      "RCPT" + Date.now().toString(36).toUpperCase() + Math.floor(Math.random() * 1000);
  }
  next();
});

module.exports = mongoose.model("Donation", donationSchema);
