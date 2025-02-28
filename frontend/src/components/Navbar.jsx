import React from "react";
import styled from "styled-components";

// Styled components for Navbar
const NavbarContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #d89527;
  color: white;
  height: 50px;
  position: fixed; /* Keeps it fixed */
  top: 0; /* Sticks to the top */
  width: 100%; /* Full width */
  z-index: 1000; /* Ensures it stays on top */
`;

const Logo = styled.div`
  font-size: 35px;
  font-weight: bold;
  cursor: pointer;
`;

const ProfileIcon = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-right: 40px;

  img {
    width: 35px;
    height: 35px;
    border-radius: 50%;
    background-color: #d3d2d0;
  }
`;

const Navbar = () => {
  return (
    <NavbarContainer>
      <Logo>CocoSmart</Logo>
      <ProfileIcon>
        <img></img>
      </ProfileIcon>
    </NavbarContainer>
  );
};

export default Navbar;
