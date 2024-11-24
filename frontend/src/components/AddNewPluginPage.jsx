import React from "react";
import styled from "styled-components";
import AddNewPluginSidebar from "./sidebar/AddNewPluginSidebar";
import Diagram from "./Diagram";

// Styled components for layout
const Container = styled.div`
  display: flex;
  height: 100vh;
`;

const SidebarWrapper = styled.div`
  flex: 0 0 240px;
  background-color: #f9f9f9;
  border-right: 1px solid #ddd;
`;

const DiagramWrapper = styled.div`
  flex: 1;
  padding: 10px;
`;

const AddNewPluginPage = () => {
  const nodeTemplates = [
    { category: "Start", text: "Start" },
    { category: "Conditional", text: "Conditional" },
    { category: "", text: "Step" },
    { category: "End", text: "End" },
  ];

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Diagram />
    </div>
  );
};

export default AddNewPluginPage;
