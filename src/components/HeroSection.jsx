import Antigravity from './Antigravity';
import './HeroSection.css';

const HeroSection = () => {
  return (
    <section className="hero">
      {/* Antigravity 배경 캔버스 */}
      <div className="hero__canvas">
        <Antigravity
          count={350}
          color="#a78bfa"
          magnetRadius={12}
          ringRadius={8}
          waveSpeed={0.5}
          waveAmplitude={1.2}
          particleSize={1.8}
          lerpSpeed={0.08}
          autoAnimate={true}
          pulseSpeed={2.5}
          particleShape="capsule"
          fieldStrength={8}
          rotationSpeed={0.05}
        />
      </div>

      {/* 콘텐츠 오버레이 */}
      <div className="hero__content">
        <p className="hero__eyebrow">Welcome to my portfolio</p>
        <h1 className="hero__title">
          Creative<br />
          <span className="hero__title--accent">Developer</span>
        </h1>
        <p className="hero__description">
          Move your cursor to interact with the particles.
          <br />
          Building beautiful things with code.
        </p>
        <div className="hero__actions">
          <a href="#work" className="btn btn--primary">View Work</a>
          <a href="#contact" className="btn btn--ghost">Contact Me</a>
        </div>
      </div>

      {/* 스크롤 힌트 */}
      <div className="hero__scroll-hint">
        <span>Scroll</span>
        <div className="hero__scroll-line" />
      </div>
    </section>
  );
};

export default HeroSection;
