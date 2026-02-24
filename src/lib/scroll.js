import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollToPlugin);

export function scrollToSection(target, offset = -80) {
  gsap.to(window, {
    duration: 1.2,
    scrollTo: { y: target, offsetY: Math.abs(offset) },
    ease: 'power2.inOut',
  });
}
