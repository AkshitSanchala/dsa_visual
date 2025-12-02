import React from 'react';
import { motion } from 'framer-motion';

const Bar = ({ number, isHighlighted }) => {
    return (
        <motion.div
            layout
            className={isHighlighted ? "bg-red-500" : "bg-cyan-500"}
            style={{ height: `${number * 20}px`, width: '30px' }}
        />
    );
};

export default Bar;
