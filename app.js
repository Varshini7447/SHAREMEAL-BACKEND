const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

// Middleware
app.use(cors());
app.use(express.json());
const logger = require('./Middlewares/logger');
const errorHandler = require('./Middlewares/error');

// Routes
const authRoutes = require('./routes/authRoutes'); 
app.use('/api', authRoutes); 
app.use(logger);

// DB connection
mongoose.connect(process.env.MONGO_URL, {

}).then(() => {
  console.log('MongoDB connected');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

app.use(errorHandler);

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
