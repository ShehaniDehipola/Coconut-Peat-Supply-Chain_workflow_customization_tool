import React from 'react';
import { ResizableBox } from 'react-resizable';
import styled from 'styled-components';

const NodeContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ffc107;
  color: black;
  border: 2px solid #d39e00;
  border-radius: 50%;
`;

const WaitNode = ({ id, data, selected, updateNode }) => {
  const size = data?.size || { width: 120, height: 60 }; // Fallback to default size
  const handleResizeStop = (event, { size }) => {
    updateNode(id, size.width, size.height);
  };

  return (
    <ResizableBox
      width={size.width}
      height={size.height}
      minConstraints={[40, 40]}
      maxConstraints={[150, 150]}
      resizeHandles={['se']}
      onResizeStop={handleResizeStop}
      style={{ border: selected ? '2px solid #007bff' : 'none' }}
    >
      <NodeContainer>{data.label}</NodeContainer>
    </ResizableBox>
  );
};

export default WaitNode;
