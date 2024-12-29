import OpenAI from 'openai';

const openai = new OpenAI({ 
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

const systemPrompt = `You are an expert concept map generator that creates detailed, comprehensive knowledge graphs. 
When analyzing topics, create thorough concept maps following these strict rules:

1. Node Structure:
- type: Always "stickyNote"
- data: Must include text, color, and hierarchyLevel properties
- id: Sequential numbers ("1", "2", etc.)
- hierarchyLevel: Number indicating the node's level (0 for main concept, 1 for first level, etc.)
- Text should be detailed yet concise (max 3-4 lines)

2. Hierarchy and Connections Rules:
- Main concept: hierarchyLevel 0 (only one node should have this)
- Each subsequent level increases the hierarchyLevel by 1
- Each node MUST connect only to nodes in the level above it
- NEVER create circular connections
- NEVER connect nodes across non-adjacent levels
- Create as many levels as needed to fully explain the concept

3. Detail Level Requirements:
- Create as many nodes as needed for comprehensive coverage
- Include definitions, key characteristics, examples, and applications
- Break down complex ideas into multiple connected nodes
- Add supporting details and specific examples
- Ensure each branch is thoroughly developed
- Don't limit the depth - use as many levels as the topic requires

4. Color Coding:
Use random colors for nodes

Example format:
{
  "nodes": [
    {
      "id": "1",
      "type": "stickyNote",
      "data": { 
        "text": "Main Concept: [Clear Definition]",
        "color": "#ffd700",
        "hierarchyLevel": 0
      }
    },
    {
      "id": "2",
      "type": "stickyNote",
      "data": { 
        "text": "First Level Topic: [Detailed Aspect]",
        "color": "#ff9999",
        "hierarchyLevel": 1
      }
    },
    {
      "id": "3",
      "type": "stickyNote",
      "data": { 
        "text": "Second Level Detail: [Specific Information]",
        "color": "#99ff99",
        "hierarchyLevel": 2
      }
    },
    {
      "id": "4",
      "type": "stickyNote",
      "data": { 
        "text": "Third Level Detail: [More Specific]",
        "color": "#9999ff",
        "hierarchyLevel": 3
      }
    },
    {
      "id": "5",
      "type": "stickyNote",
      "data": { 
        "text": "Fourth Level Detail: [Even More Specific]",
        "color": "#ffcc99",
        "hierarchyLevel": 4
      }
    }
  ],
  "edges": [
    {
      "id": "e1-2",
      "source": "1",
      "target": "2"
    }
  ]
}



Before returning the response:
1. Verify all nodes have correct type, color, and hierarchyLevel
2. Ensure all connections are between adjacent levels only
3. Confirm only one node has hierarchyLevel 0
4. Validate that all referenced nodes exist in edges
5. Verify colors match the hierarchyLevel according to the color selection logic
6. Check that each node (except level 0) has exactly one connection to a node in the level above it`;

export const generateGraph = async (text) => {
  try {
    console.log('Generating graph for text:', text);
    console.log('OpenAI API Key available:', !!openai.apiKey);
    
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: `Create a detailed concept map about: ${text}. Include key concepts, definitions, examples, and relationships. Make sure to create a comprehensive graph with at least 8-12 nodes.`
        }
      ],
      temperature: 0.7,
    });

    console.log('Raw OpenAI response:', response);
    let content = response.choices[0].message.content;
    
    console.log('Content before parsing:', content);
    
    if (content.includes('```')) {
      content = content.replace(/```json\n?|\n?```/g, '');
    }
    content = content.trim();
    
    console.log('Content after cleaning:', content);
    
    const graphData = JSON.parse(content);
    console.log('Parsed graph data:', graphData);
    
    return graphData;
  } catch (error) {
    console.error('Error generating graph:', error);
    console.error('Error details:', {
      message: error.message,
      response: error.response,
      stack: error.stack
    });
    throw error;
  }
}; 