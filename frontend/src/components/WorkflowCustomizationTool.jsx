import React, { useState } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import Sidebar from './sidebar/Sidebar';
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
  const plugins = [
    { id: 'A', name: 'Grading' },
    { id: 'B', name: 'Cutting' },
    { id: 'C', name: 'Washing' },
  ];

   const stepsArray = [
    { id: 'A', name: 'Grading' },
  ];
  const [steps, setSteps] = useState([]);

  // Handle the end of a drag event
  const onDragEnd = (result) => {
    const { source, destination } = result;

    console.log("source:", source);
    console.log("destination:", destination);

    // If dropped outside the droppable area, return
    if (!destination) return;

    // Handle dragging from the sidebar to the canvas
    if (source.droppableId === 'sidebar' && destination.droppableId === 'canvas') {
      const newStep = {
        id: uuid4(),
        name: plugins[source.index].name,
      };

      // Add the new step to the list of steps
      setSteps((prevSteps) => [...prevSteps, newStep]);
      }
      
      // Moving within the canvas (reordering)
  if (source.droppableId === 'canvas' && destination.droppableId === 'canvas') {
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
        <Canvas steps={stepsArray} />
      </ToolContainer>
    </DragDropContext>
  );
};

export default WorkflowCustomizationTool;
