import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";

// Styled Components
const PageContainer = styled.div`
  display: flex;
  justify-content: space-between;
  max-width: 1000px;
  margin: 20px auto;
  padding: 20px;
  background: white;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
`;

const LeftSection = styled.div`
  width: 50%;
  padding-right: 20px;
`;

const RightSection = styled.div`
  width: 50%;
  padding-left: 20px;
  border-left: 2px solid #d3d2d0;
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

const WorkflowDetailsPage = ({ workflowName }) => {
  const [versions, setVersions] = useState([]);
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [changeLog, setChangeLog] = useState([]);
  const [manufacturer, setManufacturer] = useState("");

  useEffect(() => {
    axios.get(`/api/workflows/versions/${workflowName}`)
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

  const assignManufacturer = () => {
    if (!manufacturer) return;
    axios.post(`/api/workflows/assign-manufacturer`, { workflowName, manufacturer })
      .then(response => alert("Manufacturer Assigned Successfully"))
      .catch(error => console.error(error));
  };

  return (
    <PageContainer>
      {/* Left Side - Workflow Details */}
      <LeftSection>
        <Title>Workflow Details</Title>
        {selectedVersion && (
          <div>
            <h3>{selectedVersion.workflow_name}</h3>
            <p><strong>Status:</strong> {selectedVersion.status}</p>
            <p><strong>Version:</strong> {selectedVersion.version}</p>
            <h4>Steps:</h4>
            <ul>
              {selectedVersion.steps.map((step, index) => (
                <li key={index}>{step.pluginName} - Required: {step.required_amount}</li>
              ))}
            </ul>
            <p><strong>Assigned Manufacturer:</strong> {selectedVersion.manufacturer_id || "Not Assigned"}</p>
            <input
              type="text"
              placeholder="Enter Manufacturer Name"
              value={manufacturer}
              onChange={(e) => setManufacturer(e.target.value)}
            />
            <AssignManufacturerButton onClick={assignManufacturer}>Assign Manufacturer</AssignManufacturerButton>
          </div>
        )}
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

        <button onClick={fetchChangeLog} style={{ marginTop: "10px", padding: "8px", background: "#2D3142", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>
          View Change Log
        </button>

        <ChangeLogContainer>
          <h4>Change Log:</h4>
          {changeLog.length > 0 ? (
            changeLog.map((log, index) => (
              <ChangeLogItem key={index}>
                <strong>Version {log.version}:</strong> {log.changes}
              </ChangeLogItem>
            ))
          ) : (
            <p>No change log available.</p>
          )}
        </ChangeLogContainer>
      </RightSection>
    </PageContainer>
  );
};

export default WorkflowDetailsPage;
