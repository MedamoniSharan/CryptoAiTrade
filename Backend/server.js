// server.js (or app.js)

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./Routes/auth');
const InvestmentRoutes = require('./Routes/investment');
const coinRoutes = require('./Routes/coin');

const app = express();

// CORS setup
const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

app.use(express.json({ limit: '500mb' }));
app.use(express.urlencoded({ limit: '500mb', extended: true }));

// Routes
app.use('/api/coins', coinRoutes);
app.use('/api', authRoutes);
app.use('/api', InvestmentRoutes);

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI;
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
