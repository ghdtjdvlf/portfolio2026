import Lenis from 'lenis';
import { createContext, useContext, useEffect, useRef } from 'react';

const LenisContext = createContext(null);

// 모듈 스코프에 인스턴스 보관 → 어디서든 scrollToSection() 호출 가능
let _lenis = null;

export function scrollToSection(target, offset = -80) {
  if (_lenis) {
    _lenis.scrollTo(target, { offset, duration: 1.2 });
  } else {
    // lenis 미초기화 fallback
    const el = typeof target === 'string'
      ? document.querySelector(target)
      : target;
    el?.scrollIntoView({ behavior: 'smooth' });
  }
}

export function LenisProvider({ children }) {
  const ref = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
    });

    _lenis = lenis;
    ref.current = lenis;

    let rafId;
    const raf = (time) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      _lenis = null;
      ref.current = null;
    };
  }, []);

  return <LenisContext.Provider value={ref}>{children}</LenisContext.Provider>;
}

export function useLenis() {
  return useContext(LenisContext);
}
