import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';
import { FaArrowRight, FaTrash } from 'react-icons/fa';
import NewLayout from './NewWorkflowLayout';
import Header from './Header';
import TerminalOutput from './sidebar/TerminalOutput';
import { toast } from 'react-toastify';

// Styled Components
const AppContainer = styled.div`
  display: flex;
  flex-direction: row;
  height: 100vh;
  overflow: hidden;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  width: 100%;
  height: 100%; /* Subtract header height if applicable */
  box-sizing: border-box;
`;

const SplitContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const HalfSection = styled.div`
  flex: 1; /* Makes both sections take equal height */
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const WorkflowContainer = styled.div`
  display: flex;
  flex-direction: column; /* Stack items vertically */
  gap: 10px; /* Add spacing between heading and canvas */
`;

const Title = styled.h1`
  font-size: 18px;
  font-weight: bold;
  color: #2d3142;
  margin-bottom: 20px;
`;

const CanvasHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #1f2532;
  padding: 8px 12px;
  color: white;
  font-weight: semi-bold;
`;

const CanvasContainer = styled.div`
  background-color: #2d3142;
  color: white;
  padding: 10px;
  min-height: 300px; /* Keep canvas height */
  border: 1px solid #333;
  box-sizing: border-box;
  overflow: auto;
  display: flex;
  flex-direction: column;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px; /* Add spacing between buttons */
`;

const CanvasButton = styled.button`
  background: none;
  border: 1px solid white;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 14px;
  padding: 6px 12px;
  border-radius: 4px;
  transition: background-color 0.3s ease-in-out;

  &:hover {
    background-color: #d9534f; /* Red hover effect */
  }

  svg {
    margin-left: 5px;
  }
`;

const CanvasHeadingContainer = styled.div`
  display: flex;
  justify-content: space-between; /* Aligns left and right */
  align-items: center;
  padding-bottom: 10px;
`;

const BuildWorkflowButton = styled.button`
  background-color: #2d3142;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background-color: #1f2532;
  }
`;

const Sidebar = styled.div`
  width: 200px;
  background-color: #d3d2d0;
  border-right: 1px solid #ccc;
  padding: 8px;
  box-sizing: border-box;
  flex-shrink: 0;
  height: 100%; /* Ensures sidebar does not exceed screen height */
  display: flex;
  flex-direction: column;
`;

const SidebarHeader = styled.div`
  font-size: 18px;
  font-weight: semi-bold;
  color: #2d3142;
  padding: 12px;
  border-bottom: 2px solid #ccc;
  text-align: center;
  background-color: #d3d2d0;
`;

const Canvas = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  background-color: #ffffff;
  overflow: auto;
  height: auto; /* Prevents unnecessary height expansion */
`;

const AddPluginButton = styled.button`
  margin-bottom: 20px;
  padding: 10px;
  background-color: #2d3142;
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
  background-color: ${(props) => (props.isFixed ? '#ffffff' : '#fff')};
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
  border: 2px solid rgba(234, 149, 11, 0.1);
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 10px;
  background-color: rgba(216, 149, 39, 0.4);
  cursor: pointer;
  overflow: visible;
  position: relative;
  min-height: 150px;
  max-height: auto;
`;

const ExpandedSection = styled.div`
  margin-top: 10px;
  padding: 10px;
  border-top: 1px solid #ddd;
  max-height: 150px; /* Set a maximum height to prevent overflow */
  overflow-y: auto; /* Allow scrolling when steps exceed limit */
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
  transform: ${(props) => (props.expanded ? 'rotate(180deg)' : 'rotate(0deg)')};
  transition: transform 0.2s ease-in-out; /* Smooth rotation */
`;

const Button = styled.button`
  background-color: transparent;
  color: #2d3142;
  border: 1px solid #2d3142;
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
    background-color: #2d3142;
    color: white;
  }
