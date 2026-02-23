const KEY = 'pf_analytics';

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

export function trackCompletedAnswers(answers) {
  const d = load();
  if (!d.completedAnswers) d.completedAnswers = {};
  accumulateAnswers(d.completedAnswers, answers);
  save(d);
}

export function trackAbandonedAnswers(answers, lastStep) {
  const d = load();
  if (!d.abandonedAnswers) d.abandonedAnswers = {};
  if (!d.abandonedAtStep) d.abandonedAtStep = {};
  if (!d.abandonedTimes) d.abandonedTimes = [];

  d.abandonedAtStep[`s${lastStep}`] = (d.abandonedAtStep[`s${lastStep}`] || 0) + 1;
  accumulateAnswers(d.abandonedAnswers, answers);

  // 이탈 시각 + 스텝 기록 (시간대 분석용)
  d.abandonedTimes.push({ time: Date.now(), step: lastStep });
  if (d.abandonedTimes.length > 500) d.abandonedTimes = d.abandonedTimes.slice(-500);

  save(d);
}

// 방문자 위치 기록
export function trackVisitor(loc) {
  const d = load();
  if (!d.visitors) d.visitors = [];
  d.visitors.push({
    time: Date.now(),
    country: loc.country_code || '',
    region: loc.region || '',   // 시·도
    city: loc.city || '',       // 시·군·구
  });
  if (d.visitors.length > 500) d.visitors = d.visitors.slice(-500);
  save(d);
}

export function getAnalytics() {
  return load();
}

export function clearAnalytics() {
  localStorage.removeItem(KEY);
}
