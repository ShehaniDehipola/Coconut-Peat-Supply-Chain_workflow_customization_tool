import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios'
import Layout from '../MainLayout';
import Header from '../Header';
import ConfirmationModal from '../ConfirmationModal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Container = styled.div`
  padding: 1rem;
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between; 
  align-items: center;
  margin-bottom: 20px;
`;

const Title = styled.h1`
  font-size: 18px;
  font-weight: bold;
  color: #2D3142; 
  margin-bottom: 20px;
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
  font-weight: semi-bold;

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


const SubStepContainer = styled.div`
  margin-left: 20px;
  margin-bottom: 8px;
  padding: 8px;
  border-left: 4px solid 
    ${(props) => {
      if (props.status === 'completed') return '#28a745';
      if (props.status === 'in_progress') return '#ffc107';
      return '#6c757d';
    }};
  background-color: 
    ${(props) => {
      if (props.status === 'completed') return '#e6ffe6';
      if (props.status === 'in_progress') return '#fffbea';
      return '#f0f0f0';
    }};
  border-radius: 4px;
`;

const SubStepHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SubStepName = styled.text`
  font-weight: normal;
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

export const ManufacturerWorkflowPage = () => {
  const { workflowId } = useParams();
  const [workflow, setWorkflow] = useState(null);
  const [steps, setSteps] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalProps, setModalProps] = useState({});

  const openModal = (props) => {
  setModalProps(props);
  setModalOpen(true);
};

const closeModal = () => {
  setModalOpen(false);
  setModalProps({});
};

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/workflow/${workflowId}`)
      .then((response) => {
        setWorkflow(response.data);
        console.log("Workflow details: ", workflow)
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching workflow details:", error);
        setError(error);
        setIsLoading(false);
      });
  }, [workflowId]);

  useEffect(() => {
    if (!workflow || !workflow.versions || workflow.versions.length === 0) return;

    const currentVersion = workflow?.versions?.find(v => v.status === 'pending')
      || workflow?.versions?.[0];
    
    console.log("Current version of the wf: ", currentVersion)

    const mappedSteps = (currentVersion.steps ?? []).map((step) => {

      const stepStatus = mapServerStatusToUiStatus(step);
      const subSteps = (step.sub_steps ?? []).map((sub) => ({
        name: sub.name,
        completed: sub.status === 'completed',
        status: sub.status,
        notes: '',
        order: step.order 
      }));

      return {
        name: step.pluginName, 
        status: stepStatus, 
        order: step.order,
        subSteps,
        notes: ''
      };
    });

    setSteps(mappedSteps);
  }, [workflow]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!workflow) return <div>No workflow data found</div>;

  // Handle plugin-level Start/Next
  const handleStatusChange = async (stepIndex, actionType) => {
    try {
    const updatedSteps = [...steps];
    const stepOrder = updatedSteps[stepIndex].order;
    const currentPlugin = updatedSteps[stepIndex];
    const workflowId = workflow.workflow_id;
      
    // For "complete" plugin, ensure all sub-steps are completed
    if (actionType === 'next') {
      const allSubStepsCompleted = currentPlugin.subSteps.every(
        sub => sub.status === 'completed'
      );
      if (!allSubStepsCompleted) {
        toast.error("Please complete all sub-steps before completing the plugin.");
        return;
      }
      }
      
    // Confirmation modal for plugin actions
    let confirmMsg = "";
    if (actionType === 'start') {
      if (currentPlugin.status !== 'Pending') {
        toast.error("Plugin already started.");
        return;
      }
      confirmMsg = "Are you sure you want to start this plugin?";
    } else if (actionType === 'next') {
      confirmMsg = "Are you sure you want to complete this plugin?";
    }
    if (!window.confirm(confirmMsg)) return;

      let payload = {};

    if (actionType === 'start') {
      payload = {
        started_at: new Date().toISOString(),
        status: 'in_progress'
      };
      updatedSteps[stepIndex].status = 'In Progress';
    } else if (actionType === 'next') {
      payload = {
        completed_at: new Date().toISOString(),
        status: 'completed'
      };
      updatedSteps[stepIndex].status = 'Completed';

      if (stepIndex + 1 < updatedSteps.length) {
        updatedSteps[stepIndex + 1].status = 'Pending';
      }
    }

    await axios.put(
      `http://localhost:5000/api/workflow/${workflowId}/step/${stepOrder}`,
      payload
    );

      setSteps(updatedSteps);
      toast.success("Plugin status updated successfully.");
  } catch (error) {
      console.error('Error updating plugin step:', error);
      toast.error("Error updating plugin status.");
  }
  };

  // Handle sub-step actions: "start" or "complete"
  const handleSubStepAction = async (stepIndex, subIndex, actionType) => {
    try {
    const updated = [...steps];
    const currentPlugin = updated[stepIndex];
      const workflowId = workflow.workflow_id;
      
    // Prevent starting a sub-step unless plugin is started (In Progress)
    if (currentPlugin.status === 'Pending') {
      toast.error("Please start the plugin before starting a sub-step.");
      return;
    }
      
    const stepOrder = currentPlugin.order;
    const sub = currentPlugin.subSteps[subIndex];

    let payload = {};
    if (actionType === 'start') {
      payload = {
        started_at: new Date().toISOString(),
        status: 'in_progress'
      };
      sub.status = 'in_progress';
    } else if (actionType === 'complete') {
      payload = {
        completed_at: new Date().toISOString(),
        status: 'completed'
      };
      sub.status = 'completed';
    }

    await axios.put(
      `http://localhost:5000/api/workflow/${workflowId}/step/${stepOrder}/substep/${encodeURIComponent(sub.name)}`,
      payload
    );

      setSteps(updated);
      toast.success("Sub-step status updated successfully.");
  } catch (error) {
      console.error('Error updating sub-step:', error);
      toast.error("Error updating sub-step status.");
  }
  };

  // --- For date fields, ensure you check they exist before using them
  const assignedDate = workflow.created_at
    ? new Date(workflow.created_at).toLocaleDateString()
    : 'N/A';
  const deadline = workflow.expected_date
    ? new Date(workflow.expected_date).toLocaleDateString()
    : 'N/A';

  // Wrapper function for plugin actions with modal confirmation
  const confirmPluginAction = (stepIndex, actionType) => {
    const currentPlugin = steps[stepIndex];
    if (actionType === 'next') {
      const allSubStepsCompleted = currentPlugin.subSteps.every(
        sub => sub.status === 'completed'
      );
      if (!allSubStepsCompleted) {
        toast.error("Please complete all sub-steps before completing the plugin.");
        return;
      }
    }
    let confirmMsg = actionType === 'start'
      ? "Are you sure you want to start this plugin?"
      : "Are you sure you want to complete this plugin?";
    openModal({
      title: actionType === 'start' ? "Start Plugin" : "Complete Plugin",
      message: confirmMsg,
      onConfirm: async () => {
        closeModal();
        await handleStatusChange(stepIndex, actionType);
      },
      onCancel: closeModal
    });
  };

  // Wrapper function for sub-step actions with modal confirmation
  const confirmSubStepAction = (stepIndex, subIndex, actionType) => {
    const currentPlugin = steps[stepIndex];
    if (currentPlugin.status === 'Pending') {
      toast.error("Please start the plugin before starting a sub-step.");
      return;
    }
    let confirmMsg = actionType === 'start'
      ? "Are you sure you want to start this sub-step?"
      : "Are you sure you want to complete this sub-step?";
    // Additional validations
    if (actionType === 'start' && currentPlugin.subSteps[subIndex].status !== 'not_started') {
      toast.error("Sub-step already started.");
      return;
    }
    if (actionType === 'complete' && currentPlugin.subSteps[subIndex].status !== 'in_progress') {
      toast.error("Sub-step must be in progress to complete.");
      return;
    }
    openModal({
      title: actionType === 'start' ? "Start Sub-step" : "Complete Sub-step",
      message: confirmMsg,
      onConfirm: async () => {
        closeModal();
        await handleSubStepAction(stepIndex, subIndex, actionType);
      },
      onCancel: closeModal
    });
  };

  // const handleStatusChange = (stepIndex, actionType) => {
  //   setSteps((prevSteps) => {
  //     const updatedSteps = [...prevSteps];
  //     if (actionType === 'start') {
  //       updatedSteps[stepIndex].status = 'In Progress';
  //     } else if (actionType === 'next') {
  //       updatedSteps[stepIndex].status = 'Completed';
  //       if (stepIndex + 1 < updatedSteps.length) {
  //         updatedSteps[stepIndex + 1].status = 'Pending';
  //       }
  //     }
  //     return updatedSteps;
  //   });
  // };

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
    <Layout role="manufacturer">
      <Container>
        <Header title="Worklow Progress" role="manufacturer"></Header>
      <HeaderRow>
        {/* Progress Bar */}
        <ProgressBarWrapper>
          <ProgressBarContainer>
            <ProgressBarFill progress={overallProgress} />
          </ProgressBarContainer>
          <span>{overallProgress}%</span>
        </ProgressBarWrapper>
      </HeaderRow>
      <p>Assigned Date: {assignedDate}</p>
      <p>Expoter ID: {workflow?.exporter_id}</p>
      <p>Deadline: {deadline}</p>
        

      <Title>Plugins and Sub-Steps</Title>
      {steps.map((step, index) => (
        <StepWrapper key={index}>
          {/* Step Section */}
          <StepContainer>
            <StepHeader>
              <h3>{step.name}</h3>
              <StatusLabel status={step.status}>{step.status}</StatusLabel>
            </StepHeader>

             {/* Render each sub-step inside this plugin */}
              {step.subSteps.map((subStep, subIndex) => (
                <SubStepContainer
                  key={subIndex}
                  status={subStep.status}
                >
                  <SubStepHeader>
                    <SubStepName>{subStep.name}</SubStepName>
                    <div>
                      {/* Show "Start Sub-step" if status is 'not_started' */}
                      {subStep.status === 'not_started' && (
                        <Button
                          onClick={() => confirmSubStepAction(index, subIndex, 'start')}
                        >
                          Start Sub-step
                        </Button>
                      )}
                      {/* Show "Complete Sub-step" if status is 'in_progress' */}
                      {subStep.status === 'in_progress' && (
                        <Button
                          onClick={() => confirmSubStepAction(index, subIndex, 'complete')}
                        >
                          Complete Sub-step
                        </Button>
                      )}
                      {/* If subStep.status === 'completed', no sub-step button needed */}
                    </div>
                  </SubStepHeader>
                </SubStepContainer>
              ))}
            
            {/* Plugin-level buttons */}
              <ButtonGroup>
                <Button
                  onClick={() => confirmPluginAction(index, 'start')} disabled={step.status !== 'Pending'}
                >
                  Start Plugin
                </Button>
                <Button
                  primary
                  onClick={() => confirmPluginAction(index, 'next')} disabled={step.status !== 'In Progress'}
                >
                  Complete Plugin
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
      <ToastContainer />
      <ConfirmationModal
        isOpen={modalOpen}
        title={modalProps.title}
        message={modalProps.message}
        onConfirm={modalProps.onConfirm}
        onCancel={modalProps.onCancel}
      />
    </Layout>
  );
};

// --- Helper to map server statuses to UI-friendly statuses
function mapServerStatusToUiStatus(step) {
  // If you store step-level status on the server, you can read that. If not, 
  // you might decide a step is 'pending' if none of its sub_steps started, 
  // 'in progress' if at least one sub_step is in_progress, etc.
  // As an example:
  if (step.completed_at) return 'Completed';
  if (step.started_at) return 'In Progress';
  return 'Pending';
}