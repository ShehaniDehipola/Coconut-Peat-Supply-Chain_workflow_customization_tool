import React, {useState} from 'react';
import ReactFlow, {addEdge, Background, Controls} from 'reactflow';
import 'reactflow/dist/style.css';
import {nodeTypes} from './nodes/NodeTypes';

const FlowchartCanvas = () => {
    const [nodes, setNodes] = useState([
        {
            id: '1',
            type: 'action',
            position: {x: 100, y: 100},
            data: {
                label: 'Action Node',
                size: {width: 120, height: 60}, // Size is part of the data object
            },
        },
    ]);

    const [edges, setEdges] = useState([]);

    // Update node size dynamically
    const updateNode = (id, width, height) => {
        setNodes((prevNodes) =>
            prevNodes.map((node) =>
                node.id === id
                    ? {
                        ...node,
                        data: {
                            ...node.data,
                            size: {width, height}, // Update size inside the data object
                        },
                    }
                    : node
            )
        );
    };

    const onNodesChange = (changes) =>
        setNodes((nds) =>
            nds.map((node) => ({
                ...node,
                data: {
                    ...node.data,
                    size: node.data.size || {width: 120, height: 60}, // Ensure default size
                },
            }))
        );

    const onConnect = (connection) =>
        setEdges((eds) => addEdge({...connection, animated: true}, eds));

    return (
        <div style={{height: '100vh', width: '100%'}}>
            <ReactFlow
                nodes={nodes.map((node) => ({
                    ...node,
                    data: {
                        ...node.data,
                        updateNode, // Pass the update function
                    },
                }))}
                edges={edges}
                onNodesChange={onNodesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
            >
                <Controls/>
                <Background/>
            </ReactFlow>
        </div>
    );
};

export default FlowchartCanvas;
