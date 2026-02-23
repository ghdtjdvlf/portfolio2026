import { useState } from 'react';
import { motion } from 'framer-motion';
import * as Accordion from '@radix-ui/react-accordion';

const FAQ_DATA = [
  {
    id: 1,
    question: '외모승인제 파티가 뭔가요?',
    answer: '신청서 검토 후 선정된 인원만 참여할 수 있는 프라이빗 파티예요. 쾌적한 파티 환경을 위한 최소한의 기준을 적용하고 있어요.',
    icon: '🎉',
    iconPosition: 'left',
  },
  {
    id: 2,
    question: '승인 기준이 어떻게 되나요?',
    answer: '외모만이 아닌 인스타그램 프로필, 자기소개, 분위기 등을 종합적으로 검토해요. 누구든 성실하게 작성하면 승인 확률이 높아져요.',
    icon: '⭐',
    iconPosition: 'right',
  },
  {
    id: 3,
    question: '결과는 언제 알 수 있나요?',
    answer: '신청 마감 후 24~48시간 내로 연락처로 결과를 안내해 드려요.',
    icon: '💫',
    iconPosition: 'left',
  },
  {
    id: 4,
    question: '파티 장소와 날짜는 언제인가요?',
    answer: '승인된 분들께만 개별적으로 장소와 일정을 공유해 드려요.',
    icon: '🩷',
    iconPosition: 'right',
  },
  {
    id: 5,
    question: '비용이 드나요?',
    answer: '입장료 및 기본 음료는 포함되어 있어요. 추가 비용은 현장에서 개인 선택에 따라 달라질 수 있어요.',
    icon: '✨',
    iconPosition: 'left',
  },
];

const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 shrink-0">
    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z" clipRule="evenodd" />
  </svg>
);

const MinusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#147EFB" className="size-6 shrink-0">
    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm3 10.5a.75.75 0 0 0 0-1.5H9a.75.75 0 0 0 0 1.5h6Z" clipRule="evenodd" />
  </svg>
);

const FaqSection = () => {
  const [openItem, setOpenItem] = useState(null);

  return (
    <section className="w-full flex flex-col items-center justify-center px-4 py-20 md:px-8 md:py-28" style={{ background: '#09090b' }}>
      <div className="w-full max-w-[700px] flex flex-col gap-8">

        {/* Header */}
        <div className="flex flex-col gap-3">
          <p className="text-sm font-semibold tracking-[0.25em] uppercase text-zinc-600">FAQ</p>
          <h2 className="text-4xl font-bold text-zinc-100 md:text-5xl">자주 묻는 질문</h2>
        </div>

        {/* Accordion */}
        <div className="rounded-2xl p-4 md:p-6" style={{ background: '#1C1C1E', border: '1px solid rgba(255,255,255,0.08)' }}>
          <p className="mb-5 text-base text-zinc-600">오늘, 오전 9:01</p>

          <Accordion.Root
            type="single"
            collapsible
            value={openItem ?? ''}
            onValueChange={(val) => setOpenItem(val || null)}
          >
            {FAQ_DATA.map((item) => {
              const isOpen = openItem === item.id.toString();
              return (
                <Accordion.Item value={item.id.toString()} key={item.id} className="mb-3">
                  <Accordion.Header>
                    <Accordion.Trigger className="flex w-full items-center justify-start gap-x-4">
                      <div
                        className="relative flex items-center space-x-2 rounded-xl px-4 py-3 transition-colors duration-200 flex-1"
                        style={{ backgroundColor: isOpen ? '#2C2C2E' : '#3A3A3C' }}
                      >
                        {item.icon && (
                          <span
                            className={`absolute bottom-8 ${item.iconPosition === 'right' ? 'right-0' : 'left-0'}`}
                            style={{ transform: item.iconPosition === 'right' ? 'rotate(7deg)' : 'rotate(-4deg)', fontSize: '1.1rem' }}
                          >
                            {item.icon}
                          </span>
                        )}
                        <span className="font-semibold text-zinc-100 text-left text-base md:text-lg">
                          {item.question}
                        </span>
                      </div>
                      <span className="cursor-pointer text-zinc-600 shrink-0">
                        {isOpen ? <MinusIcon /> : <PlusIcon />}
                      </span>
                    </Accordion.Trigger>
                  </Accordion.Header>

                  <Accordion.Content asChild forceMount style={{ display: 'block' }}>
                    <motion.div
                      initial="collapsed"
                      animate={isOpen ? 'open' : 'collapsed'}
                      variants={{
                        open: { opacity: 1, height: 'auto' },
                        collapsed: { opacity: 0, height: 0 },
                      }}
                      transition={{ duration: 0.4 }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div className="ml-4 mt-2 pb-3 md:ml-8">
                        <div className="relative inline-block rounded-2xl px-4 py-3 text-base text-white" style={{ background: '#147EFB', maxWidth: '85%' }}>
                          {item.answer}
                          <div className="absolute bottom-0 right-0 h-0 w-0 border-l-[10px] border-t-[10px] border-l-transparent border-t-[#147EFB]" />
                        </div>
                      </div>
                    </motion.div>
                  </Accordion.Content>
                </Accordion.Item>
              );
            })}
          </Accordion.Root>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
