/* 화면 배치 보정 (pwa.js가 모든 페이지에 불러옴, 단원 페이지(.lab>.stage)에서만 동작)
   [세로 화면: 휴대폰·세로 태블릿, 폭 920px 이하]
   - 시뮬레이션 화면을 위쪽에 고정하고, 조작 카드를 바로 아래로 당김
   - 지금 상태의 큰 숫자를 화면 아래 한 줄로 함께 보여 줌
   - '고정 풀기'로 끌 수 있음(기기에 기억) */
(function () {
  if (!document.querySelector('.lab > .stage')) return;
  var MQ = matchMedia('(max-width:920px) and (orientation:portrait)');
  var KEY = 'jigu-sim:dock-loose';
  var loose = false;
  try { loose = localStorage.getItem(KEY) === '1'; } catch (e) {}

  var css = document.createElement('style');
  css.textContent =
    '.lab.docked{display:flex;flex-direction:column;gap:12px;min-width:0;--dockh:38vh;--dockh:38svh}' +
    '.lab.docked:has(.gl-host){--dockh:31vh;--dockh:31svh}' +
    '.lab.docked>.controls{display:contents}' +
    '.lab.docked>.controls>*{order:4;width:100%;max-width:100%;box-sizing:border-box;min-width:0}' +
    '.lab.docked>.controls>.dk-ctl{order:1}' +
    '.lab.docked>.controls>.dk-st{order:2}' +
    '.lab.docked>.stage{order:3}' +
    '.lab.docked>.stage.dk-tail{order:5}' +
    '.lab.docked>.controls>.group{background:var(--panel);border-radius:24px;padding:22px 20px}' +
    '.lab.docked>.stage:not(:has(>*:not(.dk-ph))){display:none}' +
    '.dock{order:0;position:sticky;top:0;z-index:30;background:var(--bg);padding:6px 0 8px;margin-top:-6px}' +
    '.dock.loose{position:relative}' +
    '.dock-in{background:var(--panel);border-radius:20px;padding:10px 10px 8px;box-shadow:0 8px 20px rgba(0,20,60,.10)}' +
    '.dock canvas{display:block;width:min(100%,calc(var(--dockh) * var(--ar,1.6)))!important;margin:0 auto}' +
    '.dock .gl-host{aspect-ratio:auto!important;height:var(--dockh)}' +
    '.dock .viewbar{margin-top:6px}.dock .leg{margin-top:6px}.dock .readout{margin:4px 2px 0;font-size:12px}' +
    '.dock-mini{display:flex;align-items:center;gap:8px;margin-top:8px;padding:0 4px;min-height:30px}' +
    '.dock-mini .v{font-weight:800;font-size:16px;color:var(--ink);white-space:nowrap}' +
    '.dock-mini .v small{font-size:12px}' +
    '.dock-mini .l{font-size:12px;color:var(--muted);line-height:1.3;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}' +
    '.dock-mini button{margin-left:auto;flex:none;border:0;border-radius:999px;padding:6px 11px;font:600 12px var(--font);background:var(--btn);color:var(--btn-ink);cursor:pointer}' +
    '.dock.loose .dock-mini button{background:var(--accent-soft);color:var(--accent)}';
  document.head.appendChild(css);

  var docks = [];

  function setupLab(lab) {
    var stage = lab.querySelector(':scope>.stage'), ctr = lab.querySelector(':scope>.controls');
    if (!stage || !ctr) return null;
    var cards = Array.prototype.filter.call(ctr.children, function (c) { return (c.classList.contains('card') || c.classList.contains('group')) && !c.classList.contains('quiz'); });
    var st = cards.find(function (c) { return c.querySelector('.item-text.big'); });
    var ctl = cards.find(function (c) { return c !== st && c.querySelector('input[type=range],.btn.primary,.seg,.liqs,input[type=checkbox]'); });

    // 화면 쪽으로 옮길 요소: 첫 그림 + 시점 버튼 + 범례 + 값 읽기
    var move = [stage.firstElementChild];
    Array.prototype.forEach.call(stage.children, function (el) {
      if (el !== move[0] && (el.classList.contains('viewbar') || el.classList.contains('leg') || el.classList.contains('readout'))) move.push(el);
    });
    var dock = document.createElement('div'); dock.className = 'dock' + (loose ? ' loose' : '');
    var inner = document.createElement('div'); inner.className = 'dock-in'; dock.appendChild(inner);
    var phs = move.map(function (el) { var ph = document.createElement('i'); ph.className = 'dk-ph'; ph.hidden = true; el.parentNode.insertBefore(ph, el); inner.appendChild(el); return ph; });

    var mini = document.createElement('div'); mini.className = 'dock-mini';
    mini.innerHTML = '<span class="v"></span><span class="l"></span><button type="button"></button>';
    inner.appendChild(mini);
    var btn = mini.querySelector('button');
    btn.textContent = loose ? '화면 고정' : '고정 풀기';
    btn.onclick = function () {
      loose = !loose;
      try { localStorage.setItem(KEY, loose ? '1' : '0'); } catch (e) {}
      docks.forEach(function (d) { d.dock.classList.toggle('loose', loose); d.btn.textContent = loose ? '화면 고정' : '고정 풀기'; });
    };

    // 지금 상태의 큰 숫자 따라 쓰기
    var mo = null;
    if (st) {
      var b = st.querySelector('.item-text.big b'), sp = st.querySelector('.item-text.big span');
      var copy = function () { mini.querySelector('.v').innerHTML = b.innerHTML; mini.querySelector('.l').innerHTML = sp ? sp.innerHTML : ''; };
      copy(); mo = new MutationObserver(copy); mo.observe(st, { subtree: true, childList: true, characterData: true });
      st.classList.add('dk-st');
    } else mini.querySelector('.v').remove();
    if (ctl) ctl.classList.add('dk-ctl');
    // 그림이 빠지고 설명만 남은 영역은 맨 아래로
    if (!stage.querySelector('canvas,.chart,.gl-host,svg')) stage.classList.add('dk-tail');
    lab.insertBefore(dock, lab.firstChild);
    lab.classList.add('docked');
    return { lab: lab, dock: dock, btn: btn, move: move, phs: phs, st: st, ctl: ctl, mo: mo, cv: move[0].tagName === 'CANVAS' ? move[0] : null };
  }
  function teardown(d) {
    d.move.forEach(function (el, i) { d.phs[i].parentNode.insertBefore(el, d.phs[i]); d.phs[i].remove(); });
    if (d.mo) d.mo.disconnect();
    if (d.st) d.st.classList.remove('dk-st');
    if (d.ctl) d.ctl.classList.remove('dk-ctl');
    d.lab.querySelector(':scope>.stage').classList.remove('dk-tail');
    d.dock.remove(); d.lab.classList.remove('docked');
  }
  // 캔버스 비율(가로/세로)을 도크 높이 계산에 넘김
  setInterval(function () {
    docks.forEach(function (d) {
      if (!d.cv) return;
      var a = String(d.cv.style.aspectRatio || '').split('/');
      var r = a.length === 2 ? (+a[0]) / (+a[1]) : d.cv.width / d.cv.height;
      if (r && isFinite(r)) d.dock.style.setProperty('--ar', r.toFixed(4));
    });
  }, 250);

  /* ---- 넓은 화면(PC·가로 태블릿): 왼쪽 그림 아래로 '생각해 볼 질문'·'형성평가'를 옮겨 두 열 높이를 맞춤 ---- */
  var WQ = matchMedia('(min-width:921px)');
  var css2 = document.createElement('style');
  css2.textContent = '.lcol{display:flex;flex-direction:column;gap:12px;min-width:0}.lcol .qz-opts{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.lcol>.group{background:var(--panel);border-radius:24px;padding:22px 20px;gap:14px}';
  document.head.appendChild(css2);
  var wides = [];
  function setupWide(lab) {
    var stage = lab.querySelector(':scope>.stage'), ctr = lab.querySelector(':scope>.controls');
    if (!stage || !ctr) return null;
    // 옮길 수 있는 카드: 알아 둘 용어 · 생각해 볼(탐구) 질문 · 형성평가
    var cand = Array.prototype.filter.call(ctr.children, function (c) {
      if (c.hasAttribute('data-quiz') || c.querySelector('.qlist,ol.qs')) return true;
      var t = c.querySelector('.card-title,h3');
      return !!(t && /알아 둘 용어/.test(t.textContent) && !c.querySelector('input,.btn'));
    });
    if (!cand.length) return null;
    var col = document.createElement('div'); col.className = 'lcol';
    lab.insertBefore(col, stage); col.appendChild(stage);
    return { lab: lab, col: col, stage: stage, ctr: ctr, cand: cand, move: [], phs: [], done: false };
  }
  // 보이는 탭에서만 높이를 재어, 옮기면 두 열 높이 차가 줄어드는 카드만 옮김
  function balance(w) {
    if (w.done || !w.lab.offsetParent) return;
    var L = w.col.offsetHeight, R = w.ctr.offsetHeight; if (!L || !R) return;
    // 옮길 카드 조합을 모두 재어 두 열 높이 차가 가장 작은 조합을 고름(카드 순서는 그대로)
    var phs = w.cand.map(function (c) { var ph = document.createElement('i'); ph.hidden = true; ph.className = 'dk-ph'; w.ctr.insertBefore(ph, c); return ph; });
    function place(mask) {
      w.cand.forEach(function (c, i) {
        if (mask & (1 << i)) w.col.appendChild(c); else phs[i].parentNode.insertBefore(c, phs[i]);
      });
    }
    var best = 0, bestD = Math.abs(L - R);
    for (var m = 1; m < (1 << w.cand.length); m++) {
      place(m);
      var d = Math.abs(w.col.offsetHeight - w.ctr.offsetHeight);
      if (d < bestD - 24) { bestD = d; best = m; }
    }
    place(best);
    w.cand.forEach(function (c, i) {
      if (best & (1 << i)) { w.move.push(c); w.phs.push(phs[i]); } else phs[i].remove();
    });
    w.done = true;
  }
  function teardownWide(w) {
    w.move.forEach(function (el, i) { w.phs[i].parentNode.insertBefore(el, w.phs[i]); w.phs[i].remove(); });
    w.lab.insertBefore(w.stage, w.col); w.col.remove();
  }
  setInterval(function () { wides.forEach(balance); }, 300);

  function relayout() {
    if (docks.length) { docks.forEach(teardown); docks = []; }
    if (wides.length) { wides.forEach(teardownWide); wides = []; }
    var labs = document.querySelectorAll('.lab');
    if (MQ.matches) docks = Array.prototype.map.call(labs, setupLab).filter(Boolean);
    else if (WQ.matches) { wides = Array.prototype.map.call(labs, setupWide).filter(Boolean); wides.forEach(balance); }
  }
  relayout();
  [MQ, WQ].forEach(function (q) { try { q.addEventListener('change', relayout); } catch (e) { q.addListener(relayout); } });
})();
