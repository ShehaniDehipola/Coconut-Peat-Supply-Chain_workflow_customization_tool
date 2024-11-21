import React from 'react';
import { ResizableBox } from 'react-resizable';
import styled from 'styled-components';

const NodeContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => props.bgColor || '#4caf50'};
  color: white;
  text-align: center;
  border: 2px solid ${(props) => props.borderColor || '#388e3c'};
  border-radius: ${(props) => props.borderRadius || '5px'};
`;

const ActionNode = ({ id, data, selected, updateNode }) => {
  const size = data?.size || { width: 120, height: 60 }; // Fallback to default size
  // Handle resize stop to update the node size in React Flow
  const handleResizeStop = (event, { size }) => {
    updateNode(id, size.width, size.height);
  };

  return (
    <ResizableBox
      width={size.width}
      height={size.height}
      minConstraints={[60, 30]}
      maxConstraints={[200, 100]}
      resizeHandles={['se']}
      onResizeStop={handleResizeStop}
      style={{ border: selected ? '2px solid #007bff' : 'none' }}
    >
      <NodeContainer>{data.label}</NodeContainer>
    </ResizableBox>
  );
};

export default ActionNode;
