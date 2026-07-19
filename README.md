# 🚕 Ucab — Smart Cab Booking Application

Ucab is a full-stack cab booking web app built on the **MERN stack** (MongoDB, Express.js,
React.js, Node.js). Riders can register, search nearby cabs with a transparent fare & ETA
estimate, book a ride, track it live on the map, get charged automatically when the ride
ends, and revisit their booking history — all in a simple, few-tap flow.

Built as part of the **SmartBridge Full Stack Development internship** (domain: Full Stack).

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 Authentication | Register/login with JWT-based sessions, passwords hashed with bcrypt |
| 📍 Ride Booking | Pick pickup & drop location, choose cab type (mini/sedan/suv) |
| 🚗 Nearby Cab Discovery | Live list of nearby cabs with fare estimate and ETA |
| 📡 Live Tracking | Real-time cab location updates over Socket.io |
| 💳 Auto-Payment | Automatic charge to a saved payment method on ride completion |
| 🧾 Booking History | Full history of past rides with fare, route, and status |
| 🎁 Add-ons | Discount codes and donation option at checkout |

---

## 🛠️ Tech Stack

**Frontend:** React.js · React Router · Axios · Socket.io-client
**Backend:** Node.js · Express.js · Socket.io · JWT · bcryptjs
**Database:** MongoDB · Mongoose (MongoDB Atlas for cloud hosting)

See `Project Documentation/2. Requirement Analysis/Technology Stack - Template.docx` for
the full architecture-to-technology mapping.

---

## 📂 Repository Structure

```
CAB-BOOKING/
├── client/                       React frontend
│   └── src/
│       ├── components/           Navbar, CabCard, MockMap, ProtectedRoute
│       ├── context/                AuthContext (JWT session state)
│       ├── pages/                  Home, Login, Register, Booking, Tracking, History
│       └── services/               api.js (Axios instance)
│
├── server/                       Node.js / Express backend
│   ├── config/                   db.js (MongoDB connection)
│   ├── controllers/              auth, cab, booking, payment logic
│   ├── middleware/                auth.js (JWT verification)
│   ├── models/                   User, Driver, Booking, Payment (Mongoose schemas)
│   ├── routes/                   REST API route definitions
│   ├── seed/                     seedDrivers.js (sample data for local testing)
│   └── server.js                 App entry point + Socket.io real-time layer
│
├── Project Documentation/        SmartBridge phase-wise submission
│   ├── 1. Ideation Phase/
│   ├── 2. Requirement Analysis/
│   ├── 3. Project Design Phase/
│   ├── 4. Project Planning Phase/
│   ├── 5. Project Development Phase/
│   ├── 6. Project Documentation/
│   └── 7. Project Demonstration/
│
├── CAB_BOOKING_VIDEOS/           Demo recordings / screenshots
├── package.json                  Root convenience scripts
├── LICENSE
├── .gitattributes
├── .gitignore
└── README.md                     You are here
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- npm
- A MongoDB connection (local `mongodb://localhost:27017/ucab` or a free MongoDB Atlas cluster)

### 1. Clone & install
```bash
git clone https://github.com/Hemanth-1912/CAB-BOOKING.git
cd CAB-BOOKING
npm run install:all        # installs both client and server dependencies
```

### 2. Configure environment variables
```bash
cp server/.env.example server/.env   # set MONGO_URI, JWT_SECRET
cp client/.env.example client/.env   # points client to the local API
```

### 3. Seed sample drivers (optional but recommended)
```bash
npm run seed
```

### 4. Run the app
```bash
npm run server     # starts the API on http://localhost:5000
npm run client      # starts the React app on http://localhost:3000
```

### 5. Try the flow
1. Sign up a new account.
2. Go to **Book a Ride**, enter pickup/drop coordinates (e.g. pickup `13.6288, 79.4192`,
   drop `13.6400, 79.4300` — matches the seeded Tirupati-area drivers).
3. Pick a cab, confirm, and watch it "arrive" live on the tracking screen.
4. Pay to complete the ride, then check **Booking History**.

---

## 📡 API Reference

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | – | Register a new user |
| POST | `/api/auth/login` | – | Login, returns a JWT |
| GET | `/api/auth/me` | ✅ | Get current user's profile |
| GET | `/api/cabs/nearby` | ✅ | Nearby cabs with fare & ETA |
| POST | `/api/bookings` | ✅ | Create a new booking |
| GET | `/api/bookings/:userId` | ✅ | Get a user's booking history |
| GET | `/api/bookings/detail/:id` | ✅ | Get a single booking (used by tracking) |
| PATCH | `/api/bookings/:id/status` | ✅ | Update trip status |
| POST | `/api/payments/charge` | ✅ | Auto-charge saved payment method |
| GET | `/api/payments/:bookingId` | ✅ | Get payment record for a booking |

Real-time events (Socket.io): `joinBooking`, `driverLocationUpdate`, `cabLocation`, `statusUpdate`.

---

## 🧪 Testing

Manual functional & UAT testing covering auth, booking, tracking, payment, and history is
logged in `Project Documentation/5. Project Development Phase/User Acceptance Testing FSD.docx`
— 8/8 test cases passing at time of submission.

---

## 🗺️ Notes on This Build

- **Maps:** rendered with a lightweight built-in `MockMap` component — no API key required to
  run the project. Swap in Google Maps / Mapbox for production-grade geocoding & routing.
- **Payments:** mocked server-side in `paymentController.js`, clearly marked where to plug in
  Razorpay/Stripe for real transactions.
- **Live tracking:** uses Socket.io; the browser simulates driver movement so tracking can be
  demoed without a separate driver-side client.

---

## 🔮 Future Enhancements

- Driver-side mobile app with route optimization
- AI-based fare prediction and dynamic pricing
- In-app chat/call between rider and driver
- Loyalty points and referral discounts
- Multi-city and multi-language support

---

## 👤 Author

**Niharika Mokhamatam** — Full Stack Developer
GitHub: (https://github.com/seshadri-e7/CAB-BOOKING)

## 🙏 Acknowledgment

Built as part of the **SmartBridge / SkillWallet Full Stack Development internship program**.

## 📄 License

This project is licensed under the MIT License — see [LICENSE](./LICENSE) for details.
