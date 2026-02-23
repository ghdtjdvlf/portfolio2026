import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Sparkles, LayoutGrid, Star, Send } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { scrollToSection } from '../lib/lenis';

const NAV_ITEMS = [
  { name: '소개',    link: '#intro',    Icon: Sparkles },
  { name: '컨텐츠', link: '#program',  Icon: LayoutGrid },
  { name: '후기',   link: '#reviews',  Icon: Star },
  { name: '신청',   link: '#contact',  Icon: Send },
];

const SECTION_IDS = NAV_ITEMS.map((item) => item.link.slice(1));

const SCALE_MAX  = 1.5;
const DISTANCE   = 80;
const SPRING_CFG = { mass: 0.1, stiffness: 180, damping: 14 };

/* ── 활성 섹션 감지 ── */
function useActiveSection() {
  const [active, setActive] = useState(SECTION_IDS[0]);

  useEffect(() => {
    const update = () => {
      const threshold = window.innerHeight * 0.45;
      let best = SECTION_IDS[0];
      for (const id of SECTION_IDS) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= threshold) best = id;
      }
      setActive(best);
    };

    window.addEventListener('scroll', update, { passive: true });
    update();
    return () => window.removeEventListener('scroll', update);
  }, []);

  return active;
}

/* ── 개별 아이콘 ── */
function DockItem({ item, mouseX, isActive }) {
  const ref = useRef(null);

  const distance = useTransform(() => {
    if (!ref.current) return Infinity;
    const bounds = ref.current.getBoundingClientRect();
    const center = bounds.left + bounds.width / 2;
    const mx = mouseX.get();
    return mx === -Infinity ? Infinity : Math.abs(mx - center);
  });

  const scale = useTransform(distance, [0, DISTANCE, DISTANCE + 1], [SCALE_MAX, 1, 1]);
  const scaleSpring = useSpring(scale, SPRING_CFG);

  return (
    <motion.a
      ref={ref}
      href={item.link}
      onClick={(e) => { e.preventDefault(); scrollToSection(item.link); }}
      style={{ scale: scaleSpring, transformOrigin: 'bottom center' }}
      className="flex flex-col items-center gap-1 cursor-pointer select-none"
    >
      <motion.div
        animate={{
          background: isActive ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.08)',
          borderColor: isActive ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.15)',
          boxShadow: isActive ? '0 0 14px rgba(255,255,255,0.25)' : '0 0 0px rgba(255,255,255,0)',
        }}
        transition={{ duration: 0.25 }}
        className="w-12 h-12 rounded-2xl border flex items-center justify-center"
      >
        <motion.div
          animate={{ color: isActive ? '#18181b' : '#ffffff' }}
          transition={{ duration: 0.25 }}
        >
          <item.Icon size={22} />
        </motion.div>
      </motion.div>

      <motion.span
        animate={{ color: isActive ? '#ffffff' : 'rgba(255,255,255,0.45)' }}
        transition={{ duration: 0.25 }}
        className="text-[10px] font-medium"
      >
        {item.name}
      </motion.span>
    </motion.a>
  );
}

/* ── 메인 Dock ── */
export default function MobileDock() {
  const mouseX  = useMotionValue(-Infinity);
  const dockRef = useRef(null);
  const active  = useActiveSection();

  useEffect(() => {
    const el = dockRef.current;
    if (!el) return;
    const onTouchMove = (e) => mouseX.set(e.touches[0].clientX);
    const onTouchEnd  = ()  => mouseX.set(-Infinity);
    el.addEventListener('touchmove', onTouchMove, { passive: true });
    el.addEventListener('touchend',  onTouchEnd);
    return () => {
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend',  onTouchEnd);
    };
  }, [mouseX]);

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 flex justify-center pb-safe lg:hidden">
      <motion.div
        ref={dockRef}
        onMouseMove={(e) => mouseX.set(e.clientX)}
        onMouseLeave={() => mouseX.set(-Infinity)}
        className="mb-4 px-4 pt-3 pb-2 rounded-3xl flex items-end gap-3"
        style={{
          background: 'rgba(14, 14, 20, 0.78)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
        }}
      >
        {NAV_ITEMS.map((item) => (
          <DockItem
            key={item.link}
            item={item}
            mouseX={mouseX}
            isActive={active === item.link.slice(1)}
          />
        ))}
      </motion.div>
    </div>
  );
}
