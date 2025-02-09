const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require("cors");

const authRoutes = require('./src/modules/auth/routes/users');
const beneficiaryRoutes = require('./src/modules/Beneficiary/routes/beneficiary');
const industryRoutes = require('./src/modules/Charts/routes/industry');

dotenv.config();

const app = express();

// CORS Configuration
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Middleware
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, // Fix for MongoDB timeout issue
})
.then(() => console.log('✅ MongoDB connected'))
.catch((err) => console.error('❌ MongoDB Connection Error:', err));

// Routes
app.get("/", (req, res) => {
  res.send("Backend is running...");
});

app.use('/api/auth', authRoutes);
app.use('/api/beneficiary', beneficiaryRoutes);
app.use('/api/industries', industryRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
