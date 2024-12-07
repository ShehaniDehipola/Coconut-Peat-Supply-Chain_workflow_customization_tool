// import React, { useState } from 'react';
// import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
// import Sidebar from './sidebar/Sidebar';
// import Canvas from './Canvas';
// import styled from 'styled-components';
import { v4 as uuid4 } from 'uuid'

// // Main container to arrange sidebar and canvas
// const ToolContainer = styled.div`
//   display: flex;
//   height: 100vh;
// `;

// // Styled Components
// const Container = styled.div`
//   display: flex;
//   justify-content: center;
//   margin-top: 20px;
// `;

// const Column = styled.div`
//   margin: 0 20px;
//   padding: 10px;
//   width: 250px;
//   background-color: #f0f0f0;
//   border: 1px solid #ccc;
//   border-radius: 5px;
//   min-height: 300px;
// `;

// const Item = styled.div`
//   padding: 10px;
//   margin-bottom: 10px;
//   background-color: ${(props) => (props.isFixed ? "#ddd" : "#fff")};
//   border: 1px solid #ccc;
//   border-radius: 5px;
//   cursor: grab;
// `;

// // Main component for the workflow customization tool
// const WorkflowCustomizationTool = () => {

//   // const plugins = [
//   //   { id: 'A', name: 'Grading' },
//   //   { id: 'B', name: 'Cutting' },
//   //   { id: 'C', name: 'Washing' },
//   // ];

//   //  const stepsArray = [
//   //   { id: 'SA', name: 'Grading' },
//   // ];
//   // const [steps, setSteps] = useState([]);

//   // // Handle the end of a drag event
//   // const onDragEnd = (result) => {
//   //   const { source, destination } = result;

//   //   console.log("source:", source);
//   //   console.log("destination:", destination);

//   //   // If dropped outside the droppable area, return
//   //   if (!destination) return;

//   //   // Handle dragging from the sidebar to the canvas
//   //   if (source.droppableId === 'sidebar' && destination.droppableId === 'canvas') {
//   //     const newStep = {
//   //       id: uuid4(),
//   //       name: plugins[source.index].name,
//   //     };

//   //     // Add the new step to the list of steps
//   //     setSteps((prevSteps) => [...prevSteps, newStep]);
//   //     }
      
//   //     // Moving within the canvas (reordering)
//   // if (source.droppableId === 'canvas' && destination.droppableId === 'canvas') {
//   //   const updatedSteps = Array.from(steps);
//   //   const [movedStep] = updatedSteps.splice(source.index, 1); // Remove the dragged step
//   //   updatedSteps.splice(destination.index, 0, movedStep); // Insert it at the new position

//   //   // Update the state with the reordered steps
//   //   setSteps(updatedSteps);
//   // }
//   // };

//   const [columns, setColumns] = useState({
//     column1: {
//       name: "Fixed Items",
//       items: [
//         { id: "item-1", content: "Fixed Item 1" },
//         { id: "item-2", content: "Fixed Item 2" },
//         { id: "item-3", content: "Fixed Item 3" },
//       ],
//     },
//     column2: {
//       name: "Drop Area",
//       items: [],
//     },
//   });

//   const onDragEnd = (result) => {
//     const { source, destination } = result;

//     console.log('source', source);
//     console.log('destination', destination);

//     // If dropped outside any list
//     if (!destination) return;

//     const sourceColumn = columns[source.droppableId];
//     const destinationColumn = columns[destination.droppableId];

//     // If dragging within the same column, do nothing
//     if (source.droppableId === destination.droppableId) return;

//     // Copy the item from the source column
//     const draggedItem = sourceColumn.items[source.index];

//     // Add the copied item to the destination column
//     const updatedDestinationItems = [...destinationColumn.items, draggedItem];

//     // Update the state for the destination column
//     setColumns({
//       ...columns,
//       [destination.droppableId]: {
//         ...destinationColumn,
//         items: updatedDestinationItems,
//       },
//     });
//   };

//   return (
//     <DragDropContext onDragEnd={onDragEnd}>
//       <Container>
//         {/* Render Columns */}
//         {Object.entries(columns).map(([columnId, column]) => (
//           <Droppable key={columnId} droppableId={columnId}>
//             {(provided) => (
//               <Column ref={provided.innerRef} {...provided.droppableProps}>
//                 <h3>{column.name}</h3>
//                 {column.items.map((item, index) => (
//                   <Draggable
//                     key={item.id}
//                     draggableId={item.id}
//                     index={index}
//                     isDragDisabled={columnId === "column1"} // Disable drag within Column 1
//                   >
//                     {(provided) => (
//                       <Item
//                         ref={provided.innerRef}
//                         {...provided.draggableProps}
//                         {...provided.dragHandleProps}
//                         isFixed={columnId === "column1"}
//                       >
//                         {item.content}
//                       </Item>
//                     )}
//                   </Draggable>
//                 ))}
//                 {provided.placeholder}
//               </Column>
//             )}
//           </Droppable>
//         ))}
//       </Container>
//     </DragDropContext>
//   );
// };

