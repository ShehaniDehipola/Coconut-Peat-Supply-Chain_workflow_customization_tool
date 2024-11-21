import React, { useState } from 'react';
import styled from 'styled-components';
import AddNewPluginSidebar from './sidebar/AddNewPluginSidebar';
import FlowchartCanvas from './FlowchartCanvas';
import { nodeTypes } from './nodes/NodeTypes';

// Styled components
const AddPluginContainer = styled.div`
  display: flex;
  height: 100vh;
`;

const PropertiesPanel = styled.div`
  width: 250px;
  padding: 20px;
  background-color: #d1e7dd; /* Light green */
  box-sizing: border-box;
`;

const CanvasSection = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #fff;
`;

const AddNewPluginPage = () => {
  const [nodes, setNodes] = useState([]);
  const [pluginName, setPluginName] = useState('');

  // Handle dragging shapes onto the canvas
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const onDrop = (event) => {
    event.preventDefault();
    const nodeType = event.dataTransfer.getData('application/reactflow');
    const position = { x: event.clientX, y: event.clientY };
    const newNode = {
      id: `${nodes.length + 1}`,
      type: nodeType,
      data: { label: `${nodeType.charAt(0).toUpperCase() + nodeType.slice(1)}` },
      position,
    };
    setNodes((prevNodes) => [...prevNodes, newNode]);
  };

  const onDragOver = (event) => event.preventDefault();

  return (
    <AddPluginContainer>
      {/* Sidebar for Dragging Shapes */}
      <AddNewPluginSidebar onDragStart={onDragStart} />

      {/* Flowchart Canvas */}
      <CanvasSection
        onDrop={onDrop}
        onDragOver={onDragOver}
      >
        <FlowchartCanvas nodes={nodes} setNodes={setNodes} nodeTypes={nodeTypes} />
      </CanvasSection>

      {/* Properties Panel */}
      <PropertiesPanel>
        <h4>Plugin Name</h4>
        <input
          type="text"
          value={pluginName}
          onChange={(e) => setPluginName(e.target.value)}
          placeholder="Enter plugin name"
        />
        <h4>Nodes in Canvas</h4>
        {nodes.map((node) => (
          <div key={node.id} style={{ marginBottom: '10px' }}>
            {node.data.label}
          </div>
        ))}
      </PropertiesPanel>
    </AddPluginContainer>
  );
};

export default AddNewPluginPage;
