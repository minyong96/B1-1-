# 포트폴리오 웹사이트 구현 계획 (plan.md)

> 기준 문서: `requriment.md`
> 핵심 목표: UI 퀄리티보다 **"이벤트 → 상태 → 렌더링"** 흐름을 체득한다. (React 학습의 기반)

## 1. 범위와 제약

| 항목 | 내용 |
|---|---|
| 기술 | 순수 HTML / CSS / JavaScript (ES6+) |
| 금지 | React, Vue, jQuery, Bootstrap, Tailwind 등 외부 라이브러리 |
| 허용 | Font Awesome(아이콘), Google Fonts(웹폰트) |
| 코드 규칙 | `var` 금지(const/let), `onclick` 속성 금지(addEventListener), 인라인 `style=""` 금지 |
| 브라우저 | 최신 Chrome |
| 산출물 | GitHub 저장소 URL, GitHub Pages URL, 스크린샷(데스크톱/모바일/다크모드), README |

## 2. 폴더 구조

```
B1-1/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── main.js        # 진입점: 초기화, 모듈 연결
│   ├── theme.js       # 다크 모드 (상태 + localStorage)
│   ├── nav.js         # 햄버거, 스크롤 시 nav 스타일, 스크롤 탑, 부드러운 스크롤
│   ├── reveal.js      # IntersectionObserver 스크롤 애니메이션
│   ├── form.js        # 폼 유효성 검사
│   └── projects.js    # GitHub API + 상태 렌더링 (+ 필터)
├── images/            # 프로필 이미지, 파비콘 등
└── README.md
```

> 모듈 분리 시 `<script type="module" defer>` 사용 가능. 단순함을 원하면 `main.js` 한 파일로 시작 후 분리한다. (요구사항: `defer` 필수)

## 3. 구현 단계

### Phase 0. 환경 준비
- [ ] VS Code + Live Server 확장 설치, 폴더 구조 생성
- [ ] GitHub 저장소 생성(본인 GitHub 아이디 확인)
- [ ] `index.html`에 `style.css` 링크, `main.js`를 `defer`로 연결

### Phase 1. HTML 시맨틱 구조
- [ ] `<header>` + `<nav>` (로고, 앵커 메뉴, 다크모드 토글, 햄버거 버튼)
- [ ] `<main>` 안에 `<section id="hero|about|skills|projects|contact">`
- [ ] Projects 카드는 `<article>`로 생성
- [ ] `<footer>` (저작권, GitHub/LinkedIn 링크)
- [ ] 모든 `<img>`에 의미 있는 `alt`
- [ ] 폼: `<label for>` ↔ `<input id>` 매칭, 이름/이메일/메시지
- [ ] 햄버거/토글 버튼에 `aria-label`, `aria-expanded`
- [ ] Projects 영역에 로딩/에러/빈 상태 컨테이너 마련

### Phase 2. CSS 기본 & 레이아웃
- [ ] `:root`에 색상·폰트·간격 CSS 변수 정의
- [ ] `[data-theme="dark"]`에서 변수 재정의
- [ ] **모바일 퍼스트** 기본 스타일 작성
- [ ] 네비게이션: **Flexbox** (로고 좌, 메뉴 우)
- [ ] Projects: **Grid** `repeat(auto-fit, minmax(…, 1fr))`
- [ ] 미디어 쿼리 `@media (min-width: 768px)`, `(min-width: 1024px)`
- [ ] 모바일: 메뉴 숨김 + 햄버거 표시, `.active`일 때 펼침
- [ ] 버튼/카드 hover + `transition`, 카드 `box-shadow`
- [ ] 스크롤 애니메이션용 초기/활성 클래스(`.reveal`, `.reveal.visible`)
- [ ] 스타일은 전부 CSS 클래스로 처리 (인라인 style 금지)

### Phase 3. JavaScript – DOM & 이벤트
- [ ] 햄버거 토글: `classList.toggle('active')`, `aria-expanded` 갱신, 링크 클릭 시 닫기
- [ ] 부드러운 스크롤: CSS `scroll-behavior: smooth` + 필요 시 JS(`preventDefault` + `scrollIntoView`)
- [ ] 스크롤 이벤트 하나로 처리:
  - `scrollY > 60` → nav에 `.scrolled` (기준값 README 명시)
  - `scrollY > 300` → 스크롤 탑 버튼 표시 (기준값 README 명시)
- [ ] 스크롤 탑 버튼 클릭 → `window.scrollTo({ top: 0, behavior: 'smooth' })`
- [ ] 다크 모드: 상태(`theme`) 변경 → `document.documentElement.dataset.theme` 적용 → `localStorage` 저장 → 로드 시 복원
- [ ] IntersectionObserver (`threshold: 0.2`) → `.visible` 추가

### Phase 4. 폼 유효성 검사
- [ ] `submit`에서 `event.preventDefault()`
- [ ] 필수값(빈 값/공백) 검증, 이메일 정규식 검증
- [ ] 에러 메시지를 각 필드 근처에 표시, `input` 이벤트로 실시간 해제
- [ ] 검증 통과 시 성공 메시지 표시 후 폼 리셋
- [ ] 검증 상태 객체 `errors = { name, email, message }` → `renderErrors(errors)` 구조

