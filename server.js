require("dotenv").config();
const express = require("express");
const cors = require("cors");
const passport = require("passport");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
const connectDB = require("./config/database");

// Import Routes
const authRoutes = require("./routes/authRoutes");
const itemRoutes = require("./routes/itemRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const authenticateJWT = require("./middleware/authMiddleware"); // Middleware

// Initialize Express App
const app = express();
app.use(express.json());
app.use(cors());
app.use(passport.initialize());

// Connect to Database
connectDB();

// Initialize GitHub OAuth
require("./config/passportConfig");

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/items", authenticateJWT, itemRoutes); // Protect Item Routes
app.use("/api/categories", authenticateJWT, categoryRoutes); // Protect Category Routes

// Swagger API Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
