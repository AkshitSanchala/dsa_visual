import React from 'react';
import { Link } from 'react-router-dom';

const MainPage = () => {
    const algorithms = [
        {
            path: "/bubble-sort",
            title: "Bubble Sort",
            description: "A simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.",
            color: "from-blue-500 to-cyan-400"
        },
        {
            path: "/selection-sort",
            title: "Selection Sort",
            description: "An in-place comparison sorting algorithm that divides the input list into two parts: a sorted sublist and a remaining unsorted sublist.",
            color: "from-indigo-500 to-purple-500"
        },
        {
            path: "/insertion-sort",
            title: "Insertion Sort",
            description: "A simple sorting algorithm that builds the final sorted array one item at a time.",
            color: "from-teal-400 to-emerald-500"
        },
        {
            path: "/merge-sort",
            title: "Merge Sort",
            description: "Visualize the Divide and Conquer strategy of Merge Sort.",
            color: "from-sky-500 to-blue-600"
        },
        {
            path: "/quick-sort",
            title: "Quick Sort",
            description: "An efficient sorting algorithm that uses a divide-and-conquer strategy to quickly sort data items.",
            color: "from-violet-500 to-fuchsia-500"
        },
        {
            path: "/binary-search-tree",
            title: "Binary Search Tree",
            description: "A node-based binary tree data structure where the right subtree contains only nodes with keys greater than the node's key.",
            color: "from-green-500 to-lime-500"
        },
        {
            path: "/red-black-tree",
            title: "Red-Black Tree",
            description: "A self-balancing binary search tree. Visualize insertion and rebalancing steps.",
            color: "from-red-500 to-rose-600"
        },
        {
            path: "/heap",
            title: "Heap",
            description: "A specialized tree-based data structure which is a complete tree that satisfies the heap property.",
            color: "from-amber-500 to-orange-500"
        },
        {
            path: "/hash-set",
            title: "HashSet",
            description: "A data structure that implements an associative array abstract data type, a structure that can map keys to values.",
            color: "from-pink-500 to-rose-500"
        },
        {
            path: "/graph",
            title: "Graph Algorithms",
            description: "Visualize Breadth-First Search (BFS) and Depth-First Search (DFS) on an interactive graph.",
            color: "from-orange-500 to-red-500"
        },
        {
            path: "/mst",
            title: "Minimum Spanning Tree",
            description: "Visualize Prim's Algorithm to find the Minimum Spanning Tree of a weighted graph.",
            color: "from-yellow-400 to-amber-600"
        },
        {
            path: "/topological-sort",
            title: "Topological Sort",
            description: "Visualize Kahn's Algorithm for topological sorting of Directed Acyclic Graphs (DAGs).",
            color: "from-cyan-500 to-blue-500"
        }
    ];

    return (
        <div className="min-h-screen bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-5xl md:text-6xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
                        DSA Visualizer
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Interactive visualizations for common data structures and algorithms.
                        Learn by watching them in action.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {algorithms.map((algo, index) => (
                        <Link
                            key={index}
                            to={algo.path}
                            className="group relative bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-700 hover:border-gray-600"
                        >
                            <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${algo.color}`} />
                            <div className="p-6">
                                <h2 className={`text-2xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r ${algo.color} group-hover:opacity-80 transition-opacity`}>
                                    {algo.title}
                                </h2>
                                <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                                    {algo.description}
                                </p>
                            </div>
                            <div className={`absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-br ${algo.color} opacity-5 rounded-tl-full transition-transform duration-500 group-hover:scale-150`} />
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MainPage;
