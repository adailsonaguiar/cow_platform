(function () {
  'use strict';

  var CFG = window.QO_CONFIG || {};
  var id  = (CFG.id || 'default');

  var root = document.querySelector('.qo[data-qo-id="' + id + '"]') || document.getElementById('qo-' + id);
  if (!root) return;

  var adMode    = (root.getAttribute('data-ad-mode') || CFG.adMode || 'rewarded').toLowerCase();
  var entryMode = (CFG.entryMode || 'quiz').toLowerCase();

  if (!root.hasAttribute('hidden')) root.setAttribute('hidden', '');
  root.setAttribute('aria-hidden', 'true');
  root.style.display = 'none';

  try {
    var onceKey = 'qo_once_' + id;
    if (localStorage.getItem(onceKey) === '1') {
      localStorage.removeItem(onceKey);
      if (root.parentNode) root.parentNode.removeChild(root);
      return;
    }
  } catch(e){}

  try {
    var key  = 'qo_seen_' + id, now = Date.now();
    var cdMs = (CFG.cooldownMin || 0) * 60 * 1000;
    var seen = parseInt(localStorage.getItem(key) || '0', 10);
    if (CFG.autoShow !== false && cdMs > 0 && seen && (now - seen) < cdMs) {
      if (root.parentNode) root.parentNode.removeChild(root);
      return;
    }
  } catch (e) {}

  var html        = document.documentElement;
  var barFill     = root.querySelector('.qo__bar__fill');
  var progressEl  = root.querySelector('.qo__progress');
  var stepsEls    = Array.prototype.slice.call(root.querySelectorAll('.qo__step'));
  var loadingWrap = root.querySelector('.qo__loading');
  var finalWrap   = root.querySelector('.qo__final');
  var wheelStep   = root.querySelector('.qo__step--wheel');

  var LO_TEXT = (root.querySelector('.qo__loadingText') ? root.querySelector('.qo__loadingText').textContent : 'Procurando as melhores oportunidades').trim();
  var LO_MS   = parseInt(root.getAttribute('data-loading-ms') || '1600', 10) || 1600;

  var wheelPrizeLabel = '';

  initWheel();

  var state = { stepIndex: 0, total: stepsEls.length, answers: [] };
  if (!state.total) return;

  function lock(){ html.classList.add('qo-lock'); }
  function unlock(){ html.classList.remove('qo-lock'); }

  function updateProgress(){
    var pct = (state.stepIndex / state.total) * 100;
    if (state.stepIndex === 0) pct = Math.max(6, pct);
    if (barFill) barFill.style.width = pct + '%';
    if (progressEl) progressEl.textContent = 'Pergunta ' + (state.stepIndex + 1) + ' de ' + state.total;
  }

  function showOnly(el){
    stepsEls.forEach(function(s){ s.hidden = (s !== el); });
    if (loadingWrap) loadingWrap.hidden = true;
    if (finalWrap)   finalWrap.hidden   = true;
  }

  function focusFirstButton(el){
    setTimeout(function(){
      var b = el && el.querySelector('.qo__btn');
      if (b) b.focus();
    }, 10);
  }

  function renderStep(){
    var stepEl = stepsEls[state.stepIndex];
    if (!stepEl) { done(); return; }
    showOnly(stepEl);
    updateProgress();
    focusFirstButton(stepEl);
  }

  function selectOption(label, index){
    state.answers.push({ step: state.stepIndex, label: label, index: index });
    window.dispatchEvent(new CustomEvent('qo_answer', {
      detail: { id: id, step: state.stepIndex, label: label, index: index }
    }));
    state.stepIndex += 1;
    if (state.stepIndex >= state.total) {
      done();
    } else {
      renderStep();
      window.dispatchEvent(new CustomEvent('qo_step_view', {
        detail: { id: id, step: state.stepIndex }
      }));
    }
  }

  function showLoadingThenFinish(){
    if (barFill) barFill.style.width = '100%';
    stepsEls.forEach(function(s){ s.hidden = true; });
    if (progressEl) progressEl.textContent = '';
    if (loadingWrap){
      var txt = loadingWrap.querySelector('.qo__loadingText');
      if (txt) txt.textContent = LO_TEXT;
      loadingWrap.hidden = false;
    }
    setTimeout(finishView, Math.max(300, LO_MS));
  }

  var closedOnce = false;
  function safeCloseOnce(){
    if (closedOnce) return;
    closedOnce = true;
    close();
  }

  var fallbackTimer = null;
  var offerwallSeen = false, pollId = null, mo = null, pollTimeout = null;

  function attachGptListeners(attempt){
    attempt = attempt || 0;
    var ready = !!(window.googletag && googletag.apiReady && googletag.pubads);
    if (!ready) {
      if (attempt > 200) return;
      return setTimeout(function(){ attachGptListeners(attempt+1); }, 100);
    }
    try {
      var pubads = googletag.pubads();
      pubads.addEventListener('rewardedSlotClosed', function(){ stopWatchers(); safeCloseOnce(); });
      pubads.addEventListener('gameManualInterstitialSlotClosed', function(){ stopWatchers(); safeCloseOnce(); });
    } catch(_) {}
  }

  function startWatchers(){
    try {
      mo = new MutationObserver(function(muts){
        muts.forEach(function(m){
          m.removedNodes && m.removedNodes.forEach(function(n){
            if (n.id === 'av-offerwall__wrapper' || (n.querySelector && n.querySelector('#av-offerwall__wrapper'))){
              stopWatchers(); safeCloseOnce();
            }
          });
        });
      });
      mo.observe(document.body, { childList: true, subtree: true });
    } catch(_){}

    pollId = setInterval(function(){
      var w = document.getElementById('av-offerwall__wrapper');
      if (w) {
        offerwallSeen = true;
        if (fallbackTimer) { clearTimeout(fallbackTimer); fallbackTimer = null; }
      }
      if (offerwallSeen && !w) { stopWatchers(); safeCloseOnce(); }
      if (document.cookie.indexOf('avOfferWallRewarded=true') !== -1) { stopWatchers(); safeCloseOnce(); }
    }, 300);
    pollTimeout = setTimeout(function(){ stopWatchers(); }, 60000);

    attachGptListeners(0);
  }

  function stopWatchers(){
    if (pollId) { clearInterval(pollId); pollId = null; }
    if (pollTimeout) { clearTimeout(pollTimeout); pollTimeout = null; }
    if (mo) { try { mo.disconnect(); } catch(_){ } mo = null; }
    if (fallbackTimer) { clearTimeout(fallbackTimer); fallbackTimer = null; }
  }

  function finishView(){
    if (loadingWrap) loadingWrap.hidden = true;
    if (finalWrap)   finalWrap.hidden   = false;
    focusFirstButton(finalWrap);

    if (adMode === 'interstitial') {
      var ctaI = finalWrap.querySelector('.qo__btn--interstitial, .qo__btn[href="#"]') || finalWrap.querySelector('.qo__btn');
      if (ctaI && !ctaI.__qoBound) {
        ctaI.addEventListener('click', function(e){
          if (e && e.preventDefault) e.preventDefault();
          if (e && e.stopPropagation) e.stopPropagation();
          try {
            localStorage.setItem('qo_once_' + id, '1');
            localStorage.setItem('qo_seen_' + id, String(Date.now()));
          } catch(_){}
          safeCloseOnce();
        }, { passive:false });
        ctaI.__qoBound = true;
      }
    } else {
      var ctaR = finalWrap.querySelector('.qo__btn.av-rewarded, .qo__btn[data-av-rewarded="true"]');
      if (ctaR) {
        if (!ctaR.hasAttribute('href')) ctaR.setAttribute('href', '');
        ctaR.setAttribute('data-av-rewarded','true');
        ctaR.setAttribute('data-google-rewarded','true');
        ctaR.setAttribute('data-google-interstitial','false');

        if (!ctaR.__qoOnceBound){
          ctaR.addEventListener('click', function(){
            try {
              localStorage.setItem('qo_once_' + id, '1');
              localStorage.setItem('qo_seen_' + id, String(Date.now()));
            } catch(_){}
            if (fallbackTimer) clearTimeout(fallbackTimer);
            var fbMs = (typeof CFG.rewardedFallbackMs === 'number') ? CFG.rewardedFallbackMs : 2500;
            fallbackTimer = setTimeout(function(){
              if (!offerwallSeen) { stopWatchers(); safeCloseOnce(); }
            }, Math.max(500, fbMs));
          });
          ctaR.__qoOnceBound = true;
        }
      }
      startWatchers();
    }

    window.dispatchEvent(new CustomEvent('qo_complete', {
      detail: { id: id, answers: state.answers.slice() }
    }));
  }

  function done(){
    if (LO_MS > 0) showLoadingThenFinish();
    else finishView();
  }

  function hydrateStepButtons() {
    stepsEls.forEach(function (stepEl) {
      var buttons = stepEl.querySelectorAll('.qo__btn');

      buttons.forEach(function (btn, idx) {
        if (btn.classList.contains('qo__wheelSpin')) return;
        if (btn.classList.contains('qo__wheelRedeem')) return;
        
        if (btn.__qoHandlerBound) return;
        
        btn.addEventListener('click', function (ev) {
          ev.preventDefault();
          var label = btn.getAttribute('data-qo-label') || btn.textContent || '';
          selectOption(label.trim(), idx);
        });
        
        btn.__qoHandlerBound = true;
      });
    });
  }

  function hydrateVisualButtons() {
    var visualSteps = Array.prototype.slice.call(root.querySelectorAll('.qo__step--visual'));
    
    visualSteps.forEach(function (stepEl) {
      var buttons = stepEl.querySelectorAll('.qo__visualOption');
      
      buttons.forEach(function (btn, idx) {
        if (btn.__qoVisualHandlerBound) return;
        
        btn.addEventListener('click', function (ev) {
          ev.preventDefault();
          var label = btn.getAttribute('data-qo-label') || '';
          if (!label) {
            var labelEl = btn.querySelector('.qo__visualLabel');
            label = labelEl ? labelEl.textContent : '';
          }
          selectOption(label.trim(), idx);
        });
        
        btn.addEventListener('keydown', function(ev) {
          if (ev.key === 'Enter' || ev.key === ' ') {
            ev.preventDefault();
            btn.click();
          }
        });
        
        btn.__qoVisualHandlerBound = true;
      });
    });
  }

  var opened = false;
  function open(){
    if (opened) return;
    opened = true;

    try { localStorage.setItem('qo_seen_' + id, String(Date.now())); } catch(_){}

    if (root.parentNode !== document.body) document.body.appendChild(root);

    root.hidden = false;
    root.removeAttribute('hidden');
    root.style.display = '';
    root.removeAttribute('aria-hidden');

    lock();
    hydrateStepButtons();
    hydrateVisualButtons();
    renderStep();

    window.dispatchEvent(new CustomEvent('qo_open', { detail: { id: id } }));
    window.dispatchEvent(new CustomEvent('qo_step_view', { detail: { id: id, step: 0 } }));
  }

  function close(){
    stopWatchers();
    if (root && root.parentNode) root.parentNode.removeChild(root);
    unlock();
    window.dispatchEvent(new CustomEvent('qo_close', { detail: { id: id } }));
  }

  window.QuizOverlay = window.QuizOverlay || {};
  window.QuizOverlay.show  = open;
  window.QuizOverlay.close = close;
  window.QuizOverlay.resetSeen = function(){
    try{ localStorage.removeItem('qo_seen_' + id); localStorage.removeItem('qo_once_' + id);}catch(_){}
  };

  var delayMs = (typeof CFG.openDelayMs === 'number') ? CFG.openDelayMs : 2000;
  if (CFG.autoShow !== false) {
    setTimeout(open, delayMs);
  }

  function initWheel() {
    if (!wheelStep) return;

    var wheelEl   = wheelStep.querySelector('.qo__wheel');
    var prizeRow  = wheelStep.querySelector('.qo__wheelResult');
    var prizeEl   = wheelStep.querySelector('.qo__wheelPrize');
    var redeemBtn = wheelStep.querySelector('.qo__wheelRedeem');
    var spinBtn   = wheelStep.querySelector('.qo__wheelSpin');

    if (!wheelEl) return;

    wheelEl.style.position = 'relative';

    if (prizeRow) {
      prizeRow.hidden = true;
      prizeRow.style.display = 'none';
    }
    if (redeemBtn) {
      redeemBtn.hidden = true;
      redeemBtn.style.display = 'none';
    }

    var opts = [];
    try {
      var raw = wheelEl.getAttribute('data-wheel-options');
      if (raw) opts = JSON.parse(raw);
    } catch (_){}

    if ((!opts || !opts.length) && CFG.wheel && Array.isArray(CFG.wheel.options)) {
      opts = CFG.wheel.options.slice();
    }
    if (!opts || !opts.length) return;

    var fixedIndex = 0;
    var attrIndex  = wheelEl.getAttribute('data-wheel-fixed-index');
    if (attrIndex !== null && attrIndex !== '') {
      fixedIndex = parseInt(attrIndex, 10) || 0;
    } else if (CFG.wheel && typeof CFG.wheel.fixedIndex === 'number') {
      fixedIndex = CFG.wheel.fixedIndex | 0;
    }
    if (fixedIndex < 0 || fixedIndex >= opts.length) fixedIndex = 0;

    wheelPrizeLabel = '';

    var colors = ['#ff6b81','#ffc542','#28c76f','#00cfe8','#7367f0','#FF9F43'];
    var sliceAngle = 360 / opts.length;
    var gradientParts = [];

    for (var i = 0; i < opts.length; i++) {
      var start = i * sliceAngle;
      var end   = start + sliceAngle;
      gradientParts.push(colors[i % colors.length] + ' ' + start + 'deg ' + end + 'deg');
    }

    wheelEl.style.background = 'conic-gradient(' + gradientParts.join(',') + ')';

    // Função para copiar textos traduzidos
    function copyTranslatedTexts() {
      var translateContainer = wheelStep.querySelector('.qo__wheelTranslate');
      if (!translateContainer) return;
      
      var translatedTexts = translateContainer.querySelectorAll('[data-translate-for]');
      var visibleLabels = wheelEl.querySelectorAll('.qo__wheelLabel');
      
      translatedTexts.forEach(function(translatedSpan) {
        var index = parseInt(translatedSpan.getAttribute('data-translate-for'), 10);
        var text = translatedSpan.textContent.trim();
        var visibleLabel = visibleLabels[index];
        
        if (visibleLabel && text) {
          visibleLabel.textContent = text;
        }
      });
    }
    
    // Tenta copiar imediatamente
    copyTranslatedTexts();
    
    // Tenta após delays (para GTranslate terminar)
    setTimeout(copyTranslatedTexts, 300);
    setTimeout(copyTranslatedTexts, 800);
    setTimeout(copyTranslatedTexts, 1500);
    setTimeout(copyTranslatedTexts, 3000);
    
    // Observer para detectar mudanças do GTranslate
    var translateContainer = wheelStep.querySelector('.qo__wheelTranslate');
    if (translateContainer && window.MutationObserver) {
      var observer = new MutationObserver(function() {
        copyTranslatedTexts();
      });
      observer.observe(translateContainer, {
        childList: true,
        subtree: true,
        characterData: true
      });
      
      setTimeout(function() {
        observer.disconnect();
      }, 5000);
    }

    var spinning = false;
    var currentRotation = 0;

    function spin() {
      if (spinning) return;
      spinning = true;

      if (prizeRow) {
        prizeRow.hidden = true;
        prizeRow.style.display = 'none';
      }
      if (redeemBtn) {
        redeemBtn.hidden = true;
        redeemBtn.style.display = 'none';
      }

      if (spinBtn) {
        spinBtn.disabled = true;
        spinBtn.style.display = 'none';
      }

      var extraTurns = 4 + Math.floor(Math.random() * 2);
      var sliceCenter = sliceAngle * fixedIndex + sliceAngle / 2;
      var neededRotation = 270 - sliceCenter + sliceAngle + (sliceAngle / 2);
      
      neededRotation = neededRotation % 360;
      if (neededRotation <= 0) neededRotation += 360;
      
      var finalRotation = currentRotation + extraTurns * 360 + neededRotation;
      currentRotation = finalRotation;

      wheelEl.style.transition = 'transform 2.4s cubic-bezier(0.25, 0.1, 0.25, 1)';
      wheelEl.style.transform  = 'rotate(' + finalRotation + 'deg)';

      var onEnd = function () {
        wheelEl.removeEventListener('transitionend', onEnd);
        spinning = false;

        var allLabels = wheelEl.querySelectorAll('.qo__wheelLabel');
        if (allLabels[fixedIndex]) {
          wheelPrizeLabel = allLabels[fixedIndex].textContent.trim();
          if (redeemBtn) {
            redeemBtn.setAttribute('data-qo-label', wheelPrizeLabel);
          }
        }

        if (prizeRow) {
          prizeRow.hidden = false;
          prizeRow.style.display = '';
        }
        if (redeemBtn) {
          redeemBtn.hidden = false;
          redeemBtn.style.display = '';
        }
      };

      wheelEl.addEventListener('transitionend', onEnd);
    }

    if (spinBtn) {
      spinBtn.addEventListener('click', spin);
    } else {
      window.addEventListener('qo_open', function (ev) {
        if (ev && ev.detail && ev.detail.id && ev.detail.id !== id) return;
        spin();
      });
    }

    if (redeemBtn && !redeemBtn.__qoRedeemBound) {
      redeemBtn.addEventListener('click', function(ev) {
        ev.preventDefault();
        var label = prizeEl ? prizeEl.textContent.trim() : (redeemBtn.getAttribute('data-qo-label') || wheelPrizeLabel || '');
        selectOption(label.trim(), 0);
      });
      redeemBtn.__qoRedeemBound = true;
    }
  }
})();