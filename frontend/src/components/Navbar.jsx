import React, { useState } from "react";
import styled from "styled-components";
import { FaUserCircle } from "react-icons/fa";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Styled Components
const NavbarContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #d89527;
  color: white;
  height: 50px;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1000;
`;

const Logo = styled.div`
  font-size: 35px;
  font-weight: bold;
  cursor: pointer;
`;

const UserContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-right: 30px;
`;

const Username = styled.span`
  font-weight: 500;
  margin-right: 8px;
`;

const UserIcon = styled(FaUserCircle)`
  font-size: 35px;
`;

const Dropdown = styled.div`
  position: absolute;
  top: 45px;
  right: 0;
  background-color: white;
  color: black;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 5px 10px;
  display: ${({ open }) => (open ? "block" : "none")};
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1001;
`;

const LogoutButton = styled.button`
  background: none;
  border: none;
  color: black;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    text-decoration: underline;
  }
`;

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { user } = useUser(); // Access username from context
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
    <NavbarContainer>
      <Logo>CocoSmart</Logo>
      <UserContainer onClick={() => setOpen(!open)}>
        <Username>{user?.username || "User"}</Username>
        <UserIcon />
        <Dropdown open={open}>
          <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
        </Dropdown>
      </UserContainer>
    </NavbarContainer>
  );
};

export default Navbar;
