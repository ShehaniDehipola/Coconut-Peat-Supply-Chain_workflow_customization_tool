import React, { useState } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import styled from 'styled-components';
import { PluginServiceClient } from '../generated/plugin_grpc_web_pb';
import { ExecuteGradingRequest } from '../generated/plugin_pb';

// Canvas container styling
const CanvasContainer = styled.div`
  flex-grow: 1;
  padding: 20px;
  border: 2px dashed #ccc;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;

const PluginStepBox = styled.div`
  padding: 20px;
  margin-bottom: 10px;
  background-color: ${(props) => (props.expanded ? '#f0f8ff' : '#fffbcc')};
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
  max-width: 400px;
  text-align: center;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const EditBox = styled.div`
  padding: 10px;
  margin-top: 10px;
  background-color: #f0f8ff;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
  max-width: 400px;
  text-align: left;
`;

const DropdownIcon = styled.span`
  display: inline-block;
  transition: transform 0.3s ease;
  transform: ${(props) => (props.expanded ? 'rotate(180deg)' : 'rotate(0deg)')};
`;

const SubstepContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
`;

const SubstepBox = styled.div`
  padding: 20px;
  background-color: #e7e7e7;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin: 0 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 120px;
  text-align: center;
`;

const Arrow = styled.div`
  width: 40px;
  height: 2px;
  background-color: #000;
  position: relative;
`;

const ArrowHead = styled.div`
  position: absolute;
  top: -3px;
  right: -5px;
  border: solid black;
  border-width: 0 3px 3px 0;
  display: inline-block;
  padding: 3px;
  transform: rotate(-45deg);
  -webkit-transform: rotate(-45deg);
`;

const InputField = styled.input`
  padding: 5px;
  margin: 5px 0;
  width: 80%;
`;

const LabelBox = styled.div`
  padding: 5px;
  margin-top: 5px;
  color: #fff;
  background-color: ${(props) => props.bgColor};
  border-radius: 4px;
  width: 60px;
  text-align: center;
  font-size: 12px;
  top: -30px;
`;

// Background for total husks required
const TotalHuskRequiredBox = styled.div`
  padding: 15px;
  margin-top: 20px;
  background-color: #d4edda;
  border: 2px solid #c3e6cb;
  border-radius: 4px;
  text-align: center;
  font-weight: bold;
`;

const SendButton = styled.button`
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  margin-top: 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }

  &:focus {
    outline: none;
  }
`;

// Canvas component where steps are dropped
const Canvas = ({ steps }) => {
    const [expanded, setExpanded] = useState(false);
    const [userRequirementCount, setUserRequirementCount] = useState(0);

    // Toggle expanded state to show editing form
    const toggleExpanded = () => {
        setExpanded(!expanded);
    };

    const pluginService = new PluginServiceClient('http://localhost:50051', null, null);  // Replace with actual server

const sendToCore = () => {
    const request = new ExecuteGradingRequest();
    request.setUserRequirement(userRequirementCount);  // Set the userRequirement value
    request.setExecutionCount(1);  // Set example execution count

    pluginService.executeGrading(request, {}, (err, response) => {
        if (err) {
            console.error('gRPC call failed:', err);
            return;
        }
        console.log('Response from core:', response.getMessage());
    });
};

    return (
        <CanvasContainer>
            <h3>Workflow Canvas</h3>

            {/* Droppable area for plugins */}
      <Droppable droppableId="canvas" type="dropZone" isDropDisabled={false}>
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {steps.map((step, index) => (
              <Draggable key={step.id} draggableId={step.id} index={index}>
                {(provided) => (
                  <PluginStepBox
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    expanded={expanded}
                    onClick={toggleExpanded}
                  >
                    <span>{step.name}</span>
                    {/* Dropdown icon for expanding/collapsing */}
                    <DropdownIcon expanded={expanded}>▼</DropdownIcon>
                    </PluginStepBox>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
        </Droppable>
        
        {expanded && (
        <EditBox>
          <h4>Edit Grading Process</h4>
          <p>This step captures the color of coconut husks and categorizes them.</p>

          <SubstepContainer>
            <SubstepBox>Capture Husk Color</SubstepBox>
            <Arrow>
              <ArrowHead />
            </Arrow>
            <SubstepBox>
              Categorize Husk <br />
              <LabelBox bgColor="#28a745">Qualified</LabelBox>
              <LabelBox bgColor="#ffc107">Acceptable</LabelBox>
              <LabelBox bgColor="#dc3545">Disqualified</LabelBox>
            </SubstepBox>
          </SubstepContainer>

          <div style={{ marginTop: '20px' }}>
            <label>
              Number of Required Husks:
              <InputField
                type="number"
                value={userRequirementCount}
                onChange={(e) => setUserRequirementCount(e.target.value)}
              />
            </label>
          </div>
          <TotalHuskRequiredBox>
            Total Husk Required (Qualified + Acceptable): {userRequirementCount}
          </TotalHuskRequiredBox>
          <SendButton onClick={sendToCore}>Send to Core</SendButton>
        </EditBox>
      )}
        </CanvasContainer>
    );
};

export default Canvas;
