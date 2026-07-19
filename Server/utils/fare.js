// Haversine formula: straight-line distance in km between two lat/lng points
function distanceKm(a, b) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const R = 6371; // Earth radius in km
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
  return R * c;
}

const BASE_FARE = { mini: 40, sedan: 60, suv: 90 };
const PER_KM_RATE = { mini: 12, sedan: 16, suv: 22 };

function estimateFare(pickup, drop, cabType = "mini") {
  const km = distanceKm(pickup, drop);
  const base = BASE_FARE[cabType] ?? BASE_FARE.mini;
  const perKm = PER_KM_RATE[cabType] ?? PER_KM_RATE.mini;
  const fare = Math.round(base + km * perKm);
  const etaMinutes = Math.max(3, Math.round(km * 2.5)); // rough traffic-aware estimate
  return { distanceKm: Number(km.toFixed(2)), fare, etaMinutes };
}

module.exports = { distanceKm, estimateFare };
