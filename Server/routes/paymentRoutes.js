const express = require("express");
const router = express.Router();
const { chargePayment, getPaymentForBooking } = require("../controllers/paymentController");
const { protect } = require("../middleware/auth");

router.post("/charge", protect, chargePayment);
router.get("/:bookingId", protect, getPaymentForBooking);

module.exports = router;