// export default WorkflowCustomizationTool;

import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useNavigate } from 'react-router-dom';
import styled from "styled-components";

// Styled Components
const AppContainer = styled.div`
  display: flex;
  height: 100vh; /* Full viewport height */
`;

const WorkflowContainer = styled.div`
  display: flex;
  flex-direction: column; /* Stack items vertically */
  gap: 10px; /* Add spacing between heading and canvas */
`;

const CanvasHeading = styled.h3`
  margin: 0; /* Remove any default margin for better alignment */
  padding-bottom: 10px; /* Optional padding for better spacing */
`;

const Sidebar = styled.div`
  width: 200px; /* Sidebar width */
  background-color: #d3d2d0;
  border-right: 1px solid #ccc;
  padding: 20px;
  box-sizing: border-box;
`;

const Canvas = styled.div`
  flex: 1; /* Takes the remaining space */
  background-color: #ffffff;
  padding: 20px;
  box-sizing: border-box;
`;

const AddPluginButton = styled.button`
  margin-bottom: 20px;
  padding: 10px;
  background-color: #2D3142;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
`;


const Column = styled.div`
  padding: 10px;
  border-radius: 5px;
  min-height: 300px;
`;

const ColumnCanvas = styled.div`
  display: flex;
  margin-top: 100px;
  gap: 10px; /* Add spacing between items */
  padding: 10px;
  background-color: #f0f0f0;
  border: 2px dashed #ccc;
  border-radius: 5px;
  min-height: 300px; /* Adjust height to fit horizontal layout */
  overflow-x: auto; /* Enable horizontal scrolling if content overflows */
  white-space: nowrap; /* Prevent items from wrapping */
`;

const Item = styled.div`
  padding: 10px;
  margin-bottom: 10px;
  background-color: ${(props) => (props.isFixed ? "#ffffff" : "#fff")};
  border: 1px solid black;
  border-radius: 5px;
  cursor: grab;
`;

const ExpandButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  margin-left: auto;
  font-size: 14px;
  color: #007bff;

  &:hover {
    text-decoration: underline;
  }
`;

const PluginCard = styled.div`
  display: flex;
  flex-direction: column;
  width: 200px;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 10px;
  background-color: rgba(216, 149, 39, 0.1);
  cursor: pointer;
  overflow: hidden; /* Prevents overflow of content */
  position: relative; /* Ensures positioning of children relative to the card */
`;


const ExpandedSection = styled.div`
  margin-top: 10px;
  padding: 10px;
  border-top: 1px solid #ddd;
  max-height: 150px; /* Set a maximum height to prevent overflow */
`;

const InputField = styled.div`
  display: flex;
  flex direction: column;
  align-items: flex-start;
  margin-top: 10px;

  label {
    font-size: 14px;
    margin-right: 5px;
  }

  input {
    width: 100%;
    padding: 5px;
    font-size: 14px;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-sizing: border-box;
  }
`;

const Step = styled.div`
  padding: 5px;
  font-size: 12px;
  border-left: 4px solid #d89527;
  margin-bottom: 5px;
  background-color: #eef;
  border-radius: 3px;
`;

const DropdownIcon = styled.span`
  font-size: 16px;
  cursor: pointer;
  transform: ${(props) => (props.expanded ? "rotate(180deg)" : "rotate(0deg)")};
  transition: transform 0.2s ease-in-out; /* Smooth rotation */
`;

const Button = styled.button`
  background-color: transparent;
  color: #2D3142;
  border: 1px solid #2D3142;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  margin-top: 100px;
  margin-left: 120px;
  
  &:hover {
    opacity: 0.8;
  }
    transition: background-color 0.3s, color 0.3s;

  &:hover {
    background-color: #2D3142;
    color: white;
  }
