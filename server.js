require('dotenv').config();

const express = require('express');
const connectDB = require('./config/database');
const itemRoutes = require('./routes/itemRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./docs/swagger.json');

const app = express();

// Middleware
app.use(express.json());

// Root Route - Prevents "Cannot GET /" error
app.get('/', (req, res) => {
    res.send('Welcome to the CRUD API! Visit <a href="/api-docs">API Documentation</a> for details.');
});

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Log MongoDB URI for debugging (optional, for troubleshooting only)
if (!process.env.MONGO_URI) {
    console.error("❌ MONGO_URI is not defined. Please check your environment variables.");
    process.exit(1);
} else {
    console.log("✅ Mongo URI detected");
}

// Connect to database
connectDB();

// Routes
app.use('/api/items', itemRoutes);
app.use('/api/categories', categoryRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
});
