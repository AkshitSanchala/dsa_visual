import { useState, useEffect } from 'react';
import Bar from '../components/Bar.jsx';

const InsertionSortPage = () => {
    // Initialize with objects containing value and unique ID
    const [numbers, setNumbers] = useState(
        [10, 5, 8, 3, 12, 6, 4, 15, 2, 9, 1, 14, 11, 7, 13].map((val, idx) => ({ value: val, id: idx }))
    );
    const [i, setI] = useState(1); // The element we are currently inserting
    const [j, setJ] = useState(1); // The position of that element as it bubbles down
    const [sorting, setSorting] = useState(false);
    const [message, setMessage] = useState('Click Sort to start');
    const [isSorted, setIsSorted] = useState(false);

    // Visual state
    const [keyIndex, setKeyIndex] = useState(1); // The index of the element being inserted
    const [compareIndex, setCompareIndex] = useState(null);

    const shuffle = () => {
        const shuffledNumbers = [...numbers];
        for (let i = shuffledNumbers.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledNumbers[i], shuffledNumbers[j]] = [shuffledNumbers[j], shuffledNumbers[i]];
        }
        setNumbers(shuffledNumbers);
        setI(1);
        setJ(1);
        setKeyIndex(1);
        setSorting(false);
        setMessage('Shuffled array');
        setIsSorted(false);
        setCompareIndex(null);
    };

    const nextStep = () => {
        if (i >= numbers.length) {
            setSorting(false);
            setIsSorted(true);
            setMessage('Sorting Complete!');
            return;
        }

        const currentNumbers = [...numbers];

        // If the current element (j) is smaller than the one before it (j-1), swap them.
        if (j > 0) {
            setCompareIndex(j - 1);
            if (currentNumbers[j].value < currentNumbers[j - 1].value) {
                setMessage(`Swapping ${currentNumbers[j].value} and ${currentNumbers[j - 1].value} because ${currentNumbers[j].value} < ${currentNumbers[j - 1].value}`);
                [currentNumbers[j], currentNumbers[j - 1]] = [currentNumbers[j - 1], currentNumbers[j]];
                setNumbers(currentNumbers);
                setJ(j - 1); // Follow the element down
                setKeyIndex(j - 1);
            } else {
                // Placed correctly relative to left neighbor
                setMessage(`${currentNumbers[j].value} is in correct position relative to ${currentNumbers[j - 1].value}`);
                // Move to next element
                const nextI = i + 1;
                setI(nextI);
                setJ(nextI);
                setKeyIndex(nextI);
                setCompareIndex(null);
            }
        } else {
            // Reached start of array
            setMessage(`${currentNumbers[j].value} reached start of array`);
            const nextI = i + 1;
            setI(nextI);
            setJ(nextI);
            setKeyIndex(nextI);
            setCompareIndex(null);
        }
    };

    const startSort = () => {
        setI(1);
        setJ(1);
        setKeyIndex(1);
        setSorting(true);
        setIsSorted(false);
        setMessage('Starting Insertion Sort...');
    };

    useEffect(() => {
        if (sorting) {
            const interval = setInterval(() => {
                nextStep();
            }, 300);
            return () => clearInterval(interval);
        }
    }, [sorting, i, j, numbers]);

    const getBarColor = (index) => {
        if (isSorted) return 'bg-green-500';
        if (index === keyIndex) return 'bg-blue-500'; // Element being inserted
        if (index === compareIndex) return 'bg-yellow-500'; // Being compared against
        if (index < i) return 'bg-green-500'; // Sorted portion (relative)
        return 'bg-cyan-500';
    };

    return (
        <div className="bg-gray-800 min-h-screen flex flex-col items-center justify-center text-white">
            <h1 className="text-4xl font-bold mb-4">Insertion Sort</h1>

            <div className="mb-8 h-8 text-xl text-yellow-400 font-semibold">
                {message}
            </div>

            <div className="flex items-end space-x-2 mb-8 h-64">
                {numbers.map((item, index) => (
                    <Bar
                        key={item.id}
                        number={item.value}
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

export default InsertionSortPage;