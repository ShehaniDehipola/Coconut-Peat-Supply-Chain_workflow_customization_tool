import React from 'react';
import styled from 'styled-components';

// Styled components
const SidebarContainer = styled.div`
  width: 200px;
  padding: 10px;
  background-color: #f4f4f4;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ShapeBox = styled.div`
  padding: 10px;
  background-color: #ccc;
  border: 1px solid #999;
  border-radius: 5px;
  cursor: grab;
  text-align: center;

  &:hover {
    background-color: #bbb;
  }
`;

const AddNewPluginSidebar = ({ onDragStart, pluginName, setPluginName }) => {
  const shapes = [
    { id: 'action', label: 'Action (Rectangle)' },
    { id: 'wait', label: 'Wait (Circle)' },
    { id: 'check', label: 'Check (Diamond)' },
    { id: 'triangle', label: 'Triangle' },
  ];

  return (
    <SidebarContainer>
      <h4>Plugin Name</h4>
      <input
        type="text"
        value={pluginName}
        onChange={(e) => setPluginName(e.target.value)}
        placeholder="Enter plugin name"
      />

      <h4>Shapes</h4>
      {shapes.map((shape) => (
        <ShapeBox
          key={shape.id}
          draggable
          onDragStart={(event) => onDragStart(event, shape.id)}
        >
          {shape.label}
        </ShapeBox>
      ))}
    </SidebarContainer>
  );
};

export default AddNewPluginSidebar;
