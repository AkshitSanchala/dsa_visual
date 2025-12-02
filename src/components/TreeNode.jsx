import React from 'react';

const TreeNode = ({ node, style }) => {
    if (!node) {
        return null;
    }

    return (
        <div style={style} className="absolute flex items-center justify-center w-12 h-12 rounded-full bg-cyan-500 text-white font-bold">
            {node.value}
            {node.left && (
                <svg className="absolute w-full h-full" style={{ top: 0, left: 0 }}>
                    <line x1="50%" y1="100%" x2="25%" y2="150%" stroke="white" />
                </svg>
            )}
            {node.right && (
                <svg className="absolute w-full h-full" style={{ top: 0, left: 0 }}>
                    <line x1="50%" y1="100%" x2="75%" y2="150%" stroke="white" />
                </svg>
            )}
        </div>
    );
};

export default TreeNode;
