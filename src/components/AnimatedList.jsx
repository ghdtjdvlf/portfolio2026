import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useMemo, useState, useRef } from 'react';

export function AnimatedListItem({ children }) {
  return (
    <motion.div
      layout
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1, originY: 0 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 350, damping: 40 }}
      className="mx-auto w-full"
    >
      {children}
    </motion.div>
  );
}

export const AnimatedList = React.memo(({ children, className = '', delay = 1200, active = true }) => {
  const [index, setIndex] = useState(0);
  const childrenArray = useMemo(() => React.Children.toArray(children), [children]);
  const prevActiveRef = useRef(active);

  useEffect(() => {
    if (!active) return;
    if (index < childrenArray.length - 1) {
      const timeout = setTimeout(() => {
        setIndex((prev) => prev + 1);
      }, delay);
      return () => clearTimeout(timeout);
    }
  }, [index, delay, childrenArray.length, active]);

  useEffect(() => {
    // Check if active just changed from false to true
    if (!prevActiveRef.current && active) {
       
      setIndex(0);
    }
    prevActiveRef.current = active; // Update ref for next render
  }, [active]);

  const itemsToShow = useMemo(
    () => childrenArray.slice(0, index + 1).reverse(),
    [index, childrenArray],
  );

  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      <AnimatePresence>
        {itemsToShow.map((item) => (
          <AnimatedListItem key={item.key}>
            {item}
          </AnimatedListItem>
        ))}
      </AnimatePresence>
    </div>
  );
});

AnimatedList.displayName = 'AnimatedList';
