import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import plusIcon from '../assests/plus.png';

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px;
  border-bottom: 1px solid #ddd;
`;

const Title = styled.h3`
  font-size: 30px;
  font-weight: bold;
  color: #2D3142; 
  margin-left: 10px;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  width: 160px;
  background-color: #2D3142;
  color: white;
  padding: 10px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color:rgb(42, 63, 87);
  }

  img {
    margin-right: 8px;
    width: 16px;
    height: 16px;
     filter: brightness(0) invert(1);
  }
`;

const Header = ({ title, role }) => {
  const navigate = useNavigate();

  return (
    <HeaderContainer>
      <Title>{title}</Title>
      {role !== "manufacturer" && (
        <div style={{ display: "flex", gap: "10px" }}>
          <Button onClick={() => navigate("/add-plugin")}>
            <img src={plusIcon} alt="plus" style={{ width: "18px", marginRight: "8px", color: "white" }} />
            Add New Step
          </Button>
          <Button onClick={() => navigate("/new-workflow")}>
            <img src={plusIcon} alt="plus" style={{ width: "18px", marginRight: "8px" }} />
            Create Workflow
          </Button>
        </div>
      )}
    </HeaderContainer>
  );
};

export default Header;
