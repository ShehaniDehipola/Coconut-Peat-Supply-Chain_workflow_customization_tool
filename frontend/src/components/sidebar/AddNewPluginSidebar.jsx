import React from "react";
import styled from "styled-components";

const PaletteContainer = styled.div`
  width: 240px;
  padding: 10px;
  background-color: #f4f4f4;
  border-right: 1px solid #ddd;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ShapeBox = styled.div`
  padding: 12px;
  background-color: #e0e0e0;
  border: 1px solid #bbb;
  border-radius: 5px;
  cursor: grab;
  text-align: center;
  font-size: 0.9em;
  color: #333;

  &:hover {
    background-color: #d0d0d0;
  }
`;

const AddNewPluginSidebar = ({ nodeTemplates }) => {
  return (
    <PaletteContainer>
      <h4>Shapes</h4>
      {nodeTemplates.map((template) => (
        <ShapeBox
          key={template.category}
          draggable
          onDragStart={(e) =>
            e.dataTransfer.setData(
              "application/json",
              JSON.stringify({ category: template.category, text: template.text })
            )
          }
        >
          {template.text}
        </ShapeBox>
      ))}
    </PaletteContainer>
  );
};

export default AddNewPluginSidebar;
