import React, { useCallback, useState } from 'react';
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  applyNodeChanges,
  applyEdgeChanges,
} from 'reactflow';
import styled from '@emotion/styled';
import 'reactflow/dist/style.css';
import StickyNote from './StickyNote';

const nodeTypes = {
  stickyNote: StickyNote,
};

const StickyBoard = () => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const addStickyNote = useCallback(() => {
    const newNode = {
      id: `node-${nodes.length + 1}`,
      type: 'stickyNote',
      data: { label: `Note ${nodes.length + 1}` },
      position: { x: Math.random() * 500, y: Math.random() * 500 },
      draggable: true,
    };
    setNodes((nds) => [...nds, newNode]);
  }, [nodes]);

  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <button
        onClick={addStickyNote}
        style={{ position: 'absolute', top: 10, left: 10, zIndex: 4 }}
      >
        Add Sticky Note
      </button>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default StickyBoard; 