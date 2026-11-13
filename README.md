# 지구과학 체험형 시뮬레이션

통합과학1·2, 지구과학, 지구시스템과학, 행성우주과학 단원별로 직접 조작하며 원리를 확인하는 학생용 시뮬레이션 모음입니다.
사이트: https://jigoolee-earthscience.github.io/jigu-sim/

작업 지침과 상세 절차는 [`CLAUDE.md`](CLAUDE.md), 진행 기록은 [`docs/PROGRESS.md`](docs/PROGRESS.md).

## 구성
- `src/` : 원본(직접 고치는 곳) → `python3 tools/build.py`로 아래 사이트 파일을 만듦
- `kit/` : 디자인 키트(기본 틀, 글꼴, 토스페이스 이모지, 로고)
- `index.html` : 첫 화면(과목 선택). `SUBJECTS` 목록에 `href`가 있는 과목만 열림
- `subjects/<과목>.html` : 과목별 단원 목차 (`UNITS` 목록에 `href`가 있는 단원만 열림)
  - `subjects/ess.html` : 지구시스템과학 (미래엔 교과서 목차·쪽수 기준)
- `units/` : 단원별 시뮬레이션 페이지 (파일 하나에 글꼴·이모지 포함)
- `lib/three.min.js` : 3D 그림용 three.js r128 (오프라인 사용을 위해 내장)
- `manifest.webmanifest`, `icons/`, `sw.js`, `pwa.js` : 앱(PWA) 설치와 오프라인 사용
- `feedback.js` : 모든 페이지 오른쪽 아래 '피드백' 버튼 (pwa.js가 불러옴)
  - 의견은 구글 설문지 「지구과학 시뮬레이션 피드백」 → 연결된 스프레드시트에 쌓임
  - 설문지 질문·보기 문구를 바꾸면 `feedback.js`의 `FORM`, `KIND`, `DEV`도 똑같이 바꿔야 접수됨
- `layout.js` : 단원 페이지 화면 배치 (세로 휴대폰: 그림 고정 + 조작 카드 바로 아래 / 가로: 두 열 높이 맞춤)
- `tools/pwaify.py` : 새 페이지에 앱용 머리말·오프라인 등록 코드를 넣는 스크립트

## 앱(오프라인) 사용
- 인터넷이 연결된 상태로 한 번 열면 모든 단원이 기기에 저장됩니다.
- 이후에는 인터넷 없이 열리고, 인터넷이 연결된 상태로 열면 새 내용이 자동 반영됩니다.
- 피드백은 인터넷이 연결되어 있을 때만 보낼 수 있습니다(쓴 내용은 기기에 남아 있음).

## 새 단원 추가
1. `kit/skeleton.html`을 `src/units/<대단원>-<중단원 두 자리>-<영문이름>.html`로 복사해 작성한다.
2. `src/subjects/<과목>.html`의 `UNITS`에 `href:'../units/새파일.html'`, `src/index.html`의 `SUBJECTS`에서 `open`을 늘린다.
3. `python3 tools/build.py` (src 전체를 사이트 파일로)
4. `sw.js`의 `ASSETS`에 새 파일을 추가하고 `VERSION`을 바꾼다.

## 새 과목 열기
1. `src/subjects/ess.html`을 복사해 `src/subjects/<과목>.html`을 만들고 제목·`UNITS`·교과서 표기를 바꾼다.
2. `src/index.html`의 `SUBJECTS`에서 그 과목에 `href:'subjects/<과목>.html'`, `open`, `total`, `pub`(출판사)를 넣는다.
3. `python3 tools/build.py` 후 `sw.js`의 `ASSETS`·`VERSION`을 갱신한다.
