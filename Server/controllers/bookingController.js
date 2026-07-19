const Booking = require("../models/Booking");
const Driver = require("../models/Driver");
const { estimateFare } = require("../utils/fare");

// POST /api/bookings
exports.createBooking = async (req, res) => {
  try {
    const { pickupLocation, dropLocation, cabType, driverId, discountCode, donationAmount } = req.body;

    if (!pickupLocation?.lat || !dropLocation?.lat) {
      return res.status(400).json({ message: "pickupLocation and dropLocation are required" });
    }

    const { fare, etaMinutes } = estimateFare(pickupLocation, dropLocation, cabType);

    let finalFare = fare;
    if (discountCode === "UCAB10") finalFare = Math.round(fare * 0.9); // 10% off
    finalFare += Number(donationAmount) || 0;

    const booking = await Booking.create({
      userId: req.user.id,
      driverId: driverId || null,
      pickupLocation,
      dropLocation,
      cabType: cabType || "mini",
      fareEstimate: finalFare,
      etaMinutes,
      discountCode: discountCode || null,
      donationAmount: donationAmount || 0,
      status: driverId ? "confirmed" : "requested",
    });

    if (driverId) {
      await Driver.findByIdAndUpdate(driverId, { status: "busy" });
    }

    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: "Could not create booking", error: err.message });
  }
};

// GET /api/bookings/:userId  -> booking history for a user
exports.getUserBookings = async (req, res) => {
  try {
    // Riders may only fetch their own history; admins can fetch anyone's
    if (req.user.role !== "admin" && req.user.id !== req.params.userId) {
      return res.status(403).json({ message: "Not authorized to view this history" });
    }

    const bookings = await Booking.find({ userId: req.params.userId })
      .populate("driverId", "name vehicleNumber cabType")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Could not fetch booking history", error: err.message });
  }
};

// GET /api/bookings/detail/:id -> single booking (used by tracking screen)
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate(
      "driverId",
      "name vehicleNumber cabType currentLocation rating"
    );
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: "Could not fetch booking", error: err.message });
  }
};

// PATCH /api/bookings/:id/status  -> update trip status (ongoing/completed/cancelled)
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ["requested", "confirmed", "ongoing", "completed", "cancelled"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: `status must be one of: ${allowed.join(", ")}` });
    }

    const booking = await Booking.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (["completed", "cancelled"].includes(status) && booking.driverId) {
      await Driver.findByIdAndUpdate(booking.driverId, { status: "available" });
    }

    // Broadcast the status change to anyone tracking this booking's room
    const io = req.app.get("io");
    io?.to(`booking:${booking._id}`).emit("statusUpdate", { bookingId: booking._id, status });

    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: "Could not update booking status", error: err.message });
  }
};
