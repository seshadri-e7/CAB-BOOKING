import React from "react";

// Lightweight placeholder "map" so the app runs with zero external API keys.
// Swap this out for an actual Google Maps / Mapbox <GoogleMap> component in production -
// see REACT_APP_* keys you'd add to .env and the `@react-google-maps/api` package.
export default function MockMap({ pickup, drop, cabPosition, height = 260 }) {
  // Normalize arbitrary lat/lng into a 0-100 box just for visual placement
  const norm = (val, min, max) => {
    if (val === undefined || val === null || isNaN(val)) return 50;
    const clamped = Math.min(Math.max(val, min), max);
    return ((clamped - min) / (max - min)) * 100;
  };

  const allLats = [pickup?.lat, drop?.lat, cabPosition?.lat].filter((v) => v !== undefined && v !== null);
  const allLngs = [pickup?.lng, drop?.lng, cabPosition?.lng].filter((v) => v !== undefined && v !== null);
  const minLat = Math.min(...allLats, 0), maxLat = Math.max(...allLats, 1);
  const minLng = Math.min(...allLngs, 0), maxLng = Math.max(...allLngs, 1);

  const toXY = (point) =>
    point
      ? { x: norm(point.lng, minLng, maxLng), y: 100 - norm(point.lat, minLat, maxLat) }
      : null;

  const p = toXY(pickup);
  const d = toXY(drop);
  const c = toXY(cabPosition);

  return (
    <div
      style={{
        height,
        borderRadius: 10,
        background: "linear-gradient(135deg, #eaf1fb 0%, #eaf6ee 100%)",
        position: "relative",
        overflow: "hidden",
        border: "1px solid #d8e2f0",
      }}
    >
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
        {p && d && (
          <line x1={p.x} y1={p.y} x2={d.x} y2={d.y} stroke="#2e5395" strokeWidth="0.8" strokeDasharray="2,2" />
        )}
        {p && <circle cx={p.x} cy={p.y} r="2.2" fill="#2e7d46" />}
        {d && <circle cx={d.x} cy={d.y} r="2.2" fill="#b23a48" />}
        {c && <circle cx={c.x} cy={c.y} r="2.6" fill="#2e5395" stroke="#fff" strokeWidth="0.6" />}
      </svg>
      <div style={{ position: "absolute", bottom: 8, left: 10, fontSize: 11, color: "#555" }}>
        🟢 Pickup &nbsp; 🔴 Drop {cabPosition && <>&nbsp; 🔵 Cab</>}
      </div>
    </div>
  );
}
