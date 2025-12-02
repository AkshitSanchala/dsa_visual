import React, { useState, useEffect } from 'react';
import { MinHeap } from '../data-structures/Heap';

const HeapPage = () => {
    const [heapContainer, setHeapContainer] = useState({ instance: new MinHeap() });
    const [inputValue, setInputValue] = useState('');

    // Animation State
    const [snapshots, setSnapshots] = useState([]);
    const [currentStep, setCurrentStep] = useState(-1);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(500);
    const [message, setMessage] = useState('Add numbers to the heap');

    // ✅ Logic State: Tracks if the heap needs fixing before next insert
    const [isDirty, setIsDirty] = useState(false);

    const heap = heapContainer.instance;

    useEffect(() => {
        let interval;
        if (isPlaying && currentStep < snapshots.length - 1) {
            interval = setInterval(() => {
                setCurrentStep(prev => prev + 1);
            }, speed);
        } else if (currentStep >= snapshots.length - 1 && isPlaying) {
            setIsPlaying(false);
            setMessage('Operation Complete');
        }
        return () => clearInterval(interval);
    }, [isPlaying, currentStep, snapshots, speed]);

    // Update message based on current step
    useEffect(() => {
        if (currentStep >= 0 && currentStep < snapshots.length) {
            setMessage(snapshots[currentStep].message);
        }
    }, [currentStep, snapshots]);

    const handleAdd = () => {
        const value = parseInt(inputValue, 10);
        if (!isNaN(value)) {
            heap.insertRaw(value);
            setHeapContainer({ instance: heap });
            setInputValue('');
            setMessage(`Added ${value}. Click Heapify to restore heap property.`);
            // Reset animation state
            setSnapshots([]);
            setCurrentStep(-1);
            setIsDirty(true); // ✅ Flag that heap is dirty
        }
    };

    const handleHeapify = () => {
        const newSnapshots = heap.heapifyUpAnimated();
        if (newSnapshots.length > 0) {
            setSnapshots(newSnapshots);
            setCurrentStep(0);
            setIsPlaying(true);
            setIsDirty(false); // ✅ Heap is being fixed
        } else {
            setMessage("Heap property is already satisfied.");
            setIsDirty(false);
        }
    };

    const handleRemove = () => {
        // You cannot remove if the heap is dirty (structure invalid)
        if (isDirty) {
            setMessage("Please Heapify first before removing.");
            return;
        }

        const newSnapshots = heap.removeAnimated();
        if (newSnapshots.length > 0) {
            setSnapshots(newSnapshots);
            setCurrentStep(0);
            setIsPlaying(true);
        } else {
            setMessage("Heap is empty.");
        }
    };

    // Determine what to render
    let currentHeapArray = heap.heap;
    let highlights = [];

    if (currentStep >= 0 && currentStep < snapshots.length) {
        currentHeapArray = snapshots[currentStep].heap;
        highlights = snapshots[currentStep].highlights || [];
    }

    // Helper to generate node positions based on the CURRENT array state
    const generateNodePositions = (index = 0, x = 600, y = 50, dx = 300, positions = []) => {
        if (index >= currentHeapArray.length) return positions;

        positions.push({ val: currentHeapArray[index], x, y, index });

        generateNodePositions(2 * index + 1, x - dx, y + 80, dx / 2, positions); // Left child
        generateNodePositions(2 * index + 2, x + dx, y + 80, dx / 2, positions); // Right child

        return positions;
    };

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
                    key: `${node.index}-${leftChild.index}`
                });
            }

            const rightChild = nodes.find(n => n.index === rightChildIndex);
            if (rightChild) {
                edges.push({
                    x1: node.x, y1: node.y,
                    x2: rightChild.x, y2: rightChild.y,
                    key: `${node.index}-${rightChild.index}`
                });
            }
        });
        return edges;
    };

    const nodes = generateNodePositions();
    const edges = generateEdges(nodes);

    return (
        <div className="bg-gray-800 min-h-screen flex flex-col items-center py-10 text-white overflow-hidden">
            <h1 className="text-4xl font-bold mb-4">Min Heap</h1>

            <div className="mb-4 h-8 text-xl text-yellow-400 font-semibold">
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
                        key={`${node.index}`}
                        className={`absolute flex items-center justify-center w-12 h-12 rounded-full text-white font-bold shadow-lg border-2 border-white transition-all duration-300
                            ${highlights.includes(node.index) ? 'bg-yellow-500 scale-110' : 'bg-green-500'}
                        `}
                        style={{ left: node.x, top: node.y }}
                    >
                        {node.val}
                    </div>
                ))}
            </div>

            <div className="flex flex-col items-center space-y-4 z-10 w-full max-w-2xl">
                <div className="flex space-x-4">
                    <input
                        type="number"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        className="bg-gray-700 text-white px-4 py-2 rounded border border-gray-600"
                        placeholder="Enter number"
                        disabled={isPlaying}
                    />
                    <button
                        onClick={handleAdd}
                        // ✅ Disabled if playing, empty, OR if dirty (must heapify first)
                        className={`font-bold py-2 px-4 rounded transition-colors ${isPlaying || !inputValue || isDirty
                                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-500 text-white'
                            }`}
                        disabled={isPlaying || !inputValue || isDirty}
                    >
                        {isDirty ? "Heapify First" : "Add (Leaf)"}
                    </button>
                    <button
                        onClick={handleHeapify}
                        className={`font-bold py-2 px-4 rounded transition-colors ${isPlaying || heap.heap.length === 0
                                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                : 'bg-yellow-600 hover:bg-yellow-500 text-white'
                            }`}
                        disabled={isPlaying || heap.heap.length === 0}
                    >
                        Heapify
                    </button>
                    <button
                        onClick={handleRemove}
                        className={`font-bold py-2 px-4 rounded transition-colors ${isPlaying || heap.heap.length === 0 || isDirty
                                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                : 'bg-red-600 hover:bg-red-500 text-white'
                            }`}
                        disabled={isPlaying || heap.heap.length === 0 || isDirty}
                    >
                        Remove Min
                    </button>
                </div>

                <div className="flex items-center space-x-4 w-full px-8">
                    <span className="text-gray-400">Speed:</span>
                    <input
                        type="range"
                        min="100"
                        max="2000"
                        step="100"
                        value={speed}
                        onChange={(e) => setSpeed(Number(e.target.value))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="text-gray-400 w-16 text-right">{speed}ms</span>
                </div>
            </div>
        </div>
    );
};

export default HeapPage;