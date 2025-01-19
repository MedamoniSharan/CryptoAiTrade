const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

require('dotenv').config();


const authRoutes = require('./Routes/auth');
const InvestmentRoutes = require('./Routes/investment');


const app = express();
const PORT = process.env.PORT || 3000;

const corsOptions = {
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'], 
  };
  
app.use(cors(corsOptions));
app.use(bodyParser.json());

const MONGO_URI = process.env.MONGO_URI ;
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));



//rotues:
app.use('/api', authRoutes);
app.use('/api', InvestmentRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
