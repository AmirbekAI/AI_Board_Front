import React, { useState, useRef, useEffect } from 'react';
import { Handle, Position } from 'reactflow';
import styled from '@emotion/styled';
import NoteToolbar from './NoteToolbar';

const NoteWrapper = styled.div`
  padding: 20px;
  border-radius: 8px;
  background-color: ${props => props.color};
  min-width: 200px;
  min-height: 100px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  position: relative;
`;

const NoteContent = styled.textarea`
  width: 100%;
  min-height: 80px;
  border: none;
  background: transparent;
  resize: none;
  font-family: inherit;
  font-size: inherit;
  outline: none;
  font-weight: ${props => props.format === 'bold' ? 'bold' : 'normal'};
  font-style: ${props => props.format === 'italic' ? 'italic' : 'normal'};
`;

const StickyNoteNode = ({ data, isConnectable }) => {
  const [showToolbar, setShowToolbar] = useState(false);
  const [noteColor, setNoteColor] = useState(data.color);
  const [format, setFormat] = useState('normal');
  const [text, setText] = useState(data.text);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const isToolbarClick = event.target.closest('.note-toolbar');
      if (isToolbarClick) return;

      const isThisNote = wrapperRef.current && wrapperRef.current.contains(event.target);
      if (!isThisNote) {
        setShowToolbar(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside, true);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true);
    };
  }, []);

  const handleChange = (e) => {
    setText(e.target.value);
    if (data.onTextChange) {
      data.onTextChange(e.target.value);
    }
  };

  const handleNoteClick = (e) => {
    e.stopPropagation();
    setShowToolbar(true);
  };

  const getToolbarPosition = () => {
    if (!wrapperRef.current) return { x: 0, y: 0 };
    const rect = wrapperRef.current.getBoundingClientRect();
    return {
      x: rect.width / 2,
      y: -60
    };
  };

  return (
    <NoteWrapper 
      ref={wrapperRef}
      color={noteColor}
      onClick={handleNoteClick}
    >
      <Handle 
        type="target" 
        position={Position.Top} 
        isConnectable={isConnectable} 
      />
      <NoteContent
        value={text}
        onChange={handleChange}
        format={format}
        onClick={(e) => e.stopPropagation()}
      />
      <Handle 
        type="source" 
        position={Position.Bottom} 
        isConnectable={isConnectable} 
      />
      
      {showToolbar && (
        <NoteToolbar
          position={getToolbarPosition()}
          onColorChange={setNoteColor}
          onFormatChange={setFormat}
          currentColor={noteColor}
          currentFormat={format}
          className="note-toolbar"
        />
      )}
    </NoteWrapper>
  );
};

export default StickyNoteNode; 