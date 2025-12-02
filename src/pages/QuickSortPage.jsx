import { useState, useEffect, useRef } from 'react';
import Bar from '../components/Bar.jsx';

const QuickSortPage = () => {
    const [numbers, setNumbers] = useState(
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((val, idx) => ({ value: val, id: idx }))
    );
    const [sorting, setSorting] = useState(false);
    const stackRef = useRef([]);
    const [low, setLow] = useState(0);
    const [high, setHigh] = useState(numbers.length - 1);
    const [pivot, setPivot] = useState(null);

    // Partition state
    const [partitioning, setPartitioning] = useState(false);
    const [partitionI, setPartitionI] = useState(0);
    const [partitionJ, setPartitionJ] = useState(0);

    const shuffle = () => {
        const shuffledNumbers = [...numbers];
        for (let i = shuffledNumbers.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledNumbers[i], shuffledNumbers[j]] = [shuffledNumbers[j], shuffledNumbers[i]];
        }
        setNumbers(shuffledNumbers);
        setSorting(false);
        stackRef.current = [];
        setLow(0);
        setHigh(shuffledNumbers.length - 1);
        setPivot(null);
        setPartitioning(false);
    };

    const nextStep = () => {
        if (!partitioning) {
            // Start new partition or pop from stack
            if (stackRef.current.length === 0 && low >= high) {
                setSorting(false);
                setPivot(null);
                return;
            }

            if (low < high) {
                // Initialize partition
                setPartitioning(true);
                setPivot(high);
                setPartitionI(low - 1);
                setPartitionJ(low);
            } else {
                // Pop from stack
                if (stackRef.current.length > 0) {
                    const newHigh = stackRef.current.pop();
                    const newLow = stackRef.current.pop();
                    setHigh(newHigh);
                    setLow(newLow);
                } else {
                    setSorting(false);
                    setPivot(null);
                }
            }
        } else {
            // Continue partitioning
            const arr = [...numbers];
            const pivotValue = arr[high].value;

            if (partitionJ < high) {
                if (arr[partitionJ].value < pivotValue) {
                    const newI = partitionI + 1;
                    setPartitionI(newI);
                    [arr[newI], arr[partitionJ]] = [arr[partitionJ], arr[newI]];
                    setNumbers(arr);
                }
                setPartitionJ(partitionJ + 1);
            } else {
                // Finalize partition
                const newI = partitionI + 1;
                [arr[newI], arr[high]] = [arr[high], arr[newI]];
                setNumbers(arr);

                const pi = newI;
                if (pi - 1 > low) {
                    stackRef.current.push(low, pi - 1);
                }
                if (pi + 1 < high) {
                    stackRef.current.push(pi + 1, high);
                }

                setPartitioning(false);

                // Prepare for next iteration
                if (stackRef.current.length > 0) {
                    const newHigh = stackRef.current.pop();
                    const newLow = stackRef.current.pop();
                    setHigh(newHigh);
                    setLow(newLow);
                } else {
                    // We might be done, but let the next loop iteration decide
                    // by checking stack and low/high
                    setLow(high); // Effectively skip to end condition check next time
                }
            }
        }
    };


    const startSort = () => {
        stackRef.current = [0, numbers.length - 1];
        setLow(0);
        setHigh(numbers.length - 1);
        setSorting(true);
        setPartitioning(false);
    };

    useEffect(() => {
        if (sorting) {
            const interval = setInterval(() => {
                nextStep();
            }, 100); // Slower interval for better visibility
            return () => clearInterval(interval);
        }
    }, [sorting, low, high, numbers, partitioning, partitionI, partitionJ]);

    return (
        <div className="bg-gray-800 min-h-screen flex flex-col items-center justify-center text-white">
            <h1 className="text-4xl font-bold mb-8">Quick Sort</h1>
            <div className="flex items-end space-x-2 mb-8">
                {numbers.map((item, index) => (
                    <Bar
                        key={item.id}
                        number={item.value}
                        isHighlighted={
                            index === pivot ||
                            (partitioning && index === partitionJ) ||
                            (partitioning && index === partitionI)
                        }
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

export default QuickSortPage;
