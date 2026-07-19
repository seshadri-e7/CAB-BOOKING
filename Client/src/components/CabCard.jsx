import React from "react";

export default function CabCard({ cab, onSelect, selected }) {
  return (
    <div
      className="card"
      onClick={() => onSelect(cab)}
      style={{
        cursor: "pointer",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        border: selected ? "2px solid #2e5395" : "1px solid transparent",
      }}
    >
      <div>
        <div style={{ fontWeight: 700, textTransform: "capitalize" }}>{cab.cabType} · {cab.name}</div>
        <div style={{ fontSize: 13, color: "#6b7280" }}>
          {cab.vehicleNumber} · ⭐ {cab.rating} · {cab.pickupEtaMinutes} min away
        </div>
      </div>
      <div style={{ textAlign: "right" }}>
        <div style={{ fontWeight: 700, fontSize: 18 }}>₹{cab.fareEstimate}</div>
        <div style={{ fontSize: 12, color: "#6b7280" }}>{cab.tripEtaMinutes} min trip</div>
      </div>
    </div>
  );
}
