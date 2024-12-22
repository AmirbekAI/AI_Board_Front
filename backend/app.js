const aiRouter = require('./routes/ai');
const cors = require('cors');
// ... other imports

// ... other middleware
app.use(cors({
  origin: [
    'https://ai-board-front-efknttpuj-amirbekais-projects.vercel.app',
    'http://localhost:5173'  // For local development
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use('/api/ai', aiRouter); 