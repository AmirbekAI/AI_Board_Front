import React, { useState, useCallback } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState
} from 'reactflow';
import 'reactflow/dist/style.css';
import StickyNoteNode from './StickyNoteNode';
import AIChatPanel from './AIChatPanel';

const nodeTypes = {
  stickyNote: StickyNoteNode
};

const StickyNoteBoard = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const addNewNote = useCallback(() => {
    const newNode = {
      id: `note-${nodes.length + 1}`,
      type: 'stickyNote',
      position: { x: 100, y: 100 },
      data: { 
        text: 'New Note',
        color: '#ffd700'
      }
    };
    setNodes((nds) => [...nds, newNode]);
  }, [nodes, setNodes]);

  const handleGraphData = (graphData) => {
    if (graphData.nodes) {
      setNodes((nds) => [...nds, ...graphData.nodes]);
    }
    if (graphData.edges) {
      setEdges((eds) => [...eds, ...graphData.edges]);
    }
  };

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <button 
        onClick={addNewNote}
        style={{ 
          position: 'absolute', 
          top: '20px', 
          left: '20px',
          zIndex: 4 
        }}
      >
        Add Note
      </button>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
      <AIChatPanel onGraphDataReceived={handleGraphData} />
    </div>
  );
};

export default StickyNoteBoard; 