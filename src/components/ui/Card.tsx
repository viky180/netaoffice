/**
 * Reusable Card component with glassmorphism
 */

'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { ReactNode } from 'react';

interface CardProps extends HTMLMotionProps<'div'> {
    children: ReactNode;
    variant?: 'default' | 'highlight' | 'elevated';
    hover?: boolean;
}

export function Card({
    children,
    variant = 'default',
    hover = true,
    className = '',
    ...props
}: CardProps) {
    const variants: Record<string, string> = {
        default: 'bg-gray-800/50 border border-gray-700/50',
        highlight: 'bg-gradient-to-br from-emerald-900/30 to-cyan-900/30 border border-emerald-500/30',
        elevated: 'bg-gray-800/80 border border-gray-600/50 shadow-xl',
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={hover ? { y: -4, scale: 1.01 } : undefined}
            transition={{ duration: 0.2 }}
            className={`rounded-2xl backdrop-blur-sm p-6 ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </motion.div>
    );
}
