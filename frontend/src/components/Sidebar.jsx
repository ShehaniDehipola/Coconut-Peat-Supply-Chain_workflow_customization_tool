import React, { useState } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import styled from 'styled-components';
import Modal from 'react-modal';
import InstructionsContainer from './parser/InstructionsContainer';

// Sidebar container styling
const SidebarContainer = styled.div`
  width: 200px;
  padding: 10px;
  background-color: #f4f4f4;
`;

const PluginBox = styled.div`
  padding: 10px;
  margin-bottom: 10px;
  background-color: #ccc;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
`;

const AddPluginButton = styled.button`
  margin-bottom: 20px;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
`;

// Sidebar component for draggable items
const Sidebar = ({ plugins }) => {
  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility

  // Functions to open and close modal
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  
  return (
    <SidebarContainer>
      <h3>Plugins</h3>

      {/* Add Plugin Button */}
      <AddPluginButton onClick={openModal}>Add Plugin</AddPluginButton>

      {/* Droppable expects a function as its child */}
      <Droppable droppableId="sidebar" type="dropZone">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {plugins.map((plugin, index) => (
              <Draggable key={plugin.id + '-button'} draggableId={plugin.id} index={index}>
                {(provided) => (
                  <PluginBox
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    {plugin.name}
                  </PluginBox>
                )}
              </Draggable>
            ))}
            {/* Placeholder is required to handle spacing during drag and drop */}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      {/* Modal for adding a new plugin */}
      <Modal 
        isOpen={isModalOpen} // Modal visibility controlled by state
        onRequestClose={closeModal} // Close modal on request
        contentLabel="Add New Plugin"
      >
        <InstructionsContainer closeModal={closeModal} />  {/* Render the AddPluginInstructions component inside the modal */}
      </Modal>
    </SidebarContainer>
  );
};

export default Sidebar;
