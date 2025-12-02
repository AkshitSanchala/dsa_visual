import React, { useState } from 'react';
import { motion } from 'framer-motion';

const TopologicalSortPage = () => {
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]); // { source, target, id }
    const [mode, setMode] = useState('add-node'); // 'add-node', 'add-edge', 'run'
    const [selectedNode, setSelectedNode] = useState(null);

    // Algo State
    const [inDegrees, setInDegrees] = useState({});
    const [queue, setQueue] = useState([]);
    const [sortedOrder, setSortedOrder] = useState([]);
    const [message, setMessage] = useState('Draw a Directed Graph (DAG) to start');
    const [isFinished, setIsFinished] = useState(false);
    const [processedCount, setProcessedCount] = useState(0);

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
                        (edge.source === selectedNode && edge.target === nodeId)
                    );

                    if (!exists) {
                        setEdges([...edges, {
                            source: selectedNode,
                            target: nodeId,
                            id: generateId()
                        }]);
                    }
                }
                setSelectedNode(null);
            }
        }
    };

    const startKahn = () => {
        // Calculate in-degrees
        const degrees = {};
        nodes.forEach(node => degrees[node.id] = 0);
        edges.forEach(edge => {
            degrees[edge.target] = (degrees[edge.target] || 0) + 1;
        });

        setInDegrees(degrees);

        // Initialize queue with 0 in-degree nodes
        const initialQueue = nodes.filter(node => degrees[node.id] === 0).map(n => n.id);

        // Sort initial queue by label for consistency
        initialQueue.sort((a, b) => {
            const nodeA = nodes.find(n => n.id === a);
            const nodeB = nodes.find(n => n.id === b);
            return (nodeA?.label || 0) - (nodeB?.label || 0);
        });

        setQueue(initialQueue);
        setSortedOrder([]);
        setProcessedCount(0);
        setIsFinished(false);

        if (initialQueue.length === 0 && nodes.length > 0) {
            setMessage("Cycle Detected! No nodes with 0 in-degree.");
            setIsFinished(true);
        } else {
            setMessage("Started Kahn's Algorithm. Queue has 0-in-degree nodes.");
        }
    };

    const nextStep = () => {
        if (queue.length === 0) {
            if (processedCount < nodes.length) {
                setMessage("Cycle Detected! Queue empty but nodes remain.");
            } else {
                setMessage("Topological Sort Complete");
            }
            setIsFinished(true);
            return;
        }

        const newQueue = [...queue];
        const nodeId = newQueue.shift(); // Dequeue

        setSortedOrder(prev => [...prev, nodeId]);
        setProcessedCount(prev => prev + 1);

        // Process neighbors
        const neighbors = edges.filter(e => e.source === nodeId).map(e => e.target);
        const newInDegrees = { ...inDegrees };

        let addedToQueue = [];

        neighbors.forEach(neighborId => {
            newInDegrees[neighborId]--;
            if (newInDegrees[neighborId] === 0) {
                newQueue.push(neighborId);
                addedToQueue.push(neighborId);
            }
        });

        // Sort queue again if needed, but standard queue order is fine

        setInDegrees(newInDegrees);
        setQueue(newQueue);

        const nodeLabel = nodes.find(n => n.id === nodeId)?.label;
        setMessage(`Processed Node ${nodeLabel}. Added ${addedToQueue.length} neighbors to queue.`);

        if (newQueue.length === 0 && processedCount + 1 === nodes.length) {
            setMessage("Topological Sort Complete");
            setIsFinished(true);
        }
    };

    const reset = () => {
        setNodes([]);
        setEdges([]);
        setInDegrees({});
        setQueue([]);
        setSortedOrder([]);
        setMode('add-node');
        setMessage('Draw a Directed Graph (DAG) to start');
        setIsFinished(false);
        setProcessedCount(0);
    };

    const resetAlgo = () => {
        setInDegrees({});
        setQueue([]);
        setSortedOrder([]);
        setMessage('Click Run to start');
        setIsFinished(false);
        setProcessedCount(0);
    };

    const getQueueDisplay = () => {
        return queue.map(id => nodes.find(n => n.id === id)?.label).join(', ');
    };

    const getSortedDisplay = () => {
        return sortedOrder.map(id => nodes.find(n => n.id === id)?.label).join(' → ');
    };

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-900 text-white p-4">
            <h1 className="text-3xl font-bold mb-4">Topological Sort (Kahn's)</h1>

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
                    Add Edge (Directed)
                </button>
                <div className="w-px bg-gray-600 mx-2"></div>
                <button
                    className={`px-4 py-2 rounded ${mode === 'run' ? 'bg-green-600' : 'bg-gray-700'}`}
                    onClick={() => { setMode('run'); startKahn(); }}
                >
                    Run Kahn's
                </button>
                <button
                    className="px-4 py-2 rounded bg-red-600 hover:bg-red-700"
                    onClick={reset}
                >
                    Reset
                </button>
            </div>

            {mode === 'run' && (
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

            <div className="flex space-x-8 mb-4 w-full max-w-4xl">
                <div className="flex-1 bg-gray-800 p-4 rounded">
                    <h3 className="font-bold text-gray-400 mb-2">Queue (0 In-Degree)</h3>
                    <div className="font-mono text-lg overflow-x-auto whitespace-nowrap">
                        [{getQueueDisplay()}]
                    </div>
                </div>
                <div className="flex-1 bg-gray-800 p-4 rounded">
                    <h3 className="font-bold text-gray-400 mb-2">Sorted Order</h3>
                    <div className="font-mono text-lg overflow-x-auto whitespace-nowrap">
                        {getSortedDisplay()}
                    </div>
                </div>
            </div>

            <div className="mb-2 text-xl text-yellow-400 font-semibold h-8">
                {message}
            </div>

            <div
                className="relative bg-gray-800 rounded-lg shadow-xl overflow-hidden cursor-crosshair"
                style={{ width: '800px', height: '600px' }}
                onClick={handleCanvasClick}
            >
                <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
                    <defs>
                        <marker id="arrowhead" markerWidth="10" markerHeight="7"
                            refX="28" refY="3.5" orient="auto">
                            <polygon points="0 0, 10 3.5, 0 7" fill="#4B5563" />
                        </marker>
                        <marker id="arrowhead-green" markerWidth="10" markerHeight="7"
                            refX="28" refY="3.5" orient="auto">
                            <polygon points="0 0, 10 3.5, 0 7" fill="#10B981" />
                        </marker>
                    </defs>
                    {edges.map((edge) => {
                        const source = nodes.find(n => n.id === edge.source);
                        const target = nodes.find(n => n.id === edge.target);
                        if (!source || !target) return null;

                        // Highlight edge if source is processed
                        const isProcessed = sortedOrder.includes(edge.source);

                        return (
                            <line
                                key={edge.id}
                                x1={source.x} y1={source.y}
                                x2={target.x} y2={target.y}
                                stroke={isProcessed ? "#10B981" : "#4B5563"}
                                strokeWidth="2"
                                markerEnd={isProcessed ? "url(#arrowhead-green)" : "url(#arrowhead)"}
                            />
                        );
                    })}
                </svg>

                {nodes.map(node => (
                    <motion.div
                        key={node.id}
                        className={`absolute flex items-center justify-center w-10 h-10 rounded-full border-2 font-bold cursor-pointer transition-colors
                            ${sortedOrder.includes(node.id) ? 'bg-green-500 border-green-300' :
                                queue.includes(node.id) ? 'bg-purple-500 border-purple-300' :
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
                        {mode === 'run' && (
                            <div className="absolute -top-6 text-xs bg-black px-1 rounded text-white">
                                In: {inDegrees[node.id] !== undefined ? inDegrees[node.id] : '?'}
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default TopologicalSortPage;
