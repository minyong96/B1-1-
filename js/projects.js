import { GITHUB_USER } from './config.js';

// 이벤트(로드/재시도/필터 click) → 상태(status, repos, filter) → 렌더링
const grid = document.querySelector('#projects-grid');
const statusBox = document.querySelector('#projects-status');
const filtersBox = document.querySelector('#filters');

const ALL = 'All';
const state = { status: 'loading', repos: [], filter: ALL };

const escapeHtml = (str = '') =>
  str.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

const cardTemplate = ({ name, description, stargazers_count: stars, language, html_url: url }) => `
  <article class="card">
    <h3>${escapeHtml(name)}</h3>
    <p>${escapeHtml(description ?? '설명이 없습니다.')}</p>
    <div class="card-meta">
      <span>${escapeHtml(language ?? 'N/A')}</span>
      <span>★ ${stars}</span>
    </div>
    <a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">GitHub에서 보기</a>
  </article>`;

const visibleRepos = () =>
  state.filter === ALL ? state.repos : state.repos.filter(({ language }) => language === state.filter);

const renderFilters = () => {
  const languages = [...new Set(state.repos.map(({ language }) => language).filter(Boolean))];
  if (state.status !== 'success' || languages.length === 0) {
    filtersBox.innerHTML = '';
    return;
  }
  filtersBox.innerHTML = [ALL, ...languages]
    .map((lang) => `<button type="button" class="btn btn-outline btn-small${lang === state.filter ? ' active' : ''}" data-lang="${escapeHtml(lang)}">${escapeHtml(lang)}</button>`)
    .join('');
};

const render = () => {
  const { status } = state;
  grid.innerHTML = '';
  statusBox.innerHTML = '';

  if (status === 'loading') {
    statusBox.innerHTML = '<div class="spinner" aria-hidden="true"></div><p>로딩 중...</p>';
  } else if (status === 'error') {
    statusBox.innerHTML = '<p>프로젝트를 불러올 수 없습니다.</p><button type="button" class="btn btn-primary" id="retry-btn">다시 시도</button>';
  } else if (status === 'empty') {
    statusBox.innerHTML = '<p>표시할 프로젝트가 없습니다.</p>';
  } else {
    grid.innerHTML = visibleRepos().map(cardTemplate).join('');
  }
  renderFilters();
};

const setState = (next) => {
  Object.assign(state, next);
  render();
};

const loadRepos = async () => {
  setState({ status: 'loading', filter: ALL });
  try {
    const response = await fetch(`https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=30`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`); // 403 레이트 리밋 포함
    const data = await response.json();
    const repos = data.filter(({ fork }) => !fork);
    setState({ repos, status: repos.length ? 'success' : 'empty' });
  } catch (error) {
    console.error('GitHub API 오류:', error);
    setState({ status: 'error', repos: [] });
  }
};

export const initProjects = () => {
  // 이벤트 위임: 동적으로 생성되는 버튼 처리
  statusBox.addEventListener('click', (event) => {
    if (event.target.closest('#retry-btn')) loadRepos();
  });
  filtersBox.addEventListener('click', (event) => {
    const btn = event.target.closest('[data-lang]');
    if (btn) setState({ filter: btn.dataset.lang });
  });
  loadRepos();
};
