import React, { useState } from 'react';
import { RedBlackTree, RED } from '../data-structures/RedBlackTree';

const RedBlackTreePage = () => {
    const [treeContainer, setTreeContainer] = useState({ instance: new RedBlackTree() });
    const [inputValue, setInputValue] = useState('');
    const [steps, setSteps] = useState([]);
    const [currentStepIndex, setCurrentStepIndex] = useState(-1);
    const [message, setMessage] = useState('Insert a number to start');

    // Helper: Calculate positions for all nodes
    const generateNodePositions = (node, x, y, dx, positions = []) => {
        if (!node) return positions;
        positions.push({ val: node.value, color: node.color, id: node.id, x, y });
        generateNodePositions(node.left, x - dx, y + 60, dx / 2, positions);
        generateNodePositions(node.right, x + dx, y + 60, dx / 2, positions);
        return positions;
    };

    // Helper: Generate edges
    const generateEdges = (node, x, y, dx, edges = []) => {
        if (!node) return edges;
        if (node.left) {
            edges.push({
                x1: x, y1: y,
                x2: x - dx, y2: y + 60,
                key: `${node.id}-${node.left.id}`
            });
            generateEdges(node.left, x - dx, y + 60, dx / 2, edges);
        }
        if (node.right) {
            edges.push({
                x1: x, y1: y,
                x2: x + dx, y2: y + 60,
                key: `${node.id}-${node.right.id}`
            });
            generateEdges(node.right, x + dx, y + 60, dx / 2, edges);
        }
        return edges;
    };

    const handleInsert = () => {
        const value = parseInt(inputValue, 10);
        if (!isNaN(value)) {
            const newSteps = treeContainer.instance.insert(value);
            setSteps(newSteps);
            setCurrentStepIndex(0);
            setMessage(newSteps[0].message);
            setInputValue('');
        }
    };

    const handleNextStep = () => {
        if (currentStepIndex < steps.length - 1) {
            const nextIndex = currentStepIndex + 1;
            setCurrentStepIndex(nextIndex);
            setMessage(steps[nextIndex].message);
        } else {
            setMessage("Insertion Complete");
            // Update the main tree instance to the final state
            // Actually, the instance is already updated in place, but for React we might want to ensure consistency
            // The snapshots are copies, the main instance is the final state.
            // But while stepping, we want to show the snapshot.
        }
    };

    const handleReset = () => {
        setTreeContainer({ instance: new RedBlackTree() });
        setSteps([]);
        setCurrentStepIndex(-1);
        setMessage('Tree Reset');
    };

    // Determine what to render: current snapshot or final tree (if no steps active)
    let rootToRender = treeContainer.instance.root;
    if (currentStepIndex >= 0 && currentStepIndex < steps.length) {
        rootToRender = steps[currentStepIndex].root;
    }

    const initialDx = 200;
    const startX = 600;
    const startY = 50;

    const nodes = generateNodePositions(rootToRender, startX, startY, initialDx);
    const edges = generateEdges(rootToRender, startX, startY, initialDx);

    return (
        <div className="bg-gray-800 min-h-screen flex flex-col items-center py-10 text-white overflow-hidden">
            <h1 className="text-4xl font-bold mb-4">Red-Black Tree</h1>

            <div className="mb-4 text-xl font-semibold text-yellow-400 h-8">
                {message}
            </div>

            <div className="relative w-full h-[500px] border border-gray-700 bg-gray-900 overflow-auto mb-8">
                <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
                    {edges.map(edge => (
                        <line
                            key={edge.key}
                            x1={edge.x1 + 24} y1={edge.y1 + 24}
                            x2={edge.x2 + 24} y2={edge.y2 + 24}
                            stroke="white"
                            strokeWidth="2"
                        />
                    ))}
                </svg>

                {nodes.map((node) => (
                    <div
                        key={node.id}
                        className={`absolute flex items-center justify-center w-12 h-12 rounded-full text-white font-bold shadow-lg border-2 border-white transition-all duration-500
                            ${node.color === RED ? 'bg-red-600' : 'bg-black'}
                        `}
                        style={{ left: node.x, top: node.y }}
                    >
                        {node.val}
                    </div>
                ))}
            </div>

            <div className="flex space-x-4 z-10">
                <input
                    type="number"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="bg-gray-700 text-white px-4 py-2 rounded border border-gray-600"
                    placeholder="Enter number"
                    disabled={currentStepIndex >= 0 && currentStepIndex < steps.length - 1}
                />
                <button
                    onClick={handleInsert}
                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                    disabled={!inputValue || (currentStepIndex >= 0 && currentStepIndex < steps.length - 1)}
                >
                    Insert
                </button>
                <button
                    onClick={handleNextStep}
                    className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-2 px-4 rounded disabled:opacity-50"
                    disabled={currentStepIndex === -1 || currentStepIndex >= steps.length - 1}
                >
                    Next Step
                </button>
                <button
                    onClick={handleReset}
                    className="bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded"
                >
                    Reset
                </button>
            </div>
        </div>
    );
};

export default RedBlackTreePage;
