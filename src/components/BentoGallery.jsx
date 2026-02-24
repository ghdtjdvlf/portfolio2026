import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flip } from 'gsap/Flip';
import './BentoGallery.css';

gsap.registerPlugin(ScrollTrigger, Flip);

const images = [
  'https://assets.codepen.io/16327/portrait-pattern-1.jpg',
  'https://assets.codepen.io/16327/portrait-image-12.jpg',
  'https://assets.codepen.io/16327/portrait-image-8.jpg',
  'https://assets.codepen.io/16327/portrait-pattern-2.jpg',
  'https://assets.codepen.io/16327/portrait-image-4.jpg',
  'https://assets.codepen.io/16327/portrait-image-3.jpg',
  'https://assets.codepen.io/16327/portrait-pattern-3.jpg',
  'https://assets.codepen.io/16327/portrait-image-1.jpg',
];

const BentoGallery = ({ onLeave, onEnterBack }) => {
  const galleryRef = useRef(null);
  const flipCtxRef = useRef(null);
  const callbacksRef = useRef({ onLeave, onEnterBack });

  useEffect(() => {
    callbacksRef.current = { onLeave, onEnterBack };
  });

  useEffect(() => {
    const createTween = () => {
      const galleryElement = galleryRef.current;
      if (!galleryElement) return;

      const galleryItems = galleryElement.querySelectorAll('.gallery__item');

      flipCtxRef.current && flipCtxRef.current.revert();
      galleryElement.classList.remove('gallery--final');

      flipCtxRef.current = gsap.context(() => {
        galleryElement.classList.add('gallery--final');
        const flipState = Flip.getState(galleryItems);
        galleryElement.classList.remove('gallery--final');

        const flip = Flip.to(flipState, {
          simple: true,
          ease: 'expoScale(1, 5)',
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: galleryElement,
            start: 'center center',
            end: '+=100%',
            scrub: true,
            pin: galleryElement.parentNode,
            onLeave: () => callbacksRef.current.onLeave?.(),
            onEnterBack: () => callbacksRef.current.onEnterBack?.(),
          },
        });
        tl.add(flip);

        return () => gsap.set(galleryItems, { clearProps: 'all' });
      });
    };

    createTween();
    window.addEventListener('resize', createTween);

    return () => {
      window.removeEventListener('resize', createTween);
      flipCtxRef.current && flipCtxRef.current.revert();
    };
  }, []);

  return (
    <>
      <div className="gallery-wrap">
        <div
          className="gallery gallery--bento gallery--switch"
          id="gallery-8"
          ref={galleryRef}
        >
          {images.map((src, i) => (
            <div className="gallery__item" key={i}>
              <img src={src} alt="" />
            </div>
          ))}
        </div>
      </div>

      <div className="bento-section">
        <h2>Here is some content</h2>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
      </div>
    </>
  );
};

export default BentoGallery;
