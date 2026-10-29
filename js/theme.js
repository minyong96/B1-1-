// 이벤트(click) → 상태(theme) → 렌더링(data-theme 속성 → CSS 변수 전환)
const toggleBtn = document.querySelector('#theme-toggle');
const root = document.documentElement;

const state = { theme: 'light' };

const readSaved = () => {
  try { return localStorage.getItem('theme'); } catch { return null; }
};

const save = (theme) => {
  try { localStorage.setItem('theme', theme); } catch { /* 저장 불가 시 무시 */ }
};

const render = () => {
  const { theme } = state;
  root.dataset.theme = theme;
  toggleBtn.textContent = theme === 'dark' ? '☀️' : '🌙';
  toggleBtn.setAttribute('aria-label', theme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환');
};

const setTheme = (theme) => {
  state.theme = theme;
  save(theme);
  render();
};

export const initTheme = () => {
  // 우선순위: 저장값 > 시스템 설정(보너스) > 라이트
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  state.theme = readSaved() ?? (systemDark ? 'dark' : 'light');
  render();
  toggleBtn.addEventListener('click', () => setTheme(state.theme === 'dark' ? 'light' : 'dark'));
};
