import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { AnimatedList } from './AnimatedList';

// surname: null → 이름 비공개 / gender: null → 성별 비공개
const REVIEWS = [
  {
    count: 2,
    surname: '김',
    gender: 'F',
    rating: 5,
    text: '이렇게 비주얼이 다 되는 파티는 처음이에요. 입장하는 순간부터 눈이 즐거웠어요 😍',
    date: '2025.06',
  },
  {
    count: 5,
    surname: '박',
    gender: 'M',
    rating: 5,
    text: 'Secret Matching에서 상대방도 저를 골랐다는 연락 받았어요 🩷 용기 내길 잘했습니다.',
    date: '2025.06',
  },
  {
    count: 3,
    surname: null,
    gender: 'F',
    rating: 4,
    text: '1:1 로테이션이 어색함을 완전히 없애줬어요. 자연스럽게 다들 친해졌어요.',
    date: '2025.05',
  },
  {
    count: 7,
    surname: '최',
    gender: 'M',
    rating: 5,
    text: '블라인드 카드 아이디어 진짜 신선했어요. 이름 대신 키워드로 대화하니까 훨씬 재밌었어요.',
    date: '2025.05',
  },
  {
    count: 1,
    surname: null,
    gender: null,
    rating: 5,
    text: '샴페인 룰렛에서 이기고 합석까지 됐어요 ㅋㅋ 분위기가 너무 좋았어요 🍾',
    date: '2025.04',
  },
  {
    count: 4,
    surname: '윤',
    gender: null,
    rating: 4,
    text: '처음엔 긴장했는데 운영진이 분위기를 너무 잘 잡아줬어요. 금방 편해졌습니다.',
    date: '2025.04',
  },
  {
    count: 6,
    surname: '이',
    gender: 'F',
    rating: 5,
    text: '파티 끝나고 연락처 교환했어요. 분위기가 너무 좋아서 시간 가는 줄 몰랐네요 🥂',
    date: '2025.03',
  },
  {
    count: 8,
    surname: null,
    gender: 'M',
    rating: 5,
    text: '혼자 왔는데 전혀 어색하지 않았어요. 로테이션 시스템 덕분에 모두와 대화할 수 있었습니다.',
    date: '2025.03',
  },
];

const Stars = ({ rating }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((i) => (
      <svg
        key={i}
        viewBox="0 0 20 20"
        className="w-4 h-4"
        fill={i <= rating ? '#fbbf24' : 'none'}
        stroke={i <= rating ? '#fbbf24' : '#52525b'}
        strokeWidth="1.5"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
);

const GenderBadge = ({ gender }) => {
  if (gender === 'F') {
    return (
      <span
        className="text-xs font-semibold px-2 py-0.5 rounded-full"
        style={{ background: 'rgba(251,113,133,0.15)', color: '#fb7185', border: '1px solid rgba(251,113,133,0.3)' }}
      >
        여성
      </span>
    );
  }
  if (gender === 'M') {
    return (
      <span
        className="text-xs font-semibold px-2 py-0.5 rounded-full"
        style={{ background: 'rgba(96,165,250,0.15)', color: '#60a5fa', border: '1px solid rgba(96,165,250,0.3)' }}
      >
        남성
      </span>
    );
  }
  return (
    <span
      className="text-xs font-semibold px-2 py-0.5 rounded-full"
      style={{ background: 'rgba(113,113,122,0.2)', color: '#71717a', border: '1px solid rgba(113,113,122,0.25)' }}
    >
      비공개
    </span>
  );
};

const ReviewCard = ({ count, surname, gender, rating, text, date }) => {
  const nameLabel = surname ? `${surname}**` : '이름 비공개';
  const displayName = `${count}회 참가자 ${nameLabel}`;

  return (
    <div
      className="w-full rounded-2xl px-5 py-4 flex flex-col gap-3"
      style={{
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center rounded-full text-sm font-bold text-white shrink-0"
            style={{
              width: '44px',
              height: '44px',
              background: '#0f172a',
            }}
          >
            {surname ?? '?'}
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-zinc-100">{displayName}</p>
              <GenderBadge gender={gender} />
            </div>
            <Stars rating={rating} />
          </div>
        </div>
        <span className="text-xs text-zinc-600 shrink-0 ml-2">{date}</span>
      </div>
      <p className="text-sm text-zinc-300 leading-relaxed">{text}</p>
    </div>
  );
};

const AVG_RATING = (REVIEWS.reduce((s, r) => s + r.rating, 0) / REVIEWS.length).toFixed(1);

export default function ReviewSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: '0px' });

  return (
    <section style={{ background: '#09090b' }} className="w-full px-5 py-20 md:py-28">
      <div className="w-full flex flex-col gap-10" style={{ maxWidth: '560px', margin: '0 auto' }}>

        {/* 헤더 */}
        <motion.div
          className="flex flex-col gap-3"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-sm font-semibold tracking-[0.25em] uppercase text-zinc-600">Reviews</p>
          <h2 className="text-4xl font-bold text-zinc-100 md:text-5xl">참가자 후기</h2>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-5xl font-bold text-white">{AVG_RATING}</span>
            <div className="flex flex-col gap-1">
              <Stars rating={5} />
              <p className="text-xs text-zinc-500">{REVIEWS.length}개의 후기</p>
            </div>
          </div>
        </motion.div>

        {/* 뷰포트 감지용 트리거 */}
        <div ref={ref}>
          <AnimatedList delay={1500} active={isInView}>
            {REVIEWS.map((review, i) => (
              <ReviewCard key={i} {...review} />
            ))}
          </AnimatedList>
        </div>

      </div>
    </section>
  );
}
