import { useState, useEffect } from 'react';
import Bar from '../components/Bar.jsx';

const SelectionSortPage = () => {
    const [numbers, setNumbers] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
    const [i, setI] = useState(0);
    const [j, setJ] = useState(1);
    const [minIndex, setMinIndex] = useState(0);
    const [sorting, setSorting] = useState(false);

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
    };

    const nextStep = () => {
        if (i >= numbers.length - 1) {
            setSorting(false);
            return;
        }

        const sortedNumbers = [...numbers];
        if (j < sortedNumbers.length) {
            if (sortedNumbers[j] < sortedNumbers[minIndex]) {
                setMinIndex(j);
            }
            setJ(j + 1);
        } else {
            [sortedNumbers[i], sortedNumbers[minIndex]] = [sortedNumbers[minIndex], sortedNumbers[i]];
            setNumbers([...sortedNumbers]);
            const newI = i + 1;
            setI(newI);
            setJ(newI + 1);
            setMinIndex(newI);
        }
    };

    const startSort = () => {
        setI(0);
        setJ(1);
        setMinIndex(0);
        setSorting(true);
    };

    useEffect(() => {
        if (sorting) {
            const interval = setInterval(() => {
                nextStep();
            }, 50);
            return () => clearInterval(interval);
        }
    }, [sorting, i, j]);

    return (
        <div className="bg-gray-800 min-h-screen flex flex-col items-center justify-center text-white">
            <h1 className="text-4xl font-bold mb-8">Selection Sort</h1>
            <div className="flex items-end space-x-2 mb-8">
                {numbers.map((number, index) => (
                    <Bar key={number} number={number} isHighlighted={index === i || index === j} />
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
