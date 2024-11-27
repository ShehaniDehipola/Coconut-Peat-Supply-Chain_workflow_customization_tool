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
  height: 60px;
`;

const Logo = styled.div`
  font-size: 40px;
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
  }
`;

const Navbar = () => {
  return (
    <NavbarContainer>
      <Logo>ABCDE</Logo>
      <ProfileIcon>
        <img
          src="https://via.placeholder.com/35"
          alt="Profile"
        />
      </ProfileIcon>
    </NavbarContainer>
  );
};

export default Navbar;
