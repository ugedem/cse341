const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const passport = require("passport");
const session = require("express-session");
const fs = require("fs");
const swaggerUI = require("swagger-ui-express");

require("./config/passport");

const authRoutes = require("./routes/authRoutes");
const itemsRoutes = require("./routes/itemsRoutes");
const categoryRoutes = require("./routes/categoryRoutes"); // ✅ Corrected route

const app = express();

// Middleware
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your_secret_key",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// ✅ Corrected category route from `/api/category` to `/api/categories`
app.use("/auth", authRoutes);
app.use("/api/items", itemsRoutes);
app.use("/api/categories", categoryRoutes);

// ✅ Serve Swagger Documentation from swagger.json
const swaggerDocument = JSON.parse(fs.readFileSync("./swagger.json", "utf8"));
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

console.log("📄 Swagger Docs available at: http://localhost:10000/api-docs");

const PORT = process.env.PORT || 10000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));
