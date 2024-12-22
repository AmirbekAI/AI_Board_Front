const express = require('express');
const cors = require('cors');
const app = express();

// Move CORS before all other middleware
app.use(cors({
  origin: [
    'https://ai-board-front-efknttpuj-amirbekais-projects.vercel.app',
    'http://localhost:5173',
    'https://ai-board-front.vercel.app'  // Add any other frontend URLs
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Access-Control-Allow-Credentials'],
  exposedHeaders: ['Access-Control-Allow-Origin']
}));

// Add preflight handling
app.options('*', cors()); // Enable pre-flight for all routes

// Parse JSON bodies
app.use(express.json());

// Rest of your middleware and routes