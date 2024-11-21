import React from 'react';
import { ResizableBox } from 'react-resizable';
import styled from 'styled-components';

const NodeContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #066cdb;
  color: white;
  transform: rotate(45deg); /* Makes it a diamond shape */
  border: 2px solid #054a9a;
`;

const LabelContainer = styled.div`
  transform: rotate(-45deg); /* Rotates text back to normal */
`;

const CheckNode = ({ id, data, selected, updateNode }) => {
  const size = data?.size || { width: 120, height: 60 }; // Fallback to default size
  const handleResizeStop = (event, { size }) => {
    updateNode(id, size.width, size.height);
  };

  return (
    <ResizableBox
      width={size.width}
      height={size.height}
      minConstraints={[50, 50]}
      maxConstraints={[150, 150]}
      resizeHandles={['se']}
      onResizeStop={handleResizeStop}
      style={{ border: selected ? '2px solid #007bff' : 'none' }}
    >
      <NodeContainer>
        <LabelContainer>{data.label}</LabelContainer>
      </NodeContainer>
    </ResizableBox>
  );
};


export default CheckNode;
