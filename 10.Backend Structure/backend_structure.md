# BACKEND STRUCTURE

## Project Name

**UCAB – Cab Booking System**
<img width="1536" height="1024" alt="image" src="https://github.com/user-attachments/assets/17153477-3999-4024-b10a-dbe656a17fe9" />

## Technology Stack

Node.js, Express.js, MongoDB (MERN Stack)

---

# Objective

The backend directory structure of the UCAB application outlines the files and layers required to run the Node.js/Express.js APIs. Incorporating configurations (`config`), schemas (`models`), routing controllers (`controllers`), routers (`routes`), security guards (`middleware`), and server setups (`server.js`) ensures a clean, modular structure following the Model-View-Controller (MVC) architectural pattern.

---

# Backend Technology Stack

* **Node.js**: Server environment runtime.
* **Express.js**: Backend REST API framework.
* **MongoDB**: Persistent NoSQL document storage.
* **Mongoose**: Object Document Mapper (ODM) for database driver mappings.
* **JWT (JSON Web Tokens)**: Statel-less client session authorizations.
* **bcryptjs**: Safe database-level password hashing.

---

# Backend Folder Structure

Below is the file tree mapping for the backend `Server` container:

```text
Server/
│
├── package.json            # Backend dependency manifests
├── server.js               # Express application entry-point file
│
├── config/                 # Configurations
│   └── db.js               # MongoDB connection setup script
│
├── models/                 # Database Mongoose schemas
│   ├── UserModel.js        # Rider details schema
│   ├── DriverModel.js      # Driver & vehicle connection schema
│   ├── RideModel.js        # Coordinate booking schema
│   └── PaymentModel.js     # Billing & transaction schema
│
├── controllers/            # Logic controllers
│   ├── UserController.js   # Riders registrations & session audits
│   ├── DriverController.js # Drivers online-toggles & ride accept logs
│   ├── RideController.js   # Booking matching & coordinates updates
│   └── PaymentController.js# Transaction confirmations & receipt hooks
│
├── routes/                 # API router configurations
│   ├── userRoutes.js       # User auth & profile endpoints
│   ├── driverRoutes.js     # Driver status & matched ride lists
│   ├── rideRoutes.js       # Booking commands & history queries
│   └── paymentRoutes.js    # Gateway checkout sessions
│
├── middleware/             # Route interceptor layers
│   └── authMiddleware.js   # JWT token decryption & validation
│
└── node_modules/           # Installed package libraries
```

---

# Subdirectory Explanations

### `server.js` (Server Initialization)
Acts as the entry point of the backend application.
* **Responsibilities**: Starts Express listener port, binds database drivers, registers routers, and mounts global middlewares (CORS, JSON parsers).

### Models Folder (`models/`)
Stores database schemas specifying data types, keys, validations, and reference bindings.
* **User**: Name, Email, Password, Phone, Address.
* **Driver**: Vehicle category type, Driver Name, license, active coordinates, online status.
* **Ride**: References User and Driver, pickup/drop coordinates, ride status, fare.
* **Payment**: References Ride, amount, transaction ID, payment status.

### Controllers Folder (`controllers/`)
Houses logical engines executing query calls and processing payload requests.
* **Responsibilities**: Extracts body variables, validates credentials, pings external services (e.g. fare maps), and calls schemas to update states.

### Routes Folder (`routes/`)
Maps HTTP verbs and URLs to controller callbacks.
* *Examples*:
  * `POST /api/users/register` -> UserController register methods.
  * `POST /api/users/login` -> UserController login methods.
  * `POST /api/rides/book` -> RideController booking matching.
  * `PUT /api/rides/update` -> RideController status updates.

### Middleware Folder (`middleware/`)
Reusable route filters validating request parameters before hitting controllers.
* **authMiddleware**: Decrypts the request Authorization header (JWT Bearer Token), verifies signatures, and appends the validated payload profile parameters (`req.user`) to downstream routers.

### Config Folder (`config/`)
Configurations defining connections to third-party assets.
* **db.js**: Initializes Mongoose options to open long-lived connection pools to MongoDB Atlas clusters.

---

# Backend API Workflow

The diagram below details the step-by-step life cycle of an incoming API booking request:

```mermaid
sequenceDiagram
    autonumber
    actor Client as React Client (Frontend)
    participant Route as Express Router (Routes)
    participant Auth as Auth Middleware (JWT Verify)
    participant Ctrl as Controller (Logic)
    participant Model as Mongoose Model (Models)
    database DB as MongoDB (Atlas)

    Client->>Route: API Request (e.g. POST /api/rides/book)
    Route->>Auth: Verifies Authorization Header
    activate Auth
    Auth-->>Route: Valid User Token Decoded
    deactivate Auth
    Route->>Ctrl: Calls handler function
    activate Ctrl
    Ctrl->>Model: Query database
    activate Model
    Model->>DB: Read/Write logs
    activate DB
    DB-->>Model: Raw documents
    deactivate DB
    Model-->>Ctrl: Mongoose documents
    deactivate Model
    Ctrl-->>Client: Returns JSON payload response
    deactivate Ctrl
```

---

# Structural Advantages

* **Modular Cleanliness**: Segregates middleware, routes, data tables, and algorithms into distinct physical files.
* **High Security Integration**: Plugs authentication checks (`authMiddleware`) easily onto selected routes.
* **Ease of Testing**: Decoupled structures allow independent mock tests of controllers without loading Express routers.

---

# Expected Outcome

Successfully designed the backend structure of the UCAB Cab Booking System using Node.js, Express.js, MongoDB, and MVC architecture. The structure supports secure, scalable, and maintainable backend development.
