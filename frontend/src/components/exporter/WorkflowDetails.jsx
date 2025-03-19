import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { FaArrowRight } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import Layout from "../MainLayout";
import Header from "../Header";
import { toast, ToastContainer } from "react-toastify"; // Import Toast
import "react-toastify/dist/ReactToastify.css";

// Styled Components
const PageContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 20px;
  border-radius: 8px;
  box-sizing: border-box;
`;

const LeftContainer = styled.div`
  width: 70%;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
`;

const RightContainer = styled.div`
  width: 30%;
  padding: 20px;
  background: rgba(255, 255, 255, 0.85);
  border-radius: 8px;
  box-shadow: 2px 2px 15px rgba(0, 0, 0, 0.15);
  border-left: 3px solid #ccc;
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* Ensures spacing */
  height: auto;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  font-size: 16px;
`;

const Label = styled.span`
  font-weight: semi-bold;
  color: #333;
`;

const StatusContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
`;

const StatusLabel = styled.span`
  padding: 6px 10px;
  border-radius: 10px;
  color: white;
  font-size: 14px;
  font-weight: 600;
  background: ${(props) =>
    props.status === "pending" ? "#FFC107" :
    props.status === "in progress" ? "#4CAF50" :
    props.status === "completed" ? "#D32F2F" : "#FFC107"};
`;

const StepsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 10px;
`;

const StepBox = styled.div`
  background: rgba(216, 149, 39, 0.3);
  border-radius: 8px;
  padding: 15px 20px;
  box-shadow: 2px 2px 8px rgba(216, 149, 39, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: auto; /* Adjust height */
  font-size: 14px;
  font-weight: bold;
  min-width: 140px;
  text-align: center;
  gap: 10px; /* More spacing */
`;

const RegisterButton = styled.button`
  background: rgba(216, 149, 39, 0.8);
  color: white;
  border: none;
  padding: 8px 12px;
  margin-top: 8px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  width: 100%;

  &:hover {
    background: rgba(223, 144, 17, 0.8);
  }
`;


const PluginName = styled.div`
  font-size: 16px;
  font-weight: 400;
  margin-bottom: 8px;
`;

const RequiredAmount = styled.div`
  font-size: 12px;
  color: #666;
`;

const DropdownContainer = styled.div`
  margin-top: 30px;
`;

const TabsContainer = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 15px;
  border-bottom: 2px solid #ccc;
`;

const Tab = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 15px;
  background: none;
  border: none;
  font-size: 16px;
  font-weight: ${(props) => (props.active ? "bold" : "normal")};
  color: ${(props) => (props.active ? "#2D3142" : "#555")};
  cursor: pointer;
  border-bottom: ${(props) => (props.active ? "3px solid #2D3142" : "none")};

  &:hover {
    background: linear-gradient(135deg, #3B4252, #586274);
    color: white;
    transform: scale(1.05);
  }
`;

const ButtonsContainer = styled.div`
  display: flex;
  margin-top: 50px;
`;

// Buttons
const Button = styled.button`
  padding: 10px;
  margin: 5px;
  background: ${(props) => props.bgColor || "#2D3142"};
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background: ${(props) => props.hoverColor || "#1F2532"};
  }
`;

const SendButton = styled(Button)`
  margin-top: auto; /* Pushes button to bottom */
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 12px 16px;
  font-size: 16px;
`;

const Dropdown = styled.select`
  width: 60%;
  margin-left: 30px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
  background: white;
  color: black;
  cursor: pointer;
  ${(props) => props.disabled && "opacity: 0.6; cursor: not-allowed;"}
`;

const DropdownOption = styled.option`
  font-size: 16px;
  color: black;
  background: white;
`;

const AnimatedDiv = styled.div`
  opacity: 20;
  animation: fadeIn 0.5s ease-in-out forwards;

  @keyframes fadeIn {
    0% {
      opacity: 0;
      transform: translateY(10px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const WorkflowDetails = ({ }) => {
  const { user } = useUser();
  const location = useLocation();
  const navigate = useNavigate();

  const [workflowID, setWorkflowID] = useState(""); // Auto-generated ID
  const [status, setStatus] = useState("pending"); // Default status
  const [version, setVersion] = useState(1); // Default version
  const [manufacturers, setManufacturers] = useState([]);
  const [selectedManufacturer, setSelectedManufacturer] = useState("");
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [changeLog, setChangeLog] = useState([]);
  const [workflowVersions, setWorkflowVersions] = useState([]); // Store workflow versions locally
  const [activeVersionIndex, setActiveVersionIndex] = useState(0);

  // Explicitly extract only the required fields from location.state
  const initialWorkflowID = location.state?.workflow_id || "";
  const initialSteps = location.state?.steps || [];

  console.log("Initial Workflow ID:", initialWorkflowID);
  console.log("Initial Steps:", initialSteps);

  useEffect(() => {
    if (initialWorkflowID) {
      setWorkflowID(initialWorkflowID);
    }
  }, [initialWorkflowID]);

  const getAllVersions = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/workflow/version/${workflowID}`);
      // Assume response.data is an array of version objects
      setWorkflowVersions(response.data);
      // Optionally, set the activeVersion as the latest or first one:
      if (response.data.length > 0) {
        setActiveVersionIndex(response.data.length - 1);
        setSelectedVersion(response.data[response.data.length - 1]);
      } else {
        // If no versions exist, use the initialSteps as the default version
        const defaultVersion = { versionNumber: 1, status: status, steps: initialSteps };
        setWorkflowVersions([defaultVersion]);
        setActiveVersionIndex(0);
        setSelectedVersion(defaultVersion);
      }
    } catch (error) {
      console.error("Error fetching versions:", error);
    }
  };

  // update version and local workflowVersions if workflow exists
  useEffect(() => {
    if (workflowID) {
      getAllVersions();
      setVersion(workflowVersions.length > 0 ? workflowVersions.length + 1 : 1);
      setWorkflowVersions([{ versionNumber: version, steps: initialSteps }]);
    }
  }, [workflowID]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/manufacturers/all")
      .then(response => {
        setManufacturers(response.data); // Store manufacturers in state
        console.log("manufacturers: ", manufacturers)
    })
      .catch(error => console.error(error));
      }, []);
    
  const handleEditWorkflow = () => {
    navigate("/new-workflow", { state: { workflow_id: workflowID, steps: selectedVersion?.steps || [] } });
    
    console.log("Workflow steps:", selectedVersion?.steps);
  };

  const handleDeleteWorkflow = () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this workflow?"
    );
    if (confirmDelete) {
      alert("Workflow Deleted!");
      // Implement delete functionality
    }
  };

  const handleConfirmWorkflow = async () => {
      
    console.log("User Exporter ID:", user?.exporter_id);
    console.log("Workflow ID:", workflowID);
    console.log("Initial Steps:", initialSteps);
    console.log("Selected Manufacturer:", selectedManufacturer);
        
    if (!user?.exporter_id || !workflowID || initialSteps.length === 0 || !selectedManufacturer) {
      toast.error("Please fill all fields before confirming.");
      return;
    }
      
    console.log("Using selected manufacturer:", selectedManufacturer);
    console.log("All steps:", initialSteps);
      
      // Correctly mapping sub-steps into workflow data
  const processedSteps = initialSteps.map((step) => ({
    pluginName: step.pluginName,
    required_amount: step.required_amount || 0,
    sub_steps: step.sub_steps && Array.isArray(step.sub_steps)
            ? step.sub_steps.map((name, index) => ({
                name: name,  
            }))
            : [], 
  }));
      
    const workflowData = {
      workflow_id: workflowID, // Auto-generated ID
      exporter_id: user.exporter_id,
      manufacturer_id: selectedManufacturer,
      steps: processedSteps,
    };
      
      console.log("Submitting Workflow Data:", workflowData);
    try {
      await axios.post("http://localhost:5000/api/workflow/", workflowData);
      toast.success("Workflow Created Successfully!");
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  const handleWorkflowStatusUpdate = async () => {
    console.log("Selected version in update:", selectedVersion);
    if (!selectedVersion) {
      toast.error("No version selected for status update.");
      return;
    }
    // Only update if current status is draft; you can add more logic if needed.
    const newStatus = selectedVersion.status === "draft" ? "pending" : selectedVersion.status;
    const payload = {
      status: "pending",
      versionNumber: selectedVersion.versionNumber,
    };
    console.log("Status update payload: ", payload)
    try {
      const response = await axios.put(
        `http://localhost:5000/api/workflow/${workflowID}/status`,
        payload,
        { headers: { "Content-Type": "application/json" } }
      );
      console.log("Status update successful:", response.data);
      // Update local selectedVersion status
      setSelectedVersion((prev) => ({ ...prev, status: newStatus }));
      // Optionally, refresh versions list:
      getAllVersions();
      toast.success(`Version ${selectedVersion.versionNumber} has been selected and sent to manufacturer`);
    } catch (error) {
      console.error("Error updating workflow status:", error);
      toast.error("Failed to update status: " + error.message);
    }
  }

  const handleRegisterPlugin = async (step) => {
    const pluginData = {
    workflow_id: workflowID,
    plugin_name: step.pluginName,
    userRequirement: step.required_amount,
    action: "register",
  };

  try {
    const response = await axios.post("http://localhost:5000/api/plugin/grpc", pluginData, {
      headers: { "Content-Type": "application/json" },
    });

    toast.success("Plugin registered successfully!");
    console.log("Response:", response.data);
  } catch (error) {
    console.error("Error registering plugin:", error);
    toast.error("Failed to register plugin.");
  }
};


  return (
    <Layout role="exporter">
      <Header title="Workflow Details"></Header>
    <PageContainer>
      {/* Left Side - Version Control */}
      <LeftContainer>
        {/* Tabs for Each Version */}
        <TabsContainer>
            {workflowVersions.map((ver, index) => (
            <Tab
              key={ver.versionNumber}
              active={activeVersionIndex === index}
                onClick={() => {
                console.log("Tab clicked, version:", ver);
                setActiveVersionIndex(index);
                setSelectedVersion(ver);
              }}
            >
              Version {ver.versionNumber}
            </Tab>
          ))}
        </TabsContainer>

        {/* Selected Version Details */}
        <AnimatedDiv>
          <p><b>Steps:</b></p>
          <StepsContainer>
            {workflowVersions[0]?.steps?.map((step, index, arr) => (
            <React.Fragment key={index}>
                <StepBox>
                  <PluginName>{step.pluginName}</PluginName>
                {step.required_amount !== undefined && step.required_amount !== "" && (
          <RequiredAmount>Required: {step.required_amount}</RequiredAmount>
                  )}
                  <RegisterButton onClick={() => handleRegisterPlugin(step)}>
    Register
  </RegisterButton>
              </StepBox>
              {index < arr.length - 1 && <FaArrowRight size={20} color="#2D3142" />}
            </React.Fragment>
          ))}
          </StepsContainer>
        </AnimatedDiv>

        <DropdownContainer>
        <label>Assign Manufacturer:</label>
        <Dropdown value={selectedManufacturer}
          onChange={(e) => setSelectedManufacturer(e.target.value)}
          disabled={selectedManufacturer !== ""}>
          <DropdownOption value="">Select a Manufacturer</DropdownOption>
          {manufacturers.map((manu) => (
            <DropdownOption key={manu.user_id} value={manu.user_id}>{manu.username}</DropdownOption>
          ))}
        </Dropdown>
        </DropdownContainer>

        {/* Version Control Actions */}
        <ButtonsContainer>
          <Button bgColor="#1565C0" hoverColor="#0D47A1" onClick={handleEditWorkflow}>Edit Version</Button>
          <Button bgColor="#D32F2F" hoverColor="#B71C1C">Delete Version</Button>
          <Button bgColor="#4CAF50" hoverColor="#388E3C" onClick={handleConfirmWorkflow}>Confirm Version</Button>
        </ButtonsContainer>
      </LeftContainer>

      {/* Right Side - Workflow Details */}
      <RightContainer>

        <InfoRow>
    <Label>Workflow ID:</Label> <span>{workflowID || "N/A"}</span>
  </InfoRow>


       <InfoRow>
    <Label>Selected Version:</Label> <span>{selectedVersion?.versionNumber || "N/A"}</span>
  </InfoRow>

        <InfoRow>
    <Label>Status:</Label>
    <StatusContainer>
      <StatusLabel status={status}>{status}</StatusLabel>
    </StatusContainer>
  </InfoRow>


        <InfoRow>
    <Label>Assigned Manufacturer:</Label>
    <span>{selectedManufacturer ? manufacturers.find(m => m.user_id === selectedManufacturer)?.username : "Not Assigned"}</span>
  </InfoRow>

        <SendButton bgColor="#2D3142" 
  hoverColor="#1F2532" onClick={handleWorkflowStatusUpdate}>
          <FontAwesomeIcon icon={faPaperPlane} />Send to Manufacturer
        </SendButton>
        </RightContainer>
        <ToastContainer />
    </PageContainer>
</Layout>
      );
};

export default WorkflowDetails;
