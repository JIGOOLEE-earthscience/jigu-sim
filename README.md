# 지구시스템과학 체험형 시뮬레이션

교과서 단원별로 직접 조작하며 원리를 확인하는 학생용 시뮬레이션 모음입니다.
사이트: https://jigoolee-earthscience.github.io/jigu-sim/

## 구성
- `index.html` : 단원 목차
- `units/` : 단원별 시뮬레이션 페이지 (파일 하나에 글꼴·이모지 포함)
- `lib/three.min.js` : 3D 그림용 three.js r128 (오프라인 사용을 위해 내장)
- `manifest.webmanifest`, `icons/`, `sw.js`, `pwa.js` : 앱(PWA) 설치와 오프라인 사용
- `tools/pwaify.py` : 새 페이지에 앱용 머리말·오프라인 등록 코드를 넣는 스크립트

## 앱(오프라인) 사용
- 인터넷이 연결된 상태로 한 번 열면 모든 단원이 기기에 저장됩니다.
- 이후에는 인터넷 없이 열리고, 인터넷이 연결된 상태로 열면 새 내용이 자동 반영됩니다.

## 새 단원 추가
1. 단원 파일을 `units/<대단원>-<중단원 두 자리>-<영문이름>.html`로 넣는다.
2. `python3 tools/pwaify.py units/새파일.html`
3. `index.html`의 `UNITS` 목록에서 해당 단원에 `href:'units/새파일.html'`을 넣는다.
4. `sw.js`의 `ASSETS`에 새 파일을 추가하고 `VERSION`을 바꾼다.
