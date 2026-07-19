const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    driverId: { type: mongoose.Schema.Types.ObjectId, ref: "Driver" },
    pickupLocation: {
      address: String,
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    dropLocation: {
      address: String,
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    cabType: { type: String, enum: ["mini", "sedan", "suv"], default: "mini" },
    fareEstimate: { type: Number, required: true },
    etaMinutes: { type: Number, default: 5 },
    discountCode: { type: String, default: null },
    donationAmount: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["requested", "confirmed", "ongoing", "completed", "cancelled"],
      default: "requested",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
