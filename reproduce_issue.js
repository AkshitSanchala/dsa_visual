
const simulateInsertionSort = () => {
    let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
    // Shuffle
    for (let i = numbers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }
    console.log("Initial numbers:", numbers.length);

    let i = 1;
    let j = 0;
    let key = numbers[1];
    let sorting = true;
    let steps = 0;

    while (sorting && steps < 1000) {
        steps++;
        if (i >= numbers.length) {
            sorting = false;
            break;
        }

        const sortedNumbers = [...numbers];
        if (j >= 0 && sortedNumbers[j] > key) {
            sortedNumbers[j + 1] = sortedNumbers[j];
            numbers = [...sortedNumbers];
            j = j - 1;
        } else {
            sortedNumbers[j + 1] = key;
            numbers = [...sortedNumbers];
            const newI = i + 1;
            i = newI;
            if (newI < numbers.length) {
                key = numbers[newI];
                j = newI - 1;
            }
        }
        
        if (numbers.length > 15) {
            console.log("ERROR: Array grew!", numbers.length);
            break;
        }
    }
    console.log("Final numbers length:", numbers.length);
};

const simulateQuickSort = () => {
    let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
    // Shuffle
    for (let i = numbers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }
    console.log("QuickSort Initial:", numbers);

    let stack = [0, numbers.length - 1];
    let low = 0;
    let high = numbers.length - 1;
    let sorting = true;
    let steps = 0;

    const partition = (arr, low, high) => {
        const pivotValue = arr[high];
        let i = low - 1;

        for (let j = low; j < high; j++) {
            if (arr[j] < pivotValue) {
                i++;
                [arr[i], arr[j]] = [arr[j], arr[i]];
            }
        }
        [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
        return i + 1;
    };

    while (sorting && steps < 1000) {
        steps++;
        if (stack.length === 0 && low >= high) {
            sorting = false;
            break;
        }

        if (low < high) {
            const pi = partition(numbers, low, high);
            // In the component, setNumbers([...numbers]) is called here.
            
            if (pi - 1 > low) {
                stack.push(low, pi - 1);
            }
            if (pi + 1 < high) {
                stack.push(pi + 1, high);
            }
        }

        if (stack.length > 0) {
            const newHigh = stack.pop();
            const newLow = stack.pop();
            high = newHigh;
            low = newLow;
        } else {
            low = high; // This logic in component seems weird: setLow(high)
        }
        
        console.log(`Step ${steps}: stack len ${stack.length}, low ${low}, high ${high}`);
    }
    console.log("QuickSort Final:", numbers);
};

console.log("--- Insertion Sort ---");
simulateInsertionSort();
console.log("\n--- Quick Sort ---");
simulateQuickSort();
