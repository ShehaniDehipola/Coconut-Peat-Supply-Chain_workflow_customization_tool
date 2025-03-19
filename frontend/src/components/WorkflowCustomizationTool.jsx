import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useNavigate, useLocation } from 'react-router-dom';
import styled from "styled-components";
import { v4 as uuidv4 } from "uuid";
import { FaArrowRight, FaTrash } from "react-icons/fa";
import Layout from "./MainLayout";
import Header from "./Header";
import TerminalOutput from "./sidebar/TerminalOutput"

// Styled Components
const AppContainer = styled.div`
  display: flex;
  flex-direction: row;
  height: 100vh;
  overflow: hidden;
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  width: 100%;
  height: 100vh;
  box-sizing: border-box;
  overflow: hidden;
  justify-content: space-between;
`;

const WorkflowContainer = styled.div`
  display: flex;
  flex-direction: column; /* Stack items vertically */
  gap: 10px; /* Add spacing between heading and canvas */
`;

const Title = styled.h1`
  font-size: 18px;
  font-weight: bold;
  color: #2D3142; 
  margin-bottom: 20px;
`;

const CanvasHeadingContainer = styled.div`
  display: flex;
  justify-content: space-between; /* Aligns left and right */
  align-items: center;
  padding-bottom: 10px;
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
  width: 200px; 
  background-color: #d3d2d0;
  border-right: 1px solid #ccc;
  padding: 8px;
  box-sizing: border-box;
  flex-shrink: 0;
  height: 100vh;
`;

const Canvas = styled.div`
  flex-grow: 1; /* Takes only necessary space */
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  background-color: #ffffff;
  padding: 10px;
  overflow: auto;
  height: auto; /* Prevents unnecessary height expansion */
  min-height: 300px; /* Ensures the Canvas is not too small */
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
  gap: 10px; /* Add spacing between items */
  padding: 10px;
  background-color: #f0f0f0;
  border: 2px dashed #ccc;
  border-radius: 5px;
  min-height: 200px; /* Adjust height to fit horizontal layout */
  overflow-x: hidden; /* Enable horizontal scrolling if content overflows */
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

const TerminalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #1F2532;
  padding: 8px 12px;
  color: white;
  font-weight: bold;
`;

const ClearButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 14px;

  &:hover {
    color: #d9534f; /* Red hover effect */
  }

  svg {
    margin-left: 5px;
  }
`;

const TerminalContainer = styled.div`
  background-color: #2D3142;
  color: white;
  padding: 10px;
  height: 220px; /* Fixed height */
  overflow-y: auto;
  font-family: monospace;
  font-size: 12px;
  border: 1px solid #333;
  white-space: pre-wrap;
  display: flex;
  flex-direction: column;
  width: 100%;
  box-sizing: border-box;
  margin-top: 0px;
