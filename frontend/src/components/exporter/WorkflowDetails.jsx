import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { useUser } from "../../context/UserContext";

// Styled Components
const PageContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 90%;
  height: 80vh; /* Full screen height */
  margin: 60px; /* Small margin to prevent full edge */
  padding: 50px;
  background: rgba(45, 49, 66, 0.1);
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  box-sizing: border-box;

  @media (max-width: 768px) {
    flex-direction: column;
    height: auto;
  }
`;

const LeftSection = styled.div`
  width: 50%;
  padding-right: 10px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start; /* Aligns buttons at the bottom */

  @media (max-width: 768px) {
    padding-right: 0;
  }
`;

const RightSection = styled.div`
  width: 50%;
  padding-left: 10px;
  border-left: 2px solid #d3d2d0;

  @media (max-width: 768px) {
    padding-left: 0;
    border-left: none;
    margin-top: 20px;
  }
`;

const Title = styled.h2`
  margin-bottom: 10px;
`;

const VersionSelector = styled.select`
  padding: 8px;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-top: 10px;
`;

const ChangeLogContainer = styled.div`
  margin-top: 20px;
  padding: 10px;
  background: #f9f9f9;
  border-radius: 5px;
  max-height: 200px;
  overflow-y: auto;
`;

const ChangeLogItem = styled.div`
  margin-bottom: 10px;
  padding: 8px;
  background: #eef;
  border-radius: 5px;
  font-size: 14px;
`;

const AssignManufacturerButton = styled.button`
  padding: 10px;
  width: 100%;
  background: #2D3142;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 15px;

  &:hover {
    background: #1F2532;
  }
`;

const InputField = styled.input`
  width: 80%;
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const Dropdown = styled.select`
  width: 80%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
  display: inline-block;
`;

const StatusLabel = styled.span`
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: bold;
  color: white;
  background-color: ${(props) => {
    switch (props.status) {
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

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 10px;
  }
`;

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

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const WorkflowDetailsPage = ({ }) => {
  const { user } = useUser();
  const [workflowName, setWorkflowName] = useState("");
  const [status, setStatus] = useState("pending"); // Default status
  const [version, setVersion] = useState(1); // Default version
  const [manufacturers, setManufacturers] = useState([]);
  const [selectedManufacturer, setSelectedManufacturer] = useState("");
  const [versions, setVersions] = useState([]);
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [changeLog, setChangeLog] = useState([]);

    
  const location = useLocation();
  const steps = location.state?.steps || [];

  console.log("User data:", user);

  useEffect(() => {
    axios.get(`/api/workflow/versions/${workflowName}`)
      .then(response => {
        setVersions(response.data);
        setSelectedVersion(response.data[0]); // Default to latest version
      })
      .catch(error => console.error(error));
  }, [workflowName]);

  const fetchChangeLog = () => {
    axios.get(`/api/workflows/changelog/${workflowName}`)
      .then(response => {
        setChangeLog(response.data);
      })
      .catch(error => console.error(error));
  };

  useEffect(() => {
    axios.get("http://localhost:5000/api/manufacturers/all")
      .then(response => {
      setManufacturers(response.data); // Store manufacturers in state
    })
      .catch(error => console.error(error));
      }, []);
    
    const handleEditWorkflow = () => {
    alert("Edit Workflow Clicked!");
    // Implement the edit workflow functionality
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
        
    // if (!user || !user.exporter_id) {
    // alert("User not logged in or exporter_id missing.");
    // return;
    // }
        
    if (!workflowName || steps.length === 0 || !selectedManufacturer) {
      alert("Please fill all fields before confirming.");
      return;
    }

    const workflowData = {
      workflow_name: workflowName,
      exporter_id: "exp-001",
      manufacturer_id: selectedManufacturer,
      steps: steps,
      status: "pending",
      version: 1,
    };

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
      {/* Left Side - Workflow Details */}
      <LeftSection>
        <Title>Workflow Details</Title>
        <label>Workflow Name:</label>
        <InputField 
          type="text" 
          value={workflowName} 
          onChange={(e) => setWorkflowName(e.target.value)} 
          placeholder="Enter Workflow Name"
        />

        <label>Status:</label>
        <InputField type="text" value={status} readOnly />

        <label>Version:</label>
        <InputField type="number" value={version} readOnly />

        <label>Steps:</label>
        <ul>
          {steps.length > 0 ? (
            steps.map((step, index) => (
              <li key={index}>
                {step.pluginName} - Required: {step.required_amount}
              </li>
            ))
          ) : (
            <p>No steps added.</p>
          )}
        </ul>

        <label>Assign Manufacturer:</label>
        <Dropdown 
  value={selectedManufacturer} 
  onChange={(e) => setSelectedManufacturer(e.target.value)}
>
  <option value="">Select a Manufacturer</option>
  {manufacturers.length > 0 ? (
    manufacturers.map((manu) => (
      <option key={manu.id} value={manu.id}>
        {manu.name}
      </option>
    ))
  ) : (
    <option disabled>Loading manufacturers...</option>
  )}
</Dropdown>

              {/* <AssignManufacturerButton onClick={assignManufacturer}>Assign Manufacturer</AssignManufacturerButton> */}
              
              {/* Buttons at the bottom of Left Section */}
        <ButtonContainer>
          <Button onClick={handleEditWorkflow} bgColor="#4CAF50" hoverColor="#388E3C">
            Edit Workflow
          </Button>
          <Button onClick={handleDeleteWorkflow} bgColor="#D32F2F" hoverColor="#B71C1C">
            Delete
          </Button>
          <Button onClick={handleConfirmWorkflow} bgColor="#2D3142" hoverColor="#1565C0">
            Confirm
          </Button>
        </ButtonContainer>
      </LeftSection>

      {/* Right Side - Versions & Change Log */}
      <RightSection>
        <Title>Version Control</Title>
        <label>Select Version:</label>
        <VersionSelector onChange={(e) => {
          const selected = versions.find(v => v.version === parseInt(e.target.value));
          setSelectedVersion(selected);
        }}>
          {versions.map((workflow) => (
            <option key={workflow._id} value={workflow.version}>
              Version {workflow.version}
            </option>
          ))}
        </VersionSelector>

        <button onClick={fetchChangeLog} style={{ marginTop: "10px", padding: "8px", background: "#1976D2", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>
          View Change Log
        </button>

        <ChangeLogContainer>
          <h4>Change Log:</h4>
          {changeLog.map((log, index) => (
  <ChangeLogItem key={index}>
    <strong>Version {log.version}:</strong> {log.changes}
  </ChangeLogItem>
))}
        </ChangeLogContainer>
      </RightSection>
    </PageContainer>
  );
};

export default WorkflowDetailsPage;
