import { NAME, SKILLS } from './config.js';
import { initTheme } from './theme.js';
import { initNav } from './nav.js';
import { initReveal } from './reveal.js';
import { initForm } from './form.js';
import { initProjects } from './projects.js';

const renderSkills = () => {
  document.querySelector('#skills-list').innerHTML = SKILLS.map((skill) => `<li>${skill}</li>`).join('');
};

// Hero 타이핑 효과 (보너스)
const typeName = (el, text, delay = 120) => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    el.textContent = text;
    return;
  }
  el.textContent = '';
  let i = 0;
  const timer = setInterval(() => {
    el.textContent = text.slice(0, ++i);
    if (i >= text.length) clearInterval(timer);
  }, delay);
};

initTheme();
initNav();
renderSkills();
typeName(document.querySelector('#typing-name'), NAME);
initForm();
initProjects();
initReveal();
