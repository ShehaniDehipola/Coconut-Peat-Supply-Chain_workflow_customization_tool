import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: auto;
`;

const WorkflowHeader = styled.h2`
  text-align: flex-start;
`;

/* Flexbox wrapper to place Step and Notes side by side */
const StepWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    flex-direction: column; /* Stack on smaller screens */
  }
`;

/* Step container */
const StepContainer = styled.div`
  flex: 1;
  padding: 16px;
  background-color: #f8f9fa;
  border-radius: 8px;
  border: 2px solid #d89527;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

/* Notes container */
const NotesContainer = styled.div`
  flex: 1;
  padding: 16px;
  background-color: rgba(45, 49, 66, 0.2);
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const NotesLabel = styled.label`
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 4px;
  display: block;
`;

const NotesInput = styled.textarea`
  width: 90%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  min-height: 70px;
  resize: vertical;
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
  font-weight: bold;

   ${(props) => {
    switch (props.value) {
      case 'Pending':
        return 'background-color: #ffc107; color: black;';
      case 'In Progress':
        return 'background-color: #17a2b8; color: white;';
      case 'Completed':
        return 'background-color: #28a745; color: white;';
      default:
        return 'background-color: #6c757d; color: white;';
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
        notes: '',
      },
      {
        name: 'Cutting',
        status: 'Pending',
        subSteps: [
          { name: 'Cutting Preparation', completed: false },
          { name: 'Cutting Execution', completed: false },
        ],
        notes: '',
      },
      {
        name: 'Washing',
        status: 'Pending',
        subSteps: [
          { name: 'First Wash', completed: false },
          { name: 'Second Wash', completed: false },
        ],
        notes: '',
      },
    ]);
  }, [workflow]);

  const handleSubStepChange = (stepIndex, subStepIndex) => {
    setSteps((prevSteps) => {
      const updatedSteps = [...prevSteps];
      updatedSteps[stepIndex].subSteps[subStepIndex].completed =
        !updatedSteps[stepIndex].subSteps[subStepIndex].completed;
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

  const handleNotesChange = (stepIndex, newNote) => {
    setSteps((prevSteps) => {
      const updatedSteps = [...prevSteps];
      updatedSteps[stepIndex].notes = newNote;
      return updatedSteps;
    });
  };

  return (
    <Container>
      <WorkflowHeader>{workflow?.name || 'Workflow Progress'}</WorkflowHeader>
      <p>Description: {workflow?.description}</p>
      <p>Assigned by: {workflow?.exporter}</p>
      <p>Date of Creation: {workflow?.dateSent}</p>

      <h3>Workflow Steps and Sub-Steps</h3>
      {steps.map((step, index) => (
        <StepWrapper key={index}>
          {/* Step Section */}
          <StepContainer>
            <StepHeader>
              <h3>{step.name}</h3>
              <StatusSelect value={step.status} onChange={(e) => handleStatusChange(index, e.target.value)}>
                <option style={{ backgroundColor: "white", fontColor: "black" } } value="Pending">Pending</option>
                <option style={{ backgroundColor: "white", fontColor: "black" } } value="In Progress">In Progress</option>
                <option style={{ backgroundColor: "white", fontColor: "black" } } value="Completed">Completed</option>
              </StatusSelect>
            </StepHeader>

            {step.subSteps.map((subStep, subIndex) => (
              <SubStep key={subIndex} completed={subStep.completed}>
                <Checkbox type="checkbox" checked={subStep.completed} onChange={() => handleSubStepChange(index, subIndex)} />
                {subStep.name}
              </SubStep>
            ))}
          </StepContainer>

          {/* Notes Section (Next to StepContainer) */}
          <NotesContainer>
            <NotesLabel>Notes (Optional):</NotesLabel>
            <NotesInput
              value={step.notes}
              onChange={(e) => handleNotesChange(index, e.target.value)}
              placeholder="Write any special instructions or comments for this step..."
            />
          </NotesContainer>
        </StepWrapper>
      ))}
    </Container>
  );
};
