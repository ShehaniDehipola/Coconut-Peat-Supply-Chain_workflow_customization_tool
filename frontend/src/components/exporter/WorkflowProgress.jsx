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

const ProgressBar = styled.div`
  background: #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  height: 24px;
  width: 100%;
  margin-bottom: 16px;

  &::after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: ${(props) => props.progress || '0%'};
    background: ${(props) => (props.progress === '100%' ? '#28a745' : '#007bff')};
    transition: width 0.3s ease;
  }
`;

const StepContainer = styled.div`
  margin-bottom: 20px;
  padding: 16px;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const StepHeader = styled.h3`
  margin-bottom: 10px;
`;

const SubStep = styled.div`
  margin-left: 20px;
  padding: 8px;
  border-left: 4px solid ${(props) => (props.completed ? '#28a745' : '#ffc107')};
  background-color: ${(props) => (props.completed ? '#e6ffe6' : '#fffbea')};
  margin-bottom: 8px;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StatusLabel = styled.span`
  font-weight: bold;
  color: ${(props) => (props.completed ? '#28a745' : '#ffc107')};
`;

export const WorkflowProgress = ({ workflow }) => {
  const [progress, setProgress] = useState(0);
  const [steps, setSteps] = useState([]);

  useEffect(() => {
    // Fetch workflow details and progress (mock data for now)
    setProgress(50); // Example: 50% completed
    setSteps([
      {
        name: 'Grading',
        subSteps: [
          { name: 'Initial Grading', completed: true },
          { name: 'Quality Check', completed: true },
          { name: 'Final Grading', completed: false },
        ],
      },
      {
        name: 'Cutting',
        subSteps: [
          { name: 'Cutting Preparation', completed: false },
          { name: 'Cutting Execution', completed: false },
        ],
      },
      {
        name: 'Washing',
        subSteps: [
          { name: 'First Wash', completed: false },
          { name: 'Second Wash', completed: false },
        ],
      },
    ]);
  }, [workflow]);

  return (
    <Container>
      <WorkflowHeader>{workflow?.name || 'Workflow Progress'}</WorkflowHeader>
      <p>Description: {workflow?.description}</p>
      <p>Assigned Manufacturer: {workflow?.manufacturer}</p>
      <p>Date of Creation: {workflow?.dateSent}</p>
      <h3>Overall Progress</h3>
      <ProgressBar progress={`${progress}%`} />

      <h3>Workflow Steps and Sub-Steps</h3>
      {steps.map((step, index) => (
        <StepContainer key={index}>
          <StepHeader>{step.name}</StepHeader>
          {step.subSteps.map((subStep, subIndex) => (
            <SubStep key={subIndex} completed={subStep.completed}>
              {subStep.name} <StatusLabel completed={subStep.completed}>{subStep.completed ? 'Completed' : 'Pending'}</StatusLabel>
            </SubStep>
          ))}
        </StepContainer>
      ))}
    </Container>
  );
};
