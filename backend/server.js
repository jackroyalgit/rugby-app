const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { OpenAI } = require('openai');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Frontend URL
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Use the cors middleware package instead of custom implementation
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true
}));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from Express backend!' });
});

// Test CORS endpoint
app.get('/api/test-cors', (req, res) => {
  res.json({ 
    message: 'CORS is working!',
    origin: FRONTEND_URL
  });
});

// Player routes with OpenAI integration
app.post('/api/players', async (req, res) => {
  const { age, position, weight, height, description } = req.body;
  
  // Validate the data
  if (!age || !position || !weight || !height) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  
  try {
    // Log the received data
    console.log('Received player data:', { age, position, weight, height, description });
    
    // Mock AI response for now to test CORS
    const mockAnalysis = `
# Rugby Player Analysis for ${position}

## Position-Specific Strengths
Based on your profile as a ${position} at ${age} years old, ${height}cm tall, and weighing ${weight}kg:

- Your height and weight combination is well-suited for the ${position} position
- At ${age} years old, you have a good balance of physical development and potential for growth

## Areas for Improvement
Consider focusing on:
- Developing position-specific skills for ${position}
- Working on agility and speed training
- Enhancing core strength for better stability

## Training Recommendations
1. Implement a structured strength training program 3-4 times per week
2. Include position-specific drills in your practice routine
3. Focus on explosive power exercises like plyometrics
4. Incorporate regular cardio sessions to build endurance

## Nutrition Advice
- Maintain a high-protein diet to support muscle development
- Ensure adequate carbohydrate intake for energy during training
- Stay well-hydrated, especially before and during training sessions
- Consider consulting with a sports nutritionist for a personalized meal plan
    `;
    
    // Return success response with mocked AI analysis
    res.status(201).json({ 
      success: true, 
      message: 'Player information processed successfully',
      analysis: mockAnalysis
    });
  } catch (error) {
    console.error('Error processing player data:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to process player information',
      details: error.message
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
  console.log(`CORS enabled for origin: ${FRONTEND_URL}`);
}); 