import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

export function AnimatedList({ children, delay = 1000, active = true, className }) {
  const items = Array.isArray(children) ? children : [children];
  const [visibleCount, setVisibleCount] = useState(0);

  // ref로 현재 카운트 유지 → active 변경 시에도 리셋되지 않음
  const countRef = useRef(0);

  useEffect(() => {
    // 뷰포트 밖이거나 이미 전부 표시됐으면 인터벌 시작 안 함
    if (!active || countRef.current >= items.length) return;

    const interval = setInterval(() => {
      countRef.current += 1;
      setVisibleCount(countRef.current);
      if (countRef.current >= items.length) clearInterval(interval);
    }, delay);

    // active가 false가 되면 인터벌만 정지 (카운트는 유지)
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
