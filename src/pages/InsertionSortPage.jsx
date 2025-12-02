import { useState, useEffect } from 'react';
import Bar from '../components/Bar.jsx';

const InsertionSortPage = () => {
    // Initialize with objects containing value and unique ID
    const [numbers, setNumbers] = useState(
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((val, idx) => ({ value: val, id: idx }))
    );
    const [i, setI] = useState(1); // The element we are currently inserting
    const [j, setJ] = useState(1); // The position of that element as it bubbles down
    const [sorting, setSorting] = useState(false);

    const shuffle = () => {
        const shuffledNumbers = [...numbers];
        for (let i = shuffledNumbers.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledNumbers[i], shuffledNumbers[j]] = [shuffledNumbers[j], shuffledNumbers[i]];
        }
        setNumbers(shuffledNumbers);
        setI(1);
        setJ(1);
        setSorting(false);
    };

    const nextStep = () => {
        if (i >= numbers.length) {
            setSorting(false);
            return;
        }

        const currentNumbers = [...numbers];

        // LOGIC CHANGE: Swap instead of Shift
        // If the current element (j) is smaller than the one before it (j-1), swap them.
        if (j > 0 && currentNumbers[j].value < currentNumbers[j - 1].value) {
            [currentNumbers[j], currentNumbers[j - 1]] = [currentNumbers[j - 1], currentNumbers[j]];
            setNumbers(currentNumbers);
            setJ(j - 1); // Follow the element down
        } else {
            // If it's in the correct spot (or at the start), move to the next unsorted element (i+1)
            const nextI = i + 1;
            setI(nextI);
            setJ(nextI); // Reset j to start at the new i position
        }
    };

    const startSort = () => {
        setI(1);
        setJ(1);
        setSorting(true);
    };

    useEffect(() => {
        if (sorting) {
            const interval = setInterval(() => {
                nextStep();
            }, 50);
            return () => clearInterval(interval);
        }
    }, [sorting, i, j, numbers]); // Added numbers to dependency array

    return (
        <div className="bg-gray-800 min-h-screen flex flex-col items-center justify-center text-white">
            <h1 className="text-4xl font-bold mb-8">Insertion Sort</h1>
            <div className="flex items-end space-x-2 mb-8">
                {numbers.map((item, index) => (
                    <Bar
                        key={item.id} // ✅ Keeps identity stable for animation
                        number={item.value}
                        isHighlighted={index === j || index === j - 1} // Highlight the comparison pair
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