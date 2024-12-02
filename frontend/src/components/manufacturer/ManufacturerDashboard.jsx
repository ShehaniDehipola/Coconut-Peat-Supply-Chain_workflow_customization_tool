import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: auto;
`;

const WorkflowCard = styled.div`
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const WorkflowHeader = styled.h2`
  text-align: center;
`;

const Button = styled.button`
  background-color: #007bff;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

export const ManufacturerDashboard = () => {
  const [workflows, setWorkflows] = useState([]);

  useEffect(() => {
    setWorkflows([
      { name: 'Workflow A', stepsCompleted: 2, totalSteps: 4 },
      { name: 'Workflow B', stepsCompleted: 3, totalSteps: 5 },
    ]);
  }, []);

  const updateWorkflowStatus = (index) => {
    console.log(`Update workflow status for index: ${index}`);
  };

  return (
    <Container>
      <WorkflowHeader>Manufacturer Dashboard</WorkflowHeader>
      {workflows.map((workflow, index) => (
        <WorkflowCard key={index}>
          <div>
            <h3>{workflow.name}</h3>
            <p>Steps Completed: {workflow.stepsCompleted} / {workflow.totalSteps}</p>
          </div>
          <Button onClick={() => updateWorkflowStatus(index)}>Start</Button>
        </WorkflowCard>
      ))}
    </Container>
  );
};
