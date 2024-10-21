import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import styled from 'styled-components';

// Sidebar container styling
const SidebarContainer = styled.div`
  width: 200px;
  padding: 10px;
  background-color: #f4f4f4;
`;

const PluginBox = styled.div`
  padding: 10px;
  margin-bottom: 10px;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
`;

// Sidebar component for draggable items
const Sidebar = ({ plugins }) => (
  <Droppable droppableId="1" isDropDisabled={true}>
    {(provided) => (
      <SidebarContainer {...provided.droppableProps} ref={provided.innerRef}>
        <h3>Plugins</h3>
        {plugins.map((plugin, index) => (
          <Draggable key={plugin.id} draggableId={plugin.id} index={index}>
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
        {provided.placeholder}
      </SidebarContainer>
    )}
  </Droppable>
);

export default Sidebar;
