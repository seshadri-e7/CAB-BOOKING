// Run with: npm run seed
// Populates a handful of sample drivers so you can test booking flow immediately.
require("dotenv").config();
const mongoose = require("mongoose");
const Driver = require("../models/Driver");

const sampleDrivers = [
  { name: "Ravi Kumar", vehicleNumber: "AP-09-AB-1234", cabType: "mini", rating: 4.6, currentLocation: { lat: 13.6288, lng: 79.4192 }, status: "available" },
  { name: "Suresh Reddy", vehicleNumber: "AP-09-CD-5678", cabType: "sedan", rating: 4.8, currentLocation: { lat: 13.6350, lng: 79.4250 }, status: "available" },
  { name: "Anil Naidu", vehicleNumber: "AP-09-EF-9012", cabType: "suv", rating: 4.4, currentLocation: { lat: 13.6200, lng: 79.4100 }, status: "available" },
  { name: "Mahesh Babu", vehicleNumber: "AP-09-GH-3456", cabType: "mini", rating: 4.7, currentLocation: { lat: 13.6400, lng: 79.4300 }, status: "available" },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Driver.deleteMany({});
    await Driver.insertMany(sampleDrivers);
    console.log(`Seeded ${sampleDrivers.length} drivers.`);
  } catch (err) {
    console.error("Seed failed:", err.message);
  } finally {
    await mongoose.disconnect();
  }
}

seed();
