import { CanvasText } from './CanvasText';
import './AboutSection.css';

const AboutSection = () => {
  return (
    <section className="about" id="work">
      <div className="about__inner">

        {/* 섹션 라벨 */}
        <p className="about__label">About me</p>

        {/* 메인 헤드라인 */}
        <h2 className="about__headline">
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

        {/* 설명 */}
        <p className="about__desc">
          Passionate about crafting interfaces that feel alive.
          I blend design sensibility with technical depth to ship
          products that leave a lasting impression.
        </p>

        {/* 스킬 태그 */}
        <ul className="about__tags">
          {['React', 'Three.js', 'TypeScript', 'Node.js', 'Figma', 'CSS / Motion'].map(tag => (
            <li key={tag} className="about__tag">{tag}</li>
          ))}
        </ul>

      </div>
    </section>
  );
};

export default AboutSection;