`;

const TerminalLog = styled.div`
  white-space: pre-wrap;
  overflow-wrap: break-word;
  opacity: ${(props) => (props.visible ? 1 : 0)};
  transition: opacity 0.3s ease-in-out;
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
  };

  const [logs, setLogs] = useState([]);
  const [progress, setProgress] = useState(0);

  const addLog = (message) => {
  setLogs((prevLogs) => [...prevLogs, message]);
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

  const formatStepsForLog = (steps) => {
  return steps.map((step, index) => 
    `🔹 Step ${index + 1}: ${step.pluginName} | Order: ${step.order} | Required: ${step.required_amount}`
  ).join("\n");
};
  
  const buildWorkflow = async () => {
    setLogs([]); // Clear logs before each run
    setProgress(10);
    
  if (plugins.column2.items.length === 0) {
    addLog("❌ Error: You must add at least one step.");
    return;
    }
    
    addLog("📡 Preparing workflow data...");
    setProgress(30);

  // Build steps data from the canvas items
  const stepsData = plugins.column2.items.map((item, index) => ({
    pluginName: pluginsData[item.id]?.name || "Unknown Plugin",
    order: index + 1,
    required_amount: Number(item.required_amount) || 20, // Ensure it's a valid number
  }));
    
    addLog("🔍 Starting step-by-step validation...");
    
    for (let i = 0; i < stepsData.length; i++) {
    const step = stepsData[i];

    addLog(`➡️ Validating Step ${i + 1}: ${step.pluginName}...`);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate delay

    if (!step.pluginName) {
      addLog(`❌ Validation failed: Step ${i + 1} has no plugin name.`);
      setProgress(0);
      return;
    }
    if (typeof step.order !== "number" || step.order < 1) {
      addLog(`❌ Validation failed: Step ${i + 1} has an invalid order.`);
      setProgress(0);
      return;
    }
    if (step.required_amount < 1) {
      addLog(`❌ Validation failed: Step ${i + 1} requires a valid amount.`);
      setProgress(0);
      return;
    }

    addLog(`✅ Step ${i + 1}: ${step.pluginName} validated successfully.`);
    await new Promise(resolve => setTimeout(resolve, 300)); // Simulate delay
    }
    
    addLog(`📝 All steps validated! Final workflow:\n${formatStepsForLog(stepsData)}`);
    setProgress(50);

    addLog(`✅ Workflow ID: ${workflowID}`);

  const payload = { steps: stepsData };

    try {
      addLog("🔍 Validating workflow with backend...");
      setProgress(50);
    // 🔹 Step 1: Validate Workflow Before Updating/Creating
    const validateResponse = await fetch("http://localhost:5000/api/workflow/validate-workflow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const validateData = await validateResponse.json();

    if (!validateResponse.ok) {
      throw new Error(validateData.message || "Workflow validation failed.");
    }

      addLog("✅ Validation successful!...");
      setProgress(80);

    console.log("Validation successful! Proceeding with update/create.");

    // 🔹 Step 2: If editing an existing workflow, update it
    if (location.state?.workflow_id) {
      try {
        addLog(`🔄 Updating workflow ${workflowID}...`);
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

        addLog("✅ Workflow updated successfully!");
        setProgress(100);
        // After successful update, navigate to the details page
        navigate("/workflow-details", { state: { workflow_id: workflowID, steps: stepsData } });

      } catch (error) {
        console.error("Error updating workflow:", error);
        alert(`Error updating workflow: ${error.message}`);
      }
    } else {
      addLog("🆕 Creating new workflow...");
      setProgress(100);
      // Step 3: If creating a new workflow, navigate to workflow-details
      navigate("/workflow-details", { state: { workflow_id: workflowID, steps: stepsData } });
    }

    } catch (error) {
      addLog(`❌ Error: ${error.message}`);
      setProgress(0);
    console.error("Error validating workflow:", error);
    alert(`Error: ${error.message}`);
  }
};


  const onDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) return;

    const sourceColumn = plugins[source.droppableId];
    const destinationColumn = plugins[destination.droppableId];

    const sourceItems = [...sourceColumn.items];
  const destinationItems = [...destinationColumn.items];

  //   // Moving within the same column (reordering inside canvas)
  // if (source.droppableId === destination.droppableId) {
  //   const [movedItem] = sourceItems.splice(source.index, 1);
  //   destinationItems.splice(destination.index, 0, movedItem);

  //   setPlugins((prev) => ({
  //     ...prev,
  //     [destination.droppableId]: {
  //       ...destinationColumn,
  //       items: destinationItems,
  //     },
  //   }));
  // }

    if (source.droppableId === "column1" && destination.droppableId === "column2") {
      const draggedItem = { ...sourceColumn.items[source.index] }; // Clone to remove reference
      draggedItem.key = draggedItem.id + uuidv4();
      const updatedDestinationItems = [...destinationColumn.items];
      if (!destinationItems.find((item) => item.key === draggedItem.key)) {
      destinationItems.push(draggedItem);
    }

    setPlugins((prev) => ({
      ...prev,
      column2: {
        ...destinationColumn,
        items: destinationItems,
      },
    }));
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
      const updatedItems = prev.column2.items.filter((item) => item.key !== pluginId);
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
      console.log("Navigating to workflow-details with:", stepsData);
      navigate("/workflow-details", { state: { steps: stepsData } });
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Layout role="exporter">
        <Header title="Workflow Creation" role="exporter"></Header>
        <AppContainer>
        {/* Sidebar */}
        <Sidebar>
          {/* <AddPluginButton onClick={() => navigate('/add-plugin')}>Add Plugin</AddPluginButton> */}
          <Droppable droppableId="column1">
            {(provided) => (
              <Column ref={provided.innerRef} {...provided.droppableProps}>
                <Title>{plugins.column1.name}</Title>
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
          
          <MainContent>
        {/* Workflow Canvas */}
        <Canvas>
          <CanvasHeadingContainer>
            <Title>{plugins.column2.name}</Title>
            <BuildWorkflowButton onClick={buildWorkflow}>{location.state?.workflow_id ? "Update Workflow" : "Build Workflow"}</BuildWorkflowButton>
          </CanvasHeadingContainer>
          <Droppable droppableId="column2">
            {(provided) => (
              <ColumnCanvas ref={provided.innerRef} {...provided.droppableProps}>
                {plugins.column2.items.map((item, index) => (
                  <React.Fragment key={item.key}>
                  <Draggable key={item.key} draggableId={item.key} index={index}>
                    {(provided) => (
                      <PluginCard ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <strong>{pluginsData[item.id]?.name}</strong>
                          <DropdownIcon
                            expanded={expandedPlugins[item.key]}
                              onClick={() => toggleExpand(item.key)}
                              key={item.key}
                         >
                            ▼
                            </DropdownIcon>
                           {/* Delete Button */}
          <button 
            onClick={() => deletePlugin(item.key)} 
            style={{ 
              background: "none", 
              border: "none", 
              color: "red", 
              cursor: "pointer", 
              fontSize: "16px", 
              marginLeft: "8px"
            }}
          >
            ❌
          </button>
                        </div>
                        {expandedPlugins[item.key] && (
                          <ExpandedSection>
                            {pluginsData[item.id].steps.map((step, idx) => (
                              <Step key={idx}>{step}</Step>
                            ))}
                            {/* <h4>Inputs:</h4> */}
      {pluginsData[item.id].inputs.map((input, idx) => (
        <InputField key={idx}>
          <label>{input.label}</label>
          <input 
          type="text" 
          value={plugins.column2.items[index]?.required_amount || ""}
          onChange={(e) => {
            const updatedItems = [...plugins.column2.items];
            updatedItems[index] = { 
              ...updatedItems[index], 
              required_amount: e.target.value 
            };
            setPlugins((prev) => ({
              ...prev,
              column2: { ...prev.column2, items: updatedItems },
            }));
          }}
        />
        </InputField>
        ))}
                          </ExpandedSection>
                        )}
                      </PluginCard>
                    )}
                    </Draggable>
                    {/* Render arrow only if it's not the last item */}
          {index < plugins.column2.items.length - 1 && (
            <FaArrowRight size={20} style={{ alignSelf: "center", color: "#2D3142" }} />
          )}
                    </React.Fragment>
                ))}
                {provided.placeholder}
              </ColumnCanvas>
            )}
            </Droppable>
        </Canvas>
            <TerminalOutput logs={logs} setLogs={setLogs} />
          </MainContent>
      </AppContainer>
      </Layout>
    </DragDropContext>
  );
};


export default WorkflowCustomizationTool;
