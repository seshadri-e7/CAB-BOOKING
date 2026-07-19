const mongoose = require("mongoose");

const driverSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    vehicleNumber: { type: String, required: true },
    cabType: { type: String, enum: ["mini", "sedan", "suv"], default: "mini" },
    rating: { type: Number, default: 4.5 },
    currentLocation: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    status: { type: String, enum: ["available", "busy", "offline"], default: "available" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Driver", driverSchema);
