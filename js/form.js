// 이벤트(input/submit) → 상태(errors) → 렌더링(에러 메시지 표시/숨김)
const form = document.querySelector('#contact-form');
const successMsg = document.querySelector('#form-success');
const FIELDS = ['name', 'email', 'message'];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const state = { errors: {} };

const validators = {
  name: (v) => (v ? '' : '이름을 입력해주세요.'),
  email: (v) => (!v ? '이메일을 입력해주세요.' : EMAIL_RE.test(v) ? '' : '올바른 이메일 형식이 아닙니다.'),
  message: (v) => (v ? '' : '메시지를 입력해주세요.'),
};

const validateField = (field) => validators[field](form.elements[field].value.trim());

const render = () => {
  FIELDS.forEach((field) => {
    const message = state.errors[field] ?? '';
    document.querySelector(`#${field}-error`).textContent = message;
    form.elements[field].closest('.field').classList.toggle('invalid', Boolean(message));
    form.elements[field].setAttribute('aria-invalid', String(Boolean(message)));
  });
};

export const initForm = () => {
  FIELDS.forEach((field) => {
    form.elements[field].addEventListener('input', () => {
      successMsg.textContent = '';
      // 이미 에러가 표시된 필드만 실시간 재검증
      if (state.errors[field]) {
        state.errors = { ...state.errors, [field]: validateField(field) };
        render();
      }
    });
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    state.errors = Object.fromEntries(FIELDS.map((field) => [field, validateField(field)]));
    render();
    const firstInvalid = FIELDS.find((field) => state.errors[field]);
    if (firstInvalid) {
      successMsg.textContent = '';
      form.elements[firstInvalid].focus();
      return;
    }
    successMsg.textContent = '메시지가 전송되었습니다. 감사합니다!';
    form.reset();
  });
};
