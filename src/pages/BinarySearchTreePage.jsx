import React, { useState } from 'react';
import { BST } from '../data-structures/BST'; // Keep your existing import
// We don't need TreeNode anymore, we will render it directly here for layout control

const BinarySearchTreePage = () => {
    // 1. We wrap the tree in an object to force React to see updates
    const [treeContainer, setTreeContainer] = useState({ instance: new BST() });
    const [inputValue, setInputValue] = useState('');
    const [rotateValue, setRotateValue] = useState('');

    const tree = treeContainer.instance;

    const handleAdd = () => {
        const value = parseInt(inputValue, 10);
        if (!isNaN(value)) {
            tree.add(value);
            // 2. Create a NEW object reference to trigger React re-render properly
            setTreeContainer({ instance: tree });
            setInputValue('');
        }
    };

    // Helper: Calculate positions for all nodes first
    const generateNodePositions = (node, x, y, dx, positions = []) => {
        if (!node) return positions;

        // Store this node's position
        positions.push({ val: node.value, x, y });

        // Recursively calculate children
        generateNodePositions(node.left, x - dx, y + 60, dx / 2, positions);
        generateNodePositions(node.right, x + dx, y + 60, dx / 2, positions);

        return positions;
    };

    // Helper: Generate the lines (edges) between nodes
    const generateEdges = (node, x, y, dx, edges = []) => {
        if (!node) return edges;

        if (node.left) {
            edges.push({
                x1: x, y1: y,
                x2: x - dx, y2: y + 60,
                key: `${node.value}-${node.left.value}`
            });
            generateEdges(node.left, x - dx, y + 60, dx / 2, edges);
        }

        if (node.right) {
            edges.push({
                x1: x, y1: y,
                x2: x + dx, y2: y + 60,
                key: `${node.value}-${node.right.value}`
            });
            generateEdges(node.right, x + dx, y + 60, dx / 2, edges);
        }
        return edges;
    };

    const initialDx = 200; // Horizontal spacing
    const startX = 600;    // Center of screen (approx)
    const startY = 50;

    const nodes = generateNodePositions(tree.root, startX, startY, initialDx);
    const edges = generateEdges(tree.root, startX, startY, initialDx);

    return (
        <div className="bg-gray-800 min-h-screen flex flex-col items-center py-10 text-white overflow-hidden">
            <h1 className="text-4xl font-bold mb-8">Binary Search Tree</h1>

            {/* Tree Visualization Area */}
            <div className="relative w-full h-[500px] border border-gray-700 bg-gray-900 overflow-auto">

                {/* Layer 1: SVG Lines (Edges) - Drawn BEHIND nodes */}
                <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
                    {edges.map(edge => (
                        <line
                            key={edge.key}
                            x1={edge.x1 + 24} y1={edge.y1 + 24} // +24 to center in the 48px node
                            x2={edge.x2 + 24} y2={edge.y2 + 24}
                            stroke="white"
                            strokeWidth="2"
                        />
                    ))}
                </svg>

                {/* Layer 2: Nodes */}
                {nodes.map((node) => (
                    <div
                        key={node.val}
                        className="absolute flex items-center justify-center w-12 h-12 rounded-full bg-cyan-500 text-white font-bold shadow-lg border-2 border-white transition-all duration-500"
                        style={{ left: node.x, top: node.y }}
                    >
                        {node.val}
                    </div>
                ))}
            </div>

            {/* Controls */}
            <div className="flex space-x-4 mt-8 z-10">
                <input
                    type="number"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="bg-gray-700 text-white px-4 py-2 rounded border border-gray-600"
                    placeholder="Enter number to add"
                />
                <button onClick={handleAdd} className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded transition">
                    Add Node
                </button>
                <input
                    type="number"
                    value={rotateValue}
                    onChange={(e) => setRotateValue(e.target.value)}
                    className="bg-gray-700 text-white px-4 py-2 rounded border border-gray-600"
                    placeholder="Enter node to rotate"
                />
                <button onClick={() => { tree.rotateLeft(parseInt(rotateValue, 10)); setTreeContainer({ instance: tree }); }} className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded transition">
                    Rotate Left
                </button>
                <button onClick={() => { tree.rotateRight(parseInt(rotateValue, 10)); setTreeContainer({ instance: tree }); }} className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded transition" >
                    Rotate Right
                </button>
                <button onClick={() => { tree.balance(); setTreeContainer({ instance: tree }); }} className="bg-green-600 hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded transition">
                    Balance Tree
                </button>
            </div>
        </div>
    );
};

export default BinarySearchTreePage;
