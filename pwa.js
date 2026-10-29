/* 오프라인 저장 등록 + 업데이트 알림 + (목차) 설치 안내 */
(function () {
  'use strict';
  var base = new URL('.', document.currentScript ? document.currentScript.src : location.href).href;

  function toast(text) {
    var t = document.createElement('div');
    t.textContent = text;
    t.setAttribute('role', 'status');
    t.style.cssText = 'position:fixed;left:50%;bottom:calc(20px + env(safe-area-inset-bottom,0px));transform:translateX(-50%);' +
      'background:#191F28;color:#fff;font:600 14px/1.4 Pretendard,"Apple SD Gothic Neo","Malgun Gothic",sans-serif;' +
      'padding:12px 18px;border-radius:999px;box-shadow:0 6px 20px rgba(0,0,0,.2);z-index:9999;max-width:calc(100% - 32px);text-align:center';
    document.body.appendChild(t);
    setTimeout(function () { t.style.transition = 'opacity .4s'; t.style.opacity = '0'; }, 3200);
    setTimeout(function () { t.remove(); }, 3700);
  }

  var standalone = matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
  var box = document.getElementById('install');
  var status = document.getElementById('instStatus');
  var btn = document.getElementById('instBtn');
  function setStatus(s) { if (status) status.textContent = s; }

  if (box && !standalone) box.hidden = false;

  if ('serviceWorker' in navigator) {
    var hadController = !!navigator.serviceWorker.controller;
    navigator.serviceWorker.register(base + 'sw.js', { scope: base }).catch(function () {
      setStatus('이 브라우저에서는 오프라인 저장을 쓸 수 없어요.');
    });
    navigator.serviceWorker.ready.then(function () {
      setStatus('이 기기에 저장되었어요. 다음부터는 인터넷 없이도 열려요.');
    });
    navigator.serviceWorker.addEventListener('controllerchange', function () {
      if (hadController) toast('새 내용이 반영되었어요');
      hadController = true;
    });
  } else {
    setStatus('이 브라우저에서는 오프라인 저장을 쓸 수 없어요.');
  }

  var deferred = null;
  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault(); deferred = e;
    if (btn) btn.hidden = false;
  });
  if (btn) btn.addEventListener('click', function () {
    if (!deferred) return;
    deferred.prompt();
    deferred.userChoice.finally(function () { deferred = null; btn.hidden = true; });
  });
  window.addEventListener('appinstalled', function () {
    if (box) box.hidden = true;
    toast('앱으로 설치되었어요');
  });
})();
