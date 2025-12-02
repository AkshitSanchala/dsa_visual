export class MinHeap {
    constructor() {
        this.heap = [];
        this.snapshots = [];
    }

    // Helper to clone and record state
    takeSnapshot(message, highlights = []) {
        this.snapshots.push({
            heap: [...this.heap],
            message,
            highlights // Array of indices to highlight
        });
    }

    // Just adds the value to the end, does NOT heapify
    insertRaw(value) {
        this.heap.push(value);
        // No snapshot needed here as the UI will update immediately to show the new node
    }

    // Restores heap property by bubbling up from the last element
    heapifyUpAnimated() {
        this.snapshots = [];
        let index = this.heap.length - 1;

        if (index <= 0) return []; // Nothing to heapify if 0 or 1 element

        this.takeSnapshot(`Starting Heapify from index ${index}`, [index]);

        let parentIndex = Math.floor((index - 1) / 2);
        while (index > 0 && this.heap[index] < this.heap[parentIndex]) {
            this.takeSnapshot(`Comparing ${this.heap[index]} < ${this.heap[parentIndex]}`, [index, parentIndex]);

            this.swap(index, parentIndex);
            this.takeSnapshot(`Swapped ${this.heap[index]} and ${this.heap[parentIndex]}`, [index, parentIndex]);

            index = parentIndex;
            parentIndex = Math.floor((index - 1) / 2);
        }

        this.takeSnapshot('Heap property restored', [index]);
        return this.snapshots;
    }

    removeAnimated() {
        this.snapshots = [];
        if (this.heap.length === 0) return [];

        if (this.heap.length === 1) {
            const val = this.heap.pop();
            this.takeSnapshot(`Removed last element: ${val}`, []);
            return this.snapshots;
        }

        this.takeSnapshot('Swapping Root with Last Element', [0, this.heap.length - 1]);
        this.swap(0, this.heap.length - 1);

        const minValue = this.heap.pop();
        this.takeSnapshot(`Removed Min Value: ${minValue}`, []);

        if (this.heap.length > 0) {
            this.heapifyDownAnimated(0);
        }

        return this.snapshots;
    }

    heapifyDownAnimated(index) {
        let smallestIndex = index;
        let leftChildIndex = 2 * index + 1;
        let rightChildIndex = 2 * index + 2;

        const highlightIndices = [index];
        if (leftChildIndex < this.heap.length) highlightIndices.push(leftChildIndex);
        if (rightChildIndex < this.heap.length) highlightIndices.push(rightChildIndex);

        this.takeSnapshot(`Checking children of ${this.heap[index]}`, highlightIndices);

        if (leftChildIndex < this.heap.length && this.heap[leftChildIndex] < this.heap[smallestIndex]) {
            smallestIndex = leftChildIndex;
        }

        if (rightChildIndex < this.heap.length && this.heap[rightChildIndex] < this.heap[smallestIndex]) {
            smallestIndex = rightChildIndex;
        }

        if (smallestIndex !== index) {
            this.takeSnapshot(`Swapping ${this.heap[index]} with ${this.heap[smallestIndex]}`, [index, smallestIndex]);
            this.swap(index, smallestIndex);
            this.heapifyDownAnimated(smallestIndex);
        } else {
            this.takeSnapshot(`${this.heap[index]} is in correct position`, [index]);
        }
    }

    swap(i, j) {
        [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
    }
}