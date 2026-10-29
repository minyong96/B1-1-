import { NAV_SCROLL_THRESHOLD, SCROLL_TOP_THRESHOLD } from './config.js';

const header = document.querySelector('#header');
const hamburger = document.querySelector('#hamburger');
const menu = document.querySelector('#nav-menu');
const scrollTopBtn = document.querySelector('#scroll-top');

const setMenu = (open) => {
  menu.classList.toggle('active', open);
  hamburger.setAttribute('aria-expanded', String(open));
  hamburger.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
};

const onScroll = () => {
  const { scrollY } = window;
  header.classList.toggle('scrolled', scrollY > NAV_SCROLL_THRESHOLD);
  scrollTopBtn.classList.toggle('show', scrollY > SCROLL_TOP_THRESHOLD);
};

export const initNav = () => {
  hamburger.addEventListener('click', () => setMenu(!menu.classList.contains('active')));

  // 부드러운 스크롤: 앵커 클릭 시 해당 섹션으로 이동 + 모바일 메뉴 닫기
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
      setMenu(false);
    });
  });

  scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
};
