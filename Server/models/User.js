const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true }, // hashed
    role: { type: String, enum: ["rider", "admin"], default: "rider" },
    savedPaymentMethod: {
      type: { type: String, enum: ["card", "wallet", "upi"], default: "card" },
      last4: { type: String, default: "4242" },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
