const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { OpenAI } = require('openai');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8888;

// Frontend URL
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Explicit CORS configuration
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).send();
  }
  next();
});

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from Express backend!' });
});

// Simple echo POST endpoint to test data submission
app.post('/api/echo', (req, res) => {
  console.log('Received data in echo endpoint:', req.body);
  res.json({ 
    success: true,
    message: 'Data received successfully',
    receivedData: req.body
  });
});

// Test CORS endpoint
app.get('/api/test-cors', (req, res) => {
  res.json({ 
    message: 'CORS is working!',
    origin: FRONTEND_URL
  });
});

// Test OpenAI endpoint
app.get('/api/test-openai', async (req, res) => {
  try {
    console.log('Testing OpenAI API connection...');
    console.log('OpenAI API Key status:', openai.apiKey ? 'Key is set' : 'Key is missing');
    
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "user", content: "Say hello world" }
      ],
    });
    
    console.log('OpenAI test successful!');
    
    res.json({ 
      success: true,
      message: 'OpenAI API is working!',
      response: completion.choices[0].message.content
    });
  } catch (error) {
    console.error('OpenAI test failed:', error);
    
    // Send back detailed error information
    res.status(500).json({ 
      success: false,
      error: 'Failed to connect to OpenAI',
      errorType: error.constructor.name,
      errorMessage: error.message,
      errorStack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Player routes with OpenAI integration
app.post('/api/players', async (req, res) => {
  const { age, position, weight, height, description } = req.body;
  
  // Validate the data
  if (!age || !position || !weight || !height) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  
  // Log the received data
  console.log('Received player data:', { age, position, weight, height, description });
  console.log('Preparing to call OpenAI API...');
  
  try {
    // Try to make the OpenAI API call
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a rugby coach and expert. Analyze the player data and provide personalized advice."
        },
        {
          role: "user",
          content: `Analyze this rugby player data and provide advice in markdown format:
          Age: ${age}
          Position: ${position}
          Weight: ${weight}kg
          Height: ${height}cm
          Additional Info: ${description || 'None provided'}`
        }
      ],
      temperature: 0.7,
    });
    
    console.log('OpenAI API call successful!');
    const analysis = completion.choices[0].message.content;
    
    // Return success response with actual AI analysis
    res.status(201).json({ 
      success: true, 
      message: 'Player information processed successfully',
      analysis: analysis
    });
  } catch (error) {
    console.error('Error processing player data:', error);
    
    // Generate mock analysis as fallback
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
    
    // Return success response with mock analysis
    res.status(201).json({ 
      success: true, 
      message: 'Player information processed with mock data (OpenAI API unavailable)',
      analysis: mockAnalysis,
      openaiError: error.message
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
  console.log(`CORS enabled for origin: ${FRONTEND_URL}`);
  console.log(`Environment PORT value: ${process.env.PORT || 'Not set (using default)'}`);
}); 