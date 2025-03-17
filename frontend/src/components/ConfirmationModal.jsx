import React from 'react';
import styled from 'styled-components';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 400px;
  max-width: 90%;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.25);
`;

const ModalHeader = styled.div`
  font-size: 1.2rem;
  margin-bottom: 1rem;
  font-weight: bold;
`;

const ModalBody = styled.div`
  font-size: 1rem;
  margin-bottom: 1.5rem;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  font-size: 1rem;
  cursor: pointer;
  border: none;
  border-radius: 4px;
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const ConfirmButton = styled(Button)`
  background: #28a745;
  color: white;
`;

const CancelButton = styled(Button)`
  background: #dc3545;
  color: white;
`;

const ConfirmationModal = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;
  return (
    <ModalOverlay>
      <ModalContainer>
        <ModalHeader>{title || 'Confirm Action'}</ModalHeader>
        <ModalBody>{message || 'Are you sure you want to proceed?'}</ModalBody>
        <ModalFooter>
          <CancelButton onClick={onCancel}>Cancel</CancelButton>
          <ConfirmButton onClick={onConfirm}>Confirm</ConfirmButton>
        </ModalFooter>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default ConfirmationModal;
