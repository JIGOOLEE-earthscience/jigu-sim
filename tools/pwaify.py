# 사이트 페이지를 앱(PWA)용으로 정리한다. 여러 번 실행해도 결과가 같다.
#   python3 tools/pwaify.py index.html units/*.html
# - 문서 머리(doctype, charset, viewport)와 앱 정보 링크를 넣는다.
# - 빌드 주석(로고 base64가 든 skeleton 설명)을 지운다.
# - three.js를 인터넷(cdnjs) 대신 lib/three.min.js에서 읽게 한다.
# - 마지막에 pwa.js(오프라인 저장 등록)를 붙인다.
import re, sys, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
for arg in sys.argv[1:]:
    f = pathlib.Path(arg).resolve()
    p = '../' * (len(f.relative_to(ROOT).parts) - 1)
    s = f.read_text(encoding='utf-8')
    # 1) skeleton 설명 주석 제거
    s = re.sub(r'^\s*<!-- 지구과학 체험형 시뮬레이션 기본 틀.*?-->\s*', '', s, count=1, flags=re.S)
    # 2) 문서 머리
    pwa_head = (f'<meta name="theme-color" content="#3182F6">'
                f'<link rel="manifest" href="{p}manifest.webmanifest">'
                f'<link rel="icon" href="{p}icons/icon-192.png">'
                f'<link rel="apple-touch-icon" href="{p}icons/apple-touch-icon.png">'
                f'<meta name="mobile-web-app-capable" content="yes">'
                f'<meta name="apple-mobile-web-app-capable" content="yes">'
                f'<meta name="apple-mobile-web-app-title" content="지구시스템과학">')
    if 'rel="manifest"' not in s:
        if s.lstrip().lower().startswith('<!doctype'):
            s = re.sub(r'(<meta name=viewport[^>]*>|<meta name="viewport"[^>]*>)', lambda m: m.group(1) + pwa_head, s, count=1)
        else:
            s = ('<!doctype html><html lang="ko"><head><meta charset="utf-8">'
                 '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">'
                 + pwa_head + '\n' + s)
    # 3) three.js 내장본 사용
    s = s.replace('https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', f'{p}lib/three.min.js')
    # 4) 오프라인 저장 등록
    if 'pwa.js' not in s:
        tag = f'<script src="{p}pwa.js" defer></script>'
        s = s.replace('</body>', tag + '</body>', 1) if '</body>' in s else s.rstrip() + '\n' + tag + '\n'
    f.write_text(s, encoding='utf-8')
    print('ok', f.relative_to(ROOT))
