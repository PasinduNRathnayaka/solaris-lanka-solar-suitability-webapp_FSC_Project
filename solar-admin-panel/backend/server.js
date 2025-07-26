const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/coefficients', require('./routes/coefficients'));
app.use('/api/variables', require('./routes/variables'));
app.use('/api/locations', require('./routes/locations'));
app.use('/api/analytics', require('./routes/analytics'));

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Solar Admin Panel API' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});