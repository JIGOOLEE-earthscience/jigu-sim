# 원본(src/)을 사이트 파일로 만든다.
#   python3 tools/build.py                      # src/ 안의 모든 페이지
#   python3 tools/build.py src/units/3-04-pressure-forces.html
# 하는 일
#   1) 원본의 자리표시자를 디자인 키트(kit/)로 채움
#        /*@@FONT_FACE@@*/  → 프리텐다드 글꼴(base64)
#        /*@@EMOJI_CSS@@*/  → 원본에 적힌 em-이름 마다 토스페이스 이모지 PNG(base64)
#        @@LOGO@@           → 로고 PNG(base64)
#   2) tools/pwaify.py 로 앱(PWA)용 머리말·three.js 내장본·pwa.js 연결
#   3) <script> 문법 검사(node 가 있으면)
# 원본 src/<경로>.html → 결과 <경로>.html (예: src/units/a.html → units/a.html)
import base64, re, sys, pathlib, subprocess, shutil, tempfile

ROOT = pathlib.Path(__file__).resolve().parent.parent
KIT = ROOT / 'kit'
b64 = lambda p: base64.b64encode(p.read_bytes()).decode()
FONT = ('@font-face{font-family:"Pretendard";src:url(data:font/woff2;base64,' + b64(KIT / 'font/pretendard-kr.woff2') +
        ') format("woff2");font-weight:45 920;font-style:normal;font-display:swap}')
LOGO = 'data:image/png;base64,' + b64(KIT / 'logo.png')

def build(src):
    src = pathlib.Path(src).resolve()
    rel = src.relative_to(ROOT / 'src')
    out = ROOT / rel
    s = src.read_text(encoding='utf-8')
    slugs = sorted(set(re.findall(r'\bem-([a-z0-9]+(?:-[a-z0-9]+)*)', s)))
    css, miss = [], []
    for slug in slugs:
        p = KIT / 'em' / (slug + '.png')
        if p.exists(): css.append('.em-%s{background-image:url(data:image/png;base64,%s)}' % (slug, b64(p)))
        else: miss.append(slug)
    s = s.replace('/*@@FONT_FACE@@*/', FONT).replace('/*@@EMOJI_CSS@@*/', '\n'.join(css)).replace('@@LOGO@@', LOGO)
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(s, encoding='utf-8')
    subprocess.run([sys.executable, str(ROOT / 'tools/pwaify.py'), str(out)], check=True, stdout=subprocess.DEVNULL)
    msg = f'ok {rel}  이모지 {len(css)}개'
    if miss: msg += f'  ⚠ 키트에 없는 이모지: {", ".join(miss)}'
    if shutil.which('node'):
        js = '\n;\n'.join(re.findall(r'<script>(.*?)</script>', out.read_text(encoding='utf-8'), re.S))
        with tempfile.NamedTemporaryFile('w', suffix='.js', delete=False, encoding='utf-8') as f: f.write(js)
        r = subprocess.run(['node', '--check', f.name], capture_output=True, text=True)
        msg += '  문법 OK' if r.returncode == 0 else '\n  ⚠ 문법 오류:\n' + r.stderr
    print(msg)

targets = sys.argv[1:] or sorted(str(p) for p in (ROOT / 'src').rglob('*.html'))
for t in targets: build(t)
