const mongoose = require("mongoose");

const templeSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Temple name is required"], trim: true },
    deity: { type: String, required: [true, "Deity name is required"], trim: true },
    location: {
      city: { type: String, required: true },
      state: { type: String, required: true },
      address: { type: String },
    },
    description: { type: String, default: "" },
    imageUrl: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=800",
    },
    timings: {
      openTime: { type: String, default: "06:00" },
      closeTime: { type: String, default: "21:00" },
    },
    facilities: [{ type: String }], // e.g. ["Prasadam", "Parking", "Wheelchair Access"]
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

templeSchema.index({ name: "text", "location.city": "text", deity: "text" });

module.exports = mongoose.model("Temple", templeSchema);
