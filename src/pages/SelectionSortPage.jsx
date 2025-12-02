import { useState, useEffect } from 'react';
import Bar from '../components/Bar.jsx';

const SelectionSortPage = () => {
    const [numbers, setNumbers] = useState([10, 5, 8, 3, 12, 6, 4, 15, 2, 9, 1, 14, 11, 7, 13]);
    const [i, setI] = useState(0);
    const [j, setJ] = useState(1);
    const [minIndex, setMinIndex] = useState(0);
    const [sorting, setSorting] = useState(false);
    const [message, setMessage] = useState('Click Sort to start');
    const [sortedIndices, setSortedIndices] = useState(new Set());
    const [compareIndex, setCompareIndex] = useState(null);

    const shuffle = () => {
        const shuffledNumbers = [...numbers];
        for (let i = shuffledNumbers.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledNumbers[i], shuffledNumbers[j]] = [shuffledNumbers[j], shuffledNumbers[i]];
        }
        setNumbers(shuffledNumbers);
        setI(0);
        setJ(1);
        setMinIndex(0);
        setSorting(false);
        setMessage('Shuffled array');
        setSortedIndices(new Set());
        setCompareIndex(null);
    };

    const nextStep = () => {
        if (i >= numbers.length - 1) {
            setSorting(false);
            setSortedIndices(new Set(numbers.map((_, idx) => idx))); // All sorted
            setMessage('Sorting Complete!');
            return;
        }

        const sortedNumbers = [...numbers];

        if (j < sortedNumbers.length) {
            setCompareIndex(j);
            if (sortedNumbers[j] < sortedNumbers[minIndex]) {
                setMessage(`Found new minimum: ${sortedNumbers[j]} at index ${j}`);
                setMinIndex(j);
            } else {
                setMessage(`Comparing ${sortedNumbers[j]} with current min ${sortedNumbers[minIndex]}`);
            }
            setJ(j + 1);
        } else {
            // End of pass, swap if needed
            if (minIndex !== i) {
                setMessage(`Swapping min ${sortedNumbers[minIndex]} with ${sortedNumbers[i]}`);
                [sortedNumbers[i], sortedNumbers[minIndex]] = [sortedNumbers[minIndex], sortedNumbers[i]];
                setNumbers([...sortedNumbers]);
            } else {
                setMessage(`${sortedNumbers[i]} is already in correct position`);
            }

            setSortedIndices(prev => new Set(prev).add(i));
            const newI = i + 1;
            setI(newI);
            setJ(newI + 1);
            setMinIndex(newI);
            setCompareIndex(null);
        }
    };

    const startSort = () => {
        setI(0);
        setJ(1);
        setMinIndex(0);
        setSorting(true);
        setSortedIndices(new Set());
        setMessage('Starting Selection Sort...');
    };

    useEffect(() => {
        if (sorting) {
            const interval = setInterval(() => {
                nextStep();
            }, 300);
            return () => clearInterval(interval);
        }
    }, [sorting, i, j]);

    const getBarColor = (index) => {
        if (sortedIndices.has(index)) return 'bg-green-500';
        if (index === minIndex) return 'bg-blue-500'; // Current Min
        if (index === compareIndex) return 'bg-yellow-500'; // Currently comparing
        if (index === i) return 'bg-purple-500'; // Current start position
        return 'bg-cyan-500';
    };

    return (
        <div className="bg-gray-800 min-h-screen flex flex-col items-center justify-center text-white">
            <h1 className="text-4xl font-bold mb-4">Selection Sort</h1>

            <div className="mb-8 h-8 text-xl text-yellow-400 font-semibold">
                {message}
            </div>

            <div className="flex items-end space-x-2 mb-8 h-64">
                {numbers.map((number, index) => (
                    <Bar
                        key={number}
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

export default SelectionSortPage;
