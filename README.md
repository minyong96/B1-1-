# 반응형 포트폴리오

순수 HTML / CSS / JavaScript(ES6+)만으로 만든 반응형 포트폴리오 웹사이트입니다. GitHub API로 저장소 목록을 불러와 Projects 섹션에 렌더링합니다.

- 배포 URL: _(GitHub Pages 배포 후 기입)_
- 저장소: _(기입)_

## 사용 기술
HTML5(시맨틱 마크업), CSS3(변수, Flexbox, Grid, 모바일 퍼스트), JavaScript(ES Modules, fetch/async-await, IntersectionObserver, localStorage). 외부 라이브러리 없음.

## 주요 기능
- 반응형 레이아웃 (768px / 1024px 브레이크포인트), 모바일 햄버거 메뉴
- 다크 모드 (localStorage 저장, 시스템 설정 감지)
- 부드러운 스크롤, 스크롤 탑 버튼, 스크롤 애니메이션
- 폼 유효성 검사 (필수값, 이메일 형식, 필드별 에러 메시지)
- GitHub API 연동: 로딩 / 성공 / 에러(재시도) / 빈 상태, 언어별 필터
- Hero 타이핑 효과

## 임계값 (js/config.js)
| 항목 | 값 |
|---|---|
| 네비게이션 배경 변경 | 스크롤 60px 이상 |
| 스크롤 탑 버튼 표시 | 스크롤 300px 이상 |
| IntersectionObserver threshold | 0.2 |

## 실행
VS Code Live Server로 `index.html`을 엽니다. (ES Module을 사용하므로 `file://`이 아닌 서버로 열어야 합니다.)
`js/config.js`의 `GITHUB_USER`, `NAME`을 본인 정보로 바꾸세요.

## 상태 → 렌더링 흐름
1. 다크 모드: 토글 click → `theme` 상태 → `data-theme` → CSS 변수
2. Projects: 로드/재시도 → `status` (loading/success/error/empty) → 영역 교체
3. 폼: input/submit → `errors` 상태 → 에러 메시지 표시/숨김
4. 필터: 버튼 click → `filter` 상태 → 카드 목록

## 스크린샷
_(데스크톱 / 모바일 / 다크모드 스크린샷 추가)_
