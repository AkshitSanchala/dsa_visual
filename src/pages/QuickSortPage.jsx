import { useState, useEffect, useRef } from 'react';
import Bar from '../components/Bar.jsx';

const QuickSortPage = () => {
    const [numbers, setNumbers] = useState(
        [10, 5, 8, 3, 12, 6, 4, 15, 2, 9, 1, 14, 11, 7, 13].map((val, idx) => ({ value: val, id: idx }))
    );
    const [sorting, setSorting] = useState(false);
    const stackRef = useRef([]);
    const [low, setLow] = useState(0);
    const [high, setHigh] = useState(numbers.length - 1);
    const [pivot, setPivot] = useState(null);
    const [message, setMessage] = useState('Click Sort to start');
    const [sortedIndices, setSortedIndices] = useState(new Set());

    // Partition state
    const [partitioning, setPartitioning] = useState(false);
    const [partitionI, setPartitionI] = useState(0);
    const [partitionJ, setPartitionJ] = useState(0);

    // Visual state
    const [compareIndex, setCompareIndex] = useState(null);
    const [swapIndices, setSwapIndices] = useState([]);

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
        setMessage('Shuffled array');
        setSortedIndices(new Set());
        setCompareIndex(null);
        setSwapIndices([]);
    };

    const nextStep = () => {
        if (!partitioning) {
            // Start new partition or pop from stack
            if (stackRef.current.length === 0 && low >= high) {
                setSorting(false);
                setPivot(null);
                setSortedIndices(new Set(numbers.map((_, idx) => idx))); // All sorted
                setMessage('Sorting Complete!');
                return;
            }

            if (low < high) {
                // Initialize partition
                setPartitioning(true);
                setPivot(high);
                setPartitionI(low - 1);
                setPartitionJ(low);
                setMessage(`Partitioning range [${low}...${high}] with Pivot ${numbers[high].value}`);
                setCompareIndex(null);
                setSwapIndices([]);
            } else {
                // Single element range is sorted
                if (low === high) {
                    setSortedIndices(prev => new Set(prev).add(low));
                }

                // Pop from stack
                if (stackRef.current.length > 0) {
                    const newHigh = stackRef.current.pop();
                    const newLow = stackRef.current.pop();
                    setHigh(newHigh);
                    setLow(newLow);
                    setMessage(`Next range: [${newLow}...${newHigh}]`);
                } else {
                    setSorting(false);
                    setPivot(null);
                    setSortedIndices(new Set(numbers.map((_, idx) => idx)));
                    setMessage('Sorting Complete!');
                }
            }
        } else {
            // Continue partitioning
            const arr = [...numbers];
            const pivotValue = arr[high].value;

            if (partitionJ < high) {
                setCompareIndex(partitionJ);
                setSwapIndices([]);

                if (arr[partitionJ].value < pivotValue) {
                    const newI = partitionI + 1;
                    setPartitionI(newI);

                    if (newI !== partitionJ) {
                        setMessage(`Swapping ${arr[partitionJ].value} and ${arr[newI].value} (smaller than pivot)`);
                        [arr[newI], arr[partitionJ]] = [arr[partitionJ], arr[newI]];
                        setNumbers(arr);
                        setSwapIndices([newI, partitionJ]);
                    } else {
                        setMessage(`${arr[partitionJ].value} is smaller than pivot, incrementing i`);
                    }
                } else {
                    setMessage(`${arr[partitionJ].value} >= pivot, skipping`);
                }
                setPartitionJ(partitionJ + 1);
            } else {
                // Finalize partition
                const newI = partitionI + 1;
                setMessage(`Placing pivot ${pivotValue} at index ${newI}`);
                [arr[newI], arr[high]] = [arr[high], arr[newI]];
                setNumbers(arr);
                setSwapIndices([newI, high]);
                setSortedIndices(prev => new Set(prev).add(newI)); // Pivot is now sorted

                const pi = newI;
                if (pi - 1 > low) {
                    stackRef.current.push(low, pi - 1);
                } else if (pi - 1 === low) {
                    setSortedIndices(prev => new Set(prev).add(low));
                }

                if (pi + 1 < high) {
                    stackRef.current.push(pi + 1, high);
                } else if (pi + 1 === high) {
                    setSortedIndices(prev => new Set(prev).add(high));
                }

                setPartitioning(false);
                setPivot(null);
                setCompareIndex(null);

                // Prepare for next iteration
                if (stackRef.current.length > 0) {
                    const newHigh = stackRef.current.pop();
                    const newLow = stackRef.current.pop();
                    setHigh(newHigh);
                    setLow(newLow);
                } else {
                    setLow(high); // Skip to end check
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
        setSortedIndices(new Set());
        setMessage('Starting Quick Sort...');
    };

    useEffect(() => {
        if (sorting) {
            const interval = setInterval(() => {
                nextStep();
            }, 300);
            return () => clearInterval(interval);
        }
    }, [sorting, low, high, numbers, partitioning, partitionI, partitionJ]);

    const getBarColor = (index) => {
        if (sortedIndices.has(index)) return 'bg-green-500';
        if (index === pivot) return 'bg-purple-500'; // Pivot
        if (swapIndices.includes(index)) return 'bg-red-500'; // Swapping
        if (index === compareIndex) return 'bg-yellow-500'; // Comparing
        if (partitioning && index >= low && index < high) return 'bg-blue-500'; // Current range
        return 'bg-cyan-500';
    };

    return (
        <div className="bg-gray-800 min-h-screen flex flex-col items-center justify-center text-white">
            <h1 className="text-4xl font-bold mb-4">Quick Sort</h1>

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

export default QuickSortPage;