### Phase 5. GitHub API & 상태 렌더링
- [ ] `https://api.github.com/users/{id}/repos` 를 `fetch` + `async/await`로 호출
- [ ] `response.ok` 확인(403 레이트 리밋 포함 시 throw) + `try/catch`
- [ ] 상태 모델: `state = { status: 'loading' | 'success' | 'error' | 'empty', repos: [] }`
- [ ] `setState()` → `render()` 단일 흐름
  - loading: 스피너/"로딩 중..."
  - success: `map` + 템플릿 리터럴로 카드 생성
  - error: "프로젝트를 불러올 수 없습니다" + **다시 시도** 버튼(재호출)
  - empty: "표시할 프로젝트가 없습니다"
- [ ] 구조분해 할당으로 `{ name, description, stargazers_count, language, html_url }` 추출
- [ ] 외부 데이터 삽입 시 XSS 방지(`textContent` 또는 이스케이프)
- [ ] 정렬/표시 개수 제한 (예: 최신순 상위 N개, fork 제외 `filter`)

### Phase 6. 보너스 (선택)
- [ ] 언어별 필터 버튼 (`filter`, 필터 상태 → 목록 렌더링)
- [ ] Hero 타이핑 효과
- [ ] Formspree/EmailJS 실제 전송
- [ ] `prefers-color-scheme` 로 초기 테마 감지 (저장값 > 시스템값 순서)

### Phase 7. 배포 & 문서
- [ ] GitHub 저장소에 push → Settings > Pages (main / root)
- [ ] 배포 URL에서 전 기능 확인 (경로 대소문자, 상대경로 주의)
- [ ] README: 프로젝트 설명, 사용 기술, 배포 URL, 스크린샷, **임계값 명시**(nav 60px, 스크롤탑 300px, IO threshold 0.2)
- [ ] 스크린샷: 데스크톱 / 모바일 / 다크모드

## 4. "이벤트 → 상태 → 렌더링" 매핑 (필수 3개 이상)

| # | 이벤트 | 상태 | 렌더링 |
|---|---|---|---|
| 1 | 토글 버튼 click | `theme: light/dark` | `data-theme` 변경 → CSS 변수 전환, localStorage 저장 |
| 2 | 페이지 로드 / 재시도 click | `status: loading/success/error/empty` | Projects 영역 교체 |
| 3 | 폼 submit / input | `errors{}` , `submitted` | 에러 메시지 표시·숨김, 성공 메시지 |
| 4 | 햄버거 click | `menuOpen` | `.active` 토글 |
| 5 | (선택) 필터 click | `filter: language` | 카드 목록 재렌더 |

## 5. 테스트 체크리스트

**반응형**
- [ ] 375px / 768px / 1024px+ 레이아웃 정상, 가로 스크롤 없음
- [ ] 모바일에서 메뉴 숨김 + 햄버거 노출, 데스크톱에서 반대

**인터랙션**
- [ ] 햄버거 열기/닫기, 메뉴 클릭 시 해당 섹션으로 부드럽게 이동
- [ ] 60px 이상 스크롤 시 nav 배경 변경, 300px 이상 시 탑 버튼 노출·동작
- [ ] 다크 모드 전환 + 새로고침 후 유지
- [ ] 섹션 진입 시 애니메이션

**폼**
- [ ] 빈 제출 차단, 잘못된 이메일 차단, 에러 위치, 성공 메시지

**API 상태 (DevTools로 재현)**
- [ ] 로딩: Network throttling(Slow 3G)
- [ ] 에러: Offline 모드 또는 잘못된 URL, 재시도 버튼 동작
- [ ] 빈 상태: 저장소 없는 계정 ID 또는 필터로 0건
- [ ] 403 레이트 리밋 시 에러 UI

**규칙 준수**
- [ ] `grep`으로 `var `, `onclick=`, `style="` 없는지 확인
- [ ] 이미지 `alt`, 라벨 연결, 콘솔 에러 0
- [ ] Lighthouse 접근성/SEO 점검 (참고)

## 6. 리스크 & 대응

| 리스크 | 대응 |
|---|---|
| GitHub API 60회/시간 제한 | 반복 새로고침 자제, 403 → 에러 UI, (선택) sessionStorage 캐시 |
| Pages 배포 후 경로 깨짐 | 상대경로 사용(`/css/..` 대신 `css/..`) |
| 스크롤 이벤트 성능 | 가벼운 핸들러, `passive: true`, 필요 시 throttle |
| 다크모드 깜빡임(FOUC) | `<head>`에서 저장된 테마를 먼저 적용하는 소형 스크립트 고려 |
| 외부 데이터 삽입 시 XSS | `innerHTML` 사용 시 이스케이프 처리 |

## 7. 권장 진행 순서 (요약)

1. HTML 뼈대 → 2. CSS 변수/레이아웃/반응형 → 3. 햄버거·스크롤·다크모드 → 4. 폼 검증 → 5. GitHub API 4상태 → 6. 스크롤 애니메이션 → 7. (보너스) → 8. 배포·README·스크린샷
