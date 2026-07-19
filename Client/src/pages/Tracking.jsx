import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import api from "../services/api";
import MockMap from "../components/MockMap";

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || "http://localhost:5000";

export default function Tracking() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [cabPosition, setCabPosition] = useState(null);
  const [error, setError] = useState("");
  const [paying, setPaying] = useState(false);

  // Load booking details
  useEffect(() => {
    api
      .get(`/bookings/detail/${bookingId}`)
      .then(({ data }) => {
        setBooking(data);
        if (data.driverId?.currentLocation) setCabPosition(data.driverId.currentLocation);
      })
      .catch((err) => setError(err.response?.data?.message || "Could not load booking"));
  }, [bookingId]);

  // Live tracking via Socket.io
  useEffect(() => {
    const socket = io(SOCKET_URL);
    socket.emit("joinBooking", bookingId);

    socket.on("cabLocation", ({ lat, lng }) => setCabPosition({ lat, lng }));
    socket.on("statusUpdate", ({ status }) => setBooking((b) => (b ? { ...b, status } : b)));

    // Demo-only: simulate the driver moving toward the pickup point every 3s.
    // In a real driver app, this emit happens from the driver's own client.
    const interval = setInterval(() => {
      setCabPosition((prev) => {
        if (!prev || !booking?.pickupLocation) return prev;
        const lat = prev.lat + (booking.pickupLocation.lat - prev.lat) * 0.2;
        const lng = prev.lng + (booking.pickupLocation.lng - prev.lng) * 0.2;
        socket.emit("driverLocationUpdate", { bookingId, lat, lng });
        return { lat, lng };
      });
    }, 3000);

    return () => {
      clearInterval(interval);
      socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingId, booking?.pickupLocation]);

  const handlePay = async () => {
    setPaying(true);
    setError("");
    try {
      await api.post("/payments/charge", { bookingId });
      await api.patch(`/bookings/${bookingId}/status`, { status: "completed" });
      navigate("/history");
    } catch (err) {
      setError(err.response?.data?.message || "Payment failed");
    } finally {
      setPaying(false);
    }
  };

  if (error) return <div className="container"><p className="error-text">{error}</p></div>;
  if (!booking) return <div className="container">Loading booking...</div>;

  return (
    <div className="container">
      <h2>Track Your Ride</h2>

      <div className="card">
        <MockMap pickup={booking.pickupLocation} drop={booking.dropLocation} cabPosition={cabPosition} height={300} />
      </div>

      <div className="card">
        <p><strong>Status:</strong> <span className="badge badge-pending" style={{ textTransform: "capitalize" }}>{booking.status}</span></p>
        <p><strong>Driver:</strong> {booking.driverId?.name} ({booking.driverId?.vehicleNumber})</p>
        <p><strong>Cab Type:</strong> {booking.cabType}</p>
        <p><strong>Fare:</strong> ₹{booking.fareEstimate}</p>
        <p><strong>ETA:</strong> {booking.etaMinutes} min</p>

        {booking.status !== "completed" && (
          <button className="btn" onClick={handlePay} disabled={paying}>
            {paying ? "Processing payment..." : `Pay ₹${booking.fareEstimate} & Complete Ride`}
          </button>
        )}
        {booking.status === "completed" && <p style={{ color: "#1f5c33", fontWeight: 600 }}>✓ Ride completed &amp; paid</p>}
      </div>
    </div>
  );
}
