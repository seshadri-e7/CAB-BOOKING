import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const statusClass = {
  completed: "badge-success",
  cancelled: "badge-cancelled",
};

export default function History() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    api
      .get(`/bookings/${user.id}`)
      .then(({ data }) => setBookings(data))
      .catch((err) => setError(err.response?.data?.message || "Could not load history"))
      .finally(() => setLoading(false));
  }, [user]);

  return (
    <div className="container">
      <h2>Booking History</h2>
      {error && <p className="error-text">{error}</p>}
      {loading && <p>Loading...</p>}
      {!loading && bookings.length === 0 && <p>No rides booked yet. <Link to="/booking">Book your first ride →</Link></p>}

      {bookings.map((b) => (
        <div key={b._id} className="card" style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontWeight: 700 }}>
              {b.pickupLocation?.address || "Pickup"} → {b.dropLocation?.address || "Drop"}
            </div>
            <div style={{ fontSize: 13, color: "#6b7280" }}>
              {new Date(b.createdAt).toLocaleString()} · {b.cabType} · {b.driverId?.name || "Driver"}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontWeight: 700 }}>₹{b.fareEstimate}</div>
            <span className={`badge ${statusClass[b.status] || "badge-pending"}`} style={{ textTransform: "capitalize" }}>
              {b.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
