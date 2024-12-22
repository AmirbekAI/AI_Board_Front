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
  
  &:before {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-top: 8px solid white;
    filter: drop-shadow(0 2px 2px rgba(0,0,0,0.1));
  }
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

const NoteToolbar = ({ position, onColorChange, onFormatChange, currentColor, currentFormat }) => {
  const colors = ['#ffd700', '#ff9999', '#99ff99', '#9999ff', '#ffcc99'];
  const formats = ['normal', 'bold', 'italic'];

  return (
    <ToolbarWrapper style={{ top: position.y, left: position.x }}>
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