(function () {
  'use strict';

  var STORAGE_KEY = 'aitlas_cookie_consent';
  var PRIVACY_PATH = '/privacy';

  var defaultConsent = {
    necessary: true,
    analytics: false,
    marketing: false,
    decided: false,
    updatedAt: null
  };

  function readConsent() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return Object.assign({}, defaultConsent);
      var parsed = JSON.parse(raw);
      return {
        necessary: true,
        analytics: !!parsed.analytics,
        marketing: !!parsed.marketing,
        decided: !!parsed.decided,
        updatedAt: parsed.updatedAt || null
      };
    } catch (e) {
      return Object.assign({}, defaultConsent);
    }
  }

  function writeConsent(consent) {
    var next = {
      necessary: true,
      analytics: !!consent.analytics,
      marketing: !!consent.marketing,
      decided: true,
      updatedAt: new Date().toISOString()
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (e) {}
    window.dispatchEvent(new CustomEvent('aitlas:consent', { detail: next }));
    return next;
  }

  function injectStyles() {
    if (document.getElementById('aitlas-cc-styles')) return;
    var style = document.createElement('style');
    style.id = 'aitlas-cc-styles';
    style.textContent = [
      '#aitlas-cc-root{position:fixed;inset:auto 0 0 0;z-index:99999;font-family:Inter,system-ui,sans-serif;pointer-events:none}',
      '#aitlas-cc-root *{box-sizing:border-box}',
      '#aitlas-cc-root.aitlas-cc-open{pointer-events:auto}',
      '#aitlas-cc-banner{display:none;margin:16px;padding:20px 22px;border-radius:16px;background:#040F24;color:#fff;border:1px solid rgba(147,163,184,.22);box-shadow:0 18px 50px rgba(0,0,0,.45);max-width:720px;margin-left:auto;margin-right:auto}',
      '#aitlas-cc-root.aitlas-cc-show-banner #aitlas-cc-banner{display:block}',
      '#aitlas-cc-banner h2{font-family:Montserrat,sans-serif;font-size:17px;font-weight:700;margin:0 0 8px;letter-spacing:-.01em}',
      '#aitlas-cc-banner p{margin:0;color:#93A3B8;font-size:14px;line-height:1.55}',
      '#aitlas-cc-banner a{color:#8FE05F;text-decoration:underline}',
      '#aitlas-cc-actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:16px}',
      '#aitlas-cc-root .aitlas-cc-btn{appearance:none;border:0;cursor:pointer;font-family:Montserrat,sans-serif;font-weight:700;font-size:13.5px;border-radius:10px;padding:12px 16px;transition:transform .15s ease,background .15s ease}',
      '#aitlas-cc-root .aitlas-cc-btn:focus-visible{outline:3px solid #8FE05F;outline-offset:2px}',
      '#aitlas-cc-root .aitlas-cc-btn-primary{background:linear-gradient(135deg,#8FE05F,#68BC44);color:#040F24}',
      '#aitlas-cc-root .aitlas-cc-btn-primary:hover{transform:translateY(-1px)}',
      '#aitlas-cc-root .aitlas-cc-btn-secondary{background:rgba(255,255,255,.05);color:#fff;border:1px solid rgba(147,163,184,.28)}',
      '#aitlas-cc-root .aitlas-cc-btn-secondary:hover{background:rgba(255,255,255,.09)}',
      '#aitlas-cc-root .aitlas-cc-btn-text{background:transparent;color:#93A3B8;padding:12px 8px}',
      '#aitlas-cc-root .aitlas-cc-btn-text:hover{color:#fff}',
      '#aitlas-cc-panel{display:none;position:fixed;inset:0;z-index:100000;background:rgba(4,15,36,.72);align-items:flex-end;justify-content:center;padding:16px;pointer-events:auto}',
      '#aitlas-cc-root.aitlas-cc-show-panel #aitlas-cc-panel{display:flex}',
      '#aitlas-cc-dialog{width:100%;max-width:520px;max-height:min(88vh,640px);overflow:auto;background:#061733;border:1px solid rgba(147,163,184,.22);border-radius:16px;padding:24px;color:#fff;box-shadow:0 24px 60px rgba(0,0,0,.5)}',
      '#aitlas-cc-dialog h2{font-family:Montserrat,sans-serif;font-size:20px;margin:0 0 8px}',
      '#aitlas-cc-dialog > p{color:#93A3B8;font-size:14px;line-height:1.55;margin:0 0 18px}',
      '.aitlas-cc-row{display:flex;gap:14px;align-items:flex-start;justify-content:space-between;padding:14px 0;border-top:1px solid rgba(147,163,184,.16)}',
      '.aitlas-cc-row:last-of-type{border-bottom:1px solid rgba(147,163,184,.16);margin-bottom:18px}',
      '.aitlas-cc-row h3{font-family:Montserrat,sans-serif;font-size:14.5px;margin:0 0 4px}',
      '.aitlas-cc-row p{margin:0;color:#93A3B8;font-size:13px;line-height:1.5;max-width:340px}',
      '.aitlas-cc-switch{position:relative;width:44px;height:26px;flex-shrink:0}',
      '.aitlas-cc-switch input{opacity:0;width:0;height:0}',
      '.aitlas-cc-switch span{position:absolute;inset:0;background:rgba(147,163,184,.28);border-radius:999px;cursor:pointer;transition:background .15s ease}',
      '.aitlas-cc-switch span::after{content:"";position:absolute;width:20px;height:20px;left:3px;top:3px;border-radius:50%;background:#fff;transition:transform .15s ease}',
      '.aitlas-cc-switch input:checked + span{background:#68BC44}',
      '.aitlas-cc-switch input:checked + span::after{transform:translateX(18px)}',
      '.aitlas-cc-switch input:disabled + span{opacity:.55;cursor:not-allowed}',
      '#aitlas-cc-dialog .aitlas-cc-actions{margin-top:0}',
      '@media (max-width:560px){',
      '#aitlas-cc-banner{margin:10px;padding:16px}',
      '#aitlas-cc-actions{flex-direction:column}',
      '#aitlas-cc-root .aitlas-cc-btn{width:100%}',
      '#aitlas-cc-root .aitlas-cc-btn-text{width:auto}',
      '}'
    ].join('');
    document.head.appendChild(style);
  }

  function buildUI() {
    if (document.getElementById('aitlas-cc-root')) return;
    var root = document.createElement('div');
    root.id = 'aitlas-cc-root';
    root.setAttribute('aria-live', 'polite');
    root.innerHTML =
      '<div id="aitlas-cc-banner" role="dialog" aria-labelledby="aitlas-cc-title" aria-describedby="aitlas-cc-desc">' +
        '<h2 id="aitlas-cc-title">Cookies & privacy</h2>' +
        '<p id="aitlas-cc-desc">We use essential cookies to run this site. With your permission, we may also use analytics and marketing cookies. You can change your choice anytime. See our <a href="' + PRIVACY_PATH + '">Privacy & Cookies</a> page.</p>' +
        '<div id="aitlas-cc-actions">' +
          '<button type="button" class="aitlas-cc-btn aitlas-cc-btn-primary" data-cc="accept">Accept all</button>' +
          '<button type="button" class="aitlas-cc-btn aitlas-cc-btn-secondary" data-cc="reject">Essential only</button>' +
          '<button type="button" class="aitlas-cc-btn aitlas-cc-btn-text" data-cc="manage">Manage</button>' +
        '</div>' +
      '</div>' +
      '<div id="aitlas-cc-panel" role="dialog" aria-modal="true" aria-labelledby="aitlas-cc-panel-title" hidden>' +
        '<div id="aitlas-cc-dialog">' +
          '<h2 id="aitlas-cc-panel-title">Cookie preferences</h2>' +
          '<p>Choose which optional cookies we may use. Essential cookies stay on so the site works.</p>' +
          '<div class="aitlas-cc-row">' +
            '<div><h3>Essential</h3><p>Required for security, page function, and remembering your consent choice.</p></div>' +
            '<label class="aitlas-cc-switch"><input type="checkbox" checked disabled aria-label="Essential cookies always on"><span></span></label>' +
          '</div>' +
          '<div class="aitlas-cc-row">' +
            '<div><h3>Analytics</h3><p>Helps us understand traffic and improve the site. No sale of personal data.</p></div>' +
            '<label class="aitlas-cc-switch"><input type="checkbox" id="aitlas-cc-analytics" aria-label="Allow analytics cookies"><span></span></label>' +
          '</div>' +
          '<div class="aitlas-cc-row">' +
            '<div><h3>Marketing</h3><p>Used for ads measurement and retargeting where we run campaigns.</p></div>' +
            '<label class="aitlas-cc-switch"><input type="checkbox" id="aitlas-cc-marketing" aria-label="Allow marketing cookies"><span></span></label>' +
          '</div>' +
          '<div class="aitlas-cc-actions">' +
            '<button type="button" class="aitlas-cc-btn aitlas-cc-btn-primary" data-cc="save">Save preferences</button>' +
            '<button type="button" class="aitlas-cc-btn aitlas-cc-btn-secondary" data-cc="close">Cancel</button>' +
          '</div>' +
        '</div>' +
      '</div>';
    document.body.appendChild(root);

    root.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-cc]');
      if (!btn) {
        if (e.target.id === 'aitlas-cc-panel') hidePanel();
        return;
      }
      var action = btn.getAttribute('data-cc');
      if (action === 'accept') {
        applyAndClose({ analytics: true, marketing: true });
      } else if (action === 'reject') {
        applyAndClose({ analytics: false, marketing: false });
      } else if (action === 'manage') {
        showPanel();
      } else if (action === 'save') {
        applyAndClose({
          analytics: document.getElementById('aitlas-cc-analytics').checked,
          marketing: document.getElementById('aitlas-cc-marketing').checked
        });
      } else if (action === 'close') {
        hidePanel();
        if (!readConsent().decided) showBanner();
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && root.classList.contains('aitlas-cc-show-panel')) {
        hidePanel();
        if (!readConsent().decided) showBanner();
      }
    });
  }

  function showBanner() {
    var root = document.getElementById('aitlas-cc-root');
    root.classList.add('aitlas-cc-open', 'aitlas-cc-show-banner');
    root.classList.remove('aitlas-cc-show-panel');
    document.getElementById('aitlas-cc-panel').hidden = true;
  }

  function hideBanner() {
    var root = document.getElementById('aitlas-cc-root');
    root.classList.remove('aitlas-cc-show-banner');
    if (!root.classList.contains('aitlas-cc-show-panel')) root.classList.remove('aitlas-cc-open');
  }

  function showPanel() {
    var consent = readConsent();
    document.getElementById('aitlas-cc-analytics').checked = !!consent.analytics;
    document.getElementById('aitlas-cc-marketing').checked = !!consent.marketing;
    var root = document.getElementById('aitlas-cc-root');
    root.classList.add('aitlas-cc-open', 'aitlas-cc-show-panel');
    root.classList.remove('aitlas-cc-show-banner');
    var panel = document.getElementById('aitlas-cc-panel');
    panel.hidden = false;
    document.getElementById('aitlas-cc-analytics').focus();
  }

  function hidePanel() {
    var root = document.getElementById('aitlas-cc-root');
    root.classList.remove('aitlas-cc-show-panel');
    document.getElementById('aitlas-cc-panel').hidden = true;
    if (!root.classList.contains('aitlas-cc-show-banner')) root.classList.remove('aitlas-cc-open');
  }

  function applyAndClose(prefs) {
    writeConsent(prefs);
    hidePanel();
    hideBanner();
  }

  function openPreferences() {
    buildUI();
    showPanel();
  }

  function init() {
    injectStyles();
    buildUI();
    var consent = readConsent();
    window.dispatchEvent(new CustomEvent('aitlas:consent', { detail: consent }));
    if (!consent.decided) showBanner();
  }

  window.AitlasConsent = {
    get: readConsent,
    open: openPreferences,
    allow: function (category) {
      var c = readConsent();
      if (category === 'necessary') return true;
      if (!c.decided) return false;
      return !!c[category];
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
