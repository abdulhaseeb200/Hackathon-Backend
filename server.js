// server.js

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./src/modules/auth/routes/users');
const beneficiaryRoutes = require('./src/modules/Beneficiary/routes/beneficiary');
const cors = require("cors");
const router = require('./src/modules/Charts/routes/industry');

dotenv.config();

const app = express();
app.use(cors()); // Allow all origins (you can modify this for security)

// Middleware
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/beneficiary', beneficiaryRoutes);
app.use("/api/industries", router);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
