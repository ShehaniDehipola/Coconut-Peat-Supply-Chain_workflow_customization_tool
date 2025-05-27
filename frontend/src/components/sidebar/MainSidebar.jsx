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

const NavSection = styled.div`
  flex-grow: 1;
  margin-top: 20px;
`;

const NavItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${(props) => (props.expanded ? "15px" : "0")}; 
  padding: 10px;
  margin: 5px;
  background: ${(props) => (props.active ? "#d89527" : "transparent")};
  color: ${(props) => (props.active ? "black" : "white")};
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  white-space: nowrap;
  transition: all 0.3s ease-in-out;

  &:hover {
    background: #d89527;
    color: black;
  }
`;

const NavText = styled.span`
  display: ${(props) => (props.expanded ? "inline" : "none")};
  margin-left: 15px;  /* Adjust spacing between icon and text */
  transition: opacity 0.3s ease-in-out;
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

const MainSidebar = ({ expanded, setExpanded, role }) => {
  const navigate = useNavigate();

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
            <NavItem onClick={() => navigate("/exporter-dashboard")}><Icon src={dashboardIcon} alt="Dashboard" /><NavText expanded={expanded}>Dashboard</NavText></NavItem>
          <NavItem onClick={() => navigate("/all-workflows")}><Icon src={workflowIcon} alt="Workflow" /><NavText expanded={expanded}>Workflows</NavText></NavItem>
            <NavItem onClick={() => navigate("/manufacturers")}><Icon src={manufacturerIcon} alt="Manufacturer" /><NavText expanded={expanded}>Manufacturers</NavText></NavItem>
            {/* <NavItem onClick={() => navigate("/reports")}><Icon src={reportsIcon} alt="Report" /><NavText expanded={expanded}>Reports & Analytics</NavText></NavItem>
        <NavItem onClick={() => navigate("/settings")}><Icon src={settingsIcon} alt="Settings" /><NavText expanded={expanded}>Settings</NavText></NavItem> */}
          </>
        )}

        {role === "manufacturer" && (
          <>
          <NavItem onClick={() => navigate("/manufacturer-dashboard")}><Icon src={dashboardIcon} alt="Dashboard" /><NavText expanded={expanded}>Dashboard</NavText></NavItem>
          <NavItem onClick={() => navigate("/manufacturer-workflows")}><Icon src={workflowIcon} alt="Workflow" /><NavText expanded={expanded}>Workflows</NavText></NavItem>
            {/* <NavItem onClick={() => navigate("/assigned-workflows")}>Assigned Workflows</NavItem> */}
            {/* <NavItem onClick={() => navigate("/reports")}><Icon src={reportsIcon} alt="Report" /><NavText expanded={expanded}>Reports & Analytics</NavText></NavItem>
            <NavItem onClick={() => navigate("/settings")}><Icon src={settingsIcon} alt="Settings" /><NavText expanded={expanded}>Settings</NavText></NavItem> */}
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
      <NavItem onClick={handleLogout}><Icon src={LogoutIcon} alt="logout" /><NavText expanded={expanded}>Logout</NavText></NavItem>
      </BottomContainer>
    </SidebarContainer>
  );
};

export default MainSidebar;
