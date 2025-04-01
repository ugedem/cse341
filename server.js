const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const session = require("express-session");
const fs = require("fs");
const swaggerUI = require("swagger-ui-express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const passport = require("passport");
require("./config/passport");

const authRoutes = require("./routes/authRoutes");
const itemsRoutes = require("./routes/itemsRoutes");
const categoryRoutes = require("./routes/categoryRoutes");

const app = express();

// ✅ Ensure JWT_SECRET is present
const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  console.error("❌ JWT_SECRET is missing. Please add it to your environment variables.");
  process.exit(1); // Exit the app if JWT_SECRET is missing
}

// ✅ CORS Configuration
const allowedOrigins = ["http://localhost:10000", "https://cse341-tdwz.onrender.com"];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("CORS not allowed"));
    },
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
    credentials: true,
  })
);

// ✅ Middleware
app.use(express.json());
app.use(cookieParser()); // Parse cookies for JWT authentication

// ✅ Session Middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === "production" },
  })
);

app.use(passport.initialize());

// ✅ JWT Authentication Middleware (Reads Token from Cookie or Header)
const authenticateJWT = (req, res, next) => {
  let token = req.cookies.jwt || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(403).json({ message: "No token provided" });
  }

  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
    req.user = decoded; // Attach user data from the token
    next();
  });
};

// ✅ API Routes
app.use("/auth", authRoutes);

// 🚀 Enforce Authentication for API Routes
app.use("/api/items", authenticateJWT, itemsRoutes);
app.use("/api/categories", authenticateJWT, categoryRoutes);

// ✅ Protected Route Example
app.get("/dashboard", authenticateJWT, (req, res) => {
  res.json({ message: `Hello ${req.user.username}, welcome to your dashboard!` });
});

// ✅ Load and Modify Swagger Documentation to Require Authentication
const swaggerDocument = JSON.parse(fs.readFileSync("./swagger.json", "utf8"));

// 🔹 Modify Swagger to Require Authorization for Protected Routes
swaggerDocument.components = {
  securitySchemes: {
    BearerAuth: {
      type: "http",
      scheme: "bearer",
      bearerFormat: "JWT",
    },
  },
};
swaggerDocument.security = [{ BearerAuth: [] }];

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

console.log("📄 Swagger Docs available at: http://localhost:10000/api-docs");

// ✅ MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
    app.listen(process.env.PORT || 10000, () => {
      console.log(`🚀 Server running on port ${process.env.PORT || 10000}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);
  });
