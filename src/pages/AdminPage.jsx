import { useState, useEffect } from 'react';
import { getAnalytics, clearAnalytics } from '../lib/analytics';

const PASSWORD = '5242';

const STEP_LABELS = [
  '이름', '나이', '성별', '인스타그램', '자기소개',
  '체형', '직업', '참여 동기', '연락처', '하고 싶은 말',
];

const RADIO_QUESTIONS = [
  { key: 'age',    label: '나이',     options: ['만 20세', '21~25세', '26~30세', '31세 이상'] },
  { key: 'gender', label: '성별',     options: ['남성', '여성', '논바이너리', '비공개'] },
  { key: 'body',   label: '체형',     options: ['슬림', '보통', '근육질', '통통'] },
  { key: 'job',    label: '직업',     options: ['대학생', '직장인', '프리랜서', '기타'] },
  { key: 'reason', label: '참여 동기', options: ['새로운 인연', '재미있을 것 같아서', '지인 추천', '기타'] },
];

function formatDuration(sec) {
  if (!sec || sec < 1) return '—';
  if (sec < 60) return `${sec}초`;
  if (sec < 3600) return `${Math.floor(sec / 60)}분 ${sec % 60}초`;
  return `${Math.floor(sec / 3600)}시간 ${Math.floor((sec % 3600) / 60)}분`;
}

