const Driver = require("../models/Driver");
const { estimateFare, distanceKm } = require("../utils/fare");

// GET /api/cabs/nearby?lat=..&lng=..&dropLat=..&dropLng=..&cabType=mini
exports.getNearbyCabs = async (req, res) => {
  try {
    const { lat, lng, dropLat, dropLng, cabType } = req.query;

    if (!lat || !lng || !dropLat || !dropLng) {
      return res.status(400).json({
        message: "pickup (lat, lng) and drop (dropLat, dropLng) coordinates are required",
      });
    }

    const pickup = { lat: parseFloat(lat), lng: parseFloat(lng) };
    const drop = { lat: parseFloat(dropLat), lng: parseFloat(dropLng) };

    const query = { status: "available" };
    if (cabType) query.cabType = cabType;

    const drivers = await Driver.find(query).limit(10);

    const cabs = drivers
      .map((driver) => {
        const kmToPickup = distanceKm(pickup, driver.currentLocation);
        const { fare, etaMinutes, distanceKm: tripKm } = estimateFare(pickup, drop, driver.cabType);
        return {
          driverId: driver._id,
          name: driver.name,
          vehicleNumber: driver.vehicleNumber,
          cabType: driver.cabType,
          rating: driver.rating,
          currentLocation: driver.currentLocation,
          pickupEtaMinutes: Math.max(1, Math.round(kmToPickup * 3)),
          tripDistanceKm: tripKm,
          fareEstimate: fare,
          tripEtaMinutes: etaMinutes,
        };
      })
      .sort((a, b) => a.pickupEtaMinutes - b.pickupEtaMinutes);

    res.json({ count: cabs.length, cabs });
  } catch (err) {
    res.status(500).json({ message: "Could not fetch nearby cabs", error: err.message });
  }
};
