import React from 'react';
import { motion } from 'framer-motion';
import PartBridge from './PartBridge';

const ITEMS = [
  {
    part: '1부 — 01',
    emoji: '🥂',
    title: '웰컴 드링크\n& 블라인드 카드',
    desc: '입장과 동시에 #웃음예쁨 #직진남 #반전매력 — 당신만의 매력 키워드 카드를 받습니다. 이름보다 키워드로 대화가 먼저 시작됩니다.',
    image: 'https://picsum.photos/seed/drinks42/1200/900',
    accent: '#a78bfa',
    align: 'left',
  },
  {
    part: '1부 — 02',
    emoji: '📸',
    title: 'Best Dresser\n실시간 투표',
    desc: '파티장 한켠의 폴라로이드 존. 가장 스타일리시한 남녀를 참가자들이 직접 투표합니다. 서로를 유심히 관찰할 완벽한 명분.',
    image: 'https://picsum.photos/seed/fashion55/1200/900',
    accent: '#f9a8d4',
    align: 'right',
  },
  {
    part: '1부 — 03',
    emoji: '🎴',
    title: '1:1 로테이션\n스피드 토크',
    desc: '10~15분마다 파트너가 바뀝니다. 테이블 위 Q&A 카드가 어색함을 없애줍니다. 모든 사람과 자연스럽게 눈을 맞추는 시간.',
    image: 'https://picsum.photos/seed/social99/1200/900',
    accent: '#6ee7b7',
    align: 'left',
  },
  {
    part: '2부 — 01',
    emoji: '💌',
    title: 'Secret\nMatching',
    desc: '마음에 드는 번호를 적어 운영진에게 제출하세요. 서로 지목했을 때만 파티 종료 전 문자로 알려드립니다. 실패의 두려움 없는 설렘.',
    image: 'https://picsum.photos/seed/heart11/1200/900',
    accent: '#fb7185',
    align: 'right',
  },
  {
    part: '2부 — 02',
    emoji: '🍾',
    title: '샴페인\n룰렛 & 옥션',
    desc: '게임 미션 승리팀에게 고급 샴페인이 제공됩니다. 팀별 합석이 자연스럽게 이루어지고, 분위기는 걷잡을 수 없이 달아오릅니다.',
    image: 'https://picsum.photos/seed/champagne8/1200/900',
    accent: '#fcd34d',
    align: 'left',
  },
  {
    part: '2부 — 03',
    emoji: '🎵',
    title: 'After-Party\n무제한 나이트',
    desc: '조명을 낮추고 힙합·하우스로 전환. 라운지는 클럽이 됩니다. 오늘 밤을 기억하게 될 마지막 시간.',
    image: 'https://picsum.photos/seed/night77/1200/900',
    accent: '#818cf8',
    align: 'right',
  },
];

export default function ProgramSection() {
  return (
    <section style={{ background: '#09090b' }} className="w-full">

      <PartBridge
        id="part1"
        part="1부"
        subtitle="Eye-Contact"
        subtitleKo="아이 컨택 · 시선"
        desc="눈으로 먼저 스캔하고 서로를 점찍는 단계"
        color="#a78bfa"
      />

      {/* 아이템 */}
      {ITEMS.map((item, i) => (
        <React.Fragment key={i}>
        {i === 3 && (
          <PartBridge
            id="part2"
            part="2부"
            subtitle="Mind-Connect"
            subtitleKo="마인드 커넥트 · 연결"
            desc="시선을 넘어 확신으로 이어지는 단계"
            color="#fb7185"
          />
        )}
        <motion.div
          className={`w-full flex flex-col ${item.align === 'right' ? 'md:flex-row-reverse' : 'md:flex-row'}`}
          style={{ minHeight: '100vh' }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
        >
          {/* 이미지 */}

          <div
            className="relative overflow-hidden md:w-1/2"
            style={{ height: '55vw', minHeight: '260px', flexShrink: 0 }}
          >
            <motion.img
              src={item.image}
              alt={item.title}
              crossOrigin="anonymous"
              className="absolute inset-0 w-full h-full object-cover"
              initial={{ scale: 1.06 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            />
            {/* 모바일: 아래쪽 페이드 / 데스크탑: 옆쪽 페이드 */}
            <div
              className="absolute inset-0 md:hidden"
              style={{ background: 'linear-gradient(to bottom, transparent 50%, #09090b)' }}
            />
            <div
              className="absolute inset-0 hidden md:block"
              style={{
                background: item.align === 'left'
                  ? 'linear-gradient(to right, transparent 55%, #09090b)'
                  : 'linear-gradient(to left, transparent 55%, #09090b)',
              }}
            />
          </div>

          {/* 텍스트 */}
          <motion.div
            className="flex flex-col justify-center px-6 py-12 md:px-16 md:py-0"
            style={{ flex: 1 }}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* 파트 레이블 */}
            <div className="flex items-center gap-3 mb-5">
              <span style={{ fontSize: '2rem' }}>{item.emoji}</span>
              <p
                className="text-sm font-bold tracking-[0.2em] uppercase"
                style={{ color: item.accent }}
              >
                {item.part}
              </p>
            </div>

            {/* 제목 */}
            <h3
              className="font-bold text-white leading-tight mb-5"
              style={{ fontSize: 'clamp(2.4rem, 9vw, 3.8rem)', whiteSpace: 'pre-line' }}
            >
              {item.title}
            </h3>

            {/* 구분선 */}
            <div
              className="rounded-full mb-6"
              style={{ width: '48px', height: '3px', background: item.accent }}
            />

            {/* 설명 */}
            <p
              className="text-zinc-300 leading-relaxed"
              style={{ fontSize: 'clamp(1rem, 3.5vw, 1.15rem)', maxWidth: '420px' }}
            >
              {item.desc}
            </p>
          </motion.div>
        </motion.div>
        </React.Fragment>
      ))}

      <div style={{ height: '60px' }} />
    </section>
  );
}
