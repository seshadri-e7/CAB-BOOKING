require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const cabRoutes = require("./routes/cabRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: process.env.CLIENT_URL || "http://localhost:3000" },
});

// Make io available inside controllers via req.app.get("io")
app.set("io", io);

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:3000" }));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/cabs", cabRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payments", paymentRoutes);

app.get("/", (req, res) => res.json({ message: "Ucab API is running" }));

// ---- Real-time layer: live driver location & trip status ----
io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  // Rider/driver client joins a room scoped to a specific booking
  socket.on("joinBooking", (bookingId) => {
    socket.join(`booking:${bookingId}`);
  });

  // Driver client emits its live GPS location during an ongoing trip
  socket.on("driverLocationUpdate", ({ bookingId, lat, lng }) => {
    io.to(`booking:${bookingId}`).emit("cabLocation", { lat, lng, at: Date.now() });
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  server.listen(PORT, () => console.log(`Ucab server running on port ${PORT}`));
});
