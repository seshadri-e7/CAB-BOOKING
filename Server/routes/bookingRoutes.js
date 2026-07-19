const express = require("express");
const router = express.Router();
const {
  createBooking,
  getUserBookings,
  getBookingById,
  updateBookingStatus,
} = require("../controllers/bookingController");
const { protect } = require("../middleware/auth");

router.post("/", protect, createBooking);
router.get("/detail/:id", protect, getBookingById);
router.patch("/:id/status", protect, updateBookingStatus);
router.get("/:userId", protect, getUserBookings);

module.exports = router;
