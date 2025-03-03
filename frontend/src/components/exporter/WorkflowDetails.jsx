import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";

// Styled Components
const PageContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 90%;
  height: 80vh;
  margin: 60px auto;
  padding: 20px;
  background: rgba(45, 49, 66, 0.1);
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  box-sizing: border-box;

  @media (max-width: 768px) {
    flex-direction: column;
    height: auto;
  }
`;

// Version Control (Larger)
const LeftContainer = styled.div`
  width: 75%;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
`;

// Workflow Details (Smaller)
const RightContainer = styled.div`
  width: 25%;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
`;

// Tab Navigation for Versions
const TabsContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
`;

const Tab = styled.button`
  padding: 8px 12px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background: ${(props) => (props.active ? "#2D3142" : "#ccc")};
  color: ${(props) => (props.active ? "white" : "black")};

  &:hover {
    background: #1f2532;
    color: white;
  }
`;

// Buttons
const Button = styled.button`
  flex: 1;
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
  
  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const DropdownOption = styled.option`
  font-size: 16px;
  color: black;
  background: white;
`;

const WorkflowDetailsPage = ({ }) => {
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

  console.log("Received in WorkflowDetailsPage:");

  const steps = location.state?.steps || [];
  const workflow_id = location.state?.workflow_id || "N/A"; // Retrieve passed ID

  console.log("Workflow ID:", workflow_id);
  console.log("Steps:", steps);

  console.log("User data:", user);

  useEffect(() => {
  if (location.state?.workflow_id) {
    setWorkflowID(location.state.workflow_id); // Ensure workflowID is set
  }
  console.log("Workflow ID from state:", location.state?.workflow_id); // Debugging log
}, [location.state?.workflow_id]);

  useEffect(() => {
    if (workflow_id !== "N/A") {
      setWorkflowID(workflow_id);
      
      // If this workflow ID already exists, increase version
      if (workflowVersions.length > 0) {
        setVersion(workflowVersions.length + 1);
      } else {
        setVersion(1);
      }

      setWorkflowVersions((prevVersions) => [
        ...prevVersions,
        { version, steps },
      ]);
    }
  }, [workflow_id]);

  const fetchChangeLog = () => {
    axios.get(`/api/workflows/changelog/${workflowID}`)
      .then(response => {
        setChangeLog(response.data);
      })
      .catch(error => console.error(error));
  };

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
        
    console.log("Debugging handleConfirmWorkflow:");
    console.log("workflowID:", workflowID);
    console.log("steps:", steps);
    console.log("selectedManufacturer:", selectedManufacturer);
    console.log("user.exporter_id:", user?.exporter_id);
        
    if (!workflowID || steps.length === 0 || !selectedManufacturer) {
      alert("Please fill all fields before confirming.");
      return;
      }
      
      const latestManufacturer = selectedManufacturer;
    console.log("Using latestManufacturer:", latestManufacturer);

    const workflowData = {
      workflow_id: workflowID, // Auto-generated ID
      exporter_id: user.exporter_id,
      manufacturer_id: latestManufacturer,
      steps: steps,
      status: status,
      version: version,
    };

      
      console.log("Submitting Workflow Data:", workflowData);
    try {
      await axios.post("http://localhost:5000/api/workflow/", workflowData);
      alert("Workflow Created Successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to create workflow.");
    }
  };

  return (
    <PageContainer>
      {/* Left Side - Version Control */}
      <LeftContainer>
        <h2>Version Control</h2>

        {/* Tabs for Each Version */}
        <TabsContainer>
            <Tab>
              Version {version}
            </Tab>
        </TabsContainer>

        {/* Selected Version Details */}
        <div>
          <p><b>Steps:</b></p>
          <ul>
            {steps?.length > 0 ? (
    steps.map((step, index) => (
      <li key={index}>{step.pluginName} - Required: {step.required_amount}</li>
    ))
  ) : (
    <p>No steps available.</p>
  )}
          </ul>
        </div>

        {/* Version Control Actions */}
        <div>
          <Button bgColor="#4CAF50" hoverColor="#388E3C" onClick={handleEditWorkflow}>Edit Version</Button>
          <Button bgColor="#D32F2F" hoverColor="#B71C1C">Delete Version</Button>
          <Button bgColor="#2D3142" hoverColor="#1565C0">Confirm</Button>
        </div>
      </LeftContainer>

      {/* Right Side - Workflow Details */}
      <RightContainer>
        <h2>Workflow Details</h2>

        <label>Workflow ID:</label>
        <p><b>{workflow_id || "N/A"}</b></p>

        {/* <label>Exporter ID:</label>
        <p><b>{exporter_id || "Generating..."}</b></p> */}

        <label>Status:</label>
        <p>{status}</p>

        <label>Assign Manufacturer:</label>
        <select value={selectedManufacturer} onChange={(e) => {
      console.log("Manufacturer Selected (user_id):", e.target.value);
      setSelectedManufacturer(e.target.value);
  }}>
          <DropdownOption value="">Select a Manufacturer</DropdownOption>
          {manufacturers.map((manu) => (
            <DropdownOption key={manu.user_id} value={manu.user_id}>{manu.username}</DropdownOption>
          ))}
        </select>

        <Button bgColor="#2D3142" onClick={handleConfirmWorkflow}>
          Send to Manufacturer
        </Button>
      </RightContainer>
    </PageContainer>
  );
};

export default WorkflowDetailsPage;
