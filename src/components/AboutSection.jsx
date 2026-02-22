import { CanvasText } from './CanvasText';

const SKILLS = ['React', 'Three.js', 'TypeScript', 'Node.js', 'Figma', 'CSS / Motion'];

const AboutSection = () => {
  return (
    <section
      id="work"
      className="relative w-full min-h-screen bg-background flex items-center justify-center py-32 px-6
                 before:absolute before:top-0 before:left-[10%] before:w-4/5 before:h-px
                 before:bg-gradient-to-r before:from-transparent before:via-white/[0.06] before:to-transparent"
    >
      <div className="max-w-[860px] w-full flex flex-col gap-8">

        <p className="text-xs font-semibold tracking-[0.25em] uppercase text-zinc-600">
          About me
        </p>

        <h2 className="text-[clamp(2.8rem,8vw,6.5rem)] font-extrabold leading-[1.1] tracking-tight text-zinc-50 m-0">
          I build{' '}
          <CanvasText
            text="remarkable"
            bgColor="#09090b"
            colors={['#a78bfa', '#818cf8', '#c084fc', '#e879f9', '#f472b6']}
            animationDuration={6}
            lineGap={8}
            curveIntensity={50}
            lineWidth={1.8}
          />{' '}
          digital{' '}
          <CanvasText
            text="experiences"
            bgColor="#09090b"
            colors={['#60a5fa', '#38bdf8', '#34d399', '#a3e635', '#4ade80']}
            animationDuration={8}
            lineGap={8}
            curveIntensity={55}
            lineWidth={1.8}
          />
        </h2>

        <p className="text-[clamp(1rem,2vw,1.2rem)] leading-[1.8] text-zinc-500 max-w-[52ch]">
          Passionate about crafting interfaces that feel alive.
          I blend design sensibility with technical depth to ship
          products that leave a lasting impression.
        </p>

        <ul className="flex flex-wrap gap-2.5 mt-2 list-none">
          {SKILLS.map(tag => (
            <li
              key={tag}
              className="text-xs font-medium tracking-wide px-4 py-1.5 rounded-full border border-white/10 text-zinc-400 bg-white/[0.03] hover:border-violet-400/40 hover:text-violet-300 transition-all duration-200 cursor-default"
            >
              {tag}
            </li>
          ))}
        </ul>

      </div>
    </section>
  );
};

export default AboutSection;
