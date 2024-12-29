import React, { useState, useCallback, useEffect, useMemo, useContext, memo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactFlow, { 
  Background, 
  Controls, 
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  ReactFlowProvider,
  MarkerType,
  useReactFlow
} from 'reactflow';
import { boardService } from '../services/api';
import 'reactflow/dist/style.css';
import styled from '@emotion/styled';
import StickyNoteNode from './StickyNoteNode';
import AIChatPanel from './AIChatPanel';
import { arrangeNodes } from '../utils/layoutUtils';

const FlowWrapper = styled.div`
  width: 100vw;
  height: 100vh;
  background: white;
`;

const StyledMiniMap = styled(MiniMap)`
  position: absolute;
  top: 0;
  right: 0;
  border-radius: 0 0 0 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-left: 1px solid rgba(22, 24, 35, 0.05);
  border-bottom: 1px solid rgba(22, 24, 35, 0.05);
  height: 120px !important;
  width: 160px !important;
  z-index: 5;
`;

const ButtonGroup = styled.div`
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 150px;
`;

const BackButton = styled.button`
  width: 100%;
  padding: 8px 16px;
  background: #007AFF;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  transition: all 0.2s ease;
  white-space: nowrap;
  display: block;

  &:hover {
    transform: translateY(-1px);
    background: #0066CC;
  }
`;

const ErrorMessage = styled.div`
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  background: rgba(255, 77, 79, 0.1);
  color: #ff4d4f;
  padding: 12px 24px;
  border-radius: 8px;
  border: 1px solid rgba(255, 77, 79, 0.2);
  backdrop-filter: blur(4px);
`;

const defaultEdgeOptions = {
  animated: true,
  style: {
    stroke: '#000000',
    strokeWidth: 1.5,
    background: 'white',
  },
  type: 'bezier',
  markerEnd: {
    type: MarkerType.ArrowClosed,
    width: 15,
    height: 15,
    color: '#000000',
  },
  pathOptions: {
    curvature: 0.3
  }
};

// Create a context for the handlers
const HandlerContext = React.createContext(null);

// Create a wrapper component for StickyNoteNode that uses the context
const StickyNoteWrapper = memo((props) => {
  const handlers = useContext(HandlerContext);
  if (!handlers) {
    console.error('Handlers not found in context');
    return null;
  }
  return (
    <StickyNoteNode
      {...props}
      onColorChange={(color) => handlers.onColorChange(props.id, color)}
      onTextChange={(text) => handlers.onTextChange(props.id, text)}
    />
  );
});

// Define nodeTypes outside of the component
const nodeTypes = {
  stickyNote: StickyNoteWrapper
};

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error in component:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div>Something went wrong. Please refresh the page.</div>;
    }

    return this.props.children;
  }
}

