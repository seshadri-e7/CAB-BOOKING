# DEVELOPMENT AND EXPLANATION

## Project Name

**UCAB – Cab Booking System**

## Technology Stack

Node.js, Express.js, MongoDB, Mongoose, JWT, Multer (MERN Stack)

---

# Objective

The Development and Explanation module provides a granular breakdown of the backend code structure. Detailing components like database connection pools, file uploads middleware (`multer.js`), schemas, action controllers, and routes mapping ensures all developers understand how requests compile and where resources are allocated.

---

# Backend Component Breakdown

## 1. Controllers (`controllers/`)
Controllers contain the business logic, parsing raw requests and sending structured responses.

* ### `adminController.js`
  Handles platform admin tasks:
  * Manages Rider accounts status (e.g. bans, list active users).
  * Audits Driver applications (checking files).
  * Exposes system reports and revenue analytics.

* ### `bookingController.js`
  Manages ride bookings lifecycles:
  * Schedules bookings and matches riders to active drivers.
  * Details ride histories.
  * Cancels active requests and updates statuses (e.g., in-transit).

* ### `carController.js`
  Manages cab vehicles registry:
  * Creates new vehicle entries.
  * Updates vehicle details (e.g. status changes).
  * Deletes vehicles from database tables.

* ### `userController.js`
  Manages rider user authentication and profile configurations:
  * Registration (password hashing verification).
  * Login (JWT authentication tokens return).
  * Fetches profile card data.

---

## 2. Database Configuration (`config/`)

* ### `config/db.js` (or `db/config.js`)
  Sets up database connections utilizing the Mongoose library.
  * **Responsibilities**: Establishes connections to MongoDB Atlas clusters, prints success logs, catch connection errors, and maintains connection pool configurations.
  * *Code Pattern*: `mongoose.connect(process.env.MONGO_URI)`

---

## 3. Middlewares (`middleware/`)
Middlewares act as request filters running before controllers.

* ### `authMiddleware.js`
  * Decrypts the request `Authorization` header.
  * Validates the JWT signature against backend secrets.
  * Blocks calls from reaching private routes if the token is missing or invalid.

* ### `multer.js`
  * Handles multipart form-data requests (binary files).
  * Configures storage boundaries (e.g., naming rules, file filters).
  * Uploads license documents and vehicle images.

---

## 4. Models (`models/`)
Models define the database collections and property validations.

* ### `AdminSchema.js`
  Stores administrative credentials.

* ### `UserSchema.js`
  Stores rider information (Name, Email, password hashes, phone).

* ### `CarSchema.js`
  Stores vehicle details (Car Name, model, category tier: Mini/Sedan/SUV, image URL).

* ### `MyBookingSchema.js`
  Stores trip records (UserID, DriverID, pickup/drop coordinates, fare, ride status).

---

## 5. Routes (`routes/`)
Routes connect URL path patterns to controller callbacks.

* ### `adminRoutes.js`
  API calls: `GET /api/admin/users`, `POST /api/admin/cabs/verify`.
* ### `userRoutes.js`
  API calls: `POST /api/users/register`, `POST /api/users/login`, `GET /api/users/profile`.
* ### `carRoutes.js`
  API calls: `POST /api/cars/add`, `PUT /api/cars/update/:id`, `GET /api/cars/list`.
* ### `bookingRoutes.js`
  API calls: `POST /api/bookings/book`, `DELETE /api/bookings/cancel/:id`.

---

## 6. Uploads Folder (`uploads/`)
Stores uploaded binary files processed by `multer.js` middleware:
* Profile photos
* Driver registration sheets
* Cab vehicle inspection photos

---

## 7. Entry Point (`server.js`)
The central file of the backend application:
* Initializes the Express app structure.
* Registers core middlewares (JSON, CORS).
* Binds Mongo DB connection pools.
* Mounts routes gateways.
* Starts HTTP listener (e.g., listening on port `8000`).

---

# Application Workflow Diagram

Below is the lifecycle path a request takes through the MERN backend:

```mermaid
sequenceDiagram
    autonumber
    actor Frontend as React Frontend (UI)
    participant Router as Express Routes (Router)
    participant Mid as Auth/Multer Middleware
    participant Ctrl as Controllers (Logic)
    participant Model as Mongoose Schema (Models)
    database DB as MongoDB Atlas

    Frontend->>Router: Sends HTTP request with payload
    Router->>Mid: Intercepts call for verification/processing
    activate Mid
    Note over Mid: Verifies JWT Token / Parses Multipart Files (Multer)
    Mid-->>Router: Pass control (next())
    deactivate Mid
    Router->>Ctrl: Triggers matched action function
    activate Ctrl
    Ctrl->>Model: Query database collection
    activate Model
    Model->>DB: CRUD operations
    activate DB
    DB-->>Model: Raw documents
    deactivate DB
    Model-->>Ctrl: Mongoose documents
    deactivate Model
    Ctrl-->>Frontend: Sends JSON API Response
    deactivate Ctrl
```

---

# Expected Outcome

Successful implementation of the backend development structure of the UCAB Cab Booking System using Node.js, Express.js, MongoDB, and MVC architecture principles. The backend is modularly structured, separating route listeners, middlewares, logical operations, and DB queries.
