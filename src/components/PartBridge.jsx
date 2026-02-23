import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

export default function PartBridge({ id, part, subtitle, subtitleKo, desc, color }) {
  const sectionRef = useRef(null);
  const descRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const split = new SplitText(descRef.current, { type: 'words', wordsClass: 'word' });

      gsap.set(split.words, { opacity: 0.15 });

      gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=150%',
          pin: true,
          scrub: true,
        },
      }).to(split.words, {
        opacity: 1,
        stagger: 0.1,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id={id}
      ref={sectionRef}
      className="w-full h-screen flex items-center"
      style={{ background: '#09090b' }}
    >
      <div className="w-full px-8 md:px-20" style={{ maxWidth: '800px', margin: '0 auto' }}>

        <p
          className="text-xs font-bold tracking-[0.3em] uppercase mb-6"
          style={{ color }}
        >
          {part} · {subtitle} · {subtitleKo}
        </p>

        <p
          ref={descRef}
          className="font-bold text-white leading-tight"
          style={{ fontSize: 'clamp(2.2rem, 5.5vw, 3.6rem)' }}
        >
          {desc}
        </p>

      </div>
    </section>
  );
}
