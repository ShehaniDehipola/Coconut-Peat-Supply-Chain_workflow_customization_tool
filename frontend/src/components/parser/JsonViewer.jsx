import React from "react";
import styled from "styled-components";

const ViewerContainer = styled.div`
  padding: 10px;
  font-family: monospace;
  font-size: 12px;
  overflow-y: auto;
  height: 100%;
`;

const JSONViewer = ({ model }) => {
  return (
    <ViewerContainer>
      <h3>Data Model Panel</h3>
      <pre>{model ? JSON.stringify(model, null, 2) : "No data available"}</pre>
    </ViewerContainer>
  );
};

export default JSONViewer;
