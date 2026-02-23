import { useState, useEffect } from 'react';
import { trackFormStep, trackFormSubmit, trackCompletedAnswers, trackAbandonedAnswers } from '../lib/analytics';

const FORMSPREE_URL = 'https://formspree.io/f/mkozwrwj';

const STEPS = [
  {
    id: 'name',
    question: '이름이 어떻게 되세요?',
    type: 'text',
    placeholder: '홍길동',
  },
  {
    id: 'age',
    question: '나이가 어떻게 되세요?',
    type: 'radio',
    options: ['만 20세', '21~25세', '26~30세', '31세 이상'],
  },
  {
    id: 'gender',
    question: '성별을 알려주세요.',
    type: 'radio',
    options: ['남성', '여성', '논바이너리', '비공개'],
  },
  {
    id: 'instagram',
    question: '인스타그램 아이디를 알려주세요.',
    type: 'text',
    placeholder: '@username',
  },
  {
    id: 'intro',
    question: '간단한 자기소개를 해주세요.',
    type: 'textarea',
    placeholder: '어떤 사람인지 자유롭게 작성해 주세요.',
  },
  {
    id: 'body',
    question: '본인의 체형을 선택해 주세요.',
    type: 'radio',
    options: ['슬림', '보통', '근육질', '통통'],
  },
  {
    id: 'job',
    question: '직업이 어떻게 되세요?',
    type: 'radio',
    options: ['대학생', '직장인', '프리랜서', '기타'],
  },
  {
    id: 'reason',
    question: '파티에 참여하고 싶은 이유가 뭔가요?',
    type: 'radio',
    options: ['새로운 인연', '재미있을 것 같아서', '지인 추천', '기타'],
  },
  {
    id: 'phone',
    question: '연락처를 알려주세요.',
    type: 'tel',
    placeholder: '010-0000-0000',
  },
  {
    id: 'memo',
    question: '마지막으로 하고 싶은 말이 있나요?',
    type: 'textarea',
    placeholder: '어필하고 싶은 내용을 자유롭게 적어주세요.',
  },
];

const LABEL_MAP = {
  name: '이름',
  age: '나이',
  gender: '성별',
  instagram: '인스타그램',
  intro: '자기소개',
  body: '체형',
  job: '직업',
  reason: '참여 동기',
  phone: '연락처',
  memo: '하고 싶은 말',
};

