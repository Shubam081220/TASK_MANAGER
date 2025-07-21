const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors'); // ✅ Added cors package
const taskRoutes = require('./routes/task');

const app = express();
dotenv.config();

// ✅ Enable CORS for frontend requests
app.use(cors({
  origin: 'http://localhost:3000', // frontend base URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// Middleware
app.use(express.json());

// Routes
app.use('/api/tasks', taskRoutes);

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch((err) => {
  console.error('Connection error:', err.message);
});
