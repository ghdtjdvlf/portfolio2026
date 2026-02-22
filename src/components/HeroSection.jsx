import Antigravity from './Antigravity';

const HeroSection = () => {
  return (
    <section className="relative w-full h-screen min-h-[600px] bg-background overflow-hidden flex items-center justify-center">

      {/* Antigravity canvas background */}
      <div className="absolute inset-0 z-0">
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

      {/* Content overlay */}
      <div className="relative z-10 text-center px-6 pointer-events-none select-none">
        <p className="text-[0.8rem] font-medium tracking-[0.25em] uppercase text-violet-400 mb-6">
          Welcome to my portfolio
        </p>

        <h1 className="text-[clamp(3rem,10vw,7.5rem)] font-extrabold leading-[1.05] tracking-tight text-zinc-50 mb-6">
          Creative<br />
          <span className="bg-gradient-to-br from-violet-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            Developer
          </span>
        </h1>

        <p className="text-[clamp(0.95rem,2vw,1.15rem)] leading-7 text-zinc-400 max-w-[36ch] mx-auto mb-10">
          Move your cursor to interact with the particles.<br />
          Building beautiful things with code.
        </p>

        <div className="flex gap-4 justify-center flex-wrap pointer-events-auto">
          <a
            href="#work"
            className="inline-flex items-center justify-center px-8 py-3 rounded-full text-sm font-semibold text-white bg-gradient-to-br from-violet-700 to-purple-500 shadow-[0_0_24px_rgba(139,92,246,0.45)] hover:shadow-[0_0_36px_rgba(139,92,246,0.65)] hover:-translate-y-0.5 transition-all duration-200"
          >
            View Work
          </a>
          <a
            href="#contact"
            className="inline-flex items-center justify-center px-8 py-3 rounded-full text-sm font-semibold text-zinc-200 border border-white/[0.18] backdrop-blur-sm hover:bg-white/[0.06] hover:-translate-y-0.5 transition-all duration-200"
          >
            Contact Me
          </a>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-zinc-600 text-[0.7rem] tracking-[0.2em] uppercase">
        <span>Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-zinc-600 to-transparent animate-scroll-pulse" />
      </div>

    </section>
  );
};

export default HeroSection;
