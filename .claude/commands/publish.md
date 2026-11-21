---
description: 만든·고친 단원을 학생용 사이트(GitHub Pages)에 올리기
argument-hint: [단원 파일 또는 단원명, 비우면 바뀐 것 전부]
---
대상: $ARGUMENTS

CLAUDE.md 2장 6~9단계, 9장을 따른다.

1. `git status`로 바뀐 파일 확인(대상이 비어 있으면 바뀐 단원 전부). `git pull --rebase`로 최신 상태 맞춤.
2. 확인: 헤더 부제목 `← 단원 목차` 링크(`../subjects/<과목>.html`), 제목 두 줄·`(22)` 없음, 자동 재생 없음(`playing:!reduce` 등), 오른쪽 아래 모서리에 조작 요소 없음.
3. 새 단원이면 `src/subjects/<과목>.html` `UNITS`에 `href`, `src/index.html` `SUBJECTS`의 `open` +1. 다른 항목은 건드리지 않음.
4. `py tools/build.py` (바뀐 원본만 또는 전체).
5. `sw.js`: 새 파일은 `ASSETS`에 추가, `VERSION`은 항상 오늘 날짜로 변경(예: `2026-11-21-1`, 같은 날 두 번째면 `-2`).
6. 검사: 로컬 서버에서 첫 화면 → 과목 → 목차 → 단원 이동, 피드백 창 단원 자동 채움, 콘솔 오류 없음. 피드백 실제 전송은 하지 않음.
7. `docs/PROGRESS.md` 갱신(단원 현황 '공개', 날짜별 기록) → 한국어 커밋 메시지 → push.
8. 답변: 올린 파일, 목차 변경, '1~2분 뒤 반영, 앱은 인터넷 연결 상태로 한두 번 열면 새 내용 저장', 단원 주소 `https://jigoolee-earthscience.github.io/jigu-sim/units/<파일>.html`.
