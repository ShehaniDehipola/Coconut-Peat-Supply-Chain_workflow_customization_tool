import React, { useState, useEffect } from "react";
import styled from "styled-components";
import JSONViewer from "./parser/JsonViewer";
import DSLInstructions from "./parser/InstructionsContainer";
import Diagram from "./Diagram";

// Styled components for layout
const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh; /* Fills the entire viewport height */
`;

const ButtonContainer = styled.div`
  padding: 10px;
  text-align: right;
  border-left: 1px solid black;
  border-right: 1px solid black;
`;

const MainContainer = styled.div`
  display: flex;
  flex: 1; /* Allows children to grow */
  height: 100%; /* Matches the parent's height */
`;

const SidebarContainer = styled.div`
  width: 200px;
  display: flex;
  flex-direction: column;
  padding: 10px;
  box-sizing: border-box;
  background-color: #d3d2d0;
`;

const InputContainer = styled.div`
  margin-bottom: 20px;
`;

const InputField = styled.input`
  margin-bottom: 10px;
  padding: 5px;
  width: 100%;
  font-size: 14px;
  box-sizing: border-box;
`;

const Label = styled.label`
  font-size: 14px;
  margin-bottom: 5px;
  display: block;
`;

const PaletteContainer = styled.div`
  flex: 1;
  border-top: 1px solid black;
`;

const DiagramContainer = styled.div`
  flex: 1;
  position: relative;
`;

const JSONViewerContainer = styled.div`
  width: 250px;
  border-left: 1px solid black;
  height: 100%;
`;

const DSLContainer = styled.div`
  border-right: 1px solid #3e3d3c;
  display: flex;
  flex-direction: column; /* Ensures children stack vertically */
  height: 100%; /* Matches the available height in the layout */
  overflow: hidden; /* Prevents overflow issues */
`;

const ExportButton = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 15px;
  font-size: 12px;
  border-radius: 5px;
  cursor: pointer;
  margin: 10px 0;

  &:hover {
    background-color: #0056b3;
  }
`;

const AddNewPluginPage = () => {
  const [model, setModel] = useState(null);
  const [pluginName, setPluginName] = useState("");
  const [sensorName, setSensorName] = useState("");

  const handleModelChange = (modelData) => {
    if (!modelData) {
    console.error("Model data is missing.");
    return;
    }
    console.log("Model data received in handleModelChange:", modelData);
    setModel(modelData);
  };

  const handleUpdateModel = (updatedModel) => {
    console.log("updated model", model)
    setModel(updatedModel); // Update the model state
  };

  useEffect(() => {
  console.log("Current model state:", model);
}, [model]);


  return (
    <AppContainer>
      <MainContainer>
        {/* Sidebar containing input fields and palette */}
        <SidebarContainer>
          <InputContainer>
            <Label htmlFor="pluginName">Plugin Name</Label>
            <InputField
              id="pluginName"
              value={pluginName}
              onChange={(e) => setPluginName(e.target.value)}
              placeholder="Enter plugin name"
            />

            <Label htmlFor="sensorName">Sensor Name</Label>
            <InputField
              id="sensorName"
              value={sensorName}
              onChange={(e) => setSensorName(e.target.value)}
              placeholder="Enter sensor name"
            />
          </InputContainer>
          <PaletteContainer id="myPaletteDiv" />
        </SidebarContainer>

        {/* Diagram Canvas */}
        <DiagramContainer>
          <ButtonContainer>
          <ExportButton onClick={() => window.exportModel()}>
            Export Model
          </ExportButton>
          </ButtonContainer>
          <Diagram onExport={handleModelChange} model={model} />
        </DiagramContainer>

        {/* JSON Viewer */}
        {/* <JSONViewerContainer>
          <JSONViewer model={model} />
        </JSONViewerContainer> */}

        {/* DSL Instructions */}
        <DSLContainer>
          <DSLInstructions model={model} onUpdateModel={handleUpdateModel} />
        </DSLContainer>
      </MainContainer>
    </AppContainer>
  );
};

export default AddNewPluginPage;
