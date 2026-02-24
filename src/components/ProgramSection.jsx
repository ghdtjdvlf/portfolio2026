import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { getLenis } from '../lib/lenis';
import './ProgramSection.css';

gsap.registerPlugin(SplitText);

const BG_GRADIENT =
  'linear-gradient(180deg, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.1) 100%)';

const SECTIONS = [
  {
    heading: 'Best Dresser',
    part: '1부 — 02',
    emoji: '📸',
    desc: '파티장 한켠의 폴라로이드 존. 가장 스타일리시한 남녀를 참가자들이 직접 투표합니다. 서로를 유심히 관찰할 완벽한 명분.',
    bg: 'https://picsum.photos/seed/fashion55/1200/900',
    accent: '#f9a8d4',
  },
  {
    heading: '1:1 로테이션 스피드토크',
    part: '1부 — 03',
    emoji: '🎴',
    desc: '10~15분마다 파트너가 바뀝니다. 테이블 위 Q&A 카드가 어색함을 없애줍니다. 모든 사람과 자연스럽게 눈을 맞추는 시간.',
    bg: 'https://picsum.photos/seed/social99/1200/900',
    accent: '#6ee7b7',
  },
  {
    heading: 'Secret Matching',
    part: '2부 — 01',
    emoji: '💌',
    desc: '마음에 드는 번호를 적어 운영진에게 제출하세요. 서로 지목했을 때만 파티 종료 전 문자로 알려드립니다. 실패의 두려움 없는 설렘.',
    bg: 'https://picsum.photos/seed/heart11/1200/900',
    accent: '#fb7185',
  },
  {
    heading: '샴페인 룰렛',
    part: '2부 — 02',
    emoji: '🍾',
    desc: '게임 미션 승리팀에게 고급 샴페인이 제공됩니다. 팀별 합석이 자연스럽게 이루어지고, 분위기는 걷잡을 수 없이 달아오릅니다.',
    bg: 'https://picsum.photos/seed/champagne8/1200/900',
    accent: '#fcd34d',
  },
];

