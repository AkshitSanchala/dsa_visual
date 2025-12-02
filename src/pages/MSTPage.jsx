import React, { useState } from 'react';
import { motion } from 'framer-motion';

const MSTPage = () => {
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]); // { source, target, weight, id }
    const [mode, setMode] = useState('add-node'); // 'add-node', 'add-edge', 'run'
    const [selectedNode, setSelectedNode] = useState(null);

    // MST State
    const [mstEdges, setMstEdges] = useState([]);
    const [mstNodes, setMstNodes] = useState(new Set());
    const [candidates, setCandidates] = useState([]); // Potential edges to add
    const [message, setMessage] = useState('Draw a graph to start');
    const [isFinished, setIsFinished] = useState(false);

    const generateId = () => Math.random().toString(36).substr(2, 9);

    const handleCanvasClick = (e) => {
        if (mode === 'add-node') {
            const rect = e.target.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const tooClose = nodes.some(node => Math.hypot(node.x - x, node.y - y) < 40);
            if (!tooClose) {
                setNodes([...nodes, { id: generateId(), x, y, label: nodes.length + 1 }]);
            }
        }
    };

    const handleNodeClick = (e, nodeId) => {
        e.stopPropagation();

        if (mode === 'add-edge') {
            if (selectedNode === null) {
                setSelectedNode(nodeId);
            } else {
                if (selectedNode !== nodeId) {
                    const exists = edges.some(edge =>
                        (edge.source === selectedNode && edge.target === nodeId) ||
                        (edge.source === nodeId && edge.target === selectedNode)
                    );

                    if (!exists) {
                        const weightStr = window.prompt("Enter edge weight:", "1");
                        const weight = parseInt(weightStr, 10);
                        if (!isNaN(weight)) {
                            setEdges([...edges, {
                                source: selectedNode,
                                target: nodeId,
                                weight,
                                id: generateId()
                            }]);
                        }
                    }
                }
                setSelectedNode(null);
            }
        } else if (mode === 'run' && mstNodes.size === 0) {
            // Start Prim's from this node
            startPrim(nodeId);
        }
    };

    const startPrim = (startNodeId) => {
        setMstNodes(new Set([startNodeId]));
        setMstEdges([]);
        setIsFinished(false);

        // Find initial candidates
        updateCandidates(new Set([startNodeId]), edges);
        setMessage("Started Prim's Algorithm. Click Next Step.");
    };

    const updateCandidates = (visited, currentEdges) => {
        // Find all edges connecting a visited node to an unvisited node
        const newCandidates = currentEdges.filter(edge => {
            const sourceVisited = visited.has(edge.source);
            const targetVisited = visited.has(edge.target);
            return (sourceVisited && !targetVisited) || (!sourceVisited && targetVisited);
        });

        // Sort by weight
        newCandidates.sort((a, b) => a.weight - b.weight);
        setCandidates(newCandidates);
    };

    const nextStep = () => {
        if (candidates.length === 0) {
            if (mstNodes.size < nodes.length && nodes.length > 0) {
                setMessage("MST Complete (or Graph Disconnected)");
            } else {
                setMessage("MST Complete");
            }
            setIsFinished(true);
            return;
        }

        // Pick the best edge (lowest weight)
        const bestEdge = candidates[0];

        // Determine which node is new
        const newNodeId = mstNodes.has(bestEdge.source) ? bestEdge.target : bestEdge.source;

        // Add to MST
        setMstEdges([...mstEdges, bestEdge]);
        const newMstNodes = new Set(mstNodes);
        newMstNodes.add(newNodeId);
        setMstNodes(newMstNodes);

        setMessage(`Added edge with weight ${bestEdge.weight}`);

        // Update candidates
        updateCandidates(newMstNodes, edges);
    };

    const reset = () => {
        setNodes([]);
        setEdges([]);
        setMstEdges([]);
        setMstNodes(new Set());
        setCandidates([]);
        setMode('add-node');
        setMessage('Draw a graph to start');
        setIsFinished(false);
    };

    const resetAlgo = () => {
        setMstEdges([]);
        setMstNodes(new Set());
        setCandidates([]);
        setMessage('Select a start node to run Prim\'s');
        setIsFinished(false);
    };

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-900 text-white p-4">
            <h1 className="text-3xl font-bold mb-4">Minimum Spanning Tree (Prim's)</h1>

            <div className="flex space-x-4 mb-4">
                <button
                    className={`px-4 py-2 rounded ${mode === 'add-node' ? 'bg-blue-600' : 'bg-gray-700'}`}
                    onClick={() => { setMode('add-node'); resetAlgo(); }}
                >
                    Add Node
                </button>
                <button
                    className={`px-4 py-2 rounded ${mode === 'add-edge' ? 'bg-blue-600' : 'bg-gray-700'}`}
                    onClick={() => { setMode('add-edge'); setSelectedNode(null); resetAlgo(); }}
                >
                    Add Edge
                </button>
                <div className="w-px bg-gray-600 mx-2"></div>
                <button
                    className={`px-4 py-2 rounded ${mode === 'run' ? 'bg-green-600' : 'bg-gray-700'}`}
                    onClick={() => { setMode('run'); resetAlgo(); }}
                >
                    Run Prim's
                </button>
                <button
                    className="px-4 py-2 rounded bg-red-600 hover:bg-red-700"
                    onClick={reset}
                >
                    Reset
                </button>
            </div>

            {mode === 'run' && mstNodes.size > 0 && (
                <div className="flex space-x-4 mb-4">
                    <button
                        className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded"
                        onClick={nextStep}
                        disabled={isFinished}
                    >
                        Next Step
                    </button>
                </div>
            )}

            <div className="mb-2 text-xl text-yellow-400 font-semibold h-8">
                {message}
            </div>

            <div
                className="relative bg-gray-800 rounded-lg shadow-xl overflow-hidden cursor-crosshair"
                style={{ width: '800px', height: '600px' }}
                onClick={handleCanvasClick}
            >
                <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
                    {edges.map((edge) => {
                        const source = nodes.find(n => n.id === edge.source);
                        const target = nodes.find(n => n.id === edge.target);
                        if (!source || !target) return null;

                        const isMst = mstEdges.some(e => e.id === edge.id);

                        return (
                            <g key={edge.id}>
                                <line
                                    x1={source.x} y1={source.y}
                                    x2={target.x} y2={target.y}
                                    stroke={isMst ? "#10B981" : "#4B5563"}
                                    strokeWidth={isMst ? "4" : "2"}
                                />
                                <text
                                    x={(source.x + target.x) / 2}
                                    y={(source.y + target.y) / 2 - 10}
                                    fill={isMst ? "#10B981" : "#9CA3AF"}
                                    className="text-sm font-bold"
                                    textAnchor="middle"
                                >
                                    {edge.weight}
                                </text>
                            </g>
                        );
                    })}
                </svg>

                {nodes.map(node => (
                    <motion.div
                        key={node.id}
                        className={`absolute flex items-center justify-center w-10 h-10 rounded-full border-2 font-bold cursor-pointer transition-colors
                            ${mstNodes.has(node.id) ? 'bg-green-500 border-green-300' :
                                selectedNode === node.id ? 'bg-blue-500 border-blue-300' :
                                    'bg-gray-700 border-gray-500'}
                        `}
                        style={{
                            left: node.x - 20,
                            top: node.y - 20,
                        }}
                        onClick={(e) => handleNodeClick(e, node.id)}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                    >
                        {node.label}
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default MSTPage;
