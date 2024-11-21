import React from 'react';
import { ResizableBox } from 'react-resizable';
import styled from 'styled-components';

// Styled container for the triangle shape
const TriangleContainer = styled.div`
  width: 0;
  height: 0;
  border-left: ${(props) => props.size.width / 2}px solid transparent;
  border-right: ${(props) => props.size.width / 2}px solid transparent;
  border-bottom: ${(props) => props.size.height}px solid #4682b4;
  position: relative;
`;

// Label to center the text inside the triangle
const LabelContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-weight: bold;
`;

const TriangleNode = ({ id, data, selected, updateNode }) => {
    const size = data?.size || { width: 120, height: 60 }; // Fallback to default size
  // Use default size if undefined
  // const size = data.size || { width: 100, height: 80 };

  // Handle resize to update node dimensions
  const handleResizeStop = (event, { size }) => {
    updateNode(id, size.width, size.height);
  };

  return (
    <ResizableBox
      width={size.width}
      height={size.height}
      minConstraints={[60, 40]} // Minimum width and height
      maxConstraints={[200, 150]} // Maximum width and height
      resizeHandles={['se']}
      onResizeStop={handleResizeStop}
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        border: selected ? '2px solid #007bff' : 'none', // Highlight on selection
      }}
    >
      <TriangleContainer size={size}>
        <LabelContainer>{data.label}</LabelContainer>
      </TriangleContainer>
    </ResizableBox>
  );
};

export default TriangleNode;
