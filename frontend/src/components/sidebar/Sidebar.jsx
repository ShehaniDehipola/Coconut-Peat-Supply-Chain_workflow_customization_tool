// Sidebar.js

import React, { useState } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import styled from 'styled-components';
import Modal from 'react-modal';
import FlowchartCanvas from '../FlowchartCanvas';
import InstructionsContainer from '../parser/InstructionsContainer';
import { nodeTypes } from '../nodes/NodeTypes';
import { useNavigate } from 'react-router-dom';

// Sidebar container styling
const SidebarContainer = styled.div`
  width: 200px;
  padding: 10px;
  background-color: #d3d2d0;
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

const ModalContent = styled.div`
  display: flex;
  flex-direction: row;
  height: 80vh;
  width: 100%;
`;

const PropertiesPanel = styled.div`
  width: 200px;
  padding: 20px;
  background-color: #d1e7dd; /* Light green background */
  box-sizing: border-box;
`;

const CanvasSection = styled.div`
  flex-grow: 1;
  padding: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #fff; /* White background for canvas */
`;

const RightPanel = styled.div`
  width: 300px;
  background-color: #f8d7da; /* Light red background for distinction */
  padding: 10px;
  overflow-y: auto;
  box-sizing: border-box;
`;

const Sidebar = ({ plugins }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pluginName, setPluginName] = useState('');
  const [selectedNode, setSelectedNode] = useState(null);
  const [nodes, setNodes] = useState([]);
  const navigate = useNavigate();

  const availableNodes = [
    { type: "action", label: "Action" },
    { type: "wait", label: "Wait" },
    { type: "check", label: "Check" },
  ];

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setPluginName('');
    setSelectedNode(null);
  };

  const handleAddNode = (type, label) => {
    const newNode = {
      id: `${nodes.length + 1}`,
      type: type,
      data: { label: label },
      position: { x: Math.random() * 400, y: Math.random() * 400 },
    };
    setNodes((prevNodes) => [...prevNodes, newNode]);
  };

  const handleSelectNode = (nodeId) => {
    const node = nodes.find((n) => n.id === nodeId);
    setSelectedNode(node);
  };

  const handleNodeChange = (key, value) => {
    setNodes((nds) =>
      nds.map((node) => (node.id === selectedNode.id ? { ...node, data: { ...node.data, [key]: value } } : node))
    );
    setSelectedNode((node) => ({ ...node, data: { ...node.data, [key]: value } }));
  };

  return (
    <SidebarContainer>
      <h3>Plugins</h3>

      {/* Add Plugin Button */}
      <AddPluginButton onClick={() => navigate('/add-plugin')}>Add Plugin</AddPluginButton>

      {/* Droppable for draggable plugins */}
      <Droppable droppableId="sidebar" type="dropZone">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
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
          </div>
        )}
      </Droppable>

      {/* Modal for InstructionsContainer */}
      <Modal 
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Add New Plugin"
        style={{ content: { width: '90%', margin: 'auto' } }}
      >
        <ModalContent>
          {/* Left Panel: Properties Panel */}
          <PropertiesPanel>
            <h4>Plugin Properties</h4>
            <label>
              Plugin Name:
              <input 
                type="text" 
                value={pluginName} 
                onChange={(e) => setPluginName(e.target.value)} 
                placeholder="Enter plugin name" 
              />
            </label>

            {/* Display available nodes in the modal */}
            <h4>Available Nodes</h4>
            {availableNodes.map((node) => (
              <div key={node.type} onClick={() => handleAddNode(node.type, node.label)} style={{ cursor: 'pointer', marginBottom: '5px' }}>
                {node.label}
              </div>
            ))}

            {/* Display list of nodes in the properties panel */}
            <h4>Nodes in Canvas</h4>
            {nodes.map((node) => (
              <div key={node.id} onClick={() => handleSelectNode(node.id)} style={{ cursor: 'pointer', marginBottom: '5px' }}>
                {node.data.label}
              </div>
            ))}

            {/* Display editable fields for the selected node */}
            {selectedNode && (
              <>
                <h4>Edit Node: {selectedNode.data.label}</h4>
                <label>
                  Label:
                  <input
                    type="text"
                    value={selectedNode.data.label}
                    onChange={(e) => handleNodeChange('label', e.target.value)}
                  />
                </label>
              </>
            )}
          </PropertiesPanel>

          {/* Center Panel: Flowchart Canvas */}
          <CanvasSection>
            <FlowchartCanvas nodes={nodes} setNodes={setNodes} nodeTypes={nodeTypes} />
          </CanvasSection>

          {/* Right Panel: Instructions and Go Code Preview */}
          <RightPanel>
            <InstructionsContainer pluginName={pluginName} nodes={nodes} />
          </RightPanel>
        </ModalContent>
      </Modal>
    </SidebarContainer>
  );
};

export default Sidebar;
