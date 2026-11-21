# Claude Code로 시뮬레이션 작업하기 (선생님용)

## 1. 처음 한 번 설치
| 프로그램 | 용도 | 비고 |
|---|---|---|
| Git for Windows | 저장소 내려받기·올리기 | 설치 기본값 그대로 |
| Python 3 | 빌드(`tools/build.py`)·화면 검사 | 설치 첫 화면에서 **Add python.exe to PATH** 체크 |
| Node.js LTS | 빌드 때 문법 검사 | 없어도 빌드는 됨 |
| Claude Code | 작업 | Claude 데스크톱 앱의 Code 또는 터미널. 설치 안내: https://docs.claude.com/en/docs/claude-code |

git 이름 설정(명령 프롬프트에서 한 번):
```
git config --global user.name "JIGOOLEE-earthscience"
git config --global user.email "earthsci24@gmail.com"
```
처음 올릴 때 GitHub 로그인 창이 뜨면 JIGOOLEE-earthscience 계정으로 로그인함(이후 자동).

## 2. 폴더
- 이 폴더(`지구과학 시뮬레이션`)를 Claude Code에서 열면 `CLAUDE.md` 지침이 자동 적용됨.
- 교과서 PDF는 `textbook/<과목>/<출판사>/`에 넣음. GitHub에는 올라가지 않음.
  - 예: `textbook/지구시스템과학/미래엔/Ⅲ-05_104-111쪽.pdf`
- 진행 상황은 `docs/PROGRESS.md`, 단원별 교과서 분석·결정 사항은 `docs/units/`.

## 3. 명령
| 입력 | 하는 일 |
|---|---|
| `/new-unit 과목 단원 …` | 교과서 분석 → 시뮬레이션 제작 → 검사 → 미리보기 주소 |
| `/publish` | 목차 연결·앱 저장 목록 갱신 → GitHub에 올림(1~2분 뒤 사이트 반영) |
| `/log` | 오늘 작업을 진행 기록에 정리 |
- 명령 없이 그냥 요청해도 됨(수정 요청 등). 사이트에는 '올려줘'라고 할 때만 올라감.

## 4. 주의
- 같은 폴더를 두 PC에서 동시에 작업하지 않음(OneDrive 동기화 충돌).
- 채팅(claude.ai)에서도 같은 저장소로 작업할 수 있음. 이때는 Claude Code를 열 때 최신 내용을 먼저 받아옴(`git pull`, Claude가 자동으로 함).
