const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Ensure the MongoDB URI is set
        if (!process.env.MONGO_URI) {
            throw new Error('MongoDB URI is missing. Ensure your .env file is correctly configured.');
        }

        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log('✅ MongoDB connected successfully');
    } catch (err) {
        console.error(`❌ MongoDB connection error: ${err.message}`);
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectDB;
