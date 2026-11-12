# 사이트 파일에서 글꼴·이모지·로고(base64)를 자리표시자로 되돌려 원본(src/)을 만든다.
# 원본이 없는 옛 페이지를 고쳐야 할 때 한 번만 쓰면 된다.
#   python3 tools/unbuild.py units/2-05-tide.html   → src/units/2-05-tide.html
import re, sys, pathlib
ROOT = pathlib.Path(__file__).resolve().parent.parent
for arg in sys.argv[1:]:
    f = pathlib.Path(arg).resolve(); rel = f.relative_to(ROOT)
    s = f.read_text(encoding='utf-8')
    s, n1 = re.subn(r'@font-face\{font-family:"Pretendard";src:url\(data:font/woff2;base64,[A-Za-z0-9+/=]+\) format\("woff2"\);font-weight:45 920;font-style:normal;font-display:swap\}', '/*@@FONT_FACE@@*/', s, count=1)
    s, n2 = re.subn(r'(?:\.em-[a-z0-9-]+\{background-image:url\(data:image/png;base64,[A-Za-z0-9+/=]+\)\}\n?)+', lambda m: '/*@@EMOJI_CSS@@*/' + ('\n' if m.group(0).endswith('\n') else ''), s, count=1)
    s, n3 = re.subn(r'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAANQAAADwCAYAAAB440o4[A-Za-z0-9+/=]+', '@@LOGO@@', s)
    out = ROOT / 'src' / rel; out.parent.mkdir(parents=True, exist_ok=True); out.write_text(s, encoding='utf-8')
    print(f'{rel} → src/{rel}  (글꼴 {n1}, 이모지 묶음 {n2}, 로고 {n3})')
