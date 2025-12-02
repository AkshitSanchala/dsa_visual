import { useState, useEffect } from 'react';
import Bar from '../components/Bar.jsx';

const BubbleSortPage = () => {
    const [numbers, setNumbers] = useState([10, 5, 8, 3, 12, 6, 4, 15, 2, 9, 1, 14, 11, 7, 13]);
    const [i, setI] = useState(0);
    const [j, setJ] = useState(0);
    const [sorting, setSorting] = useState(false);
    const [message, setMessage] = useState('Click Sort to start');
    const [sortedIndices, setSortedIndices] = useState(new Set());
    const [compareIndices, setCompareIndices] = useState([]);
    const [swapIndices, setSwapIndices] = useState([]);

    const shuffle = () => {
        const shuffledNumbers = [...numbers];
        for (let i = shuffledNumbers.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledNumbers[i], shuffledNumbers[j]] = [shuffledNumbers[j], shuffledNumbers[i]];
        }
        setNumbers(shuffledNumbers);
        setI(0);
        setJ(0);
        setSorting(false);
        setMessage('Shuffled array');
        setSortedIndices(new Set());
        setCompareIndices([]);
        setSwapIndices([]);
    };

    const nextStep = () => {
        if (i >= numbers.length) {
            setSorting(false);
            setMessage('Sorting Complete!');
            return;
        }

        const currentNumbers = [...numbers];

        // If we finished a pass
        if (j >= numbers.length - i - 1) {
            setSortedIndices(prev => new Set(prev).add(numbers.length - i - 1));
            setJ(0);
            setI(i + 1);
            setCompareIndices([]);
            setSwapIndices([]);
            return;
        }

        // Compare j and j+1
        setCompareIndices([j, j + 1]);
        setSwapIndices([]);

        if (currentNumbers[j] > currentNumbers[j + 1]) {
            setMessage(`Swapping ${currentNumbers[j]} and ${currentNumbers[j + 1]} because ${currentNumbers[j]} > ${currentNumbers[j + 1]}`);
            [currentNumbers[j], currentNumbers[j + 1]] = [currentNumbers[j + 1], currentNumbers[j]];
            setNumbers(currentNumbers);
            setSwapIndices([j, j + 1]);
        } else {
            setMessage(`No swap: ${currentNumbers[j]} <= ${currentNumbers[j + 1]}`);
        }

        setJ(j + 1);
    };

    const startSort = () => {
        setI(0);
        setJ(0);
        setSorting(true);
        setSortedIndices(new Set());
        setMessage('Starting Bubble Sort...');
    };

    useEffect(() => {
        if (sorting) {
            const interval = setInterval(() => {
                nextStep();
            }, 300); // Slower for readability
            return () => clearInterval(interval);
        }
    }, [sorting, i, j, numbers]);

    const getBarColor = (index) => {
        if (sortedIndices.has(index)) return 'bg-green-500';
        if (swapIndices.includes(index)) return 'bg-red-500';
        if (compareIndices.includes(index)) return 'bg-yellow-500';
        return 'bg-cyan-500';
    };

    return (
        <div className="bg-gray-800 min-h-screen flex flex-col items-center justify-center text-white">
            <h1 className="text-4xl font-bold mb-4">Bubble Sort</h1>

            <div className="mb-8 h-8 text-xl text-yellow-400 font-semibold">
                {message}
            </div>

            <div className="flex items-end space-x-2 mb-8 h-64">
                {numbers.map((number, index) => (
                    <Bar
                        key={number} // Using index as key here since values swap positions but bars stay in slots
                        number={number}
                        color={getBarColor(index)}
                    />
                ))}
            </div>
            <div className="flex space-x-4">
                <button
                    className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
                    onClick={shuffle}
                >
                    Shuffle
                </button>
                <button
                    className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded"
                    onClick={startSort}
                    disabled={sorting}
                >
                    Sort
                </button>
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={nextStep}
                    disabled={sorting}
                >
                    Next Step
                </button>
            </div>
        </div>
    );
};

export default BubbleSortPage;
