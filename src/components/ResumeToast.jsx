import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { scrollToSection } from '../lib/scroll';

const STEP_LABELS = [
  '이름', '나이', '성별', '인스타그램', '자기소개',
  '체형', '직업', '참여 동기', '연락처', '하고 싶은 말',
];

export default function ResumeToast() {
  const [phase, setPhase] = useState(null); // null | 'ask' | 'reject'

  useEffect(() => {
    const raw = sessionStorage.getItem('form_progress');
    if (!raw) return;
    try {
      const p = JSON.parse(raw);
      if (p.step > 0) setPhase('ask');
    } catch { /* noop */ }
  }, []);

  const [progress, setProgress] = useState(null);

  useEffect(() => {
    const raw = sessionStorage.getItem('form_progress');
    if (!raw) return;
    try { setProgress(JSON.parse(raw)); } catch { /* noop */ }
  }, []);

  const handleYes = () => {
    window.dispatchEvent(new CustomEvent('resume-form', { detail: progress }));
    scrollToSection('#contact');
    setPhase(null);
  };

  const handleNo = () => {
    setPhase('reject');
  };

  const handleRejectConfirm = () => {
    sessionStorage.removeItem('form_progress');
    sessionStorage.removeItem('form_max_step');
    setPhase(null);
  };

  return (
    <AnimatePresence>
      {phase && (
        <>
          {/* 백드롭 */}
          <motion.div
            className="fixed inset-0 z-[70]"
            style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* 알럿 모달 */}
          <motion.div
            className="fixed inset-0 z-[71] flex items-center justify-center px-6"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
          >
            <div
              className="w-full max-w-xs flex flex-col overflow-hidden"
              style={{
                background: '#1C1C1E',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '14px',
                boxShadow: '0 24px 60px rgba(0,0,0,0.7)',
              }}
            >
              {phase === 'ask' && (
                <>
                  {/* 내용 */}
                  <div className="flex flex-col items-center gap-2 px-6 pt-7 pb-5 text-center">
                    <span className="text-3xl mb-1">✏️</span>
                    <p className="text-base font-bold text-zinc-100">이어서 작성하시겠습니까?</p>
                    <p className="text-sm text-zinc-400 leading-relaxed">
                      <span className="text-zinc-200 font-medium">"{STEP_LABELS[progress?.step ?? 0]}"</span> 단계까지<br />작성하신 내용이 있습니다.
                    </p>
                  </div>

                  {/* 버튼 */}
                  <div
                    className="flex"
                    style={{ borderTop: '0.5px solid rgba(255,255,255,0.1)' }}
                  >
                    <button
                      onClick={handleNo}
                      className="flex-1 py-4 text-sm font-medium text-zinc-400 hover:bg-white/5 transition-colors"
                      style={{ borderRight: '0.5px solid rgba(255,255,255,0.1)' }}
                    >
                      아니요
                    </button>
                    <button
                      onClick={handleYes}
                      className="flex-1 py-4 text-sm font-bold text-[#6366f1] hover:bg-white/5 transition-colors"
                    >
                      예
                    </button>
                  </div>
                </>
              )}

              {phase === 'reject' && (
                <>
                  {/* 내용 */}
                  <div className="flex flex-col items-center gap-2 px-6 pt-7 pb-5 text-center">
                    <span className="text-3xl mb-1">⚠️</span>
                    <p className="text-base font-bold text-zinc-100">처음부터 작성해야 합니다</p>
                    <p className="text-sm text-zinc-400 leading-relaxed">
                      이전에 작성하신 내용은 삭제되며<br />신청서를 처음부터 다시 작성하셔야 합니다.
                    </p>
                  </div>

                  {/* 버튼 */}
                  <div style={{ borderTop: '0.5px solid rgba(255,255,255,0.1)' }}>
                    <button
                      onClick={handleRejectConfirm}
                      className="w-full py-4 text-sm font-bold text-[#f87171] hover:bg-white/5 transition-colors"
                    >
                      확인
                    </button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
