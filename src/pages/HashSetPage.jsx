import React, { useState, useEffect } from 'react';
import { HashSet } from '../data-structures/HashSet';

const HashSetPage = () => {
    const [hashSet, setHashSet] = useState(new HashSet());
    const [inputValue, setInputValue] = useState('');
    const [searchValue, setSearchValue] = useState('');
    const [foundIndex, setFoundIndex] = useState(-1);
    const [collisionResolution, setCollisionResolution] = useState('linear');

    useEffect(() => {
        setHashSet(new HashSet(7, collisionResolution));
    }, [collisionResolution]);

    const handleAdd = async () => {
        if (inputValue.trim() === '') return;
        await hashSet.add(inputValue);
        const newHashSet = Object.assign(Object.create(Object.getPrototypeOf(hashSet)), hashSet);
        setHashSet(newHashSet);
        setInputValue('');
    };

    const handleRemove = () => {
        if (inputValue.trim() === '') return;
        hashSet.remove(inputValue);
        const newHashSet = Object.assign(Object.create(Object.getPrototypeOf(hashSet)), hashSet);
        setHashSet(newHashSet);
        setInputValue('');
    };

    const handleResolutionChange = (e) => {
        const newResolution = e.target.value;
        setCollisionResolution(newResolution);
    };

    const handleSearch = () => {
        if (searchValue.trim() === '') return;
        const index = hashSet.search(searchValue);
        setFoundIndex(index);
    };

    return (
        <div className="bg-gray-800 min-h-screen flex flex-col items-center py-10 text-white">
            <h1 className="text-4xl font-bold mb-8">HashSet Visualization</h1>

            {/* Controls */}
            <div className="flex space-x-4 mb-8 z-10">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="bg-gray-700 text-white px-4 py-2 rounded border border-gray-600"
                    placeholder="Enter a value to add/remove"
                />
                <button onClick={handleAdd} className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded transition">
                    Add
                </button>
                <button onClick={handleRemove} className="bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded transition">
                    Remove
                </button>
                <input
                    type="text"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    className="bg-gray-700 text-white px-4 py-2 rounded border border-gray-600"
                    placeholder="Enter a value to search"
                />
                <button onClick={handleSearch} className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded transition">
                    Search
                </button>
                <select
                    value={collisionResolution}
                    onChange={handleResolutionChange}
                    className="bg-gray-700 text-white px-4 py-2 rounded border border-gray-600"
                >
                    <option value="linear">Linear Probing</option>
                    <option value="quadratic">Quadratic Probing</option>
                    <option value="chaining">Chaining</option>
                </select>
            </div>

            {/* Hash Table Visualization */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-4xl">
                {hashSet.table.map((item, index) => (
                    <div key={index} className={`bg-gray-900 p-4 rounded-lg border ${foundIndex === index ? 'border-yellow-400' : 'border-gray-700'}`}>
                        <div className="font-mono text-lg text-cyan-400">Index: {index}</div>
                        <div className="mt-2 min-h-[50px]">
                            {item ? (
                                collisionResolution === 'chaining' ? (
                                    <div className="flex flex-col space-y-1">
                                        {item.map((chainedItem, cIndex) => (
                                            <div key={cIndex} className="bg-gray-700 p-2 rounded">
                                                {`{ key: "${chainedItem.key}" }`}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className={`p-2 rounded ${item.key === -1 ? 'bg-red-900' : 'bg-gray-700'}`}>
                                        {item.key === -1 ? 'DELETED' : `{ key: "${item.key}" }`}
                                    </div>
                                )
                            ) : (
                                <div className="text-gray-500">null</div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-8 text-lg">
                <span className="font-bold">Capacity:</span> {hashSet.capacity} | <span className="font-bold">Size:</span> {hashSet.size} | <span className="font-bold">Load Factor:</span> {(hashSet.size / hashSet.capacity).toFixed(2)}
            </div>
        </div>
    );
};

export default HashSetPage;
