const Payment = require("../models/Payment");
const Booking = require("../models/Booking");
const User = require("../models/User");

// POST /api/payments/charge
// Automatically charges the rider's saved payment method for a completed ride.
// NOTE: this is a mocked payment flow for demo purposes - swap in Razorpay/Stripe
// server-side SDK calls here for a production integration.
exports.chargePayment = async (req, res) => {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    if (String(booking.userId) !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to pay for this booking" });
    }

    const user = await User.findById(req.user.id);
    const method = user?.savedPaymentMethod?.type || "card";

    // Simulated gateway call - in production this calls Razorpay/Stripe and awaits a real result
    const success = true;

    const payment = await Payment.create({
      bookingId: booking._id,
      userId: req.user.id,
      amount: booking.fareEstimate,
      method,
      status: success ? "success" : "failed",
    });

    if (success) {
      booking.status = "completed";
      await booking.save();
    }

    res.status(201).json(payment);
  } catch (err) {
    res.status(500).json({ message: "Payment failed", error: err.message });
  }
};

// GET /api/payments/:bookingId
exports.getPaymentForBooking = async (req, res) => {
  try {
    const payment = await Payment.findOne({ bookingId: req.params.bookingId });
    if (!payment) return res.status(404).json({ message: "Payment not found" });
    res.json(payment);
  } catch (err) {
    res.status(500).json({ message: "Could not fetch payment", error: err.message });
  }
};
