import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";

// ================ Styled Components ================
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

const LeftContainer = styled.div`
  width: 75%;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
  margin-right: 10px; 
`;

const RightContainer = styled.div`
  width: 25%;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
`;

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

const Input = styled.input`
  width: 200px;
  padding: 6px;
  margin-right: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
`;

// ================ Main Component ================
const WorkflowDetailsPaage = () => {
  const { user } = useUser();
  const location = useLocation();
  const navigate = useNavigate();

  // Possibly passed if the user is re-editing an existing draft
  const existingWorkflowId = location.state?.workflow_id || null;

  // We'll store all versions for the *same* workflow_id
  const [workflowVersions, setWorkflowVersions] = useState([]);
  // Keep track of which version is active in the UI
  const [activeVersionIndex, setActiveVersionIndex] = useState(0);

  // For new steps that user might add in "draft" mode
  const [newPluginName, setNewPluginName] = useState("");
  const [newRequiredAmount, setNewRequiredAmount] = useState(0);

  // 1. Immediately create a draft if we have no existing workflow_id
  useEffect(() => {
    if (!existingWorkflowId) {
      // We have no workflow_id, so create a new draft
      createNewDraftWorkflow();
    } else {
      // We do have an existing ID, so fetch its versions
      fetchAllVersions(existingWorkflowId);
    }
  }, [existingWorkflowId]);

  // =============== A) Create New Draft Workflow ===============
  const createNewDraftWorkflow = async () => {
    try {
      // We'll let the backend generate a "workflow_id" or you can pass your own
      const payload = {
        exporter_id: user?.exporter_id || "temp-exporter",
        exporter_name: user?.username,
        steps: [],                  // start empty
        status: "draft",
        version: 1,
      };

      const res = await axios.post("http://localhost:5000/api/workflow", payload);

      // The response should include the newly created workflow doc
      const created = res.data.savedWorkflow; 
      console.log("Created draft workflow:", created);
      // Now fetch all versions for that workflow_id
      fetchAllVersions(created.workflow_id);
    } catch (error) {
      console.error("Failed to create draft workflow:", error);
    }
  };

  // =============== B) Fetch All Versions for a Given workflow_id ===============
  const fetchAllVersions = async (workflow_id) => {
    if (!workflow_id) return;
    try {
      const res = await axios.get(`http://localhost:5000/api/workflow/versions/${workflow_id}`);
      setWorkflowVersions(res.data);
      if (res.data.length > 0) setActiveVersionIndex(0);
    } catch (error) {
      console.error("Failed to fetch workflow versions:", error);
    }
  };

  // Helper to get the currently active version object
  const activeVersion = workflowVersions[activeVersionIndex];

  // =============== C) Add a Step Locally, then Save as New Version ===============
  // For demonstration, let's say each time we "add a plugin," we want to create a brand new version
  const handleAddPlugin = async () => {
    if (!activeVersion) return;

    // We'll create a new steps array with the new plugin
    const updatedSteps = [
      ...activeVersion.steps,
      {
        pluginName: newPluginName || "Untitled Plugin",
        required_amount: Number(newRequiredAmount) || 0,
      },
    ];

    // Now call the backend to create a new version
    // (Your updateWorkflow might do version incrementing automatically)
    try {
      const patchURL = `http://localhost:5000/api/workflow/${activeVersion._id}`;
      // Or a specialized route if you have a separate "update" endpoint
      await axios.patch(patchURL, {
        // Provide the new steps array
        steps: updatedSteps,
        // Possibly keep status "draft" so we can keep building
        status: "draft",
      });
      // After successful patch, re-fetch all versions
      fetchAllVersions(activeVersion.workflow_id);
      // Reset input fields
      setNewPluginName("");
      setNewRequiredAmount(0);
    } catch (error) {
      console.error("Failed to add new plugin:", error);
    }
  };

  // =============== D) "Send to Manufacturer" (Update Status) ===============
  // The user finalizes the active version by changing from "draft" => "pending"
  const handleSendToManufacturer = async () => {
    if (!activeVersion) return;

    try {
      await axios.patch(
        `http://localhost:5000/api/workflow/${activeVersion._id}/status`,
        { status: "pending" }
      );
      alert(`Version ${activeVersion.version} sent to manufacturer!`);
      // Re-fetch to see updated status
      fetchAllVersions(activeVersion.workflow_id);
    } catch (error) {
      console.error("Failed to send to manufacturer:", error);
    }
  };

  // =============== E) UI ===============
  return (
    <PageContainer>
      <LeftContainer>
        <h2>Workflow Version Control (Draft Approach)</h2>

        {/* Tabs for each version */}
        <TabsContainer>
          {workflowVersions.map((versionObj, idx) => (
            <Tab
              key={versionObj._id}
              active={idx === activeVersionIndex}
              onClick={() => setActiveVersionIndex(idx)}
            >
              Version {versionObj.version}
            </Tab>
          ))}
        </TabsContainer>

        {/* Render steps for the active version */}
        {activeVersion ? (
          <>
            <p>
              <strong>Status:</strong> {activeVersion.status} <br/>
              <strong>Version:</strong> {activeVersion.version}
            </p>
            {activeVersion.steps && activeVersion.steps.length > 0 ? (
              activeVersion.steps.map((step, i) => (
                <div key={i}>
                  {step.pluginName} — Required: {step.required_amount}
                </div>
              ))
            ) : (
              <p>No steps found. Add one below.</p>
            )}

            {/* Form to add new plugin step */}
            <div style={{ marginTop: "1rem" }}>
              <Input
                placeholder="Plugin Name"
                value={newPluginName}
                onChange={(e) => setNewPluginName(e.target.value)}
              />
              <Input
                type="number"
                placeholder="Required Amount"
                value={newRequiredAmount}
                onChange={(e) => setNewRequiredAmount(e.target.value)}
              />
              <Button onClick={handleAddPlugin} style={{ marginLeft: "4px" }}>
                + Add Step (New Version)
              </Button>
            </div>

            {/* "Send to Manufacturer" finalizes from "draft" to "pending" (or "in_progress") */}
            <div style={{ marginTop: "1rem" }}>
              {activeVersion.status === "draft" && (
                <Button bgColor="#4CAF50" hoverColor="#388E3C" onClick={handleSendToManufacturer}>
                  Send to Manufacturer
                </Button>
              )}
            </div>
          </>
        ) : (
          <p>Loading or no versions found yet...</p>
        )}
      </LeftContainer>

      {/* Right Side Container (optional extras) */}
      <RightContainer>
        <h2>Quick Info</h2>
        {activeVersion && (
          <>
            <p><strong>Workflow ID:</strong> {activeVersion.workflow_id}</p>
            <p><strong>Created At:</strong> {new Date(activeVersion.created_at).toLocaleString()}</p>
          </>
        )}

        {/* Possibly more UI (manufacturer selection, etc.) could go here */}
      </RightContainer>
    </PageContainer>
  );
};

export default WorkflowDetailsPaage;
