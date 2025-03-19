import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { generateJSON } from "../../utils/jsonGenerator"; // Function to generate JSON from DSL
import { generateDSL } from "../../utils/dslGenerator"; // Function to generate DSL from JSON

const InstructionsContainer = styled.div`
  padding: 5px;
  font-family: monospace;
  font-size: 12px;
  overflow: hidden;
  background-color: #d3d2d0;
  flex-grow: 1; /* Allows it to grow and fill available space */
  min-height: 200px; /* Ensures a reasonable minimum height */
  height: 100%; /* Matches the parent's height if flex is used */
  box-sizing: border-box; /* Ensures padding is included in the total height */
`;

const TabContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  margin-bottom: 10px;
  border-bottom: 1px solid #ccc;
`;

const Tab = styled.button`
  padding: 10px 20px;
  font-size: 14px;
  border: 1px solid black;
  background-color: ${(props) => (props.active ? "#d89527" : "#f1f1f1")};
  color: ${(props) => (props.active ? "white" : "#333")};
  cursor: pointer;

  &:hover {
    background-color: ${(props) => (props.active ? "#9b6b1d" : "#ddd")};
  }
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const HeaderTitle = styled.h3`
  margin: 0;
`;

const UpdateButton = styled.button`
  background-color: transparent;
  color: #2D3142;
  border: 1px solid #2D3142;
  padding: 10px 15px;
  font-size: 12px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;

  &:hover {
    background-color: #2D3142;
    color: white;
  }
`;

const TextArea = styled.textarea`
  flex-grow: 1; /* Allows the TextArea to take up remaining space */
  width: 100%; /* Ensures it spans the full width of the container */
  font-family: monospace;
  font-size: 12px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  resize: none; /* Prevents resizing if you want consistent layout */
  box-sizing: border-box; /* Includes padding in width/height calculations */
  overflow-y: auto; /* Adds scroll if content overflows vertically */
  min-height: 250px; /* Ensures a reasonable minimum height */
`;

const DSLInstructions = ({ model, onUpdateModel, logToTerminal, isUpdateWorkFlow }) => {
  const [activeTab, setActiveTab] = useState("DSL Editor");
  const [instructions, setInstructions] = useState("");
  const [preview, setPreview] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [validatedModel, setValidatedModel] = useState(null);
  
  const hasValidated = useRef(false); 

  useEffect(() => {
    if (!model || hasValidated.current || isUpdateWorkFlow) return;

    setIsProcessing(true); // Indicate that validation is in progress
    logToTerminal("Starting validation process...");

      generateDSL(model, logToTerminal, setInstructions)
        .then((dsl) => {
          logToTerminal("Validation complete. Preparing flowchart...");
          setInstructions(dsl);
          setPreview(dsl);
          setValidatedModel(generateJSON(dsl)); // Store validated model
        
          setTimeout(() => {
            setIsProcessing(false); // Mark processing as complete
          }, 1000); // Small delay for better UX
        })
        .catch((error) => {
          const errorMessage = `Error: ${error.message}`;
          logToTerminal(errorMessage);
          setInstructions(errorMessage);
          setPreview(errorMessage);
          setIsProcessing(false);
        });

  }, [model]); // Runs only when model changes

  useEffect(() => {
    if (!isProcessing && validatedModel && hasValidated.current) {
      logToTerminal("Updating flowchart with validated model...");
      onUpdateModel(validatedModel); // Only update once validation is done
    }
  }, [isProcessing, validatedModel, onUpdateModel]);

  // Handle updates to the instructions
  const handleUpdate = async () => {
  logToTerminal("Validating DSL instructions before updating flowchart...");
  setIsProcessing(true); // Show "Processing..." while running validation

  try {
    // First, validate the instructions by converting them into JSON
    const updatedJSON = generateJSON(instructions); 

    // Then, validate if JSON is correct by converting it back to DSL
    const dslValidation = await generateDSL(updatedJSON, logToTerminal, setInstructions);

    setTimeout(() => {
      onUpdateModel(updatedJSON); // Only update if validation passes
      setIsProcessing(false); // Reset processing status
    }, 1000); // Small delay for a better user experience

  } catch (error) {
    const errorMessage = `Error: ${error.message}`;
    logToTerminal(errorMessage);
    setInstructions(errorMessage);
    setPreview(errorMessage);
    setIsProcessing(false); // Reset processing status on failure
  }
};

  return (
    <InstructionsContainer>
      <TabContainer>
        <Tab active={activeTab === "DSL Editor"} onClick={() => setActiveTab("DSL Editor")}>
          Editor
        </Tab>
        <Tab active={activeTab === "Preview"} onClick={() => setActiveTab("Preview")}>
          Preview
        </Tab>
        <Tab active={activeTab === "Settings"} onClick={() => setActiveTab("Settings")}>
          Settings
        </Tab>
      </TabContainer>

      {isProcessing && <div style={{ color: "blue" }}> Running Validations...</div>}
      {errorMessage && <div style={{ color: "red" }}> {errorMessage}</div>}

      {/* Dynamic Content Based on Active Tab */}
      {activeTab === "DSL Editor" && (
        <div>
          <HeaderContainer>
            <HeaderTitle>Instruction Panel</HeaderTitle>
          </HeaderContainer>
          <TextArea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="Write DSL instructions here..."
          />
            <UpdateButton onClick={handleUpdate}>Update Workflow</UpdateButton>
        </div>
      )}

      {activeTab === "Preview" && (
        <div>
          <h4>Preview</h4>
          <TextArea readOnly value={preview} placeholder="Preview of DSL instructions..." />
        </div>
      )}

      {activeTab === "Settings" && (
        <div>
          <h4>Settings</h4>
          <p>Settings content can go here...</p>
        </div>
      )}
    </InstructionsContainer>
  );
};

export default DSLInstructions;
