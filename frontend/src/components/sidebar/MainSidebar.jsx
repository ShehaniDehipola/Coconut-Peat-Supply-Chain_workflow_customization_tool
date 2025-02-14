import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

import dashboardIcon from "../../assests/dashboard.png"
import manufacturerIcon from "../../assests/conveyor.png"
import settingsIcon from "../../assests/gear.png"
import workflowIcon from "../../assests/workflow.png"
import reportsIcon from "../../assests/statistics.png"
import LogoutIcon from "../../assests/logout.png"
import plusIcon from "../../assests/plus.png"

// Styled Components
const SidebarContainer = styled.div`
  width: 200px;
  height:  calc(100vh - 50px);
  background: #2D3142;
  color: white;
  display: flex;
  flex-direction: column;
  padding: 20px;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  position: fixed;
  left: 0;
  overflow-y: auto;
`;

// const Logo = styled.h2`
//   text-align: center;
//   margin-bottom: 30px;
//   font-size: 22px;
//   color: #FFD700;
// `;

// const ProfileSection = styled.div`
//   text-align: center;
//   margin-bottom: 20px;
// `;

// const ProfileName = styled.h4`
//   margin: 5px 0;
// `;

// const RoleTag = styled.span`
//   background: #FFD700;
//   color: black;
//   padding: 4px 10px;
//   border-radius: 5px;
//   font-size: 12px;
// `;

const NavSection = styled.div`
  margin-bottom: 20px;
`;

const NavItem = styled.div`
  padding: 10px;
  margin-bottom: 5px;
  background: ${(props) => (props.active ? "#d89527" : "transparent")};
  color: ${(props) => (props.active ? "black" : "white")};
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 16px;

  &:hover {
    background: #d89527;
    color: black;
  }
`;

const QuickActions = styled.div`
  margin-top: auto;
`;

const QuickActionButton = styled.button`
  width: 100%;
  padding: 5px;
  margin-top: 10px;
  background: #d89527;
  color: black;
  border: none;
  border-radius: 5px;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    background: #e2a73f;
  }
`;

const Icon = styled.img`
  width: 20px;
  height: 20px;
  margin-right: 10px;
`;

const LogoutButton = styled.button`
  width: 100%;
  padding: 5px;
  margin-top: 20px;
  background: transparent;
  outline: #d89527;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;

  &:hover {
    background: #d89527;
  }
`;

const MainSidebar = ({ role = "Exporter" }) => {
  const navigate = useNavigate();

  return (
    <SidebarContainer>

      {/* Navigation */}
      <NavSection>
        <NavItem onClick={() => navigate("/exporter-dashboard")}><Icon src={dashboardIcon} alt="Dashboard" />Dashboard</NavItem>
        <NavItem onClick={() => navigate("/workflows")}><Icon src={workflowIcon} alt="Workflow" />Workflows</NavItem>

        {role === "Exporter" && (
          <>
            <NavItem onClick={() => navigate("/manufacturers")}><Icon src={manufacturerIcon} alt="Manufacturer" />Manufacturers</NavItem>
          </>
        )}

        {role === "Manufacturer" && (
          <>
            <NavItem onClick={() => navigate("/assigned-workflows")}>Assigned Workflows</NavItem>
          </>
        )}

        <NavItem onClick={() => navigate("/reports")}><Icon src={reportsIcon} alt="Report" />Reports & Analytics</NavItem>
        <NavItem onClick={() => navigate("/settings")}><Icon src={settingsIcon} alt="Settings" />Settings</NavItem>
      </NavSection>

      {/* Quick Actions */}
      <QuickActions>
        <QuickActionButton onClick={() => navigate("/add-plugin")}><Icon src={plusIcon} alt="plus" />Add Plugin</QuickActionButton>
        <QuickActionButton onClick={() => navigate("/build-workflow")}><Icon src={plusIcon} alt="plus" />Create Workflow</QuickActionButton>
      </QuickActions>

      {/* Logout Button */}
      <LogoutButton onClick={() => alert("Logging out...")}><Icon src={LogoutIcon} alt="logout" />Logout</LogoutButton>
    </SidebarContainer>
  );
};

export default MainSidebar;