function formatTime(ts) {
  return new Date(ts).toLocaleString('ko-KR', {
    month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

/* ── 통계 카드 ── */
function StatCard({ label, value, sub }) {
  return (
    <div className="flex flex-col gap-1 rounded-2xl p-5"
      style={{ background: '#1C1C1E', border: '1px solid rgba(255,255,255,0.08)' }}>
      <p className="text-xs text-zinc-500 font-medium tracking-widest uppercase">{label}</p>
      <p className="text-3xl font-black text-white mt-1">{value}</p>
      {sub && <p className="text-xs text-zinc-600 mt-0.5">{sub}</p>}
    </div>
  );
}

/* ── 답변 분포 카드 ── */
function AnswerDistCard({ question, bucket, accent }) {
  const counts = bucket?.[question.key] || {};
  const total = Object.values(counts).reduce((s, v) => s + v, 0);
  if (total === 0) return (
    <div className="rounded-2xl p-5 flex flex-col gap-3"
      style={{ background: '#1C1C1E', border: '1px solid rgba(255,255,255,0.08)' }}>
      <p className="text-sm font-bold text-zinc-400">{question.label}</p>
      <p className="text-xs text-zinc-600">데이터 없음</p>
    </div>
  );

  const sorted = [...question.options]
    .map((o) => ({ option: o, count: counts[o] || 0 }))
    .sort((a, b) => b.count - a.count);
  const max = sorted[0].count;

  return (
    <div className="rounded-2xl p-5 flex flex-col gap-3"
      style={{ background: '#1C1C1E', border: '1px solid rgba(255,255,255,0.08)' }}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold text-zinc-200">{question.label}</p>
        <span className="text-xs text-zinc-600">총 {total}명</span>
      </div>
      <div className="flex flex-col gap-2">
        {sorted.map(({ option, count }) => {
          const pct = total > 0 ? Math.round((count / total) * 100) : 0;
          return (
            <div key={option} className="flex flex-col gap-1">
              <div className="flex justify-between text-xs">
                <span className="text-zinc-400">{option}</span>
                <span className="text-zinc-500">{count}명 ({pct}%)</span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${max > 0 ? (count / max) * 100 : 0}%`, background: accent }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── 퍼널 바 ── */
function FunnelBar({ label, count, max, isSubmit }) {
  const pct = max > 0 ? (count / max) * 100 : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-zinc-500 w-20 shrink-0 text-right">{label}</span>
      <div className="flex-1 h-6 rounded-lg overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
        <div className="h-full rounded-lg flex items-center px-3 transition-all duration-700"
          style={{
            width: `${pct}%`,
            background: isSubmit ? 'linear-gradient(90deg,#a78bfa,#f472b6)' : 'linear-gradient(90deg,#3b82f6,#6366f1)',
            minWidth: count > 0 ? 32 : 0,
          }}>
          <span className="text-[10px] text-white font-bold">{count}</span>
        </div>
      </div>
      <span className="text-xs text-zinc-600 w-10 shrink-0">{pct.toFixed(0)}%</span>
    </div>
  );
}

/* ── 방문자 위치 ── */
function VisitorLocations({ visitors }) {
  if (!visitors.length) return null;

  // 지역별 방문 횟수 집계
  const freq = {};
  visitors.forEach(({ region, city, country }) => {
    if (country !== 'KR') return; // 한국 외 제외하지 않으려면 이 줄 삭제
    const key = city && city !== region ? `${region} ${city}` : region || city || '알 수 없음';
    freq[key] = (freq[key] || 0) + 1;
  });

  const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]);
  const maxCount = sorted[0]?.[1] || 1;
  const recent = [...visitors].reverse().slice(0, 10);

  return (
    <div className="flex flex-col gap-4">
      {/* 지역별 방문 빈도 */}
      <div className="rounded-2xl p-6 flex flex-col gap-4"
        style={{ background: '#1C1C1E', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold text-zinc-200">방문자 지역</p>
          <span className="text-xs text-zinc-600">총 {visitors.length}건 수집</span>
        </div>
        {sorted.length === 0 ? (
          <p className="text-xs text-zinc-600">데이터 없음</p>
        ) : (
          <div className="flex flex-col gap-2">
            {sorted.slice(0, 8).map(([loc, count]) => (
              <div key={loc} className="flex items-center gap-3">
                <span className="text-xs text-zinc-400 w-32 shrink-0 truncate">{loc}</span>
                <div className="flex-1 h-5 rounded-lg overflow-hidden"
                  style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <div
                    className="h-full rounded-lg flex items-center px-2 transition-all duration-700"
                    style={{
                      width: `${(count / maxCount) * 100}%`,
                      minWidth: 24,
                      background: 'linear-gradient(90deg,#6366f1,#a78bfa)',
                    }}
                  >
                    <span className="text-[10px] text-white font-bold">{count}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 최근 방문 로그 */}
      <div className="rounded-2xl p-6 flex flex-col gap-3"
        style={{ background: '#1C1C1E', border: '1px solid rgba(255,255,255,0.08)' }}>
        <p className="text-sm font-bold text-zinc-200 mb-1">최근 방문 위치</p>
        {recent.map((v, i) => {
          const loc = v.city && v.city !== v.region
            ? `${v.region} ${v.city}`
            : v.region || v.city || '알 수 없음';
          return (
            <div key={i} className="flex items-center justify-between py-1.5"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <div className="flex items-center gap-2">
                <span className="text-base">{v.country === 'KR' ? '🇰🇷' : '🌐'}</span>
                <span className="text-sm text-zinc-300">{loc}</span>
              </div>
              <span className="text-xs text-zinc-600">{formatTime(v.time)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── 시간대/요일 분석 차트 ── */
const DAYS = ['일', '월', '화', '수', '목', '금', '토'];

function AbandonTimeChart({ times }) {
  if (!times.length) return null;

  const byHour = Array(24).fill(0);
  const byDay  = Array(7).fill(0);
  times.forEach(({ time }) => {
    const d = new Date(time);
    byHour[d.getHours()]++;
    byDay[d.getDay()]++;
  });

  const maxH = Math.max(...byHour, 1);
  const maxD = Math.max(...byDay, 1);

  // 가장 많이 이탈한 시간대
  const peakHour = byHour.indexOf(Math.max(...byHour));
  const peakDay  = DAYS[byDay.indexOf(Math.max(...byDay))];

  return (
    <div className="rounded-2xl p-6 flex flex-col gap-6"
      style={{ background: '#1C1C1E', border: '1px solid rgba(255,255,255,0.08)' }}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold text-zinc-200">이탈 시간 분석</p>
        <div className="flex gap-3 text-xs text-zinc-500">
          <span>최다 이탈 <span className="text-zinc-300 font-semibold">{peakHour}시</span></span>
          <span>최다 요일 <span className="text-zinc-300 font-semibold">{peakDay}요일</span></span>
        </div>
      </div>

      {/* 시간대별 (0~23시) */}
      <div className="flex flex-col gap-1.5">
        <p className="text-xs text-zinc-600 mb-1">시간대별 이탈</p>
        <div className="flex items-end gap-[3px] h-16">
          {byHour.map((count, h) => (
            <div key={h} className="flex-1 flex flex-col items-center justify-end gap-1">
              <div
                className="w-full rounded-sm transition-all duration-700"
                style={{
                  height: `${(count / maxH) * 100}%`,
                  minHeight: count > 0 ? 3 : 0,
                  background: count === Math.max(...byHour)
                    ? 'linear-gradient(180deg,#f87171,#fb923c)'
                    : 'rgba(255,255,255,0.15)',
                }}
              />
            </div>
          ))}
        </div>
        <div className="flex justify-between text-[9px] text-zinc-700 mt-0.5 px-0.5">
          <span>0시</span><span>6시</span><span>12시</span><span>18시</span><span>23시</span>
        </div>
      </div>

      {/* 요일별 */}
      <div className="flex flex-col gap-2">
        <p className="text-xs text-zinc-600 mb-1">요일별 이탈</p>
        {DAYS.map((day, i) => (
          <div key={day} className="flex items-center gap-3">
            <span className="text-xs text-zinc-500 w-6 shrink-0 text-right">{day}</span>
            <div className="flex-1 h-5 rounded-lg overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
              <div
                className="h-full rounded-lg flex items-center px-2 transition-all duration-700"
                style={{
                  width: `${(byDay[i] / maxD) * 100}%`,
                  minWidth: byDay[i] > 0 ? 24 : 0,
                  background: byDay[i] === Math.max(...byDay)
                    ? 'linear-gradient(90deg,#f87171,#fb923c)'
                    : 'rgba(255,255,255,0.18)',
                }}
              >
                {byDay[i] > 0 && (
                  <span className="text-[10px] text-white font-bold">{byDay[i]}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── 탭 ── */
function Tab({ label, active, onClick }) {
  return (
    <button onClick={onClick}
      className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
      style={{
        background: active ? 'rgba(255,255,255,0.1)' : 'transparent',
        color: active ? '#fff' : 'rgba(255,255,255,0.35)',
        border: active ? '1px solid rgba(255,255,255,0.15)' : '1px solid transparent',
      }}>
      {label}
    </button>
  );
}

/* ── 비밀번호 화면 ── */
function PasswordGate({ onSuccess }) {
  const [val, setVal] = useState('');
  const [shake, setShake] = useState(false);

  const submit = () => {
    if (val === PASSWORD) {
      sessionStorage.setItem('admin_auth', 'true');
      onSuccess();
    } else {
      setShake(true);
      setVal('');
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6" style={{ background: '#000' }}>
      <div className="flex flex-col items-center gap-6" style={{ width: '100%', maxWidth: 320 }}>
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
          style={{ background: '#1C1C1E', border: '1px solid rgba(255,255,255,0.1)' }}>
          🔐
        </div>
        <p className="text-zinc-300 text-sm">관리자 비밀번호를 입력하세요</p>
        <input
          type="password"
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
          placeholder="••••"
          autoFocus
          className="w-full rounded-2xl px-5 py-4 text-center text-xl tracking-[0.5em] text-white outline-none transition-all"
          style={{
            background: '#1C1C1E',
            border: shake ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.1)',
            animation: shake ? 'shake 0.4s ease' : 'none',
          }}
        />
        <button onClick={submit}
          className="w-full py-4 rounded-2xl text-white font-semibold text-sm transition-all hover:opacity-90"
          style={{ background: 'linear-gradient(135deg,#6366f1,#a78bfa)' }}>
          입장
        </button>
      </div>
      <style>{`
        @keyframes shake {
          0%,100%{transform:translateX(0)} 20%{transform:translateX(-8px)}
          40%{transform:translateX(8px)} 60%{transform:translateX(-6px)} 80%{transform:translateX(6px)}
        }
      `}</style>
    </div>
  );
}

/* ── 대시보드 ── */
function Dashboard() {
  const [data, setData] = useState(getAnalytics());
  const [tab, setTab] = useState('overview'); // overview | completed | abandoned

  useEffect(() => {
    const id = setInterval(() => setData(getAnalytics()), 5000);
    return () => clearInterval(id);
  }, []);

  const sessions = data.sessions || [];
  const avgDuration = sessions.length
    ? Math.round(sessions.reduce((s, x) => s + x.duration, 0) / sessions.length) : 0;
  const funnel = data.formFunnel || {};
  const funnelMax = funnel['s0'] || 1;
  const formSubmits = data.formSubmits || 0;

  // 중도 포기 수 = 스텝 0 이상 진입 - 제출 완료
  const formStarts = funnel['s0'] || 0;
  const abandonedCount = Math.max(0, formStarts - formSubmits);

  return (
    <div className="min-h-screen px-5 py-10 md:px-10" style={{ background: '#000' }}>
      <div className="mx-auto flex flex-col gap-8" style={{ maxWidth: 860 }}>

        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-zinc-600 tracking-widest uppercase mb-1">Admin</p>
            <h1 className="text-2xl font-black text-white">대시보드</h1>
          </div>
          <button
            onClick={() => { if (window.confirm('데이터를 초기화할까요?')) { clearAnalytics(); setData({}); } }}
            className="text-xs text-zinc-600 hover:text-rose-400 transition-colors px-3 py-2 rounded-lg"
            style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
            초기화
          </button>
        </div>

        {/* 탭 */}
        <div className="flex gap-2">
          <Tab label="개요" active={tab === 'overview'} onClick={() => setTab('overview')} />
          <Tab label={`✅ 제출 완료 (${formSubmits})`} active={tab === 'completed'} onClick={() => setTab('completed')} />
          <Tab label={`❌ 중도 포기 (${abandonedCount})`} active={tab === 'abandoned'} onClick={() => setTab('abandoned')} />
        </div>

        {/* ── 개요 탭 ── */}
        {tab === 'overview' && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <StatCard label="총 조회수" value={data.pageViews ?? 0} sub="페이지 로드 횟수" />
              <StatCard label="세션 수" value={sessions.length} sub="측정된 방문 횟수" />
              <StatCard label="평균 체류" value={formatDuration(avgDuration)} sub={`누적 ${formatDuration(sessions.reduce((s,x) => s+x.duration, 0))}`} />
              <StatCard label="완료율" value={formStarts > 0 ? `${Math.round((formSubmits / formStarts) * 100)}%` : '—'} sub={`시작 ${formStarts} / 완료 ${formSubmits}`} />
            </div>

            {/* 퍼널 */}
            <div className="rounded-2xl p-6 flex flex-col gap-4"
              style={{ background: '#1C1C1E', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-bold text-zinc-200">폼 진행 퍼널</p>
                <p className="text-xs text-zinc-600">시작 {funnelMax}명 기준</p>
              </div>
              <div className="flex flex-col gap-2">
                {STEP_LABELS.map((label, i) => (
                  <FunnelBar key={i} label={label} count={funnel[`s${i}`] || 0} max={funnelMax} />
                ))}
                <div className="mt-1 border-t border-white/5 pt-3">
                  <FunnelBar label="최종 제출" count={formSubmits} max={funnelMax} isSubmit />
                </div>
              </div>
            </div>

            {/* 최근 세션 */}
            {sessions.length > 0 && (
              <div className="rounded-2xl p-6 flex flex-col gap-3"
                style={{ background: '#1C1C1E', border: '1px solid rgba(255,255,255,0.08)' }}>
                <p className="text-sm font-bold text-zinc-200 mb-1">최근 세션</p>
                {[...sessions].reverse().slice(0, 8).map((s, i) => (
                  <div key={i} className="flex items-center justify-between py-2"
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <span className="text-xs text-zinc-500">{formatTime(s.time)}</span>
                    <span className="text-xs text-zinc-300 font-medium">{formatDuration(s.duration)}</span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ── 제출 완료 탭 ── */}
        {tab === 'completed' && (
          <>
            <div className="rounded-2xl p-5 flex items-center gap-4"
              style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)' }}>
              <span className="text-2xl">✅</span>
              <div>
                <p className="text-sm font-bold text-zinc-200">최종 제출 완료한 {formSubmits}명의 답변 분포</p>
                <p className="text-xs text-zinc-500 mt-0.5">라디오 선택 항목만 표시됩니다 (텍스트 입력 제외)</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {RADIO_QUESTIONS.map((q) => (
                <AnswerDistCard
                  key={q.key}
                  question={q}
                  bucket={data.completedAnswers}
                  accent="linear-gradient(90deg,#6366f1,#a78bfa)"
                />
              ))}
            </div>
          </>
        )}

        {/* ── 중도 포기 탭 ── */}
        {tab === 'abandoned' && (
          <>
            <div className="rounded-2xl p-5 flex items-center gap-4"
              style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
              <span className="text-2xl">❌</span>
              <div>
                <p className="text-sm font-bold text-zinc-200">중도 포기한 {abandonedCount}명의 분석</p>
                <p className="text-xs text-zinc-500 mt-0.5">탭/창 닫기 시점을 기준으로 기록됩니다</p>
              </div>
            </div>

            {/* 이탈 스텝 분포 */}
            {Object.keys(data.abandonedAtStep || {}).length > 0 && (
              <div className="rounded-2xl p-6 flex flex-col gap-4"
                style={{ background: '#1C1C1E', border: '1px solid rgba(255,255,255,0.08)' }}>
                <p className="text-sm font-bold text-zinc-200">이탈 발생 스텝</p>
                <div className="flex flex-col gap-2">
                  {STEP_LABELS.map((label, i) => {
                    const count = (data.abandonedAtStep || {})[`s${i}`] || 0;
                    const max = Math.max(...Object.values(data.abandonedAtStep || { s0: 1 }));
                    return <FunnelBar key={i} label={label} count={count} max={max || 1} />;
                  })}
                </div>
              </div>
            )}

            {/* 시간대 분석 */}
            <AbandonTimeChart times={data.abandonedTimes || []} />

            {/* 답변 분포 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {RADIO_QUESTIONS.map((q) => (
                <AnswerDistCard
                  key={q.key}
                  question={q}
                  bucket={data.abandonedAnswers}
                  accent="linear-gradient(90deg,#f87171,#fb923c)"
                />
              ))}
            </div>
          </>
        )}

        {/* ── 방문자 위치 (개요 탭에만) ── */}
        {tab === 'overview' && <VisitorLocations visitors={data.visitors || []} />}

        <p className="text-center text-xs text-zinc-700">
          localStorage 저장 · 5초 자동 갱신
        </p>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(sessionStorage.getItem('admin_auth') === 'true');
  if (!authed) return <PasswordGate onSuccess={() => setAuthed(true)} />;
  return <Dashboard />;
}
