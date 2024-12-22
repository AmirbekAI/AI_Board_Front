import React, { useState, useCallback } from 'react';
import styled from '@emotion/styled';
import { Handle, Position } from 'reactflow';
import NoteToolbar from './NoteToolbar';

const NoteWrapper = styled.div`
  position: relative;
  background-color: ${props => props.backgroundColor};
  padding: 15px;
  border-radius: 5px;
  min-width: 150px;
  min-height: 80px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.2);
  }

  &:before {
    content: '';
    position: absolute;
    top: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 40%;
    height: 12px;
    background-color: rgba(0, 0, 0, 0.1);
    border-radius: 3px;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 60px;
  border: none;
  background: transparent;
  resize: none;
  font-family: inherit;
  font-size: 14px;
  line-height: 1.4;
  outline: none;
  font-weight: ${props => props.format === 'bold' ? 'bold' : 'normal'};
  font-style: ${props => props.format === 'italic' ? 'italic' : 'normal'};

  &:focus {
    outline: none;
  }
`;

const StickyNote = ({ data, selected }) => {
  const [text, setText] = useState(data.label);
  const [color, setColor] = useState('#ffd700');
  const [format, setFormat] = useState('normal');
  const [showToolbar, setShowToolbar] = useState(false);

  const handleChange = useCallback(
    (evt) => {
      const newText = evt.target.value;
      setText(newText);
      data.onChange?.(newText);
    },
    [data]
  );

  const handleClick = useCallback(() => {
    setShowToolbar(true);
  }, []);

  const handleColorChange = useCallback((newColor) => {
    setColor(newColor);
  }, []);

  const handleFormatChange = useCallback((newFormat) => {
    setFormat(newFormat);
  }, []);

  return (
    <>
      <NoteWrapper backgroundColor={color} onClick={handleClick}>
        <Handle type="target" position={Position.Top} />
        <TextArea 
          value={text} 
          onChange={handleChange}
          format={format}
        />
        <Handle type="source" position={Position.Bottom} />
      </NoteWrapper>
      {selected && showToolbar && (
        <NoteToolbar
          position={{ x: 0, y: -60 }}
          onColorChange={handleColorChange}
          onFormatChange={handleFormatChange}
          currentColor={color}
          currentFormat={format}
        />
      )}
    </>
  );
};

export default StickyNote; 