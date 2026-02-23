import { motion } from 'framer-motion';

const STATS = [
  { value: '500+', label: '누적 참가자' },
  { value: '4.8', label: '평균 평점' },
  { value: '68%', label: '매칭 성사율' },
  { value: '72%', label: '재참가율' },
];

const FEATURES = [
  {
    emoji: '🎭',
    title: '외모 승인제',
    desc: '신청서 검토 후 선발된 인원만 입장. 쾌적하고 균형 잡힌 파티 환경.',
  },
  {
    emoji: '👥',
    title: '1:1 로테이션',
    desc: '10~15분마다 파트너가 바뀌는 구조. 어색함 없이 모든 참가자와 눈을 맞춥니다.',
  },
  {
    emoji: '💌',
    title: 'Secret Matching',
    desc: '서로 지목한 경우에만 파티 종료 전 문자 알림. 실패의 두려움 없는 설렘.',
  },
  {
    emoji: '🍾',
    title: 'Premium Venue',
    desc: '프라이빗 라운지에서 진행. 일상에서 벗어난 특별한 밤.',
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function IntroSection() {
  return (
    <section style={{ background: '#09090b' }} className="w-full px-5 py-24 md:py-32">
      <div className="mx-auto flex flex-col gap-16" style={{ maxWidth: '720px' }}>

        {/* 헤더 */}
        <motion.div
          className="flex flex-col gap-4"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={0}
        >
          <p className="text-sm font-semibold tracking-[0.28em] uppercase text-zinc-500">
            About
          </p>
          <h2
            className="font-black text-white leading-tight"
            style={{ fontSize: 'clamp(2.6rem, 8vw, 4.2rem)' }}
          >
            외모승인제<br />파티란?
          </h2>
          <p className="text-zinc-400 leading-relaxed mt-2" style={{ fontSize: '1.05rem', maxWidth: '480px' }}>
            단순한 소개팅 파티가 아닙니다.<br />
            신청서 검토를 통해 선발된 인원만 참여하는 프라이빗 소셜 파티.
            비주얼부터 분위기까지, 수준이 다른 만남이 시작됩니다.
          </p>
        </motion.div>

        {/* 스탯 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="flex flex-col gap-1 rounded-2xl px-5 py-5"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.07)',
              }}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={i * 0.5}
            >
              <span
                className="font-black text-white"
                style={{ fontSize: 'clamp(1.8rem, 5vw, 2.4rem)' }}
              >
                {stat.value}
              </span>
              <span className="text-xs text-zinc-500 font-medium">{stat.label}</span>
            </motion.div>
          ))}
        </div>

        {/* 피처 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {FEATURES.map((feat, i) => (
            <motion.div
              key={feat.title}
              className="flex flex-col gap-3 rounded-2xl px-6 py-6"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
              }}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={i * 0.15}
            >
              <span style={{ fontSize: '1.8rem' }}>{feat.emoji}</span>
              <p className="text-base font-bold text-zinc-100">{feat.title}</p>
              <p className="text-sm text-zinc-400 leading-relaxed">{feat.desc}</p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
