import { REVEAL_THRESHOLD } from './config.js';

export const initReveal = () => {
  const targets = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    targets.forEach((el) => el.classList.add('visible'));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(({ isIntersecting, target }) => {
      if (!isIntersecting) return;
      target.classList.add('visible');
      observer.unobserve(target);
    });
  }, { threshold: REVEAL_THRESHOLD });
  targets.forEach((el) => observer.observe(el));
};
