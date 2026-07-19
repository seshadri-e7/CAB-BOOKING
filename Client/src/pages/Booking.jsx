import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import CabCard from "../components/CabCard";
import MockMap from "../components/MockMap";

const CAB_TYPES = ["mini", "sedan", "suv"];

export default function Booking() {
  const navigate = useNavigate();
  const [pickup, setPickup] = useState({ address: "", lat: "", lng: "" });
  const [drop, setDrop] = useState({ address: "", lat: "", lng: "" });
  const [cabType, setCabType] = useState("mini");
  const [discountCode, setDiscountCode] = useState("");
  const [donationAmount, setDonationAmount] = useState(0);
  const [cabs, setCabs] = useState([]);
  const [selectedCab, setSelectedCab] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const canSearch = pickup.lat && pickup.lng && drop.lat && drop.lng;

  const handleSearch = async (e) => {
    e.preventDefault();
    setError("");
    setSelectedCab(null);
    setLoading(true);
    try {
      const { data } = await api.get("/cabs/nearby", {
        params: {
          lat: pickup.lat,
          lng: pickup.lng,
          dropLat: drop.lat,
          dropLng: drop.lng,
          cabType,
        },
      });
      setCabs(data.cabs);
      if (data.cabs.length === 0) setError("No cabs available nearby right now. Try a different cab type.");
    } catch (err) {
      setError(err.response?.data?.message || "Could not fetch nearby cabs");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!selectedCab) return;
    setLoading(true);
    setError("");
    try {
      const { data } = await api.post("/bookings", {
        pickupLocation: { address: pickup.address, lat: Number(pickup.lat), lng: Number(pickup.lng) },
        dropLocation: { address: drop.address, lat: Number(drop.lat), lng: Number(drop.lng) },
        cabType,
        driverId: selectedCab.driverId,
        discountCode: discountCode || undefined,
        donationAmount: Number(donationAmount) || 0,
      });
      navigate(`/tracking/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Could not confirm booking");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Book a Ride</h2>

      <div className="card">
        <MockMap
          pickup={pickup.lat ? { lat: Number(pickup.lat), lng: Number(pickup.lng) } : null}
          drop={drop.lat ? { lat: Number(drop.lat), lng: Number(drop.lng) } : null}
        />
      </div>

      <form onSubmit={handleSearch} className="card">
        <div className="grid-2">
          <div>
            <label>Pickup Address</label>
            <input
              value={pickup.address}
              onChange={(e) => setPickup({ ...pickup, address: e.target.value })}
              placeholder="e.g. MG Road, Tirupati"
            />
          </div>
          <div>
            <label>Drop Address</label>
            <input
              value={drop.address}
              onChange={(e) => setDrop({ ...drop, address: e.target.value })}
              placeholder="e.g. Tirupati Airport"
            />
          </div>
        </div>

        <div className="grid-2">
          <div className="grid-2">
            <div>
              <label>Pickup Lat</label>
              <input value={pickup.lat} onChange={(e) => setPickup({ ...pickup, lat: e.target.value })} required />
            </div>
            <div>
              <label>Pickup Lng</label>
              <input value={pickup.lng} onChange={(e) => setPickup({ ...pickup, lng: e.target.value })} required />
            </div>
          </div>
          <div className="grid-2">
            <div>
              <label>Drop Lat</label>
              <input value={drop.lat} onChange={(e) => setDrop({ ...drop, lat: e.target.value })} required />
            </div>
            <div>
              <label>Drop Lng</label>
              <input value={drop.lng} onChange={(e) => setDrop({ ...drop, lng: e.target.value })} required />
            </div>
          </div>
        </div>
        <p style={{ fontSize: 12, color: "#6b7280", marginTop: -6 }}>
          Tip: swap this for a real map picker (Google Maps Places Autocomplete) once you add an API key.
        </p>

        <div className="grid-2">
          <div>
            <label>Cab Type</label>
            <select value={cabType} onChange={(e) => setCabType(e.target.value)}>
              {CAB_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label>Discount Code (optional)</label>
            <input value={discountCode} onChange={(e) => setDiscountCode(e.target.value)} placeholder="UCAB10" />
          </div>
        </div>

        <label>Donation Amount ₹ (optional)</label>
        <input type="number" min="0" value={donationAmount} onChange={(e) => setDonationAmount(e.target.value)} />

        {error && <p className="error-text">{error}</p>}

        <button className="btn" type="submit" disabled={!canSearch || loading}>
          {loading ? "Searching..." : "Search Nearby Cabs"}
        </button>
      </form>

      {cabs.length > 0 && (
        <div className="card">
          <h3>Nearby Cabs</h3>
          {cabs.map((cab) => (
            <CabCard
              key={cab.driverId}
              cab={cab}
              selected={selectedCab?.driverId === cab.driverId}
              onSelect={setSelectedCab}
            />
          ))}
          <button className="btn" disabled={!selectedCab || loading} onClick={handleConfirm} style={{ marginTop: 8 }}>
            {loading ? "Confirming..." : `Confirm Booking${selectedCab ? ` · ₹${selectedCab.fareEstimate}` : ""}`}
          </button>
        </div>
      )}
    </div>
  );
}
