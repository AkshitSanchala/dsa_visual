import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Bar from '../components/Bar'; // Assuming you have a Bar component

const MergeSortPage = () => {
    const [numbers, setNumbers] = useState([]);
    const [snapshots, setSnapshots] = useState([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(500);

    useEffect(() => {
        resetArray();
    }, []);

    useEffect(() => {
        let interval;
        if (isPlaying && currentStep < snapshots.length - 1) {
            interval = setInterval(() => {
                setCurrentStep(prev => prev + 1);
            }, speed);
        } else if (currentStep >= snapshots.length - 1) {
            setIsPlaying(false);
        }
        return () => clearInterval(interval);
    }, [isPlaying, currentStep, snapshots, speed]);

    const resetArray = () => {
        const newNumbers = Array.from({ length: 15 }, (_, i) => ({
            value: Math.floor(Math.random() * 50) + 5,
            id: `init-${i}`
        }));
        setNumbers(newNumbers);
        setSnapshots([]);
        setCurrentStep(0);
        setIsPlaying(false);
    };

    const generateSnapshots = () => {
        const snaps = [];
        const arr = numbers.map(n => ({ ...n })); // Deep copy

        // Helper to record snapshot
        const record = (currentArr, message, highlights = {}) => {
            snaps.push({
                arr: currentArr.map(n => ({ ...n })),
                message,
                highlights // { index: color }
            });
        };

        const mergeSort = (array, start, end) => {
            if (start >= end) return;

            const mid = Math.floor((start + end) / 2);

            record(arr, `Dividing: [${start}...${end}] into [${start}...${mid}] and [${mid + 1}...${end}]`, {
                range: [start, end],
                color: 'blue'
            });

            mergeSort(array, start, mid);
            mergeSort(array, mid + 1, end);

            merge(array, start, mid, end);
        };

        const merge = (array, start, mid, end) => {
            record(arr, `Merging: [${start}...${mid}] and [${mid + 1}...${end}]`, {
                leftRange: [start, mid],
                rightRange: [mid + 1, end]
            });

            let left = array.slice(start, mid + 1);
            let right = array.slice(mid + 1, end + 1);
            let i = 0, j = 0, k = start;

            while (i < left.length && j < right.length) {
                // Highlight comparison
                record(arr, `Comparing ${left[i].value} and ${right[j].value}`, {
                    indices: [start + i, mid + 1 + j], // Note: indices in original array might be shifted if we were doing in-place swaps, but here we overwrite
                    // Actually, for visualization, we want to show the values being compared.
                    // Since we are overwriting 'arr' at index 'k', the values at 'start+i' and 'mid+1+j' might not be the original ones if we are not careful.
                    // Standard merge sort uses an auxiliary array.
                    // To visualize "movement", we can just highlight the slots k.
                    kIndex: k
                });

                if (left[i].value <= right[j].value) {
                    array[k] = left[i];
                    record(arr, `Placed ${left[i].value} at index ${k}`, { kIndex: k, color: 'green' });
                    i++;
                } else {
                    array[k] = right[j];
                    record(arr, `Placed ${right[j].value} at index ${k}`, { kIndex: k, color: 'green' });
                    j++;
                }
                k++;
            }

            while (i < left.length) {
                array[k] = left[i];
                record(arr, `Placed remaining ${left[i].value} at index ${k}`, { kIndex: k, color: 'green' });
                i++;
                k++;
            }

            while (j < right.length) {
                array[k] = right[j];
                record(arr, `Placed remaining ${right[j].value} at index ${k}`, { kIndex: k, color: 'green' });
                j++;
                k++;
            }

            record(arr, `Merged [${start}...${end}]`, { range: [start, end], color: 'green' });
        };

        mergeSort(arr, 0, arr.length - 1);
        record(arr, "Sorted!", { range: [0, arr.length - 1], color: 'green' });

        setSnapshots(snaps);
        setCurrentStep(0);
        setIsPlaying(true);
    };

    const currentSnapshot = snapshots[currentStep] || { arr: numbers, message: "Ready to Sort", highlights: {} };

    // Helper to determine bar color based on highlights
    const getBarColor = (index, highlights) => {
        if (!highlights) return 'bg-cyan-500';

        if (highlights.kIndex === index) return 'bg-yellow-500'; // Currently placing

        if (highlights.range && index >= highlights.range[0] && index <= highlights.range[1]) {
            return highlights.color === 'green' ? 'bg-green-500' : 'bg-blue-500';
        }

        if (highlights.leftRange && index >= highlights.leftRange[0] && index <= highlights.leftRange[1]) return 'bg-blue-600';
        if (highlights.rightRange && index >= highlights.rightRange[0] && index <= highlights.rightRange[1]) return 'bg-purple-600';

        return 'bg-gray-600'; // Inactive
    };

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-900 text-white p-4">
            <h1 className="text-3xl font-bold mb-4">Merge Sort</h1>

            <div className="flex space-x-4 mb-8">
                <button onClick={resetArray} className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500">Generate New Array</button>
                <button onClick={generateSnapshots} className="px-4 py-2 bg-green-600 rounded hover:bg-green-500" disabled={snapshots.length > 0}>Start Sort</button>
                <button onClick={() => setIsPlaying(!isPlaying)} className="px-4 py-2 bg-yellow-600 rounded hover:bg-yellow-500" disabled={snapshots.length === 0}>
                    {isPlaying ? 'Pause' : 'Play'}
                </button>
            </div>

            <div className="mb-4 text-xl font-semibold text-yellow-400 h-8">
                {currentSnapshot.message}
            </div>

            <div className="flex items-end justify-center space-x-2 h-64 w-full max-w-4xl bg-gray-800 p-4 rounded-lg">
                {currentSnapshot.arr.map((item, idx) => (
                    <motion.div
                        key={item.id} // Use unique ID for smooth transitions if possible, but with overwrite logic, might be tricky. 
                        // Actually, since we replace objects in the array, React might lose track if IDs change or are reused incorrectly.
                        // But here we preserved IDs in the deep copy.
                        layout
                        className={`w-8 rounded-t-md ${getBarColor(idx, currentSnapshot.highlights)}`}
                        style={{ height: `${item.value * 3}px` }}
                    >
                        <div className="text-center text-xs mt-1 hidden sm:block">{item.value}</div>
                    </motion.div>
                ))}
            </div>

            <div className="mt-8 w-full max-w-2xl">
                <label className="block text-sm font-medium text-gray-400 mb-2">Speed</label>
                <input
                    type="range"
                    min="50"
                    max="1000"
                    step="50"
                    value={speed}
                    onChange={(e) => setSpeed(Number(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
            </div>

            <div className="flex space-x-4 mt-4">
                <button
                    onClick={() => { setIsPlaying(false); setCurrentStep(Math.max(0, currentStep - 1)); }}
                    className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
                    disabled={currentStep === 0}
                >
                    Previous
                </button>
                <button
                    onClick={() => { setIsPlaying(false); setCurrentStep(Math.min(snapshots.length - 1, currentStep + 1)); }}
                    className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
                    disabled={currentStep === snapshots.length - 1}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default MergeSortPage;
