import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useNavigate, useLocation } from 'react-router-dom';
import styled from "styled-components";
import { v4 as uuidv4 } from "uuid";

// Styled Components
const AppContainer = styled.div`
  display: flex;
  height: calc(100vh - 50px); /* Full viewport height */
`;

const WorkflowContainer = styled.div`
  display: flex;
  flex-direction: column; /* Stack items vertically */
  gap: 10px; /* Add spacing between heading and canvas */
`;

const CanvasHeadingContainer = styled.div`
  display: flex;
  justify-content: space-between; /* Aligns left and right */
  align-items: center;
  padding-bottom: 10px;
`;

const CanvasHeading = styled.h3`
  margin: 0;
`;

const BuildWorkflowButton = styled.button`
  background-color: #2D3142;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background-color: #1F2532;
  }
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
  const location = useLocation(); 

  // Load previous workflow if editing
  const [workflowID, setWorkflowID] = useState("");
  const [plugins, setPlugins] = useState({
    column1: {
      name: "Plugins",
      items: [
        { id: "plugin-1", content: "Grading" },
        { id: "plugin-2", content: "Cutting" },
        { id: "plugin-3", content: "Washing" },
        { id: "plugin-4", content: "Drying" },
        { id: "plugin-5", content: "Packaging" },
        { id: "plugin-6", content: "Delivering" },
      ],
    },
    column2: {
      name: "Workflow Canvas",
      items: [],
    },
  });

  const [expandedPlugins, setExpandedPlugins] = useState({}); // To track expanded state
  const [error, setError] = useState("");

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
  "plugin-4": {
    name: "Drying",
    steps: ["Fill Tanks r", "Wash for 24 Hours", "Wash for Another 24 Hours", "Final Wash for 12 Hours", "Check EC Level"],
    inputs: [{ label: "EC Level:", parameter: "targetECLevel" }],
    },
  "plugin-6": {
    name: "Packaging",
    steps: ["Fill Tanks r", "Wash for 24 Hours", "Wash for Another 24 Hours", "Final Wash for 12 Hours", "Check EC Level"],
    inputs: [{ label: "EC Level:", parameter: "targetECLevel" }],
    }
  ,
  "plugin-7": {
    name: "Delivering",
    steps: ["Fill Tanks r", "Wash for 24 Hours", "Wash for Another 24 Hours", "Final Wash for 12 Hours", "Check EC Level"],
    inputs: [{ label: "EC Level:", parameter: "targetECLevel" }],
  },
  };

  useEffect(() => {
    if (location.state?.workflow_id) {
      // If editing, load existing workflow
      setWorkflowID(location.state.workflow_id);
      setPlugins((prev) => ({
        ...prev,
        column2: {
          ...prev.column2,
          items: location.state.steps.map((step, index) => ({
            id: `plugin-${index + 1}`,
            content: step.pluginName,
            required_amount: step.required_amount,
          })),
        },
      }));
    } else {
      // Creating a new workflow: Only generate an ID if not already set
      setWorkflowID((prevID) => prevID || `WF-${uuidv4().split("-")[0]}`);
    }
  }, [location.state]);

// const buildWorkflow = () => {
//   if (plugins.column2.items.length === 0) {
//     alert("You must add at least one step.");
//     return;
//   }

//   const stepsData = plugins.column2.items.map((item, index) => ({
//     pluginName: pluginsData[item.id]?.name || "Unknown Plugin",
//     order: index + 1,
//     required_amount: pluginsData[item.id]?.required_amount || 0,
//   }));

//   // Debugging Logs
//   console.log("Navigating to workflow-details with:");
//   console.log("Workflow ID:", workflowID);
//   console.log("Steps:", stepsData);

//   const payload = { steps: stepsData };

//   navigate("/workflow-details", { state: { workflow_id: workflowID, steps: stepsData }});
  // };
  
  const buildWorkflow = async () => {
  if (plugins.column2.items.length === 0) {
    alert("You must add at least one step.");
    return;
  }

  // Build steps data from the canvas items
  const stepsData = plugins.column2.items.map((item, index) => ({
    pluginName: pluginsData[item.id]?.name || "Unknown Plugin",
    order: index + 1,
    required_amount: pluginsData[item.id]?.required_amount || 0,
  }));

  console.log("Workflow ID:", workflowID);
  console.log("Steps:", stepsData);

  const payload = { steps: stepsData };

  // Check if we are editing an existing workflow (i.e. workflow_id is present)
  if (location.state?.workflow_id) {
    try {
      const response = await fetch(
        `http://localhost:5000/api/workflow/${workflowID}`,
        {
          method: "PUT", // or PATCH depending on your backend implementation
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update workflow");
      }

      const data = await response.json();
      console.log("Update successful:", data);
      // After successful update, navigate to the details page
      navigate("/workflow-details", {
        state: { workflow_id: workflowID, steps: stepsData },
      });
    } catch (error) {
      console.error("Error updating workflow:", error);
      alert(`Error updating workflow: ${error.message}`);
    }
  } else {
    // In create mode: navigate to the workflow-details page (where you might show a preview or further options)
    navigate("/workflow-details", { state: { workflow_id: workflowID, steps: stepsData } });
  }
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

  const validateWorkflow = async () => {
    const workflowData = {
      steps: plugins.column2.items.map((item, index) => ({
        pluginName: pluginsData[item.id]?.name || "Unknown Plugin",
        order: index + 1,
        required_amount: pluginsData[item.id]?.required_amount || 0,
        
      })),
    };


    try {
      const response = await fetch("http://localhost:5000/api/workflow/validate-workflow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(workflowData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      alert("Validation successful! Proceeding to the next step.");
      const stepsData = plugins.column2.items.map((item, index) => ({
    pluginName: pluginsData[item.id]?.name || "Unknown Plugin",
    order: index + 1,
    required_amount: pluginsData[item.id]?.required_amount || 0,
  }));
      navigate("/workflow-details", { state: { steps: stepsData } });
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <AppContainer>
        {/* Sidebar */}
        <Sidebar>
          {/* <AddPluginButton onClick={() => navigate('/add-plugin')}>Add Plugin</AddPluginButton> */}
          <Droppable droppableId="column1">
            {(provided) => (
              <Column ref={provided.innerRef} {...provided.droppableProps}>
                <h3>{plugins.column1.name}</h3>
                {plugins.column1.items.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided) => (
                      <Item ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} isFixed>
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
          <CanvasHeadingContainer>
            <CanvasHeading>{plugins.column2.name}</CanvasHeading>
            <BuildWorkflowButton onClick={buildWorkflow}>{location.state?.workflow_id ? "Update Workflow" : "Build Workflow"}</BuildWorkflowButton>
          </CanvasHeadingContainer>
          <Droppable droppableId="column2">
            {(provided) => (
              <ColumnCanvas ref={provided.innerRef} {...provided.droppableProps}>
                {plugins.column2.items.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided) => (
                      <PluginCard ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <strong>{pluginsData[item.id]?.name}</strong>
                          <DropdownIcon
                            expanded={expandedPlugins[item.id]}
                            onClick={() => toggleExpand(item.id)}
                          >
                            ▼
                          </DropdownIcon>
                        </div>
                        {expandedPlugins[item.id] && (
                          <ExpandedSection>
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
                      </PluginCard>
                    )}
                  </Draggable>
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
