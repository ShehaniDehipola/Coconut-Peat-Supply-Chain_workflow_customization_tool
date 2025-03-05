import React, { useState } from "react";
import styled from "styled-components";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

// Styled Components
const Container = styled.div`
  display: flex;
  height: 100vh;
  background: #f4f4f4;
`;

const Sidebar = styled.div`
  width: 250px;
  background: #2c3e50;
  color: white;
  padding: 20px;
`;

const PluginList = styled.div`
  margin-top: 20px;
`;

const Plugin = styled.div`
  padding: 10px;
  margin-bottom: 10px;
  background: #34495e;
  cursor: grab;
  border-radius: 5px;
  text-align: center;
`;

const WorkflowContainer = styled.div`
  flex: 1;
  padding: 20px;
`;

const WorkflowCanvas = styled.div`
  min-height: 300px;
  background: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
`;

const StepBox = styled.div`
  padding: 10px;
  margin-bottom: 10px;
  background: #ecf0f1;
  border-radius: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Input = styled.input`
  width: 50px;
  padding: 5px;
  margin-left: 10px;
`;

const GoButton = styled.button`
  margin-top: 20px;
  padding: 10px;
  width: 100%;
  background: #27ae60;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background: #219150;
  }
`;

const ErrorMessage = styled.div`
  color: red;
  margin-top: 10px;
`;

// Plugins List
const availablePlugins = [
  { id: "Grading", name: "Grading" },
  { id: "Cutting", name: "Cutting" },
  { id: "Washing", name: "Washing" },
  { id: "Drying", name: "Drying" },
];

const WorkflowCreation = ({ onSuccess }) => {
  const [workflowSteps, setWorkflowSteps] = useState([]);
  const [error, setError] = useState("");

  // Drag & Drop Handling
  const onDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(workflowSteps);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setWorkflowSteps(items);
  };

  // Add Plugin to Workflow
  const handleAddPlugin = (plugin) => {
    if (workflowSteps.find((step) => step.id === plugin.id)) {
      setError(`"${plugin.name}" is already added.`);
      return;
    }

    setWorkflowSteps([...workflowSteps, { ...plugin, requiredAmount: 0 }]);
    setError("");
  };

  // Update Required Amount
  const handleRequiredAmountChange = (index, value) => {
    const updatedSteps = [...workflowSteps];
    updatedSteps[index].requiredAmount = value;
    setWorkflowSteps(updatedSteps);
  };

  // Validate Workflow Before Proceeding
  const validateWorkflow = () => {
    if (workflowSteps.length === 0) {
      setError("Please add at least one plugin.");
      return false;
    }

    // Ensure required plugins exist
    const requiredPlugins = ["Grading", "Cutting", "Washing"];
    const existingPlugins = workflowSteps.map((step) => step.id);
    for (let plugin of requiredPlugins) {
      if (!existingPlugins.includes(plugin)) {
        setError(`"${plugin}" is required.`);
        return false;
      }
    }

    // Ensure required amounts are valid
    for (let step of workflowSteps) {
      if (step.requiredAmount <= 0) {
        setError(`"${step.name}" must have a required amount greater than 0.`);
        return false;
      }
    }

    setError("");
    return true;
  };

  // Go Button Handler
  const handleGo = () => {
    if (validateWorkflow()) {
      onSuccess(workflowSteps);
    }
  };

  return (
    <Container>
      {/* Sidebar */}
      <Sidebar>
        <h3>Available Plugins</h3>
        <PluginList>
          {availablePlugins.map((plugin) => (
            <Plugin key={plugin.id} onClick={() => handleAddPlugin(plugin)}>
              {plugin.name}
            </Plugin>
          ))}
        </PluginList>
      </Sidebar>

      {/* Main Workflow Area */}
      <WorkflowContainer>
        <h2>Create Workflow</h2>

        {/* Drag & Drop Canvas */}
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="workflowCanvas">
            {(provided) => (
              <WorkflowCanvas {...provided.droppableProps} ref={provided.innerRef}>
                {workflowSteps.length === 0 && <p>Drag plugins here...</p>}
                {workflowSteps.map((step, index) => (
                  <Draggable key={step.id} draggableId={step.id} index={index}>
                    {(provided) => (
                      <StepBox ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                        {step.name}
                        <Input
                          type="number"
                          value={step.requiredAmount}
                          onChange={(e) => handleRequiredAmountChange(index, Number(e.target.value))}
                          placeholder="Amount"
                        />
                      </StepBox>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </WorkflowCanvas>
            )}
          </Droppable>
        </DragDropContext>

        {/* Error Message */}
        {error && <ErrorMessage>{error}</ErrorMessage>}

        {/* Go Button */}
        <GoButton onClick={handleGo}>Go</GoButton>
      </WorkflowContainer>
    </Container>
  );
};

export default WorkflowCreation;
