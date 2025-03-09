import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaArrowRight } from "react-icons/fa";

import dashboardIcon from "../../assests/dashboard.png"
import manufacturerIcon from "../../assests/conveyor.png"
import settingsIcon from "../../assests/gear.png"
import workflowIcon from "../../assests/workflow.png"
import reportsIcon from "../../assests/statistics.png"
import LogoutIcon from "../../assests/logout.png"
import plusIcon from "../../assests/plus.png"

// Styled Components
const SidebarContainer = styled.div`
  width: ${(props) => (props.expanded ? "200px" : "60px")};
  height:  calc(100vh - 50px);
  background: #2D3142;
  color: white;
  display: flex;
  flex-direction: column;
  padding: 10px;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  position: fixed;
  left: 0;
  overflow-y: auto;
  justify-content: space-between;
  transition: width 0.3s ease-in-out;
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
  white-space: nowrap;

  &:hover {
    background: #d89527;
    color: black;
  }

  span {
    display: ${(props) => (props.expanded ? "inline" : "none")};
    margin-left: 12px;
    transition: opacity 0.3s ease-in-out;
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
  width: 26px;
  height: 26px;
  margin-right: ${(props) => (props.expanded ? "20px" : "0")};
  margin-top: 10px;
  transition: margin-right 0.3s ease-in-out;
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

  &:hover {
    background: #d89527;
    color: black;
  }
`;

const ToggleButton = styled.button`
  position: absolute;
  right: -15px;
  top: 50%;
  transform: translateY(-50%);
  width: 30px;
  height: 30px;
  background: black;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  color: white;
  font-size: 24px;
  transition: transform 0.3s ease-in-out;

  svg {
    color: white;
    font-size: 16px;
    transform: ${(props) => (props.expanded ? "rotate(180deg)" : "rotate(0deg)")};
    transition: transform 0.3s ease-in-out;
  }
`;

const MainSidebar = ({ role }) => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  const toggleSidebar = () => {
    setExpanded((prev) => !prev);
  };


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
    <SidebarContainer expanded={expanded}>
      <ToggleButton onClick={toggleSidebar} expanded={expanded}>
        <FaArrowRight />
      </ToggleButton>

      {/* Navigation */}
      <NavSection>

        {role === "exporter" && (
          <>
          <NavItem onClick={() => navigate("/exporter-dashboard")}><Icon src={dashboardIcon} alt="Dashboard" />{expanded && "Dashboard"}</NavItem>
          <NavItem onClick={() => navigate("/all-workflows")}><Icon src={workflowIcon} alt="Workflow" />{expanded && "Workflows"}</NavItem>
            <NavItem onClick={() => navigate("/manufacturers")}><Icon src={manufacturerIcon} alt="Manufacturer" />{expanded && "Manufacturers"}</NavItem>
            <NavItem onClick={() => navigate("/reports")}><Icon src={reportsIcon} alt="Report" />{expanded && "Reports & Analytics"}</NavItem>
        <NavItem onClick={() => navigate("/settings")}><Icon src={settingsIcon} alt="Settings" />{expanded && "Settings"}</NavItem>
          </>
        )}

        {role === "manufacturer" && (
          <>
          <NavItem onClick={() => navigate("/manufacturer-dashboard")}><Icon src={dashboardIcon} alt="Dashboard" />{expanded && "Dashboard"}</NavItem>
          <NavItem onClick={() => navigate("/manufacturer-workflows")}><Icon src={workflowIcon} alt="Workflow" />{expanded && "Workflows"}</NavItem>
            {/* <NavItem onClick={() => navigate("/assigned-workflows")}>Assigned Workflows</NavItem> */}
            <NavItem onClick={() => navigate("/reports")}><Icon src={reportsIcon} alt="Report" />{expanded && "Reports & Analytics"}</NavItem>
            <NavItem onClick={() => navigate("/settings")}><Icon src={settingsIcon} alt="Settings" />{expanded && "Settings"}</NavItem>
          </>
        )}

      </NavSection>

      <BottomContainer>
      {/* Quick Actions */}
      {/* {role === "exporter" && (
      <QuickActions>
        <QuickActionButton onClick={() => navigate("/add-plugin")}><Icon src={plusIcon} alt="plus" />Add Plugin</QuickActionButton>
        <QuickActionButton onClick={() => navigate("/new-workflow")}><Icon src={plusIcon} alt="plus" />Create Workflow</QuickActionButton>
      </QuickActions>

      )} */}
      {/* Logout Button */}
      <NavItem onClick={handleLogout}><Icon src={LogoutIcon} alt="logout" />{expanded && "Logout"}</NavItem>
      </BottomContainer>
    </SidebarContainer>
  );
};

export default MainSidebar;