export default function ProgramSection() {
  const outerRef = useRef(null);
  const stageRef = useRef(null);
  const [detailOpen, setDetailOpen] = useState(false);

  useEffect(() => {
    const outer = outerRef.current;
    const stage = stageRef.current;
    if (!outer || !stage) return;

    const sectionEls    = Array.from(stage.querySelectorAll('section'));
    const imageEls      = Array.from(stage.querySelectorAll('.bg'));
    const headingEls    = Array.from(stage.querySelectorAll('.section-heading'));
    const outerWrappers = Array.from(stage.querySelectorAll('.outer'));
    const innerWrappers = Array.from(stage.querySelectorAll('.inner'));

    const splitHeadings = headingEls.map(
      (h) => new SplitText(h, { type: 'chars,words,lines', linesClass: 'clip-text' }),
    );

    let currentIndex = -1;
    let animating = false;

    gsap.set(outerWrappers, { yPercent: 100 });
    gsap.set(innerWrappers, { yPercent: -100 });

    // ── 애니메이션과 함께 섹션 전환 ──
    function gotoSection(index, direction) {
      if (animating || index === currentIndex) return;
      index = Math.max(0, Math.min(sectionEls.length - 1, index));

      animating = true;
      const fromTop = direction === -1;
      const dFactor = fromTop ? -1 : 1;
      const tl = gsap.timeline({
        defaults: { duration: 1.25, ease: 'power1.inOut' },
        onComplete: () => { animating = false; },
      });

      if (currentIndex >= 0) {
        gsap.set(sectionEls[currentIndex], { zIndex: 0 });
        tl.to(imageEls[currentIndex], { yPercent: -15 * dFactor }).set(
          sectionEls[currentIndex], { autoAlpha: 0 },
        );
      }

      gsap.set(sectionEls[index], { autoAlpha: 1, zIndex: 1 });
      tl.fromTo(
        [outerWrappers[index], innerWrappers[index]],
        { yPercent: (i) => (i ? -100 * dFactor : 100 * dFactor) },
        { yPercent: 0 },
        0,
      )
        .fromTo(imageEls[index], { yPercent: 15 * dFactor }, { yPercent: 0 }, 0)
        .fromTo(
          splitHeadings[index].chars,
          { autoAlpha: 0, yPercent: 150 * dFactor },
          {
            autoAlpha: 1,
            yPercent: 0,
            duration: 1,
            ease: 'power2',
            stagger: { each: 0.02, from: 'random' },
          },
          0.2,
        );

      currentIndex = index;
    }

    // ── 애니메이션 없이 즉시 전환 (아래에서 진입 시 동기화) ──
    function snapToSection(index) {
      if (currentIndex >= 0) {
        gsap.set(sectionEls[currentIndex], { autoAlpha: 0, zIndex: 0 });
      }
      gsap.set(sectionEls[index], { autoAlpha: 1, zIndex: 1 });
      gsap.set([outerWrappers[index], innerWrappers[index]], { yPercent: 0 });
      gsap.set(imageEls[index], { yPercent: 0 });
      gsap.set(splitHeadings[index].chars, { autoAlpha: 1, yPercent: 0 });
      currentIndex = index;
    }

    gotoSection(0, 1);

    // ── 섹션 전환 + Lenis 위치 동기화 ──
    function advanceSection(dir) {
      if (animating) return;
      const next = currentIndex + dir;
      if (next < 0 || next >= SECTIONS.length) return;

      gotoSection(next, dir);
      // Lenis 내부 스크롤 상태를 즉시 동기화 (force: true → stopped 상태 무시)
      const targetY = outer.offsetTop + next * window.innerHeight;
      getLenis()?.scrollTo(targetY, { immediate: true, force: true });
    }

    // ── Wheel: capture phase에서 Lenis보다 먼저 처리 ──
    const handleWheel = (e) => {
      const rect = outer.getBoundingClientRect();
      const viewH = window.innerHeight;
      // sticky 활성 구간이 아니면 무시
      if (rect.top > 0 || rect.bottom < viewH) return;

      const dir = e.deltaY > 0 ? 1 : -1;

      // 경계에서는 preventDefault 없이 통과 → Lenis가 자연스럽게 섹션을 벗어남
      if (dir === -1 && currentIndex === 0) return;
      if (dir === 1 && currentIndex === SECTIONS.length - 1) return;

      // 내부 섹션 이동: Lenis wheel 이벤트 차단 후 수동 전환
      e.preventDefault();
      e.stopPropagation();
      advanceSection(dir);
    };

    // ── Touch: 스와이프 방향으로 섹션 전환 ──
    let touchStartY = 0;
    let touchLocked = false;

    const handleTouchStart = (e) => {
      const rect = outer.getBoundingClientRect();
      const viewH = window.innerHeight;
      touchLocked = rect.top <= 0 && rect.bottom >= viewH;
      if (touchLocked) touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = (e) => {
      if (!touchLocked) return;
      const dir = (touchStartY - e.touches[0].clientY) > 0 ? 1 : -1;
      if (dir === -1 && currentIndex === 0) return;
      if (dir === 1 && currentIndex === SECTIONS.length - 1) return;
      e.preventDefault();
      e.stopPropagation();
    };

    const handleTouchEnd = (e) => {
      if (!touchLocked) return;
      touchLocked = false;

      const deltaY = touchStartY - e.changedTouches[0].clientY;
      if (Math.abs(deltaY) < 50) return;

      const dir = deltaY > 0 ? 1 : -1;
      if (dir === -1 && currentIndex === 0) return;
      if (dir === 1 && currentIndex === SECTIONS.length - 1) return;

      advanceSection(dir);
    };

    // ── Scroll: 아래에서 재진입 시 시각 상태 동기화 ──
    let wasActive = false;
    const handleScroll = () => {
      const rect = outer.getBoundingClientRect();
      const viewH = window.innerHeight;
      const isActive = rect.top <= 0 && rect.bottom >= viewH;

      if (isActive && !wasActive) {
        wasActive = true;
        const scrolled = Math.max(0, -rect.top);
        const syncIdx = Math.min(SECTIONS.length - 1, Math.round(scrolled / viewH));
        if (syncIdx !== currentIndex) snapToSection(syncIdx);
      } else if (!isActive) {
        wasActive = false;
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false, capture: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true, capture: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false, capture: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true, capture: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('wheel', handleWheel, { capture: true });
      window.removeEventListener('touchstart', handleTouchStart, { capture: true });
      window.removeEventListener('touchmove', handleTouchMove, { capture: true });
      window.removeEventListener('touchend', handleTouchEnd, { capture: true });
      window.removeEventListener('scroll', handleScroll);
      splitHeadings.forEach((s) => s.revert());
    };
  }, []);

  return (
    <>
      {/* ── Tall wrapper: 섹션당 100vh + 탈출 버퍼 100vh ── */}
      <div ref={outerRef} style={{ height: `${(SECTIONS.length + 1) * 100}vh` }}>
        {/* ── Sticky stage ── */}
        <div ref={stageRef} className="prog-stage">
          {SECTIONS.map((s, i) => (
            <section key={i}>
              <div className="outer">
                <div className="inner">
                  <div
                    className="bg"
                    style={{ backgroundImage: `${BG_GRADIENT}, url(${s.bg})` }}
                  >
                    <h2 className="section-heading">{s.heading}</h2>
                  </div>
                </div>
              </div>
            </section>
          ))}
        </div>
      </div>

      {/* ── 자세히 보기 ── */}
      <div className="prog-detail">
        <button
          className="prog-detail-btn"
          onClick={() => setDetailOpen((o) => !o)}
        >
          {detailOpen ? '닫기 ↑' : '자세히 보기 ↓'}
        </button>

        <div className={`prog-detail-body${detailOpen ? ' open' : ''}`}>
          <div className="prog-detail-grid">
            {SECTIONS.map((s, i) => (
              <div key={i} className="prog-detail-item">
                <p className="prog-detail-part" style={{ color: s.accent }}>
                  {s.emoji}&nbsp;&nbsp;{s.part}
                </p>
                <h3 className="prog-detail-title">{s.heading}</h3>
                <p className="prog-detail-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
