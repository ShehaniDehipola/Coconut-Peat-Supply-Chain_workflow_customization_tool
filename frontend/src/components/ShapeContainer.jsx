import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  width: 200px;
  background: #2c3e50;
  color: white;
  padding: 10px;
`;

const ShapeButton = styled.div`
  padding: 10px;
  margin: 5px 0;
  background: #34495e;
  border-radius: 5px;
  text-align: center;
  cursor: pointer;

  &:hover {
    background: #1abc9c;
  }
`;

const ShapeContainer = ({ onShapeClick }) => {
  const shapes = [
    { type: 'rectangle', label: 'Rectangle' },
    { type: 'circle', label: 'Circle' },
    { type: 'diamond', label: 'Diamond' },
    { type: 'parallelogram', label: 'Parallelogram' },
    { type: 'cylinder', label: 'Cylinder' },
    { type: 'triangle', label: 'Triangle' },
    { type: 'arrowRectangle', label: 'Arrow Rectangle' },
    { type: 'plus', label: 'Plus' },
    { type: 'hexagon', label: 'Hexagon' },
  ];

  return (
    <Container>
      <h3>Shapes</h3>
      {shapes.map((shape) => (
        <ShapeButton
          key={shape.type}
          onClick={() => onShapeClick(shape.type)}
        >
          {shape.label}
        </ShapeButton>
      ))}
    </Container>
  );
};

export default ShapeContainer;
