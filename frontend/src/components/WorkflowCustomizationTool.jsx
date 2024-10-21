import React, { useState } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import Sidebar from './Sidebar';
import Canvas from './Canvas';
import styled from 'styled-components';
import { v4 as uuid4 } from 'uuid'

// Main container to arrange sidebar and canvas
const ToolContainer = styled.div`
  display: flex;
  height: 100vh;
`;

// Main component for the workflow customization tool
const WorkflowCustomizationTool = () => {
  const [steps, setSteps] = useState([]);
  const plugins = [
    { id: 'plugin-1', name: 'Grading' },
    { id: 'plugin-2', name: 'Cutting' },
    { id: 'plugin-3', name: 'Washing' },
  ];

  // Handle the end of a drag event
  const onDragEnd = (result) => {
    const { source, destination } = result;

    // If dropped outside the droppable area, return
    if (!destination) return;

    // Handle dragging from the sidebar to the canvas
    if (source.droppableId === '1' && destination.droppableId === '2') {
      const newStep = {
        id: uuid4(),
        name: plugins[source.index].name,
      };

      // Add the new step to the list of steps
      setSteps([...steps, newStep]);
      }
      
      // Moving within the canvas (reordering)
  if (source.droppableId === '2' && destination.droppableId === '2') {
    const updatedSteps = Array.from(steps);
    const [movedStep] = updatedSteps.splice(source.index, 1); // Remove the dragged step
    updatedSteps.splice(destination.index, 0, movedStep); // Insert it at the new position

    // Update the state with the reordered steps
    setSteps(updatedSteps);
  }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <ToolContainer>
        <Sidebar plugins={plugins} />
        <Canvas steps={steps} />
      </ToolContainer>
    </DragDropContext>
  );
};

export default WorkflowCustomizationTool;
