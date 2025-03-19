import React, { useState } from "react";
import styled from "styled-components";
import MainSidebar from "./sidebar/MainSidebar";

// Main container holds the sidebar and content
const Container = styled.div`
  display: flex;
  height: 100vh; 
  overflow: hidden;
`;

const ContentWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
`;

// Dynamic content area
const Content = styled.div`
  flex: 1;
  margin-left: ${(props) => (props.expanded ? "200px" : "60px")};
  transition: margin-left 0.3s ease-in-out;
  padding: 20px;
  width: calc(100vw - ${(props) => (props.expanded ? "200px" : "60px")});
  display: flex;
  flex-direction: column;
  height: 100%;
  box-sizing: border-box;
`;

const NewLayout = ({ children, role }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Container>
      {/* Pass expanded state to Sidebar */}
      <MainSidebar expanded={expanded} setExpanded={setExpanded} role={role} />

      {/* Main Content Area */}
      <ContentWrapper>
        <Content expanded={expanded}>{children}</Content>
        </ContentWrapper>
    </Container>
  );
};

export default NewLayout;
