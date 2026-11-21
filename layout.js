/* 화면 배치 보정 (pwa.js가 모든 페이지에 불러옴, 단원 페이지(.lab>.stage)에서만 동작)
   [세로 화면: 휴대폰·세로 태블릿, 폭 920px 이하]
   - 시뮬레이션 화면을 위쪽에 고정하고, 조작 카드를 바로 아래로 당김
   - 핵심 조작(data-dock 요소, 없으면 첫 슬라이더 + 주 버튼)을 그림 바로 아래에 붙임
   - 지금 상태의 큰 숫자를 화면 아래 한 줄로 함께 보여 줌
   - '고정 풀기'로 끌 수 있음(기기에 기억)
   [모든 화면: 그림 위 재생 버튼]
   - .stage[data-play="주 버튼 id"] 이면 첫 그림 안에 '▶ 움직이기/⏸ 멈추기' 버튼을 만듦(주 버튼과 같은 동작)
     data-back="처음으로 버튼 id", data-play-label="멈췄을 때 글자(없으면 주 버튼 글자)", data-play-pos="tr"(오른쪽 위)
   - 원본에 직접 넣은 .ovbar 도 같은 방식으로 연결(이미 연결된 것[data-bound]은 건너뜀) */
(function () {
  if (!document.querySelector('.lab > .stage')) return;

  /* ---- 그림 위 재생 버튼 ---- */
  var ovcss = document.createElement('style');
  ovcss.textContent =
    '.cvwrap{position:relative;margin:0 auto;width:100%}.cvwrap>canvas{display:block;width:100%}' +
    '.dock .cvwrap{width:min(100%,calc(var(--dockh) * var(--ar,1.6)))}.dock .cvwrap>canvas{width:100%!important}' +
    '.ovbar{position:absolute;left:50%;bottom:10px;transform:translateX(-50%);display:flex;gap:6px;z-index:3}' +
    '.ovbar.tr{left:auto;right:10px;bottom:auto;top:10px;transform:none}' +
    '.ovbtn{font:700 14px/1 var(--font);border:0;border-radius:999px;padding:9px 15px 9px 12px;background:var(--accent);color:#fff;box-shadow:0 3px 10px rgba(0,30,80,.22);cursor:pointer;display:flex;align-items:center;gap:6px;white-space:nowrap}' +
    '.ovbtn svg{width:14px;height:14px;fill:currentColor;flex:none}.ovbtn.on{background:var(--ink);color:var(--panel)}' +
    '.ovbtn.ov-back{background:var(--panel);color:var(--ink2);padding:9px 13px;font-size:13px}.ovbtn:active{transform:scale(.96)}' +
    '@media (max-width:560px){.ovbar{bottom:6px}.ovbar.tr{top:6px;right:6px}.ovbtn{font-size:12.5px;padding:7px 11px 7px 9px}.ovbtn svg{width:12px;height:12px}.ovbtn.ov-back span{display:none}.ovbtn.ov-back{padding:7px 10px}}';
  document.head.appendChild(ovcss);
  Array.prototype.forEach.call(document.querySelectorAll('.stage[data-play]'), function (stage) {
    var t = stage.firstElementChild; if (!t || t.querySelector('.ovbar')) return;
    var host = t;
    if (t.tagName === 'CANVAS') { host = document.createElement('div'); host.className = 'cvwrap'; stage.insertBefore(host, t); host.appendChild(t); }
    else if (getComputedStyle(t).position === 'static') t.style.position = 'relative';
    var bar = document.createElement('div'); bar.className = 'ovbar' + (stage.dataset.playPos === 'tr' ? ' tr' : '');
    bar.dataset.go = stage.dataset.play; bar.dataset.back = stage.dataset.back || ''; if (stage.dataset.playLabel) bar.dataset.label = stage.dataset.playLabel;
    bar.innerHTML = '<button type="button" class="ovbtn ov-play"></button>' + (stage.dataset.back ? '<button type="button" class="ovbtn ov-back" aria-label="처음으로">↺<span>처음으로</span></button>' : '');
    host.appendChild(bar);
  });
  var PLAY = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 2.5v11l9.5-5.5z"/></svg>', PAUSE = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 2.5h3.2v11H3.5zM9.3 2.5h3.2v11H9.3z"/></svg>';
  Array.prototype.forEach.call(document.querySelectorAll('.ovbar:not([data-bound])'), function (bar) {
    var main = document.getElementById(bar.dataset.go); if (!main) return;
    bar.dataset.bound = '1';
    var back = bar.dataset.back ? document.getElementById(bar.dataset.back) : null;
    var pb = bar.querySelector('.ov-play'), rb = bar.querySelector('.ov-back'), last = null;
    var stop = function (e) { e.stopPropagation(); };
    pb.addEventListener('pointerdown', stop); pb.addEventListener('click', function (e) { stop(e); main.click(); });
    if (rb && back) { rb.addEventListener('pointerdown', stop); rb.addEventListener('click', function (e) { stop(e); back.click(); }); }
    var upd = function () {
      var tx = (main.textContent || '').trim(); if (tx === last) return; last = tx;
      var on = tx.indexOf('일시정지') >= 0;
      var lb = on ? '멈추기' : tx.indexOf('이어서') === 0 ? '이어서' : (bar.dataset.label || tx);
      pb.innerHTML = (on ? PAUSE : PLAY) + '<span>' + lb + '</span>'; pb.classList.toggle('on', on); pb.setAttribute('aria-label', lb);
    };
    new MutationObserver(upd).observe(main, { childList: true, characterData: true, subtree: true }); upd();
  });

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
    '.dock.loose .dock-mini button{background:var(--accent-soft);color:var(--accent)}' +
    '.lab.docked:has(.dock-ctl){--dockh:32vh;--dockh:32svh}' +
    '.lab.docked:has(.gl-host):has(.dock-ctl){--dockh:27vh;--dockh:27svh}' +
    '.dock-ctl{display:flex;flex-direction:column;gap:6px;margin-top:8px;padding:0 6px}' +
    '.dock-ctl .ctl{gap:0}.dock-ctl .ctl .row{font-size:13px}.dock-ctl .ctl output{font-size:13px}' +
    '.dock-ctl .btn-xl{font-size:15px;padding:11px;border-radius:12px}';
  document.head.appendChild(css);

  var docks = [];

  function setupLab(lab) {
    var stage = lab.querySelector(':scope>.stage'), ctr = lab.querySelector(':scope>.controls');
    if (!stage || !ctr) return null;
    var cards = Array.prototype.filter.call(ctr.children, function (c) { return (c.classList.contains('card') || c.classList.contains('group')) && !c.classList.contains('quiz'); });
    var st = cards.find(function (c) { return c.querySelector('.item-text.big'); });
    var ctl = cards.find(function (c) { return c !== st && c.querySelector('input[type=range],.btn.primary,.seg,.liqs,input[type=checkbox]'); });

    // 화면 쪽으로 옮길 요소: 첫 그림 + 시점 버튼 + 범례 + 값 읽기
    var hasOv = !!stage.querySelector('.ovbar');
    var move = [stage.firstElementChild];
    Array.prototype.forEach.call(stage.children, function (el) {
      if (el !== move[0] && (el.classList.contains('viewbar') || el.classList.contains('leg') || el.classList.contains('readout'))) move.push(el);
    });
    var dock = document.createElement('div'); dock.className = 'dock' + (loose ? ' loose' : '');
    var inner = document.createElement('div'); inner.className = 'dock-in'; dock.appendChild(inner);
    var phs = move.map(function (el) { var ph = document.createElement('i'); ph.className = 'dk-ph'; ph.hidden = true; el.parentNode.insertBefore(ph, el); inner.appendChild(el); return ph; });

    // 핵심 조작도 그림 바로 아래로: data-dock 이 붙은 요소, 없으면 조작 카드의 첫 슬라이더 + (그림 위 재생 버튼이 없을 때) 주 버튼
    var dmove = [], dphs = [];
    if (ctl) {
      var picks = Array.prototype.slice.call(ctl.querySelectorAll('[data-dock]'));
      if (!picks.length) {
        var r = ctl.querySelector('input[type=range]'); r = r && (r.closest('.ctl') || r);
        if (r) picks.push(r);
        var pb = ctl.querySelector('.btn.primary');
        if (pb && !hasOv) picks.push(pb);
      }
      if (picks.length) {
        var dc = document.createElement('div'); dc.className = 'dock-ctl'; inner.appendChild(dc);
        picks.forEach(function (el) { var ph = document.createElement('i'); ph.className = 'dk-ph'; ph.hidden = true; el.parentNode.insertBefore(ph, el); dc.appendChild(el); dmove.push(el); dphs.push(ph); });
      }
    }

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
    return { lab: lab, dock: dock, btn: btn, move: move.concat(dmove), phs: phs.concat(dphs), st: st, ctl: ctl, mo: mo, cv: move[0].tagName === 'CANVAS' ? move[0] : (move[0].classList.contains('cvwrap') ? move[0].querySelector('canvas') : null) };
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
