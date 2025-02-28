import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import customerRoutes from './routes/customerRoutes.js';
import authRoutes from './routes/authRoutes.js';
import dietRoutes from './routes/dietRoutes.js';
import nutritionRoutes from './routes/nutritionRoutes.js';
import dietcategoryRoutes from './routes/dietCategoryRoutes.js'
dotenv.config(); // Load environment variables

const app = express();
app.use(cors());
app.use(express.json());

const mongoURI = process.env.MONGODB_URI; // Ensure your .env has this
let isConnected = false; // Flag to track connection

const connectDB = async () => {
    if (isConnected) {
        console.log("MongoDB is already connected.");
        return; // Prevent multiple connections
    }

    try {
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
            socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
        });

        isConnected = true; // Set flag to true after successful connection
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        isConnected = false; // Reset flag if connection fails
        // Optionally, you can retry connection logic here if needed
    }
};

// Listen for connection events
mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB disconnected. Attempting to reconnect...');
    isConnected = false;
    connectDB(); // Attempt to reconnect
});


connectDB();

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/nutrition', nutritionRoutes);
app.use('/api/dietcategory',dietcategoryRoutes);
app.use('/api/diets', dietRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
