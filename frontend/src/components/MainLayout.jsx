import React, { useState } from "react";
import styled from "styled-components";
import MainSidebar from "./sidebar/MainSidebar";

// Main container holds the sidebar and content
const Container = styled.div`
  display: flex;
  height: calc(100vh - 50px);
`;

// Dynamic content area
const Content = styled.div`
  flex: 1;
  margin-left: ${(props) => (props.expanded ? "200px" : "60px")};
  transition: margin-left 0.3s ease-in-out;
  padding: 20px;
  width: calc(100vw - ${(props) => (props.expanded ? "200px" : "60px")});
`;

const Layout = ({ children, role }) => {
  const [expanded, setExpanded] = useState(true);

  return (
    <Container>
      {/* Pass expanded state to Sidebar */}
      <MainSidebar expanded={expanded} setExpanded={setExpanded} role={role} />

      {/* Main Content Area */}
      <Content expanded={expanded}>{children}</Content>
    </Container>
  );
};

export default Layout;