const ContactSection = () => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [status, setStatus] = useState('idle');

  // 새 스텝 첫 도달 시에만 기록 (뒤로가기 제외)
  useEffect(() => {
    const prev = parseInt(sessionStorage.getItem('form_max_step') ?? '-1');
    if (step > prev) {
      sessionStorage.setItem('form_max_step', String(step));
      trackFormStep(step);
    }
    // 현재 진행 상태를 sessionStorage에 저장 (이탈 감지용)
    sessionStorage.setItem('form_progress', JSON.stringify({ step, answers }));
  }, [step, answers]);

  // 페이지 이탈 알럿 + 중도 포기 기록
  useEffect(() => {
    const handleUnload = (e) => {
      const raw = sessionStorage.getItem('form_progress');
      if (!raw) return;
      const { step: s, answers: a } = JSON.parse(raw);
      if (s > 0) {
        trackAbandonedAnswers(a, s);
        // 브라우저 기본 이탈 확인 다이얼로그 표시
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, []);

  // 이어서 작성 이벤트 수신 (ResumeToast에서 발송)
  useEffect(() => {
    const handleResume = (e) => {
      setStep(e.detail.step);
      setAnswers(e.detail.answers);
    };
    window.addEventListener('resume-form', handleResume);
    return () => window.removeEventListener('resume-form', handleResume);
  }, []);

  const current = STEPS[step];
  const total = STEPS.length;
  const progress = (step / total) * 100;
  const value = answers[current.id] ?? '';
  const canNext = value.toString().trim() !== '';

  const handleText = (e) => {
    setAnswers((prev) => ({ ...prev, [current.id]: e.target.value }));
  };

  const handleRadio = (option) => {
    setAnswers((prev) => ({ ...prev, [current.id]: option }));
    if (step < total - 1) {
      setTimeout(() => setStep((s) => s + 1), 300);
    }
  };

  const handleNext = () => {
    if (step < total - 1) setStep((s) => s + 1);
  };

  const handleBack = () => {
    if (step > 0) setStep((s) => s - 1);
  };

  const handleSubmit = async () => {
    setStatus('sending');
    const payload = Object.fromEntries(
      Object.entries(answers).map(([k, v]) => [LABEL_MAP[k] ?? k, v])
    );

    try {
      const res = await fetch(FORMSPREE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        trackFormSubmit();
        trackCompletedAnswers(answers);
        sessionStorage.removeItem('form_max_step');
        sessionStorage.removeItem('form_progress');
      }
      setStatus(res.ok ? 'success' : 'error');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-violet-500/20 text-4xl text-violet-400">
            ✓
          </div>
          <p className="text-3xl font-bold text-zinc-100">신청 완료!</p>
          <p className="text-lg text-zinc-400">검토 후 빠르게 연락드리겠습니다.</p>
          <button
            onClick={() => { setStatus('idle'); setStep(0); setAnswers({}); }}
            className="mt-2 text-sm text-zinc-600 underline underline-offset-4 hover:text-zinc-400 transition-colors"
          >
            다시 신청하기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5 py-16">
      <div className="w-full flex flex-col gap-10" style={{ maxWidth: '560px' }}>

        {/* Progress */}
        <div className="flex flex-col gap-3">
          <div className="flex justify-between text-sm text-zinc-500">
            <span>{step + 1} / {total}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-white/[0.06]">
            <div
              className="h-1.5 rounded-full bg-gradient-to-r from-violet-500 to-pink-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="flex flex-col gap-7">
          <h2
            className="font-bold text-zinc-100 leading-snug"
            style={{ fontSize: 'clamp(1.6rem, 6vw, 2.2rem)' }}
          >
            {current.question}
          </h2>

          {/* Radio */}
          {current.type === 'radio' && (
            <div className="grid grid-cols-2 gap-3">
              {current.options.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleRadio(option)}
                  className={`rounded-2xl border px-4 py-5 text-base font-medium text-left transition-all duration-200
                    ${value === option
                      ? 'border-violet-500 bg-violet-500/10 text-violet-300'
                      : 'border-white/[0.08] bg-white/[0.03] text-zinc-300 hover:border-white/20 hover:bg-white/[0.06]'
                    }`}
                >
                  {option}
                </button>
              ))}
            </div>
          )}

          {/* Text / Tel */}
          {(current.type === 'text' || current.type === 'tel') && (
            <input
              type={current.type}
              value={value}
              onChange={handleText}
              placeholder={current.placeholder}
              className="w-full rounded-2xl border border-white/[0.08] bg-white/[0.03] px-5 py-4 text-base text-zinc-200 placeholder:text-zinc-600 outline-none transition-all duration-200 focus:border-violet-500/60 focus:bg-white/[0.05] focus:ring-2 focus:ring-violet-500/20"
              onKeyDown={(e) => e.key === 'Enter' && canNext && handleNext()}
            />
          )}

          {/* Textarea */}
          {current.type === 'textarea' && (
            <textarea
              value={value}
              onChange={handleText}
              placeholder={current.placeholder}
              rows={4}
              className="w-full rounded-2xl border border-white/[0.08] bg-white/[0.03] px-5 py-4 text-base text-zinc-200 placeholder:text-zinc-600 outline-none transition-all duration-200 focus:border-violet-500/60 focus:bg-white/[0.05] focus:ring-2 focus:ring-violet-500/20 resize-none"
            />
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={handleBack}
            disabled={step === 0}
            className="px-6 py-4 rounded-full text-base font-medium text-zinc-500 border border-white/[0.08] hover:border-white/20 hover:text-zinc-300 transition-all duration-200 disabled:opacity-0 disabled:pointer-events-none"
          >
            ← 이전
          </button>

          {step < total - 1 ? (
            <button
              type="button"
              onClick={handleNext}
              disabled={!canNext}
              className="px-8 py-4 rounded-full text-base font-semibold text-white bg-gradient-to-br from-violet-700 to-purple-500 shadow-[0_0_24px_rgba(139,92,246,0.35)] hover:shadow-[0_0_36px_rgba(139,92,246,0.55)] hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              다음 →
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!canNext || status === 'sending'}
              className="px-8 py-4 rounded-full text-base font-semibold text-white bg-gradient-to-br from-violet-700 to-purple-500 shadow-[0_0_24px_rgba(139,92,246,0.35)] hover:shadow-[0_0_36px_rgba(139,92,246,0.55)] hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {status === 'sending' ? '전송 중…' : '신청하기 ✓'}
            </button>
          )}
        </div>

        {status === 'error' && (
          <p className="text-sm text-rose-400 text-center">오류가 발생했습니다. 다시 시도해 주세요.</p>
        )}

      </div>
    </div>
  );
};

export default ContactSection;
