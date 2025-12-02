import React from 'react';
import { Link } from 'react-router-dom';

const MainPage = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-4xl font-bold mb-8">DSA Visualizer</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <Link to="/bubble-sort" className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <h2 className="text-2xl font-semibold mb-2">Bubble Sort</h2>
                    <p className="text-gray-600">A simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.</p>
                </Link>
                <Link to="/selection-sort" className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <h2 className="text-2xl font-semibold mb-2">Selection Sort</h2>
                    <p className="text-gray-600">An in-place comparison sorting algorithm that divides the input list into two parts: a sorted sublist of items which is built up from left to right and a sublist of the remaining unsorted items.</p>
                </Link>
                <Link to="/quick-sort" className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <h2 className="text-2xl font-semibold mb-2">Quick Sort</h2>
                    <p className="text-gray-600">An efficient sorting algorithm that uses a divide-and-conquer strategy to quickly sort data items.</p>
                </Link>
                <Link to="/insertion-sort" className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <h2 className="text-2xl font-semibold mb-2">Insertion Sort</h2>
                    <p className="text-gray-600">A simple sorting algorithm that builds the final sorted array one item at a time.</p>
                </Link>
                <Link to="/binary-search-tree" className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <h2 className="text-2xl font-semibold mb-2">Binary Search Tree</h2>
                    <p className="text-gray-600">A node-based binary tree data structure which has the right subtree of a node contains only nodes with keys greater than the node's key.</p>
                </Link>
                <Link to="/heap" className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <h2 className="text-2xl font-semibold mb-2">Heap</h2>
                    <p className="text-gray-600">A specialized tree-based data structure which is a complete tree that satisfies the heap property.</p>
                </Link>
                <Link to="/hash-set" className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <h2 className="text-2xl font-semibold mb-2">HashSet</h2>
                    <p className="text-gray-600">A data structure that implements an associative array abstract data type, a structure that can map keys to values.</p>
                </Link>
                <Link to="/graph" className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <h2 className="text-2xl font-semibold mb-2">Graph Algorithms (BFS/DFS)</h2>
                    <p className="text-gray-600">Visualize Breadth-First Search (BFS) and Depth-First Search (DFS) on an interactive graph.</p>
                </Link>
                <Link to="/red-black-tree" className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <h2 className="text-2xl font-semibold mb-2">Red-Black Tree</h2>
                    <p className="text-gray-600">A self-balancing binary search tree. Visualize insertion and rebalancing steps.</p>
                </Link>
            </div>
        </div>
    );
};

export default MainPage;
