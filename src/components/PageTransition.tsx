import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface PageTransitionProps {
  children: React.ReactNode;
  viewKey: string;
}

export const PageTransition: React.FC<PageTransitionProps> = ({ children, viewKey }) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={viewKey}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ 
          duration: 0.38, 
          ease: [0.16, 1, 0.3, 1] 
        }}
        className="w-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};
