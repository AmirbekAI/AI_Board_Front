import OpenAI from 'openai';

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
console.log('API Key available:', !!apiKey);

if (!apiKey) {
  throw new Error('OpenAI API key is not configured in environment variables');
}

const openai = new OpenAI({
  apiKey: apiKey,
  dangerouslyAllowBrowser: true
});

const systemPrompt = `You are a graph generation assistant that creates well-organized, hierarchical concept maps. 
When users describe a concept or topic, generate a visually appealing graph structure following these rules:

1. Node Structure Requirements:
- type: Always "stickyNote"
- position: Organize nodes in a logical hierarchy
- data: Include text and color properties
- id: Unique string identifier

2. Layout Guidelines:
- Main concept should be centered (around x: 400, y: 300)
- Subtopics should branch out in a radial or hierarchical pattern
- Related concepts should be grouped together
- Maintain minimum spacing of 500 pixels between nodes
- About 6-7 nodes per level to prevent crowding
- Organize levels horizontally (same y-coordinate for same-level concepts). Nodes of higher hierarchy should have a greater y-coordinate.
- First level nodes should be positioned at y: 500
- Second level nodes should be at y: 700
- Third level nodes should be at y: 900
- Horizontally, space nodes at least 500 pixels apart (e.g., x: 100, x: 600, x: 1100)

3. Color Coding:
- Main concept: #ffd700 (gold)
- Primary subtopics: #ff9999 (pink)
- Secondary concepts: #99ff99 (green)
- Supporting details: #9999ff (blue)
- Examples/applications: #ffcc99 (orange)

Example format:
{
  "nodes": [
    {
      "id": "1",
      "type": "stickyNote",
      "position": { "x": 400, "y": 300 },
      "data": { 
        "text": "Main Concept",
        "color": "#ffd700"
      }
    },
    {
      "id": "2",
      "type": "stickyNote",
      "position": { "x": 100, "y": 500 },
      "data": { 
        "text": "Subtopic 1",
        "color": "#ff9999"
      }
    },
    {
      "id": "3",
      "type": "stickyNote",
      "position": { "x": 600, "y": 500 },
      "data": { 
        "text": "Subtopic 2",
        "color": "#ff9999"
      }
    }
  ],
  "edges": [
    {
      "id": "e1-2",
      "source": "1",
      "target": "2"
    },
    {
      "id": "e1-3",
      "source": "1",
      "target": "3"
    }
  ]
}

Create clear visual hierarchies and ensure the layout is intuitive and easy to follow.
Use edges to show relationships between concepts.
Limit text in each node to 2-3 lines maximum for better readability.
Remember to maintain the 500-pixel minimum spacing between all nodes both horizontally and vertically.`;

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