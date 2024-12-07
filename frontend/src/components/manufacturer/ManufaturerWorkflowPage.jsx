import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: auto;
`;

const WorkflowHeader = styled.h2`
  text-align: center;
`;

const StepContainer = styled.div`
  margin-bottom: 20px;
  padding: 16px;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const StepHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const StatusSelect = styled.select`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  color: ${(props) => {
    switch (props.value) {
      case 'Pending':
        return '#ffc107'; // Yellow
      case 'In Progress':
        return '#17a2b8'; // Blue
      case 'Completed':
        return '#28a745'; // Green
      default:
        return '#6c757d'; // Grey
    }
  }};
`;

const SubStep = styled.div`
  margin-left: 20px;
  padding: 8px;
  border-left: 4px solid ${(props) => (props.completed ? '#28a745' : '#ffc107')};
  background-color: ${(props) => (props.completed ? '#e6ffe6' : '#fffbea')};
  margin-bottom: 8px;
  border-radius: 4px;
  display: flex;
  align-items: center;
`;

const Checkbox = styled.input`
  margin-right: 10px;
`;

export const ManufacturerWorkflowPage = ({ workflow }) => {
  const [steps, setSteps] = useState([]);

  useEffect(() => {
    // Fetch workflow details and steps (mock data for now)
    setSteps([
      {
        name: 'Grading',
        status: 'Pending',
        subSteps: [
          { name: 'Initial Grading', completed: false },
          { name: 'Quality Check', completed: false },
          { name: 'Final Grading', completed: false },
        ],
      },
      {
        name: 'Cutting',
        status: 'Pending',
        subSteps: [
          { name: 'Cutting Preparation', completed: false },
          { name: 'Cutting Execution', completed: false },
        ],
      },
      {
        name: 'Washing',
        status: 'Pending',
        subSteps: [
          { name: 'First Wash', completed: false },
          { name: 'Second Wash', completed: false },
        ],
      },
    ]);
  }, [workflow]);

  const handleSubStepChange = (stepIndex, subStepIndex) => {
    setSteps((prevSteps) => {
      const updatedSteps = [...prevSteps];
      updatedSteps[stepIndex].subSteps[subStepIndex].completed = !updatedSteps[stepIndex].subSteps[subStepIndex].completed;
      return updatedSteps;
    });
  };

  const handleStatusChange = (stepIndex, newStatus) => {
    setSteps((prevSteps) => {
      const updatedSteps = [...prevSteps];
      updatedSteps[stepIndex].status = newStatus;
      return updatedSteps;
    });
  };

  return (
    <Container>
      <WorkflowHeader>{workflow?.name || 'Manufacturer Workflow Progress'}</WorkflowHeader>
      <p>Description: {workflow?.description}</p>
      <p>Assigned Manufacturer: {workflow?.manufacturer}</p>
      <p>Date of Creation: {workflow?.dateSent}</p>

      <h3>Workflow Steps and Sub-Steps</h3>
      {steps.map((step, index) => (
        <StepContainer key={index}>
          <StepHeader>
            <h3>{step.name}</h3>
            <StatusSelect
              value={step.status}
              onChange={(e) => handleStatusChange(index, e.target.value)}
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </StatusSelect>
          </StepHeader>
          {step.subSteps.map((subStep, subIndex) => (
            <SubStep key={subIndex} completed={subStep.completed}>
              <Checkbox
                type="checkbox"
                checked={subStep.completed}
                onChange={() => handleSubStepChange(index, subIndex)}
              />
              {subStep.name}
            </SubStep>
          ))}
        </StepContainer>
      ))}
    </Container>
  );
};
