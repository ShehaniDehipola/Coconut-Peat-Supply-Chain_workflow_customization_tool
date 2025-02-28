import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
  justify-content: space-between;
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
  flex-grow: 1;
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

const BottomContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: auto;
  padding-bottom: 40px;
`;

const QuickActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const QuickActionButton = styled.button`
  width: 100%;
  padding: 5px;
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
  padding: 10px;
  background: transparent;
  color: white;
  border: 2px solid #d89527;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  // position: absolute;
  // bottom: 60px; /* Anchors logout button to the bottom */
  // left: 0;
  // right: 0;
  // margin: auto;
  // width: 90%;

  &:hover {
    background: #d89527;
    color: black;
  }
`;

const MainSidebar = ({ role }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("No token found, redirecting to login.");
        navigate("/");
        return;
      }

      await axios.post(
        "http://localhost:5000/api/auth/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Remove user session
        localStorage.removeItem("token");
        localStorage.removeItem("user");

      // Redirect to login page
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Failed to logout. Please try again.");
    }
  };

  return (
    <SidebarContainer>

      {/* Navigation */}
      <NavSection>

        {role === "exporter" && (
          <>
          <NavItem onClick={() => navigate("/exporter-dashboard")}><Icon src={dashboardIcon} alt="Dashboard" />Dashboard</NavItem>
          <NavItem onClick={() => navigate("/workflows")}><Icon src={workflowIcon} alt="Workflow" />Workflows</NavItem>
            <NavItem onClick={() => navigate("/manufacturers")}><Icon src={manufacturerIcon} alt="Manufacturer" />Manufacturers</NavItem>
            <NavItem onClick={() => navigate("/reports")}><Icon src={reportsIcon} alt="Report" />Reports & Analytics</NavItem>
        <NavItem onClick={() => navigate("/settings")}><Icon src={settingsIcon} alt="Settings" />Settings</NavItem>
          </>
        )}

        {role === "manufacturer" && (
          <>
          <NavItem onClick={() => navigate("/manufacturer-dashboard")}><Icon src={dashboardIcon} alt="Dashboard" />Dashboard</NavItem>
          <NavItem onClick={() => navigate("/manufacturer-workflow")}><Icon src={workflowIcon} alt="Workflow" />Workflows</NavItem>
            {/* <NavItem onClick={() => navigate("/assigned-workflows")}>Assigned Workflows</NavItem> */}
            <NavItem onClick={() => navigate("/reports")}><Icon src={reportsIcon} alt="Report" />Reports & Analytics</NavItem>
            <NavItem onClick={() => navigate("/settings")}><Icon src={settingsIcon} alt="Settings" />Settings</NavItem>
          </>
        )}

      </NavSection>

      <BottomContainer>
      {/* Quick Actions */}
      {role === "exporter" && (
      <QuickActions>
        <QuickActionButton onClick={() => navigate("/add-plugin")}><Icon src={plusIcon} alt="plus" />Add Plugin</QuickActionButton>
        <QuickActionButton onClick={() => navigate("/new-workflow")}><Icon src={plusIcon} alt="plus" />Create Workflow</QuickActionButton>
      </QuickActions>

      )}
      {/* Logout Button */}
      <LogoutButton onClick={handleLogout}><Icon src={LogoutIcon} alt="logout" />Logout</LogoutButton>
      </BottomContainer>
    </SidebarContainer>
  );
};

export default MainSidebar;