`;

const WorkflowCustomizationTool = () => {
  const navigate = useNavigate();
  const [plugins, setPlugins] = useState({
    column1: {
      name: "Plugins",
      items: [
        { id: "plugin-1", content: "Grading" },
        { id: "plugin-2", content: "Cutting" },
        { id: "plugin-3", content: "Washing" },
      ],
    },
    column2: {
      name: "Workflow Canvas",
      items: [],
    },
  });

  const [expandedPlugins, setExpandedPlugins] = useState({}); // To track expanded state

  const pluginsData = {
    "plugin-1": {
    name: "Grading",
    steps: ["Collect Husks", "Grade Husks"],
    inputs: [{ label: "Required Husk Count:", parameter: "requiredHusks" }],
  },
  "plugin-2": {
    name: "Cutting",
    steps: ["Cut Husks ", "Validate All Husks Processed"],
    inputs: [],
  },
  "plugin-3": {
    name: "Washing",
    steps: ["Fill Tanks r", "Wash for 24 Hours", "Wash for Another 24 Hours", "Final Wash for 12 Hours", "Check EC Level"],
    inputs: [{ label: "EC Level:", parameter: "targetECLevel" }],
  },
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) return;

    const sourceColumn = plugins[source.droppableId];
    const destinationColumn = plugins[destination.droppableId];

    if (source.droppableId === "column1" && destination.droppableId === "column2") {
      const draggedItem = sourceColumn.items[source.index];
      const updatedDestinationItems = [...destinationColumn.items];
      if (!updatedDestinationItems.find((item) => item.id === draggedItem.id)) {
        updatedDestinationItems.splice(destination.index, 0, draggedItem);
      }

      setTimeout(() => {
        setPlugins((prev) => ({
          ...prev,
          column2: {
            ...destinationColumn,
            items: updatedDestinationItems,
          },
        }));
      }, 0);
    }
  };

  const toggleExpand = (pluginId) => {
    setExpandedPlugins((prev) => ({
      ...prev,
      [pluginId]: !prev[pluginId],
    }));
  };

  const deletePlugin = (pluginId) => {
    setPlugins((prev) => {
      const updatedItems = prev.column2.items.filter((item) => item.id !== pluginId);
      return {
        ...prev,
        column2: { ...prev.column2, items: updatedItems },
      };
    });
  };

  const updatePluginData = (pluginId) => {
    // Handle updating plugin data
    alert(`Updating plugin: ${pluginId}`);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <AppContainer>
        {/* Sidebar */}
        <Sidebar>
          {/* Add Plugin Button */}
      <AddPluginButton onClick={() => navigate('/add-plugin')}>Add Plugin</AddPluginButton>
          <Droppable droppableId="column1">
            {(provided) => (
              <Column ref={provided.innerRef} {...provided.droppableProps}>
                <h3>{plugins.column1.name}</h3>
                {plugins.column1.items.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided) => (
                      <Item
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        isFixed
                      >
                        {item.content}
                      </Item>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </Column>
            )}
          </Droppable>
        </Sidebar>

        {/* Workflow Canvas */}
        <Canvas>
          <CanvasHeading>{plugins.column2.name}</CanvasHeading>
          <Droppable droppableId="column2">
            {(provided) => (
              <ColumnCanvas ref={provided.innerRef} {...provided.droppableProps}>
                {plugins.column2.items.map((item, index) => (
                  <PluginCard>
  <div
    ref={provided.innerRef}
    {...provided.draggableProps}
    style={{ display: "flex", justifyContent: "space-between" }}
  >
    <strong {...provided.dragHandleProps}>{pluginsData[item.id]?.name}</strong>
    <DropdownIcon
      expanded={expandedPlugins[item.id]}
      onClick={() => toggleExpand(item.id)}
    >
      ▼
                      </DropdownIcon>
  </div>
  {expandedPlugins[item.id] && (
    <ExpandedSection>
      {/* <h4>Steps:</h4> */}
      {pluginsData[item.id].steps.map((step, idx) => (
        <Step key={idx}>{step}</Step>
      ))}
      {/* <h4>Inputs:</h4> */}
      {pluginsData[item.id].inputs.map((input, idx) => (
        <InputField key={idx}>
          <label>{input.label}</label>
          <input type="text" />
        </InputField>
      ))}
                        <Button onClick={() => updatePluginData(item.id)}>Update</Button>
                  
    </ExpandedSection>
                    )}
                    {/* Show delete button only when not expanded */}
                    {/* {!expandedPlugins[item.id] && (
                      <Button delete onClick={() => deletePlugin(item.id)}>
                        Delete
                      </Button>
                    )} */}
                    
</PluginCard>

                ))}
                {provided.placeholder}
              </ColumnCanvas>
            )}
          </Droppable>
        </Canvas>
      </AppContainer>
    </DragDropContext>
  );
};


export default WorkflowCustomizationTool;
