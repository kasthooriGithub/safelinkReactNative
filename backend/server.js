require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Import routes
const authRoutes = require('./routes/authRoutes');
const contactRoutes = require('./routes/contactRoutes');
const profileRoutes = require('./routes/profileRoutes');
const timerRoutes = require('./routes/timerRoutes');

const app = express();

// Middleware
app.use(cors()); // Allow cross-origin requests from React Native/React
app.use(express.json()); // Allow reading JSON bodies from POST requests

// Root Route
app.get('/', (req, res) => {
    res.send('SafeLink backend is running');
});

// Base Routes
app.use('/auth', authRoutes);
app.use('/contacts', contactRoutes);
app.use('/profile', profileRoutes);
app.use('/timer', timerRoutes);

// Simple Error Handler Middleware (Catches unhandled errors gracefully)
app.use((err, req, res, next) => {
    console.error("Internal Server Error:", err.stack);
    res.status(500).json({ error: "Something went wrong on the server!" });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
