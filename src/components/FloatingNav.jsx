import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const NAV_ITEMS = [
  { label: '소개', href: '#hero' },
  { label: '1부', href: '#part1' },
  { label: '2부', href: '#part2' },
  { label: '리뷰', href: '#reviews' },
  { label: '참가신청', href: '#contact' },
];

const navStyle = {
  background: 'rgba(9,9,11,0.85)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255,255,255,0.1)',
  boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
};

export default function FloatingNav() {
  const [active, setActive] = useState('#hero');

  // 현재 섹션 감지
  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY + 160;
      let current = NAV_ITEMS[0].href;
      for (const item of NAV_ITEMS) {
        const el = document.getElementById(item.href.slice(1));
        if (el && el.offsetTop <= y) current = item.href;
      }
      setActive(current);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = (e, href) => {
    e.preventDefault();
    document.getElementById(href.slice(1))?.scrollIntoView({ behavior: 'smooth' });
  };

  const renderItems = (layoutId) =>
    NAV_ITEMS.map((item) => (
      <a
        key={item.href}
        href={item.href}
        onClick={(e) => handleClick(e, item.href)}
        className="relative px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap"
        style={{ color: active === item.href ? '#fff' : '#71717a' }}
      >
        {active === item.href && (
          <motion.div
            layoutId={layoutId}
            className="absolute inset-0 rounded-full"
            style={{ background: 'rgba(255,255,255,0.1)' }}
            transition={{ type: 'spring', stiffness: 380, damping: 32 }}
          />
        )}
        <span className="relative z-10">{item.label}</span>
      </a>
    ));

  return (
    <>
      {/* PC: 상단 중앙 */}
      <div className="fixed top-6 inset-x-0 z-50 hidden md:flex justify-center pointer-events-none">
        <nav
          className="pointer-events-auto flex items-center gap-0.5 px-2 py-1.5 rounded-full"
          style={navStyle}
        >
          {renderItems('desktop-pill')}
        </nav>
      </div>

      {/* 모바일: 하단 중앙 */}
      <div className="fixed bottom-6 inset-x-0 z-50 flex md:hidden justify-center pointer-events-none">
        <nav
          className="pointer-events-auto flex items-center gap-0.5 px-2 py-1.5 rounded-full"
          style={navStyle}
        >
          {renderItems('mobile-pill')}
        </nav>
      </div>
    </>
  );
}
