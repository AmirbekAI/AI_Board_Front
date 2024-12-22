const express = require('express');
const router = express.Router();
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY // This will be on your backend server
});

router.post('/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }))
    });

    // Process the response and generate graph data
    const graphData = processAIResponse(completion.choices[0].message.content);

    res.json({
      message: completion.choices[0].message.content,
      graphData
    });
  } catch (error) {
    console.error('AI Chat Error:', error);
    res.status(500).json({ error: 'Failed to process AI request' });
  }
});

function processAIResponse(content) {
  // Your existing logic to convert AI response to graph data
  // This should match your current graph generation logic
  return {
    nodes: [],
    edges: []
  };
}

module.exports = router; 