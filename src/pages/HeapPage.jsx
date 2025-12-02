import React, { useState } from 'react';
import { MinHeap } from '../data-structures/Heap';

const HeapPage = () => {
    // Wrap the heap in an object to ensure state updates are detected
    const [heapContainer, setHeapContainer] = useState({ instance: new MinHeap() });
    const [inputValue, setInputValue] = useState('');

    const heap = heapContainer.instance;

    const handleAdd = () => {
        const value = parseInt(inputValue, 10);
        if (!isNaN(value)) {
            heap.add(value);
            setHeapContainer({ instance: heap }); // Trigger re-render
            setInputValue('');
        }
    };

    const handleRemove = () => {
        heap.remove();
        setHeapContainer({ instance: heap }); // Trigger re-render
    };

    const handleHeapify = () => {
        const array = inputValue.split(',').map(n => parseInt(n.trim(), 10)).filter(n => !isNaN(n));
        heap.buildHeap(array);
        setHeapContainer({ instance: heap }); // Trigger re-render
        setInputValue('');
    };

    // Helper to generate node positions
    const generateNodePositions = (index = 0, x = 600, y = 50, dx = 300, positions = []) => {
        if (index >= heap.heap.length) return positions;

        positions.push({ val: heap.heap[index], x, y, index });

        // Calculate positions for children
        generateNodePositions(2 * index + 1, x - dx, y + 80, dx / 2, positions); // Left child
        generateNodePositions(2 * index + 2, x + dx, y + 80, dx / 2, positions); // Right child

        return positions;
    };

    // Helper to generate edges between nodes
    const generateEdges = (nodes) => {
        const edges = [];
        nodes.forEach(node => {
            const leftChildIndex = 2 * node.index + 1;
            const rightChildIndex = 2 * node.index + 2;

            const leftChild = nodes.find(n => n.index === leftChildIndex);
            if (leftChild) {
                edges.push({
                    x1: node.x, y1: node.y,
                    x2: leftChild.x, y2: leftChild.y,
                    key: `${node.val}-${leftChild.val}-${node.index}-${leftChild.index}`
                });
            }

            const rightChild = nodes.find(n => n.index === rightChildIndex);
            if (rightChild) {
                edges.push({
                    x1: node.x, y1: node.y,
                    x2: rightChild.x, y2: rightChild.y,
                    key: `${node.val}-${rightChild.val}-${node.index}-${rightChild.index}`
                });
            }
        });
        return edges;
    };

    const nodes = generateNodePositions();
    const edges = generateEdges(nodes);

    return (
        <div className="bg-gray-800 min-h-screen flex flex-col items-center py-10 text-white overflow-hidden">
            <h1 className="text-4xl font-bold mb-8">Min Heap</h1>

            {/* Visualization Area */}
            <div className="relative w-full h-[500px] border border-gray-700 bg-gray-900 overflow-auto">
                {/* Layer 1: SVG Lines (Edges) */}
                <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
                    {edges.map(edge => (
                        <line
                            key={edge.key}
                            x1={edge.x1 + 24} y1={edge.y1 + 24} // Center offset
                            x2={edge.x2 + 24} y2={edge.y2 + 24}
                            stroke="white"
                            strokeWidth="2"
                        />
                    ))}
                </svg>

                {/* Layer 2: Nodes */}
                {nodes.map((node) => (
                    <div
                        key={`${node.val}-${node.index}`}
                        className="absolute flex items-center justify-center w-12 h-12 rounded-full bg-green-500 text-white font-bold shadow-lg border-2 border-white transition-all duration-500"
                        style={{ left: node.x, top: node.y }}
                    >
                        {node.val}
                    </div>
                ))}
            </div>

            {/* Controls */}
            <div className="flex space-x-4 mt-8 z-10">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="bg-gray-700 text-white px-4 py-2 rounded border border-gray-600"
                    placeholder="Enter value or comma-separated list"
                />
                <button onClick={handleAdd} className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded transition">
                    Add
                </button>
                <button onClick={handleRemove} className="bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded transition">
                    Remove Min
                </button>
                <button onClick={handleHeapify} className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded transition">
                    Build Heap from Array
                </button>
            </div>
        </div>
    );
};

export default HeapPage;
