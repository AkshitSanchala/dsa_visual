import React from 'react';
import { motion } from 'framer-motion';

const Bar = ({ number, isHighlighted, color }) => {
    let barColor = "bg-cyan-500";
    if (color) {
        barColor = color;
    } else if (isHighlighted) {
        barColor = "bg-red-500";
    }

    return (
        <motion.div
            layout
            className={`${barColor} rounded-t-md`}
            style={{ height: `${number * 20}px`, width: '30px' }}
        >
            <div className="text-center text-xs text-white mt-1 hidden sm:block">{number}</div>
        </motion.div>
    );
};

export default Bar;