const StickyNoteBoardContent = () => {
  const { boardId } = useParams();
  const navigate = useNavigate();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [error, setError] = useState(null);
  const reactFlowInstance = useReactFlow();
  const [loading, setLoading] = useState(false);

  // Define handlers first
  const handleNodeTextChange = useCallback(async (nodeId, newText) => {
    try {
      const currentNode = nodes.find(n => n.id === nodeId);
      if (!currentNode) return;

      setNodes(nds => nds.map(node => 
        node.id === nodeId 
          ? { ...node, data: { ...node.data, text: newText } }
          : node
      ));

      await boardService.updateNote(boardId, Number(nodeId), {
        content: newText,
        color: currentNode.data.color,
        positionX: currentNode.position.x,
        positionY: currentNode.position.y
      });
    } catch (err) {
      setError('Failed to update note text');
      console.error('Error updating note text:', err);
    }
  }, [boardId, nodes]);

  const handleNodeColorChange = useCallback(async (nodeId, newColor) => {
    try {
      const currentNode = nodes.find(n => n.id === nodeId);
      if (!currentNode) return;

      setNodes(nds => nds.map(node => 
        node.id === nodeId 
          ? { ...node, data: { ...node.data, color: newColor } }
          : node
      ));

      await boardService.updateNote(boardId, Number(nodeId), {
        content: currentNode.data.text,
        color: newColor,
        positionX: currentNode.position.x,
        positionY: currentNode.position.y
      });
    } catch (err) {
      setError('Failed to update note color');
      console.error('Error updating note color:', err);
    }
  }, [boardId, nodes]);

  // Create handlers object
  const handlers = useMemo(() => ({
    onColorChange: handleNodeColorChange,
    onTextChange: handleNodeTextChange
  }), [handleNodeColorChange, handleNodeTextChange]);

  // Then define handleGraphData using the handlers
  const handleGraphData = useCallback(async (data) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('5. Received in handleGraphData:', data);
      
      // Clear existing nodes and edges first
      setNodes([]);
      setEdges([]);
      
      if (!data || !data.nodes) {
        console.error('Invalid graph data structure:', data);
        setError('Invalid graph data received');
        return;
      }

      // Use arrangeNodes from layoutUtils
      const arrangedData = arrangeNodes(data);
      console.log('6. After arrangeNodes:', arrangedData);
      
      const formattedNodes = arrangedData.nodes.map(node => ({
        ...node,
        type: 'stickyNote',
        position: node.position || { x: 0, y: 0 },
        data: {
          ...node.data,
          text: node.data.text,
          color: node.data.color || '#ffd700',
          onColorChange: (color) => handleNodeColorChange(node.id, color),
          onTextChange: (text) => handleNodeTextChange(node.id, text)
        }
      }));
      
      console.log('7. Formatted nodes about to be set:', formattedNodes);
      
      // Set nodes and edges with a small delay
      setTimeout(() => {
        setNodes(formattedNodes);
        if (arrangedData.edges) {
          const formattedEdges = arrangedData.edges.map(edge => ({
            ...edge,
            type: 'default',
            animated: true,
            style: { stroke: '#000000' }
          }));
          setEdges(formattedEdges);
        }
        
        // Fit view after a small delay to ensure nodes are rendered
        setTimeout(() => {
          reactFlowInstance.fitView();
        }, 100);
      }, 0);

    } catch (err) {
      console.error('Error handling graph data:', err);
      setError('Failed to process graph data');
    } finally {
      setLoading(false);
    }
  }, [setNodes, setEdges, handleNodeColorChange, handleNodeTextChange, reactFlowInstance]);

  // Add getRandomPosition helper
  const getRandomPosition = () => ({
    x: Math.random() * 500,
    y: Math.random() * 500
  });

  // Add addNewNote function
  const addNewNote = useCallback(async () => {
    const position = getRandomPosition();
    try {
      const newNote = await boardService.createNote(boardId, {
        content: 'New Note',
        color: '#ffd700',
        positionX: position.x,
        positionY: position.y
      });

      const newNode = {
        id: newNote.id.toString(),
        type: 'stickyNote',
        position: { x: newNote.positionX, y: newNote.positionY },
        data: { 
          text: newNote.content,
          color: newNote.color
        }
      };
      setNodes((nds) => [...nds, newNode]);
    } catch (err) {
      setError('Failed to create note');
      console.error('Error creating note:', err);
    }
  }, [boardId, setNodes]);

  // Handle node position changes
  const handleNodeChange = useCallback(async (node) => {
    try {
      await boardService.updateNote(boardId, Number(node.id), {
        content: node.data.text,
        color: node.data.color,
        positionX: node.position.x,
        positionY: node.position.y
      });
    } catch (err) {
      setError('Failed to update note position');
      console.error('Error updating note position:', err);
    }
  }, [boardId]);

  // Load initial board data
  useEffect(() => {
    const loadBoardData = async () => {
      try {
        console.log('Loading board data...'); // Debug log
        const notes = await boardService.getBoardNotes(boardId);
        console.log('Received notes:', notes); // Debug log
        
        const formattedNodes = notes.map(note => ({
          id: note.id.toString(),
          type: 'stickyNote',
          position: { x: note.positionX, y: note.positionY },
          data: { 
            text: note.content,
            color: note.color
          }
        }));
        console.log('Formatted nodes:', formattedNodes); // Debug log
        setNodes(formattedNodes);

        const edges = await boardService.getBoardEdges(boardId);
        const formattedEdges = edges.map(edge => {
          const sourceId = edge.sourceNote?.id || edge.sourceNoteId;
          const targetId = edge.targetNote?.id || edge.targetNoteId;

          if (!sourceId || !targetId) {
            console.warn('Invalid edge data:', edge);
            return null;
          }

          return {
            id: edge.id.toString(),
            source: sourceId.toString(),
            target: targetId.toString(),
            type: edge.type || 'default',
            style: edge.style ? JSON.parse(edge.style) : {
              stroke: '#333333',
              strokeWidth: 2
            }
          };
        }).filter(Boolean);

        setEdges(formattedEdges);
      } catch (err) {
        setError('Failed to load board data');
        console.error('Error loading board:', err);
      }
    };

    loadBoardData();
  }, [boardId]);

  // Add onConnect handler if it's missing
  const onConnect = useCallback((params) => {
    setEdges((eds) => addEdge(params, eds));
  }, [setEdges]);

  // Add delete handlers if they're missing
  const onNodesDelete = useCallback((deleted) => {
    deleted.forEach(node => {
      boardService.deleteNote(boardId, node.id).catch(err => {
        console.error('Failed to delete note:', err);
        setError('Failed to delete note');
      });
    });
  }, [boardId]);

  const onEdgesDelete = useCallback((deleted) => {
    deleted.forEach(edge => {
      boardService.deleteEdge(boardId, edge.id).catch(err => {
        console.error('Failed to delete edge:', err);
        setError('Failed to delete edge');
      });
    });
  }, [boardId]);

  return (
    <HandlerContext.Provider value={handlers}>
      <FlowWrapper>
        {loading && <LoadingSpinner />}
        <ButtonGroup>
          <BackButton onClick={() => navigate('/profile')}>
            Back to Profile
          </BackButton>
          <BackButton onClick={addNewNote}>
            Add Note
          </BackButton>
        </ButtonGroup>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodesDelete={onNodesDelete}
          onEdgesDelete={onEdgesDelete}
          nodeTypes={nodeTypes}
          defaultEdgeOptions={defaultEdgeOptions}
          onNodeDragStop={(e, node) => handleNodeChange(node)}
          fitView
        >
          <Background color="#aaaaaa" style={{ background: 'white' }} />
          <Controls />
          <StyledMiniMap 
            nodeColor={node => node.data.color || '#fff'}
            style={{ backgroundColor: 'white' }}
            zoomable
            pannable
          />
        </ReactFlow>
        <AIChatPanel 
          onGraphDataReceived={handleGraphData} 
          boardId={boardId}
        />
      </FlowWrapper>
    </HandlerContext.Provider>
  );
};

const StickyNoteBoard = () => {
  return (
    <ErrorBoundary>
      <ReactFlowProvider>
        <StickyNoteBoardContent />
      </ReactFlowProvider>
    </ErrorBoundary>
  );
};

export default StickyNoteBoard; 