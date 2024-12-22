import OpenAI from 'openai';

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

const openai = new OpenAI({
  apiKey: apiKey,
  dangerouslyAllowBrowser: true
});

const systemPrompt = `You are a graph generation assistant. When users describe a concept or topic, 
generate a graph structure. Return ONLY a JSON object with 'nodes' and 'edges' arrays. Example format:
{
  "nodes": [
    {
      "id": "1",
      "position": { "x": 100, "y": 100 },
      "data": { "text": "Main Concept", "color": "#ffd700" }
    }
  ],
  "edges": [
    {
      "id": "e1-2",
      "source": "1",
      "target": "2"
    }
  ]
}`;

export const generateGraph = async (text) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: text
        }
      ],
    });

    let content = response.choices[0].message.content;
    
    // Clean up the response if it contains markdown
    if (content.includes('```')) {
      content = content.replace(/```json\n?|\n?```/g, '');
    }
    content = content.trim();

    const graphData = JSON.parse(content);
    return graphData;
  } catch (error) {
    console.error('Error generating graph:', error);
    throw error;
  }
}; 