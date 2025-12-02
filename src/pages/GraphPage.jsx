import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

const GraphPage = () => {
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);
    const [mode, setMode] = useState('add-node'); // 'add-node', 'add-edge', 'bfs', 'dfs'
    const [selectedNode, setSelectedNode] = useState(null);

    // Algorithm State
    const [algoMode, setAlgoMode] = useState(null); // 'bfs' or 'dfs'
    const [visited, setVisited] = useState(new Set());
    const [structure, setStructure] = useState([]); // Queue for BFS, Stack for DFS
    const [traversalOrder, setTraversalOrder] = useState([]);
    const [current, setCurrent] = useState(null);
    const [isFinished, setIsFinished] = useState(false);

    // Generate unique IDs
    const generateId = () => Math.random().toString(36).substr(2, 9);

    const handleCanvasClick = (e) => {
        if (mode === 'add-node') {
            const rect = e.target.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Prevent adding nodes too close to others
            const tooClose = nodes.some(node => Math.hypot(node.x - x, node.y - y) < 40);
            if (!tooClose) {
                setNodes([...nodes, { id: generateId(), x, y, label: nodes.length + 1 }]);
            }
        }
    };

    const handleNodeClick = (e, nodeId) => {
        e.stopPropagation(); // Prevent canvas click

        if (mode === 'add-edge') {
            if (selectedNode === null) {
                setSelectedNode(nodeId);
            } else {
                if (selectedNode !== nodeId) {
                    // Add edge if not exists
                    const exists = edges.some(edge =>
                        (edge.source === selectedNode && edge.target === nodeId) ||
                        (edge.source === nodeId && edge.target === selectedNode)
                    );

                    if (!exists) {
                        setEdges([...edges, { source: selectedNode, target: nodeId }]);
                    }
                }
                setSelectedNode(null);
            }
        } else if (mode === 'bfs' || mode === 'dfs') {
            // Start algorithm
            if (mode === 'bfs') startBFS(nodeId);
            else startDFS(nodeId);
        }
    };

    const startBFS = (startNodeId) => {
        setAlgoMode('bfs');
        setVisited(new Set([startNodeId]));
        setStructure([startNodeId]);
        setTraversalOrder([]);
        setCurrent(null);
        setIsFinished(false);
    };

    const startDFS = (startNodeId) => {
        setAlgoMode('dfs');
        setVisited(new Set()); // DFS marks visited on pop usually, or push. Let's do iterative DFS: push start.
        setStructure([startNodeId]);
        setTraversalOrder([]);
        setCurrent(null);
        setIsFinished(false);
    };

    const nextStep = () => {
        if (structure.length === 0) {
            setIsFinished(true);
            setCurrent(null);
            return;
        }

        const newStructure = [...structure];
        let node = null;

        if (algoMode === 'bfs') {
            // Dequeue
            node = newStructure.shift();
            setCurrent(node);
            setTraversalOrder(prev => [...prev, node]);

            // Find neighbors
            const neighbors = edges
                .filter(e => e.source === node || e.target === node)
                .map(e => e.source === node ? e.target : e.source);

            // Sort neighbors by label for consistent order (optional but good for visualization)
            neighbors.sort((a, b) => {
                const nodeA = nodes.find(n => n.id === a);
                const nodeB = nodes.find(n => n.id === b);
                return (nodeA?.label || 0) - (nodeB?.label || 0);
            });

            for (const neighbor of neighbors) {
                if (!visited.has(neighbor)) {
                    setVisited(prev => {
                        const newVisited = new Set(prev);
                        newVisited.add(neighbor);
                        return newVisited;
                    });
                    newStructure.push(neighbor);
                }
            }
        } else if (algoMode === 'dfs') {
            // Pop
            node = newStructure.pop();

            // If already visited (can happen in stack DFS), skip or just process next
            // Standard iterative DFS:
            // Pop u
            // If u not visited:
            //   Visit u
            //   Push neighbors

            if (visited.has(node)) {
                // If top of stack is visited, just remove it and recurse (call nextStep again effectively, or just return to let user click again)
                // To make it smoother, let's find the next unvisited node in this step if possible, or just show this step as "popping visited node"
                setStructure(newStructure);
                setCurrent(node); // Show we are looking at it
                // But don't add to traversal order
                return;
            }

            setCurrent(node);
            setVisited(prev => {
                const newVisited = new Set(prev);
                newVisited.add(node);
                return newVisited;
            });
            setTraversalOrder(prev => [...prev, node]);

            const neighbors = edges
                .filter(e => e.source === node || e.target === node)
                .map(e => e.source === node ? e.target : e.source);

            // Sort neighbors reverse for Stack to visit in natural order
            neighbors.sort((a, b) => {
                const nodeA = nodes.find(n => n.id === a);
                const nodeB = nodes.find(n => n.id === b);
                return (nodeB?.label || 0) - (nodeA?.label || 0);
            });

            for (const neighbor of neighbors) {
                if (!visited.has(neighbor)) {
                    newStructure.push(neighbor);
                }
            }
        }

        setStructure(newStructure);
        if (newStructure.length === 0) {
            setIsFinished(true);
        }
    };

    const resetTraversal = () => {
        setVisited(new Set());
        setCurrent(null);
        setStructure([]);
        setTraversalOrder([]);
        setIsFinished(false);
        setAlgoMode(null);
        // Keep mode as is, or reset to add-node? Let's keep it to allow re-running easily
    };

    const resetGraph = () => {
        setNodes([]);
        setEdges([]);
        resetTraversal();
        setMode('add-node');
    };

    const getStructureDisplay = () => {
        return structure.map(id => nodes.find(n => n.id === id)?.label).join(', ');
    };

    const getTraversalDisplay = () => {
        return traversalOrder.map(id => nodes.find(n => n.id === id)?.label).join(' → ');
    };

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-900 text-white p-4">
            <h1 className="text-3xl font-bold mb-4">Graph Algorithms</h1>

            <div className="flex space-x-4 mb-4">
                <button
                    className={`px-4 py-2 rounded ${mode === 'add-node' ? 'bg-blue-600' : 'bg-gray-700'}`}
                    onClick={() => { setMode('add-node'); setAlgoMode(null); }}
                    disabled={algoMode !== null}
                >
                    Add Node
                </button>
                <button
                    className={`px-4 py-2 rounded ${mode === 'add-edge' ? 'bg-blue-600' : 'bg-gray-700'}`}
                    onClick={() => { setMode('add-edge'); setSelectedNode(null); setAlgoMode(null); }}
                    disabled={algoMode !== null}
                >
                    Add Edge
                </button>
                <div className="w-px bg-gray-600 mx-2"></div>
                <button
                    className={`px-4 py-2 rounded ${mode === 'bfs' ? 'bg-green-600' : 'bg-gray-700'}`}
                    onClick={() => { setMode('bfs'); setAlgoMode(null); }}
                    disabled={algoMode !== null}
                >
                    Run BFS
                </button>
                <button
                    className={`px-4 py-2 rounded ${mode === 'dfs' ? 'bg-purple-600' : 'bg-gray-700'}`}
                    onClick={() => { setMode('dfs'); setAlgoMode(null); }}
                    disabled={algoMode !== null}
                >
                    Run DFS
                </button>
                <div className="w-px bg-gray-600 mx-2"></div>
                <button
                    className="px-4 py-2 rounded bg-orange-600 hover:bg-orange-700"
                    onClick={resetTraversal}
                >
                    Reset Traversal
                </button>
                <button
                    className="px-4 py-2 rounded bg-red-600 hover:bg-red-700"
                    onClick={resetGraph}
                >
                    Reset Everything
                </button>
            </div>

            {algoMode && (
                <div className="flex space-x-4 mb-4">
                    <button
                        className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded"
                        onClick={nextStep}
                        disabled={isFinished || structure.length === 0}
                    >
                        Next Step
                    </button>
                </div>
            )}

            <div className="flex space-x-8 mb-4 w-full max-w-4xl">
                <div className="flex-1 bg-gray-800 p-4 rounded">
                    <h3 className="font-bold text-gray-400 mb-2">
                        {algoMode === 'bfs' ? 'Queue' : algoMode === 'dfs' ? 'Stack' : 'Data Structure'}
                    </h3>
                    <div className="font-mono text-lg overflow-x-auto whitespace-nowrap">
                        [{getStructureDisplay()}]
                    </div>
                </div>
                <div className="flex-1 bg-gray-800 p-4 rounded">
                    <h3 className="font-bold text-gray-400 mb-2">Traversal Sequence</h3>
                    <div className="font-mono text-lg overflow-x-auto whitespace-nowrap">
                        {getTraversalDisplay()}
                    </div>
                </div>
            </div>

            <div className="mb-2 text-gray-300">
                {mode === 'add-node' && !algoMode && "Click on canvas to add nodes."}
                {mode === 'add-edge' && !algoMode && "Click two nodes to connect them."}
                {(mode === 'bfs' || mode === 'dfs') && !algoMode && "Click a start node to begin traversal."}
                {algoMode && "Click 'Next Step' to advance the algorithm."}
            </div>

            <div
                className="relative bg-gray-800 rounded-lg shadow-xl overflow-hidden cursor-crosshair"
                style={{ width: '800px', height: '600px' }}
                onClick={handleCanvasClick}
            >
                <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
                    {edges.map((edge, idx) => {
                        const source = nodes.find(n => n.id === edge.source);
                        const target = nodes.find(n => n.id === edge.target);
                        if (!source || !target) return null;
                        return (
                            <line
                                key={idx}
                                x1={source.x} y1={source.y}
                                x2={target.x} y2={target.y}
                                stroke="#4B5563"
                                strokeWidth="2"
                            />
                        );
                    })}
                </svg>

                {nodes.map(node => (
                    <motion.div
                        key={node.id}
                        className={`absolute flex items-center justify-center w-10 h-10 rounded-full border-2 font-bold cursor-pointer transition-colors
                            ${current === node.id ? 'bg-yellow-500 border-yellow-300 text-black scale-110' :
                                visited.has(node.id) ? 'bg-green-500 border-green-300' :
                                    selectedNode === node.id ? 'bg-blue-500 border-blue-300' :
                                        structure.includes(node.id) ? 'bg-purple-500 border-purple-300' : // Highlight nodes in queue/stack
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

export default GraphPage;
