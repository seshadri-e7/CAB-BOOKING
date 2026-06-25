# DATABASE CONNECTION

## Project Name

**UCAB – Cab Booking System**

## Technology Stack

Node.js, MongoDB, Mongoose (MERN Stack)

---

# Objective

The objective of this task is to configure the backend server to establish connection pools to MongoDB utilizing configuration variables stored in environment profiles. Centralizing the database mapping in environment variables prevents credentials leakage and enables smooth environment transitions.

---

# Prerequisites

Ensure the following setup criteria are satisfied:
* MongoDB server is running locally or configured as a MongoDB Atlas cloud cluster.
* Node.js backend workspace is initialized with Mongoose dependencies installed:
  ```bash
  npm install mongoose dotenv
  ```

---

# Environment Configuration

Create a file in the `Server` root directory:
```text
.env
```

Add your database connection coordinates:
```env
MONGO_URI=mongodb://127.0.0.1:27017/ucab
```

*Note: Environment files containing sensitive URIs are configured in `.gitignore` to prevent leakage to GitHub repository branches.*

---

# Database Connection Code

Create a configuration script:
```text
db/config.js
```

Write the connection logic:
```javascript
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Read string variables from process.env configurations
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected");
    } catch (error) {
        console.error("Database Connection failed:", error.message);
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectDB;
```

---

# Using Database Connection in Server

Import and call the setup script inside the main Express entry file:
```text
server.js
```

#### Code Integration:
```javascript
const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./db/config");

// Load environment variables before database call
dotenv.config();

const app = express();

// Establish Mongoose Database Connection Pool
connectDB();

// Body Parser Middleware
app.use(express.json());

// Listen for network API request sessions
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server Running on Port ${PORT}`);
});
```

---

# Folder Structure

Following integration, the backend directories map as follows:

```text
Server/
│
├── db/
│   └── config.js       # Database connection pool script
│
├── .env                # Secret environment configurations (untracked)
├── server.js           # Server initializer and db connect call
│
├── models/             # Schema models
├── controllers/        # Logical controllers
└── routes/             # Endpoints routers
```

---

# Connection Sequence Flow

Below is the database initialization sequence diagram:

```mermaid
sequenceDiagram
    autonumber
    participant Server as server.js
    participant DotEnv as dotenv (.env)
    participant Config as db/config.js (connectDB)
    participant Mongoose as Mongoose Library
    database MongoDB as MongoDB Atlas / Local

    Server->>DotEnv: Loads config variables (dotenv.config())
    Server->>Config: Calls connectDB() function
    activate Config
    Config->>Mongoose: Reads MONGO_URI & triggers connect()
    activate Mongoose
    Mongoose->>MongoDB: Opens TCP connection request
    activate MongoDB
    MongoDB-->>Mongoose: Acknowledges Connection Accepted
    deactivate MongoDB
    Mongoose-->>Config: Returns Active connection pool
    deactivate Mongoose
    Config-->>Server: Prints "MongoDB Connected"
    deactivate Config
    Note over Server: Server listens on Port 8000
```

---

# Advantages of Environment Mappings

* **Secured Parameters**: Connection secrets are hidden in local `.env` files rather than hardcoded in files.
* **Centralized Configuration**: Changing the database target requires altering only one variable.
* **Failover Control**: Clean error catching stops server execution to prevent queries on offline connections.

---

# Expected Output

When starting the server console:

```text
Server Running on Port 8000
MongoDB Connected
```
