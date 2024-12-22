export const arrangeNodes = (graphData) => {
  if (!graphData.nodes || graphData.nodes.length === 0) return graphData;

  const LEVEL_HEIGHT = 500;
  const NODE_WIDTH = 300;
  const NODE_SPACING = 100;
  const INITIAL_Y = 100;
  
  // Noise ranges (in pixels)
  const X_NOISE_RANGE = 30;  // ±30px horizontal variation
  const Y_NOISE_RANGE = 20;  // ±20px vertical variation

  // Helper function to add noise
  const addNoise = (value, range) => {
    return value + (Math.random() - 0.5) * 2 * range;
  };

  // Initialize all nodes with a default position
  const nodesWithPositions = graphData.nodes.map(node => ({
    ...node,
    position: { x: 0, y: 0 }
  }));

  // Group nodes by hierarchy level
  const levels = {};
  nodesWithPositions.forEach(node => {
    const level = parseInt(node.data.hierarchyLevel);
    levels[level] = levels[level] || [];
    levels[level].push(node.id);
  });

  // Position nodes by level
  Object.keys(levels)
    .sort((a, b) => parseInt(a) - parseInt(b))
    .forEach(level => {
      const nodeIds = levels[level];
      const levelY = INITIAL_Y + (parseInt(level) * LEVEL_HEIGHT);
      const totalWidth = nodeIds.length * NODE_WIDTH + (nodeIds.length - 1) * NODE_SPACING;
      const startX = Math.max(0, (1200 - totalWidth) / 2);

      nodeIds.forEach((nodeId, index) => {
        const node = nodesWithPositions.find(n => n.id === nodeId);
        if (node) {
          // Add noise to both x and y coordinates
          node.position = {
            x: addNoise(startX + index * (NODE_WIDTH + NODE_SPACING), X_NOISE_RANGE),
            y: addNoise(levelY, Y_NOISE_RANGE)
          };
        }
      });
    });

  return {
    nodes: nodesWithPositions,
    edges: graphData.edges
  };
}; 