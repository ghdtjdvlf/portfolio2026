const KEY = 'pf_analytics';

// 분석할 라디오 필드만 (텍스트/개인정보 제외)
const RADIO_FIELDS = ['age', 'gender', 'body', 'job', 'reason'];

function load() {
  try { return JSON.parse(localStorage.getItem(KEY)) || {}; }
  catch { return {}; }
}
function save(data) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

function accumulateAnswers(bucket, answers) {
  RADIO_FIELDS.forEach((field) => {
    if (!answers[field]) return;
    if (!bucket[field]) bucket[field] = {};
    bucket[field][answers[field]] = (bucket[field][answers[field]] || 0) + 1;
  });
}

export function trackPageView() {
  const d = load();
  d.pageViews = (d.pageViews || 0) + 1;
  save(d);
}

export function trackSession(durationSec) {
  const d = load();
  if (!d.sessions) d.sessions = [];
  d.sessions.push({ duration: durationSec, time: Date.now() });
  if (d.sessions.length > 200) d.sessions = d.sessions.slice(-200);
  save(d);
}

export function trackFormStep(stepIndex) {
  const d = load();
  if (!d.formFunnel) d.formFunnel = {};
  const key = `s${stepIndex}`;
  d.formFunnel[key] = (d.formFunnel[key] || 0) + 1;
  save(d);
}

export function trackFormSubmit() {
  const d = load();
  d.formSubmits = (d.formSubmits || 0) + 1;
  save(d);
}

// 최종 제출 완료 → 각 라디오 답변 누적
export function trackCompletedAnswers(answers) {
  const d = load();
  if (!d.completedAnswers) d.completedAnswers = {};
  accumulateAnswers(d.completedAnswers, answers);
  save(d);
}

// 중도 포기 → 답변 + 이탈 스텝 누적
export function trackAbandonedAnswers(answers, lastStep) {
  const d = load();
  if (!d.abandonedAnswers) d.abandonedAnswers = {};
  if (!d.abandonedAtStep) d.abandonedAtStep = {};
  d.abandonedAtStep[`s${lastStep}`] = (d.abandonedAtStep[`s${lastStep}`] || 0) + 1;
  accumulateAnswers(d.abandonedAnswers, answers);
  save(d);
}

export function getAnalytics() {
  return load();
}

export function clearAnalytics() {
  localStorage.removeItem(KEY);
}
