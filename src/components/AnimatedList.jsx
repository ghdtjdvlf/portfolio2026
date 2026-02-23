import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function AnimatedList({ children, delay = 1000, active = true, className }) {
  const items = Array.isArray(children) ? children : [children];
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    if (!active) return;

    setVisibleCount(0);
    let current = 0;

    const interval = setInterval(() => {
      current += 1;
      setVisibleCount(current);
      if (current >= items.length) clearInterval(interval);
    }, delay);

    return () => clearInterval(interval);
  }, [active, delay, items.length]);

  return (
    <div className={className}>
      <AnimatePresence>
        {items.slice(0, visibleCount).map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="mb-3"
          >
            {item}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