`;

const LoadingAnimation = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  font-size: 16px;
  font-weight: bold;
  color: white;
  animation: fadeIn 0.5s ease-in-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const WorkflowCustomizationTool = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Load previous workflow if editing
  const [workflowID, setWorkflowID] = useState('');
  const [plugins, setPlugins] = useState({
    column1: {
      name: 'Plugins',
      items: [
        { id: 'plugin-1', content: 'Grading' },
        { id: 'plugin-2', content: 'Cutting' },
        { id: 'plugin-3', content: 'Washing' },
      ],
    },
    column2: {
      name: 'Workflow Canvas',
      items: [],
    },
  });

  const [expandedPlugins, setExpandedPlugins] = useState({}); // To track expanded state
  const [error, setError] = useState('');

  const pluginsData = {
    'plugin-1': {
      name: 'Grading',
      steps: ['Collect Husks', 'Grade Husks'],
      inputs: [{ label: 'Required Husk Count:', parameter: 'requiredHusks' }],
    },
    'plugin-2': {
      name: 'Cutting',
      steps: ['Cut Husks ', 'Validate All Husks Processed'],
      inputs: [],
    },
    'plugin-3': {
      name: 'Washing',
      steps: [
        'Fill Tanks r',
        'Wash for 24 Hours',
        'Wash for Another 24 Hours',
        'Final Wash for 12 Hours',
        'Check EC Level',
      ],
      inputs: [{ label: 'EC Level:', parameter: 'targetECLevel' }],
    },
  };

  const [logs, setLogs] = useState([]);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true); // Track loading before logs print
  const [validationCompleted, setValidationCompleted] = useState(false);

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
      console.log("Workflow ID: ", location.state?.workflow_id);
      console.log("Workflow Steps: ", location.state?.steps);
    } else {
      // Creating a new workflow: Only generate an ID if not already set
      setWorkflowID((prevID) => prevID || `WF-${uuidv4().split('-')[0]}`);
    }
  }, [location.state]);

  const formatStepsForLog = (steps) => {
    return steps
      .map(
        (step, index) =>
          `   Step ${index + 1}: ${step.pluginName} | Order: ${
            step.order
          } | Required: ${step.required_amount}`
      )
      .join('\n');
  };

  const buildWorkflow = async () => {
    setLogs([]); // Clear logs before each run
    setProgress(10);
    setIsLoading(true); // Start loading animation
    setValidationCompleted(false); // Reset validation status

    if (plugins.column2.items.length === 0) {
      setTimeout(() => {
        setIsLoading(false);
        addLog(' Error: You must add at least one step.');
      }, 2000); // Delay to allow loading effect
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait for 2 seconds before log

    setIsLoading(false); // Stop loading before logs print
    addLog(' Preparing workflow data...');
    setProgress(30);

    // Build steps data from the canvas items
    const stepsData = plugins.column2.items.map((item, index) => ({
      pluginName: pluginsData[item.id]?.name || 'Unknown Plugin',
      order: index + 1,
      required_amount: Number(item.required_amount) || 20, // Ensure it's a valid number
      sub_steps: pluginsData[item.id]?.steps || [],
    }));

    addLog(' Starting step-by-step validation...');

    for (let i = 0; i < stepsData.length; i++) {
      const step = stepsData[i];

      addLog(` Validating Step ${i + 1}: ${step.pluginName}`);
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate delay

      if (!step.pluginName) {
        addLog(` Validation failed: Step ${i + 1} has no plugin name.`);
        setProgress(0);
        return;
      }
      if (typeof step.order !== 'number' || step.order < 1) {
        addLog(` Validation failed: Step ${i + 1} has an invalid order.`);
        setProgress(0);
        return;
      }
      if (step.required_amount < 1) {
        addLog(` Validation failed: Step ${i + 1} requires a valid amount.`);
        setProgress(0);
        return;
      }

      addLog(` Step ${i + 1}: ${step.pluginName} validated successfully.`);
      await new Promise((resolve) => setTimeout(resolve, 300)); // Simulate delay
    }

    addLog(
      ` All steps validated! Final workflow:\n${formatStepsForLog(stepsData)}`
    );
    setProgress(50);

    addLog(` Workflow ID: ${workflowID}`);

    const payload = { steps: stepsData };

    try {
      addLog(' Validating workflow with backend...');
      setProgress(50);
      // 🔹 Step 1: Validate Workflow Before Updating/Creating
      const validateResponse = await fetch(
        'http://localhost:5000/api/workflow/validate-workflow',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );

      const validateData = await validateResponse.json();

      if (!validateResponse.ok) {
        throw new Error(validateData.message || 'Workflow validation failed.');
      }

      addLog(' Validation successful!...');
      setProgress(80);

      console.log('Validation successful! Proceeding with update/create.');

      // Step 2: If editing an existing workflow, update it
      if (location.state?.workflow_id) {

        // Transform payload to update only sub_steps format
        const transformedPayload = {
            steps: payload.steps.map(step => ({
                ...step,  // Keep existing properties
                sub_steps: step.sub_steps.map(subStep => ({ name: subStep })) // Convert sub_steps format
            }))
        };

        console.log('Transformed payload:', JSON.stringify(transformedPayload)); 

        try {
          console.log('payload', JSON.stringify(payload));
          addLog(` Updating workflow ${workflowID}...`);
          const response = await fetch(
            `http://localhost:5000/api/workflow/${workflowID}`,
            {
              method: 'PUT', 
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(transformedPayload),
            }
          );

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to update workflow');
          }

          const data = await response.json();
          console.log('Update successful:', data);

          addLog(' Workflow updated successfully!');
          setProgress(100);
          await new Promise((resolve) => setTimeout(resolve, 20000));

          // After successful update, navigate to the details page
          navigate("/workflow-details", { state: { workflow_id: workflowID, steps: stepsData } });
        } catch (error) {
          console.error('Error updating workflow:', error);
          // toast.error(`Error updating workflow: ${error.message}`);
        }
      } else {
        addLog(' Creating new workflow...');
        setProgress(100);
        // Step 3: If creating a new workflow, navigate to workflow-details
        console.log('Navigating to workflow-details with:', workflowID, stepsData);
        await new Promise((resolve) => setTimeout(resolve, 20000));
         navigate("/workflow-details", { state: { workflow_id: workflowID, steps: stepsData } });
      }
    } catch (error) {
      addLog(` Error: ${error.message}`);
      setProgress(0);
      console.error('Error validating workflow:', error);
      toast.error(`Error: ${error.message}`);
    }
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) return;

    const sourceColumn = plugins[source.droppableId];
    const destinationColumn = plugins[destination.droppableId];

    const sourceItems = [...sourceColumn.items];
    const destinationItems = [...destinationColumn.items];

    if (
      source.droppableId === 'column1' &&
      destination.droppableId === 'column2'
    ) {
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
      const updatedItems = prev.column2.items.filter(
        (item) => item.key !== pluginId
      );
      return {
        ...prev,
        column2: { ...prev.column2, items: updatedItems },
      };
    });
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <NewLayout role='exporter'>
        <Header
          title='Workflow Creation'
          role='exporter'
        ></Header>
        <AppContainer>
          {/* Sidebar */}
          <Sidebar>
            <CanvasHeader><span>Plugins</span></CanvasHeader>
            {/* <AddPluginButton onClick={() => navigate('/add-plugin')}>Add Plugin</AddPluginButton> */}
            <Droppable droppableId='column1'>
              {(provided) => (
                <Column
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {plugins.column1.items.map((item, index) => (
                    <Draggable
                      key={item.id}
                      draggableId={item.id}
                      index={index}
                    >
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

          <ContentWrapper>
            <SplitContainer>
              <HalfSection>
                {/* Workflow Canvas */}
                <Canvas>
                  <CanvasHeader>
                    <span>Workflow Canvas</span>
                    <ButtonGroup>
                      <CanvasButton
                        onClick={() =>
                          setPlugins((prev) => ({
                            ...prev,
                            column2: { ...prev.column2, items: [] },
                          }))
                        }
                      >
                        Clear
                      </CanvasButton>
                      <CanvasButton onClick={buildWorkflow}>Build</CanvasButton>
                    </ButtonGroup>
                  </CanvasHeader>
                  <Droppable droppableId='column2'>
                    {(provided) => (
                      <ColumnCanvas
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                      >
                        {plugins.column2.items.map((item, index) => (
                          <React.Fragment key={item.key}>
                            <Draggable
                              key={item.key}
                              draggableId={item.key}
                              index={index}
                            >
                              {(provided) => (
                                <PluginCard
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  <div
                                    style={{
                                      display: 'flex',
                                      justifyContent: 'space-between',
                                    }}
                                  >
                                    <strong>
                                      {pluginsData[item.id]?.name}
                                    </strong>
                                    <DropdownIcon
                                      expanded={expandedPlugins[item.key]}
                                      onClick={() => toggleExpand(item.key)}
                                      key={item.key}
                                    >
                                      ▼
                                    </DropdownIcon>
                                  </div>
                                  {expandedPlugins[item.key] && (
                                    <ExpandedSection>
                                      {pluginsData[item.id].steps.map(
                                        (step, idx) => (
                                          <Step key={idx}>{step}</Step>
                                        )
                                      )}
                                      {/* <h4>Inputs:</h4> */}
                                      {pluginsData[item.id].inputs.map(
                                        (input, idx) => (
                                          <InputField key={idx}>
                                            <label>{input.label}</label>
                                            <input
                                              type='text'
                                              value={
                                                plugins.column2.items[index]
                                                  ?.required_amount || ''
                                              }
                                              onChange={(e) => {
                                                const updatedItems = [
                                                  ...plugins.column2.items,
                                                ];
                                                updatedItems[index] = {
                                                  ...updatedItems[index],
                                                  required_amount:
                                                    e.target.value,
                                                };
                                                setPlugins((prev) => ({
                                                  ...prev,
                                                  column2: {
                                                    ...prev.column2,
                                                    items: updatedItems,
                                                  },
                                                }));
                                              }}
                                            />
                                          </InputField>
                                        )
                                      )}
                                    </ExpandedSection>
                                  )}
                                  {/* Delete Button Positioned at the Bottom */}
                                  <div
                                    style={{
                                      marginTop: 'auto',
                                      textAlign: 'center',
                                    }}
                                  >
                                    <button
                                      onClick={() => deletePlugin(item.key)}
                                      style={{
                                        background: 'none',
                                        border: 'none',
                                        color: 'red',
                                        cursor: 'pointer',
                                        fontSize: '16px',
                                      }}
                                    >
                                      <FaTrash />
                                    </button>
                                  </div>
                                </PluginCard>
                              )}
                            </Draggable>
                            {/* Render arrow only if it's not the last item */}
                            {index < plugins.column2.items.length - 1 && (
                              <FaArrowRight
                                size={20}
                                style={{
                                  alignSelf: 'center',
                                  color: '#2D3142',
                                }}
                              />
                            )}
                          </React.Fragment>
                        ))}
                        {provided.placeholder}
                      </ColumnCanvas>
                    )}
                  </Droppable>
                </Canvas>
              </HalfSection>
              <HalfSection>
                <TerminalOutput
                  logs={logs}
                  setLogs={setLogs}
                />
              </HalfSection>
            </SplitContainer>
          </ContentWrapper>
        </AppContainer>
      </NewLayout>
    </DragDropContext>
  );
};

export default WorkflowCustomizationTool;
