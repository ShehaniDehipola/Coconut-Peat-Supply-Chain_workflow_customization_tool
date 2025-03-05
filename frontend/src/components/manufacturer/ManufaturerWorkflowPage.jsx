import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: auto;
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between; 
  align-items: center;
  margin-bottom: 20px;
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

const RightColumn = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column; /* ensures IoT container is on top, Comments below */
  align-items: stretch;   /* makes them take the full width */
`;

const IoTDataContainer = styled.div`
  flex: 1;
  padding: 16px;
  background-color: rgba(45, 49, 66, 0.2);
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const IoTDataLabel = styled.label`
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 4px;
  display: block;
`;

const IoTDataInput = styled.textarea`
  width: 90%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  min-height: 70px;
  resize: vertical;
`;

const CommentsContainer = styled.div`
  margin-top: 10px;  /* space between IoT container and this */
  padding: 14px;
  background-color: rgba(45, 49, 66, 0.1); 
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const CommentsLabel = styled.label`
  font-size: 14px;
  font-weight: bold;
  margin-top: 10px;
  margin-bottom: 4px;
  display: block;
`;

const CommentsInput = styled.textarea`
  width: 90%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  min-height: 70px;
  resize: vertical;
`;

/* Notes container */
// const NotesContainer = styled.div`
//   flex: 1;
//   padding: 16px;
//   background-color: rgba(45, 49, 66, 0.2);
//   border-radius: 8px;
//   box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
// `;

// const NotesLabel = styled.label`
//   font-size: 14px;
//   font-weight: bold;
//   margin-bottom: 4px;
//   display: block;
// `;

// const NotesInput = styled.textarea`
//   width: 90%;
//   padding: 8px;
//   border: 1px solid #ccc;
//   border-radius: 4px;
//   min-height: 70px;
//   resize: vertical;
// `;

const StepHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  padding: 8px;
  border-radius: 4px;
`;

const StatusLabel = styled.div`
  padding: 5px 10px;
  border-radius: 4px;
  font-weight: bold;
  display: inline-block;
  text-align: center;
  min-width: 100px;
   ${(props) => {
    switch (props.status) {
      case 'Pending':
        return 'background-color: #ffc107; color: white;';
      case 'In Progress':
        return 'background-color: #17a2b8; color: white;';
      case 'Completed':
        return 'background-color: #28a745; color: white;';
      default:
        return 'background-color: #6c757d; color: white;';
    }
  }};
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end; /* moves buttons to the right */
  gap: 10px; /* spacing between the two buttons */
  margin-top: 10px; /* add some vertical spacing */
`;

const Button = styled.button`
  margin: 5px;
  padding: 8px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }

  /* Styles for the 'Start' button (non-primary) */
  ${(props) =>
    !props.primary &&
    `
      background-color: #2D3142;
      color: #fff;
      border: none;
    `}

  /* Styles for the 'Next' button (primary) */
  ${(props) =>
    props.primary &&
    `
      background-color:rgb(255, 255, 255);
      color: #2D3142;
      border: 2px solid #2D3142;
    `}
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

/* Progress Bar Styles */
const ProgressBarWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 20px;
  border: 2px solid black;
`;

const ProgressBarContainer = styled.div`
  width: 150px;        /* total width of bar */
  height: 10px;        /* height of bar */
  background-color: #2D3142;
  border-radius: 5px;
  overflow: hidden;
  margin-right: 10px;  /* space for the percentage text */
`;

const ProgressBarFill = styled.div`
  height: 100%;
  background-color: #28a745;
  width: ${(props) => props.progress}%;
  transition: width 0.3s ease; 
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

  const handleStatusChange = (stepIndex, actionType) => {
    setSteps((prevSteps) => {
      const updatedSteps = [...prevSteps];
      if (actionType === 'start') {
        updatedSteps[stepIndex].status = 'In Progress';
      } else if (actionType === 'next') {
        updatedSteps[stepIndex].status = 'Completed';
        if (stepIndex + 1 < updatedSteps.length) {
          updatedSteps[stepIndex + 1].status = 'Pending';
        }
      }
      return updatedSteps;
    });
  };

  const handleIoTDataChange = (stepIndex, newData) => {
    setSteps((prevSteps) => {
      const updatedSteps = [...prevSteps];
      updatedSteps[stepIndex].iotData = newData;
      return updatedSteps;
    });
  };

  const handleCommentsChange = (stepIndex, newComments) => {
    setSteps((prevSteps) => {
      const updatedSteps = [...prevSteps];
      updatedSteps[stepIndex].comments = newComments;
      return updatedSteps;
    });
  };

   // Calculate overall progress: # of completed steps vs total steps
  const completedCount = steps.filter((step) => step.status === 'Completed').length;
  const totalSteps = steps.length;
  const overallProgress = totalSteps > 0 
    ? Math.round((completedCount / totalSteps) * 100)
    : 0;

  return (
    <Container>
      <HeaderRow>
        <WorkflowHeader>{workflow?.name || 'Workflow Progress'}</WorkflowHeader>
        {/* Progress Bar */}
        <ProgressBarWrapper>
          <ProgressBarContainer>
            <ProgressBarFill progress={overallProgress} />
          </ProgressBarContainer>
          <span>{overallProgress}%</span>
        </ProgressBarWrapper>
      </HeaderRow>
      <p>Assigned Date: {workflow?.description}</p>
      <p>Expoter ID: {workflow?.exporter}</p>
      <p>Deadline: {workflow?.dateSent}</p>
        

      <h3>Workflow Steps and Sub-Steps</h3>
      {steps.map((step, index) => (
        <StepWrapper key={index}>
          {/* Step Section */}
          <StepContainer>
            <StepHeader>
              <h3>{step.name}</h3>
              <StatusLabel status={step.status}>{step.status}</StatusLabel>
            </StepHeader>

            {step.subSteps.map((subStep, subIndex) => (
              <SubStep key={subIndex} completed={subStep.completed}>
                <Checkbox type="checkbox" checked={subStep.completed} />
                {subStep.name}
              </SubStep>
            ))}
            <ButtonGroup>
            <Button
              onClick={() => handleStatusChange(index, 'start')}
              disabled={step.status !== 'Pending'}
            >
              Start
            </Button>
            <Button
              primary
              onClick={() => handleStatusChange(index, 'next')}
              disabled={step.status !== 'In Progress'}
            >
              Next
            </Button>
            </ButtonGroup>
          </StepContainer>

          <RightColumn>
          <IoTDataContainer>
            <IoTDataLabel>IoT Data Readings:</IoTDataLabel>
            <IoTDataInput
              value={step.iotData}
              onChange={(e) => handleIoTDataChange(index, e.target.value)}
              placeholder="Enter IoT sensor data readings..."
            />
            </IoTDataContainer>
            <CommentsContainer>
             <CommentsLabel>Add Comments:</CommentsLabel>
            <CommentsInput
              value={step.comments}
              onChange={(e) => handleCommentsChange(index, e.target.value)}
              placeholder="Enter additional comments..."
            />
            </CommentsContainer>
          </RightColumn>
        </StepWrapper>
      ))}
    </Container>
  );
};
