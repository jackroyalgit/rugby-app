const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Routes
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from Express backend!' });
});

// Player routes
app.post('/api/players', (req, res) => {
  const { age, position, weight, height } = req.body;
  
  // Validate the data
  if (!age || !position || !weight || !height) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  
  // In a real app, you would save this to a database
  console.log('Received player data:', { age, position, weight, height });
  
  // Return success response
  res.status(201).json({ 
    success: true, 
    message: 'Player information saved successfully' 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
}); 