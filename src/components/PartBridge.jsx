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

      // Set the initial state of the words to gray and semi-transparent
      gsap.set(split.words, { color: '#808080', opacity: 0.5 });

      gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top', // Pins when the top of the trigger hits the top of the viewport
          end: '+=150%',
          pin: true,
          scrub: true,
        },
      })
      .to({}, { duration: 0.5 }) // Delay the start of the color change animation by 50% of the scroll duration
      .to(split.words, {
        color: color,    // Animate to the final color from the prop
        opacity: 1,      // Animate to full opacity
        stagger: 0.1,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [color]);

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
