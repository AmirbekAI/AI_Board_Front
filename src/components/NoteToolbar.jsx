import React from 'react';
import styled from '@emotion/styled';

const ToolbarWrapper = styled.div`
  position: absolute;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
  padding: 12px;
  z-index: 100;
  display: flex;
  gap: 12px;
  align-items: center;
  border: 1px solid #eee;
  transform-origin: center bottom;
`;

const Divider = styled.div`
  width: 1px;
  height: 24px;
  background: #eee;
  margin: 0 4px;
`;

const ColorButton = styled.button`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 2px solid ${props => props.selected ? '#000' : '#eee'};
  background-color: ${props => props.color};
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 0;
  
  &:hover {
    transform: scale(1.1);
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

const FormatButton = styled.button`
  padding: 6px 12px;
  background: ${props => props.active ? '#f0f0f0' : 'white'};
  border: 1px solid ${props => props.active ? '#ddd' : '#eee'};
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 13px;
  color: #444;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  
  &:hover {
    background: #f5f5f5;
    border-color: #ddd;
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
`;

const NoteToolbar = ({ position, onColorChange, onFormatChange, currentColor, currentFormat, className }) => {
  const colors = ['#ffd700', '#ff9999', '#99ff99', '#9999ff', '#ffcc99'];
  const formats = ['normal', 'bold', 'italic'];
  const { x, y, scale = 1 } = position;

  return (
    <ToolbarWrapper 
      style={{ 
        top: y,
        left: x,
        transform: `translate(-50%, -100%) scale(${scale})`
      }}
      className={`note-toolbar ${className || ''}`}
    >
      <ButtonGroup>
        {colors.map(color => (
          <ColorButton
            key={color}
            color={color}
            selected={currentColor === color}
            onClick={() => onColorChange(color)}
          />
        ))}
      </ButtonGroup>
      <Divider />
      <ButtonGroup>
        {formats.map(format => (
          <FormatButton
            key={format}
            active={currentFormat === format}
            onClick={() => onFormatChange(format)}
          >
            {format === 'normal' ? 'T' : 
             format === 'bold' ? <strong>B</strong> : 
             <em>I</em>}
          </FormatButton>
        ))}
      </ButtonGroup>
    </ToolbarWrapper>
  );
};

export default NoteToolbar; 