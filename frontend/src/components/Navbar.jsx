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

  img {
    width: 35px;
    height: 35px;
    border-radius: 50%;
    margin-left: 10px;
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
