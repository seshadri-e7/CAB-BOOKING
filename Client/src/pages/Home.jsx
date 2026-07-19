import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="container" style={{ textAlign: "center", paddingTop: 60 }}>
      <h1>🚕 Ucab</h1>
      <p style={{ fontSize: 16, color: "#4b5563", maxWidth: 480, margin: "0 auto 24px" }}>
        Book a cab in seconds — transparent fares, live tracking, and automatic payment.
      </p>
      {user ? (
        <Link to="/booking" className="btn" style={{ display: "inline-block" }}>
          Book a Ride
        </Link>
      ) : (
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <Link to="/login" className="btn">Log In</Link>
          <Link to="/register" className="btn btn-outline">Sign Up</Link>
        </div>
      )}
    </div>
  );
}
