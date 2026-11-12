/* 피드백 버튼 (모든 페이지 공통) — pwa.js 가 불러옴
   보낸 의견은 구글 설문지 「지구과학 시뮬레이션 피드백」과 연결된 스프레드시트에 쌓임.
   설문지 질문·보기 문구를 바꾸면 아래 FORM 과 KIND·DEV 문구도 똑같이 바꿔야 접수됨. */
(function () {
  'use strict';
  if (document.getElementById('jfbOpen')) return;

  var FORM = {
    url: 'https://docs.google.com/forms/d/e/1FAIpQLSeTsDlFxZO9Eh0XB_QBwvmDTdgTQY_6dXj2_6hG7R9280Q8kQ/formResponse',
    who: 'entry.220379370',    // 이름
    kind: 'entry.1504476081',  // 의견 종류 (객관식)
    where: 'entry.557765555',  // 의견이 있는 단원
    text: 'entry.1565923978',  // 제안 내용
    dev: 'entry.265736844'     // 사용한 기기 (객관식 + 기타)
  };
  var KIND = {
    '오류 신고': '오류 신고 (작동이 안 되거나 화면이 깨짐 등)',
    '내용 수정': '내용 수정 (과학 내용이나 글자 오류 등)',
    '제안하기': '제안하기 (있었으면 하는 기능이나 단원 등)',
    '기타': '기타'
  };
  var HELP = { '오류 신고': '작동이 안 되거나 화면이 깨짐 등', '내용 수정': '과학 내용이나 글자 오류 등', '제안하기': '있었으면 하는 기능이나 단원 등', '기타': '그 밖의 의견' };
  var PH = {
    '오류 신고': '예) 3D 지구가 돌아가지 않아요. 확대 버튼을 누르면 화면이 하얘져요.',
    '내용 수정': '예) 형성평가 2번 풀이의 숫자가 교과서와 달라요.',
    '제안하기': '예) 그래프 값을 표로도 볼 수 있으면 좋겠어요.',
    '기타': '자유롭게 적어 주세요.'
  };
  var DEV = { ios: 'IOS (아이폰, 아이패드 등)', android: '안드로이드 (갤럭시 등)', win: '컴퓨터 (Windows)', board: '전자칠판' };
  var DEVHELP = { ios: '아이폰, 아이패드 등', android: '갤럭시 등', win: 'Windows 컴퓨터', board: '교실 전자칠판' };
  var DRAFT = 'jigu-sim:fb-draft';

  var css = [
    '.jfb-fab{position:fixed;z-index:9000;right:calc(16px + env(safe-area-inset-right,0px));bottom:calc(16px + env(safe-area-inset-bottom,0px));display:flex;align-items:center;gap:6px;font:700 14px/1 Pretendard,"Apple SD Gothic Neo","Malgun Gothic",sans-serif;color:var(--ink,#191F28);background:var(--panel,#fff);border:0;border-radius:999px;padding:10px 15px 10px 12px;box-shadow:0 4px 16px rgba(0,0,0,.16);cursor:pointer;letter-spacing:-.01em}',
    '.jfb-fab svg{width:18px;height:18px;flex:none;color:var(--accent,#3182F6)}',
    '.jfb-fab:hover{filter:brightness(.97)}',
    '.jfb-fab:focus-visible,.jfb-sheet button:focus-visible,.jfb-sheet input:focus-visible,.jfb-sheet textarea:focus-visible{outline:2px solid var(--accent,#3182F6);outline-offset:2px}',
    '.jfb-back{position:fixed;inset:0;z-index:9500;background:rgba(0,0,0,.42);display:flex;align-items:flex-end;justify-content:center}',
    '@media (min-width:700px){.jfb-back{align-items:center}}',
    '.jfb-sheet{box-sizing:border-box;width:100%;max-width:480px;max-height:calc(100% - 24px);overflow:auto;background:var(--panel,#fff);color:var(--ink,#191F28);font:400 15px/1.5 Pretendard,"Apple SD Gothic Neo","Malgun Gothic",sans-serif;letter-spacing:-.01em;word-break:keep-all;border-radius:24px 24px 0 0;padding:22px 20px calc(20px + env(safe-area-inset-bottom,0px));padding-left:max(20px,env(safe-area-inset-left,0px));padding-right:max(20px,env(safe-area-inset-right,0px));display:flex;flex-direction:column;gap:14px;animation:jfbup .2s ease}',
    '.jfb-sheet *{box-sizing:border-box}',
    '@media (min-width:700px){.jfb-sheet{border-radius:24px;padding-bottom:20px}}',
    '@keyframes jfbup{from{transform:translateY(24px);opacity:.6}to{transform:none;opacity:1}}',
    '.jfb-top{display:flex;align-items:flex-start;justify-content:space-between;gap:10px}',
    '.jfb-top h2{margin:0;font-size:20px;font-weight:800;letter-spacing:-.03em;color:var(--ink,#191F28)}',
    '.jfb-top p{margin:2px 0 0;font-size:14px;color:var(--sub,#8B95A1)}',
    '.jfb-x{flex:none;width:36px;height:36px;border-radius:12px;border:0;background:var(--btn,#F2F4F6);color:var(--btn-ink,#4E5968);font:600 18px/1 inherit;cursor:pointer}',
    '.jfb-col{display:flex;flex-direction:column;gap:14px}',
    '.jfb-lbl{font-size:14px;font-weight:600;color:var(--ink2,#333D4B);margin:0 0 -6px}',
    '.jfb-lbl small{font-size:12.5px;font-weight:500;color:var(--sub,#8B95A1);margin-left:5px}',
    '.jfb-seg{display:grid;grid-auto-flow:column;grid-auto-columns:1fr;gap:4px;background:var(--btn,#F2F4F6);border-radius:14px;padding:4px}',
    '.jfb-seg button{font:600 14px/1.25 Pretendard,"Apple SD Gothic Neo","Malgun Gothic",sans-serif;color:var(--muted,#6B7684);background:transparent;border:0;border-radius:11px;padding:10px 2px;cursor:pointer;letter-spacing:-.03em;min-width:0}',
    '.jfb-seg button[aria-pressed="true"]{background:var(--panel,#fff);color:var(--ink,#191F28);box-shadow:0 1px 4px rgba(0,0,0,.08)}',
    '.jfb-sheet input,.jfb-sheet textarea{width:100%;font:500 15px/1.5 Pretendard,"Apple SD Gothic Neo","Malgun Gothic",sans-serif;color:var(--ink,#191F28);background:var(--btn,#F2F4F6);border:0;border-radius:12px;padding:11px 12px;margin:0}',
    '.jfb-sheet textarea{min-height:120px;resize:vertical}',
    '.jfb-cnt{align-self:flex-end;font-size:12px;color:var(--sub,#8B95A1);margin:-8px 2px 0}',
    '.jfb-help{font-size:13px;color:var(--sub,#8B95A1);margin:-6px 2px 0;line-height:1.5}',
    '.jfb-send{width:100%;font:700 17px/1.2 Pretendard,"Apple SD Gothic Neo","Malgun Gothic",sans-serif;color:var(--accent-ink,#fff);background:var(--accent,#3182F6);border:0;border-radius:16px;padding:16px;cursor:pointer}',
    '.jfb-send:disabled{opacity:.45;cursor:default}',
    '.jfb-msg{margin:0;font-size:14px;line-height:1.55;border-radius:12px;padding:10px 12px;background:var(--btn,#F2F4F6);color:var(--ink2,#333D4B)}',
    '.jfb-msg.err{background:rgba(240,68,82,.13)}',
    '.jfb-done{display:flex;flex-direction:column;align-items:center;gap:8px;text-align:center;padding:18px 0 6px}',
    '.jfb-done svg{width:52px;height:52px;color:#14A37F}',
    '.jfb-done b{font-size:19px;letter-spacing:-.02em}',
    '.jfb-done span{font-size:14px;color:var(--sub,#8B95A1)}',
    '.jfb-done .jfb-send{margin-top:10px}',
    '.jfb-back[hidden],.jfb-sheet [hidden]{display:none!important}',
    '@media (prefers-reduced-motion: reduce){.jfb-sheet{animation:none}}',
    '@media print{.jfb-fab{display:none}}'
  ].join('\n');

  var ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20.5l1.4-4.9A8 8 0 1 1 21 12z"/><path d="M8.5 11h7M8.5 14.5h4.5"/></svg>';
  var CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M7.5 12.5l3 3 6-6.5"/></svg>';

  function seg(id, label, items) {
    return '<div class="jfb-seg" id="' + id + '" role="group" aria-label="' + label + '">' +
      items.map(function (it) { return '<button type="button" data-v="' + it[0] + '" aria-pressed="false">' + it[1] + '</button>'; }).join('') + '</div>';
  }
  var html =
    '<button class="jfb-fab" id="jfbOpen" type="button" aria-haspopup="dialog">' + ICON + '피드백</button>' +
    '<div class="jfb-back" id="jfbBack" hidden><div class="jfb-sheet" role="dialog" aria-modal="true" aria-labelledby="jfbTitle">' +
      '<div class="jfb-top"><div><h2 id="jfbTitle">의견 보내기</h2><p>불편한 점이나 바라는 점을 만든 선생님께 전해요.</p></div>' +
      '<button class="jfb-x" id="jfbClose" type="button" aria-label="닫기">✕</button></div>' +
      '<form id="jfbForm" novalidate><div class="jfb-col">' +
        '<label class="jfb-lbl" for="jfbWho">이름<small>적지 않아도 돼요</small></label>' +
        '<input id="jfbWho" type="text" maxlength="20" autocomplete="off">' +
        '<p class="jfb-lbl">의견 종류</p>' +
        seg('jfbKind', '의견 종류', [['오류 신고', '오류 신고'], ['내용 수정', '내용 수정'], ['제안하기', '제안하기'], ['기타', '기타']]) +
        '<p class="jfb-help" id="jfbKindHelp"></p>' +
        '<label class="jfb-lbl" for="jfbWhere">의견이 있는 단원<small>지금 보던 단원이 자동으로 채워져요</small></label>' +
        '<input id="jfbWhere" type="text" maxlength="80">' +
        '<label class="jfb-lbl" for="jfbText">제안 내용</label>' +
        '<textarea id="jfbText" maxlength="1000"></textarea>' +
        '<span class="jfb-cnt" id="jfbCnt">0 / 1000</span>' +
        '<p class="jfb-lbl">사용한 기기</p>' +
        seg('jfbDev', '사용한 기기', [['ios', 'iOS'], ['android', '안드로이드'], ['win', '컴퓨터'], ['board', '전자칠판'], ['etc', '기타']]) +
        '<p class="jfb-help" id="jfbDevHelp"></p>' +
        '<p class="jfb-msg" id="jfbMsg" hidden></p>' +
        '<button class="jfb-send" id="jfbSend" type="submit" disabled>보내기</button>' +
      '</div></form>' +
      '<div class="jfb-done" id="jfbDone" hidden>' + CHECK + '<b>의견을 보냈어요</b><span>읽어 보고 다음 업데이트에 반영할게요.</span>' +
        '<button class="jfb-send" id="jfbAgain" type="button">닫기</button></div>' +
    '</div></div>';

  function init() {
    var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
    var wrap = document.createElement('div'); wrap.innerHTML = html;
    while (wrap.firstChild) document.body.appendChild(wrap.firstChild);
    // 버튼이 화면 맨 아래 내용을 가리지 않게 여백 확보
    var pb = parseFloat(getComputedStyle(document.body).paddingBottom) || 0;
    if (pb < 72) document.body.style.paddingBottom = '72px';

    var $ = function (id) { return document.getElementById(id); };
    var back = $('jfbBack'), form = $('jfbForm'), txt = $('jfbText'), send = $('jfbSend'), msg = $('jfbMsg');
    var kind = '오류 신고', dev = '', lastFocus = null;

    function pageName() {
      var m = document.querySelector('meta[name="jigu-page"]');
      if (m) return m.content;
      var h = document.querySelector('h1'), sub = h && h.querySelector('.subj');
      if (sub) {
        var tab = document.querySelector('[role="tab"][aria-selected="true"]');
        return (sub.textContent.trim() + '/' + h.textContent.replace(sub.textContent, '').trim() + (tab ? ' · ' + tab.textContent.trim() : '')).slice(0, 100);
      }
      return (h ? h.textContent.trim() : document.title).slice(0, 80);
    }
    function osName() {
      var ua = navigator.userAgent;
      if (/iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1)) return 'iOS';
      if (/Android/.test(ua)) return 'Android';
      if (/CrOS/.test(ua)) return 'Chromebook';
      if (/Windows/.test(ua)) return 'Windows';
      if (/Macintosh/.test(ua)) return 'Mac';
      if (/Linux/.test(ua)) return 'Linux';
      return '알 수 없음';
    }
    function guessDev() { return { iOS: 'ios', Android: 'android', Windows: 'win' }[osName()] || 'etc'; }
    function tech() {
      var app = (matchMedia('(display-mode: standalone)').matches || navigator.standalone === true) ? '앱' : '브라우저';
      return (location.pathname.split('/').pop() || 'index.html') + ' · ' + app;
    }
    function pick(id, v) { Array.prototype.forEach.call($(id).querySelectorAll('button'), function (x) { x.setAttribute('aria-pressed', String(x.dataset.v === v)); }); }
    function showKind() { pick('jfbKind', kind); $('jfbKindHelp').textContent = HELP[kind]; txt.placeholder = PH[kind]; }
    function showDev() {
      pick('jfbDev', dev);
      $('jfbDevHelp').textContent = (dev === 'etc' ? '그 밖의 기기 (' + osName() + ')' : DEVHELP[dev]) + ' · 어떤 기기에서 오류가 생겼는지 알면 고치기 쉬워요.';
    }
    function save() {
      try { localStorage.setItem(DRAFT, JSON.stringify({ kind: kind, dev: dev, where: $('jfbWhere').value, text: txt.value, who: $('jfbWho').value, page: location.pathname })); } catch (e) {}
    }
    function upd() { $('jfbCnt').textContent = txt.value.length + ' / 1000'; send.disabled = txt.value.trim().length < 2; }
    function note(t, err) { msg.textContent = t; msg.className = 'jfb-msg' + (err ? ' err' : ''); msg.hidden = false; }

    Array.prototype.forEach.call($('jfbKind').querySelectorAll('button'), function (b) { b.addEventListener('click', function () { kind = b.dataset.v; showKind(); save(); }); });
    Array.prototype.forEach.call($('jfbDev').querySelectorAll('button'), function (b) { b.addEventListener('click', function () { dev = b.dataset.v; showDev(); save(); }); });
    [txt, $('jfbWhere'), $('jfbWho')].forEach(function (el) { el.addEventListener('input', function () { upd(); save(); }); });

    function openFb() {
      lastFocus = document.activeElement;
      var d = null; try { d = JSON.parse(localStorage.getItem(DRAFT) || 'null'); } catch (e) {}
      if (d) {
        kind = KIND[d.kind] ? d.kind : kind; txt.value = d.text || ''; $('jfbWho').value = d.who || '';
        dev = (DEV[d.dev] || d.dev === 'etc') ? d.dev : '';
      }
      if (!dev) dev = guessDev();
      // 다른 페이지에서 쓰던 임시 저장본이면 단원 칸은 지금 페이지로 새로 채움
      $('jfbWhere').value = (d && d.where && d.page === location.pathname) ? d.where : pageName();
      showKind(); showDev();
      form.hidden = false; $('jfbDone').hidden = true; msg.hidden = true; upd();
      back.hidden = false; document.documentElement.style.overflow = 'hidden';
      setTimeout(function () { txt.focus(); }, 50);
    }
    function closeFb() { back.hidden = true; document.documentElement.style.overflow = ''; if (lastFocus && lastFocus.focus) lastFocus.focus(); }
    $('jfbOpen').addEventListener('click', openFb);
    $('jfbClose').addEventListener('click', closeFb);
    $('jfbAgain').addEventListener('click', closeFb);
    back.addEventListener('click', function (e) { if (e.target === back) closeFb(); });
    document.addEventListener('keydown', function (e) { if (!back.hidden && e.key === 'Escape') closeFb(); });

    form.addEventListener('submit', function (e) {
      e.preventDefault(); if (send.disabled) return;
      if (!navigator.onLine) { note('인터넷에 연결되어 있지 않아요. 쓴 내용은 저장해 두었으니 연결된 뒤 다시 보내 주세요.', true); return; }
      var body = new URLSearchParams();
      body.set(FORM.who, $('jfbWho').value.trim());
      body.set(FORM.kind, KIND[kind]);
      body.set(FORM.where, ($('jfbWhere').value.trim() || pageName()) + ' (' + tech() + ')');
      body.set(FORM.text, txt.value.trim());
      if (DEV[dev]) body.set(FORM.dev, DEV[dev]);
      else { body.set(FORM.dev, '__other_option__'); body.set(FORM.dev + '.other_option_response', osName()); }
      send.disabled = true; send.textContent = '보내는 중…';
      fetch(FORM.url, { method: 'POST', mode: 'no-cors', body: body }).then(function () {
        try { localStorage.removeItem(DRAFT); } catch (err) {}
        txt.value = ''; form.hidden = true; $('jfbDone').hidden = false;
      }).catch(function () {
        note('보내지 못했어요. 인터넷 연결을 확인하고 다시 눌러 주세요. 쓴 내용은 그대로 남아 있어요.', true);
      }).then(function () { send.textContent = '보내기'; upd(); });
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
