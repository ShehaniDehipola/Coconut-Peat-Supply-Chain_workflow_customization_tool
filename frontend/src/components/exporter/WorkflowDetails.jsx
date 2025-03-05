import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { FaArrowRight } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";

// Styled Components
const PageContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 90%;
  height: 80vh;
  margin: 60px auto;
  padding: 20px;
  border-radius: 8px;
  box-sizing: border-box;

  @media (max-width: 768px) {
    flex-direction: column;
    height: auto;
  }
`;

const LeftContainer = styled.div`
  width: 75%;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
`;

const RightContainer = styled.div`
  width: 25%;
  padding: 20px;
  background: rgba(255, 255, 255, 0.85);
  border-radius: 8px;
  box-shadow: 2px 2px 15px rgba(0, 0, 0, 0.15);
  border-left: 3px solid #ccc;
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
`;

const StatusLabel = styled.span`
  padding: 5px 10px;
  border-radius: 5px;
  color: white;
  font-size: 14px;
  font-weight: bold;
  background: ${(props) =>
    props.status === "pending" ? "#FFC107" :
    props.status === "in progress" ? "#4CAF50" :
    props.status === "completed" ? "#D32F2F" : "#2D3142"};
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
  font-size: 14px;
  font-weight: bold;
  min-width: 140px;
  text-align: center;
  gap: 5px;
`;

const PluginName = styled.div`
  font-size: 16px;
  font-weight: bold;
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
  margin-top: auto;
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

const Dropdown = styled.select`
  width: 100%;
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
        
    if (!user?.exporter_id || !workflowID || initialSteps.length === 0 || !selectedManufacturer) {
      alert("Please fill all fields before confirming.");
      return;
    }
      
    console.log("Using selected manufacturer:", selectedManufacturer);
    console.log("All steps:", initialSteps);

    const workflowData = {
      workflow_id: workflowID, // Auto-generated ID
      exporter_id: user.exporter_id,
      manufacturer_id: selectedManufacturer,
      versions: [
        {
          versionNumber: version,
          status: status,
          steps: initialSteps,
        },
      ],
    };
      
      console.log("Submitting Workflow Data:", workflowData);
    try {
      await axios.post("http://localhost:5000/api/workflow/", workflowData);
      alert("Workflow Created Successfully!");
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  const handleWorkflowStatusUpdate = async () => {
    console.log("Selected version in update:", selectedVersion);
    if (!selectedVersion) {
      alert("No version selected for status update.");
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
      alert(`Version ${selectedVersion.versionNumber} status updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating workflow status:", error);
      alert("Failed to update status: " + error.message);
    }
  }

  return (
    <PageContainer>
      {/* Left Side - Version Control */}
      <LeftContainer>
        <h2>Workflow Details</h2>

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
                <RequiredAmount>Required: {step.required_amount}</RequiredAmount>
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
          <Button bgColor="#4CAF50" hoverColor="#388E3C" onClick={handleEditWorkflow}>Edit Version</Button>
          <Button bgColor="#D32F2F" hoverColor="#B71C1C">Delete Version</Button>
          <Button bgColor="#2D3142" hoverColor="#1565C0" onClick={handleConfirmWorkflow}>Confirm Version</Button>
        </ButtonsContainer>
      </LeftContainer>

      {/* Right Side - Workflow Details */}
      <RightContainer>

        <label>Workflow ID:</label>
        <p><b>{workflowID || "N/A"}</b></p>

        {/* <label>Exporter ID:</label>
        <p><b>{exporter_id || "Generating..."}</b></p> */}

        <label>Status:</label>
        <StatusLabel>{status}</StatusLabel>

        <label>Assigned Manufacturer:</label>
        <p>{selectedManufacturer ? manufacturers.find(m => m.user_id === selectedManufacturer)?.username : "Not Assigned"}</p>

        <Button bgColor="#2D3142" onClick={handleWorkflowStatusUpdate}>
          <FontAwesomeIcon icon={faPaperPlane} />Send to Manufacturer
        </Button>
      </RightContainer>
    </PageContainer>
  );
};

export default WorkflowDetails;
