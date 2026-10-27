
    // Access guard — MediMind hospital-partnership deck unlocks with a shared password.
    // Local file:// previews (offline PDF export, etc.) and ?print-pdf are exempted.
    // ?preview=1 also bypasses the guard for local/admin preview.
    // ?name=Some%20Hospital seeds the cover "Prepared for" line in BOTH the preview
    // and the normal gated flow, so personalized links work with the password.
    (function () {
      var PASSWORD = 'medimind'; // compared case-insensitively
      try {
        if (location.protocol === 'file:') return;
        var params = new URLSearchParams(location.search);
        if (params.has('print-pdf')) return;
        var n = params.get('name');
        if (n) { try { sessionStorage.setItem('mm_briefing_name', n); } catch (_) {} }
        if (params.get('preview') === '1') return;
        if (sessionStorage.getItem('mmh_access') === '1') return;
      } catch (e) { /* fall through to the gate */ }

      // Hide the deck until the password is entered.
      var hideStyle = document.createElement('style');
      hideStyle.textContent = 'body > *:not(#hc-gate){visibility:hidden!important}';
      (document.head || document.documentElement).appendChild(hideStyle);

      function mount() {
        var gate = document.createElement('div');
        gate.id = 'hc-gate';
        gate.style.cssText = 'position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;padding:24px;background:radial-gradient(120% 120% at 0% 0%,#16365f,#0b1f3a 60%);font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;';
        gate.innerHTML =
          '<form id="hc-form" style="width:100%;max-width:380px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);border-radius:18px;padding:34px 30px;box-shadow:0 30px 70px -30px rgba(0,0,0,0.6);">' +
            '<div style="font-size:12px;letter-spacing:0.16em;text-transform:uppercase;color:#8fb4e0;font-weight:700;margin-bottom:10px;">MediMind</div>' +
            '<h1 style="margin:0 0 6px;color:#fff;font-size:22px;font-weight:700;">Hospital partnership</h1>' +
            '<p style="margin:0 0 22px;color:rgba(255,255,255,0.6);font-size:14px;line-height:1.4;">Enter the password to view the deck.</p>' +
            '<input id="hc-pass" type="password" autocomplete="off" placeholder="Password" style="width:100%;box-sizing:border-box;padding:13px 15px;border-radius:11px;border:1px solid rgba(255,255,255,0.18);background:rgba(0,0,0,0.25);color:#fff;font-size:15px;outline:none;" />' +
            '<div id="hc-err" style="min-height:18px;margin:8px 2px 0;color:#fda4af;font-size:13px;"></div>' +
            '<button type="submit" style="width:100%;margin-top:8px;padding:13px;border:none;border-radius:11px;background:linear-gradient(135deg,#3182ce,#2b6cb0);color:#fff;font-size:15px;font-weight:700;cursor:pointer;">Unlock deck</button>' +
          '</form>';
        document.body.appendChild(gate);
        var form = gate.querySelector('#hc-form');
        var input = gate.querySelector('#hc-pass');
        var err = gate.querySelector('#hc-err');
        input.focus();
        form.addEventListener('submit', function (ev) {
          ev.preventDefault();
          if (input.value.trim().toLowerCase() === PASSWORD) {
            try { sessionStorage.setItem('mmh_access', '1'); } catch (_) {}
            gate.remove();
            hideStyle.remove();
          } else {
            err.textContent = 'Incorrect password. Please try again.';
            input.value = '';
            input.focus();
          }
        });
      }

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', mount);
      } else {
        mount();
      }
    })();
  

    // A shared language link takes priority over the last session choice.
    (function () {
      var saved = null;
      try { saved = sessionStorage.getItem('mm_deck_lang'); } catch (_) {}
      var requested = new URLSearchParams(location.search).get('lang');
      var lang = requested === 'ka' || requested === 'en' ? requested : saved === 'ka' ? 'ka' : 'en';
      document.body.classList.add('lang-active-' + lang);
      document.documentElement.lang = lang;
    })();
    // Language toggle — flips every .lang-en/.lang-ka span via the body class.
    function mmSetLang(lang) {
      if (lang !== 'en' && lang !== 'ka') return;
      document.body.classList.remove('lang-active-en', 'lang-active-ka');
      document.body.classList.add('lang-active-' + lang);
      document.documentElement.lang = lang;
      try { sessionStorage.setItem('mm_deck_lang', lang); } catch (_) {}
      mmPostLang();
    }
    // Push the current language into the embedded walkthrough iframe.
    function mmPostLang() {
      var lang = document.body.classList.contains('lang-active-ka') ? 'ka' : 'en';
      document.querySelectorAll('iframe.tour-iframe').forEach(function (f) {
        try { if (f.contentWindow) f.contentWindow.postMessage({ type: 'mm-lang', lang: lang }, '*'); } catch (e) {}
      });
    }
    // The walkthrough announces itself on mount → reply with the current language.
    window.addEventListener('message', function (e) {
      if (e.data && e.data.type === 'mm-wt-ready') mmPostLang();
    });
  

    const __isMobileDeck = window.matchMedia('(max-width: 768px)').matches;
    if (__isMobileDeck) document.documentElement.classList.add('is-mobile-deck');
    Reveal.initialize({
      hash: true,
      controls: !__isMobileDeck,
      progress: true,
      slideNumber: false,
      transition: __isMobileDeck ? 'none' : 'slide',
      transitionSpeed: 'fast',
      backgroundTransition: 'none',
      keyboard: true,
      overview: !__isMobileDeck,
      touch: true,
      center: false,
      width: 1280,
      height: 720,
      margin: 0,
      minScale: 0.2,
      maxScale: 2.0
    });

    // Brand footer is now inlined directly in each section's HTML — see <a class="brand-footer"> tags.

    // Cover slide — pull recipient name from sessionStorage (set by BriefingGate on unlock).
    // Degrades silently when accessed directly without going through the gate.
    (function injectPreparedFor() {
      try {
        var name = sessionStorage.getItem('mm_briefing_name');
        if (!name || !name.trim()) return;
        var box = document.getElementById('cover-prepared-for');
        var slot = document.getElementById('cover-prepared-for-name');
        if (!box || !slot) return;
        slot.textContent = name.trim();
        box.hidden = false;
      } catch (e) { /* ignore */ }
    })();

    // Click-anywhere-to-advance — desktop only (mobile keeps swipe + custom .mobile-nav arrows).
    // Skips clicks on interactive elements, gallery screenshots (which expand a lightbox),
    // anything inside the lightbox, anything marked [data-no-advance], and clicks during text selection.
    (function clickToAdvance() {
      if (__isMobileDeck) return;
      var INTERACTIVE = 'a, button, input, textarea, select, label, summary, details, .gallery-img, .gallery-lightbox, .gallery-lightbox *, .controls, .controls *, aside.notes, [data-no-advance]';
      var reveal = document.querySelector('.reveal');
      if (!reveal) return;
      reveal.addEventListener('click', function(e) {
        // Ignore clicks on interactive elements (or any descendant of one)
        if (e.target.closest && e.target.closest(INTERACTIVE)) return;
        // Don't advance if user is selecting text
        var sel = window.getSelection && window.getSelection();
        if (sel && sel.toString().length > 0) return;
        // Don't advance while gallery lightbox is open
        var lb = document.getElementById('gallery-lightbox');
        if (lb && lb.classList.contains('open')) return;
        Reveal.next();
      });
    })();

    // Investor analytics — fire-and-forget tracking. Silent no-op when accessed
    // without going through the gate (no token in sessionStorage). Mirrors the
    // pattern in src/lib/tracking.ts. Sends: deck_opened, slide_view (per slide
    // change), deck_closed (on unload).
    //
    // ?debug=1 in the URL enables console logging + a floating status panel.
    (function deckAnalytics() {
      var TRACK_URL = 'https://kvsqtolsjggpyvdtdpss.supabase.co/functions/v1/track-event';
      var DEBUG = false;
      try { DEBUG = new URLSearchParams(location.search).get('debug') === '1'; } catch (_) {}
      var dlog = DEBUG
        ? function () { try { console.log.apply(console, ['[deck-analytics]'].concat([].slice.call(arguments))); } catch (_) {} }
        : function () {};

      var TOKEN = null;
      try { TOKEN = sessionStorage.getItem('mm_briefing_token'); } catch (_) {}
      dlog('init', { token: TOKEN ? TOKEN.slice(0, 8) + '…' : null, debug: DEBUG });
      if (!TOKEN) {
        // One always-on log so the user can see in DevTools why no tracking is firing
        console.log('[da] no token in sessionStorage — tracking disabled (preview mode or direct deck access)');
        dlog('no token — skipping all tracking (preview/direct)');
        return;
      }
      // Always-on heartbeat (no debug flag needed) — green-flag that the IIFE bootstrapped
      console.log('[da] tracking active — token=' + TOKEN.slice(0, 8) + '… (deck_opened, slide_view, deck_closed will fire)');

      var slideEnterTs = Date.now();
      var lastSlideIdx = null;
      var lastSlideLabel = '';
      var sessionStartTs = Date.now();
      var slidesViewedCount = 0;
      var deckClosedSent = false;
      var readyHandled = false;

      // Floating status panel — only when ?debug=1
      var panel = null;
      if (DEBUG) {
        try {
          panel = document.createElement('div');
          panel.style.cssText = 'position:fixed;top:8px;left:8px;z-index:99999;background:rgba(15,23,42,0.92);color:#bee3f8;font:11px/1.4 ui-monospace,monospace;padding:8px 10px;border-radius:6px;border:1px solid rgba(190,227,248,0.3);box-shadow:0 4px 12px rgba(0,0,0,0.4);max-width:320px;pointer-events:none';
          panel.textContent = '[deck-analytics] init…';
          document.body && document.body.appendChild(panel);
        } catch (_) {}
      }
      function setPanel(msg) {
        if (panel) panel.textContent = '[deck-analytics] ' + msg;
      }

      function labelOf(section) {
        if (!section) return '';
        // Each content slide has <div class="slide-label"><span class="label-num">04</span>NAME>.
        // Strip the numeral chip; return just the human text. Cover/divider/hook slides have no
        // .slide-label — fall back to the first CSS class on the section.
        var lbl = section.querySelector('.slide-label');
        if (!lbl) return (section.className || '').split(' ')[0] || '';
        var clone = lbl.cloneNode(true);
        var nClone = clone.querySelector('.label-num');
        if (nClone && nClone.parentNode) nClone.parentNode.removeChild(nClone);
        return (clone.textContent || '').trim() || (section.className || '').split(' ')[0] || '';
      }

      // track() — primary transport is fetch+keepalive (preflights cleanly, observable in
      // DevTools Network panel). sendBeacon is used ONLY when isUnload=true, because in
      // that path the page is being torn down and fetch may be killed by the browser.
      // Beacon Blob uses text/plain (CORS-safe — no preflight) so the call doesn't get
      // silently dropped by Chrome. The Edge Function reads body via req.json() which
      // calls JSON.parse(text) regardless of Content-Type header.
      function track(eventType, metadata, isUnload) {
        try {
          var body = JSON.stringify({ token: TOKEN, event_type: eventType, metadata: metadata || null });
          dlog('sending', eventType, metadata, isUnload ? '(unload)' : '');

          if (isUnload && navigator.sendBeacon) {
            var blob = new Blob([body], { type: 'text/plain' });
            var ok = navigator.sendBeacon(TRACK_URL, blob);
            dlog('beacon ok=' + ok);
            console.log('[da] beacon ' + eventType + ' ' + (ok ? 'queued' : 'REJECTED'));
            if (ok) { setPanel('Last: ' + eventType + ' (beacon)'); return; }
            // sendBeacon refused — fall through to fetch (best-effort during unload)
          }

          fetch(TRACK_URL, {
            method: 'POST', keepalive: true,
            headers: { 'Content-Type': 'application/json' },
            body: body,
          }).then(function (r) {
            if (r.ok) {
              console.log('[da] sent ' + eventType + (metadata && typeof metadata.slide_index !== 'undefined' ? ' #' + metadata.slide_index : '') + ' → ' + r.status);
              dlog('fetch ' + r.status);
            } else {
              console.warn('[da] FAILED ' + eventType + ' → ' + r.status);
              dlog('fetch FAILED ' + r.status);
            }
          }).catch(function (e) {
            console.warn('[da] fetch ERROR ' + eventType, e && e.message);
            dlog('fetch error', e && e.message);
          });
          setPanel('Last: ' + eventType + (metadata && typeof metadata.slide_index !== 'undefined' ? ' #' + metadata.slide_index + ' (' + metadata.dwell_seconds + 's)' : ''));
        } catch (e) {
          console.warn('[da] track threw for', eventType, e && e.message);
          dlog('track error', e && e.message);
        }
      }

      function flushCurrentSlide() {
        if (lastSlideIdx === null) { dlog('flush skipped — never entered a slide'); return; }
        var dwell = Math.round((Date.now() - slideEnterTs) / 1000);
        if (dwell < 1) { dlog('flush skipped — dwell<1s', { idx: lastSlideIdx }); return; }
        if (dwell > 600) dwell = 600;  // cap at 10 min — prevents idle-tab dwell skew
        track('slide_view', {
          slide_index: lastSlideIdx,
          slide_label: lastSlideLabel,
          dwell_seconds: dwell,
        });
        slidesViewedCount++;
      }

      // Race-proof ready handling: Reveal.on('ready') is non-sticky — if Reveal already
      // initialized before this IIFE ran, the listener never fires. Check isReady()
      // synchronously and fire the handler immediately if so.
      function handleReady(slide, indexh) {
        if (readyHandled) return;
        readyHandled = true;
        track('deck_opened', {
          total_slides: Reveal.getTotalSlides ? Reveal.getTotalSlides() : null,
          viewport: { w: window.innerWidth, h: window.innerHeight },
          referrer: document.referrer || null,
          user_agent: navigator.userAgent,
        });
        lastSlideIdx = (typeof indexh === 'number') ? indexh : (Reveal.getIndices ? Reveal.getIndices().h : 0);
        lastSlideLabel = labelOf(slide || (Reveal.getCurrentSlide && Reveal.getCurrentSlide()));
        slideEnterTs = Date.now();
        dlog('ready handled', { idx: lastSlideIdx, label: lastSlideLabel });
      }

      if (Reveal.isReady && Reveal.isReady()) {
        dlog('Reveal already ready when IIFE ran — firing handleReady immediately');
        handleReady(Reveal.getCurrentSlide && Reveal.getCurrentSlide());
      } else {
        dlog('Reveal not yet ready — registering listener');
        Reveal.on('ready', function (e) { handleReady(e.currentSlide, e.indexh); });
      }

      Reveal.on('slidechanged', function (e) {
        dlog('slidechanged', { from: lastSlideIdx, to: e.indexh, label: labelOf(e.currentSlide) });
        flushCurrentSlide();  // emit slide_view for the slide we just left
        lastSlideIdx = e.indexh;
        lastSlideLabel = labelOf(e.currentSlide);
        slideEnterTs = Date.now();
      });

      // Final flush on unload. pagehide is more reliable than beforeunload on mobile Safari;
      // listen to both for max coverage. Guard against double-firing with deckClosedSent.
      // Pass isUnload=true so track() uses sendBeacon (the only transport that survives a
      // page being torn down). flushCurrentSlide() also re-routes through track(); patch
      // it inline by passing isUnload via a closure flag.
      function onLeave() {
        if (deckClosedSent) return;
        deckClosedSent = true;
        // Inline final slide_view via sendBeacon so it survives unload
        if (lastSlideIdx !== null) {
          var dwell = Math.round((Date.now() - slideEnterTs) / 1000);
          if (dwell > 600) dwell = 600;  // cap per slide at 10 min
          if (dwell >= 1) {
            track('slide_view', { slide_index: lastSlideIdx, slide_label: lastSlideLabel, dwell_seconds: dwell }, true);
            slidesViewedCount++;
          }
        }
        var total = Math.round((Date.now() - sessionStartTs) / 1000);
        if (total > 7200) total = 7200;  // cap total at 2 hours — prevents idle-tab skew
        track('deck_closed', {
          total_dwell_seconds: total,
          slides_viewed: slidesViewedCount,
        }, true);
        dlog('onLeave fired', { slides_viewed: slidesViewedCount });
      }
      window.addEventListener('pagehide', onLeave);
      window.addEventListener('beforeunload', onLeave);

      setPanel('init ✓ (token=' + TOKEN.slice(0, 8) + '…)');
    })();

    // Gallery lightbox — click any screenshot to expand fullscreen
    (function() {
      const lb = document.getElementById('gallery-lightbox');
      const lbImg = document.getElementById('gallery-lightbox-img');
      const lbCap = document.getElementById('gallery-lightbox-caption');
      const lbTitle = document.getElementById('gallery-lightbox-title');
      const lbDesc = document.getElementById('gallery-lightbox-desc');

      function openLightbox(src, alt, title, description) {
        lbImg.src = src;
        lbImg.alt = alt || '';
        lbTitle.textContent = title || '';
        lbDesc.textContent = description || '';
        lbCap.style.display = (title || description) ? '' : 'none';
        lbCap.classList.remove('expanded');
        lb.classList.add('open');
      }

      // Click the caption chip to expand/collapse the description
      lbCap.addEventListener('click', (e) => {
        e.stopPropagation();
        lbCap.classList.toggle('expanded');
      });

      window.closeGalleryLightbox = function() {
        lb.classList.remove('open');
        setTimeout(() => { lbImg.src = ''; }, 250);
      };

      document.querySelectorAll('.gallery-img').forEach(img => {
        img.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          const tile = img.closest('.gallery-tile');
          const capEl = tile ? tile.querySelector('.gallery-caption-text') : null;
          const title = capEl ? capEl.textContent.trim() : '';
          const description = img.getAttribute('data-description') || '';
          openLightbox(img.src, img.alt, title, description);
        });
      });

      // Close when clicking the dark backdrop (but not the image itself)
      lb.addEventListener('click', (e) => {
        if (e.target === lb) closeGalleryLightbox();
      });

      // Escape closes lightbox (intercept before Reveal's overview-toggle)
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lb.classList.contains('open')) {
          e.stopPropagation();
          closeGalleryLightbox();
        }
      }, true);
    })();

    // Case modal — click the slide-06 scale band to read the full, de-identified case.
    (function caseModal() {
      var modal = document.getElementById('case-modal');
      if (!modal) return;
      window.openCaseModal = function () {
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
      };
      window.closeCaseModal = function () {
        modal.classList.remove('open');
        document.body.style.overflow = '';
      };
      // Click the dark backdrop (but not the card) closes it
      modal.addEventListener('click', function (e) { if (e.target === modal) closeCaseModal(); });
      // Escape closes — intercept before Reveal
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && modal.classList.contains('open')) { e.stopPropagation(); closeCaseModal(); }
      }, true);
    })();

    // Business-case modal — click the slide-06 "business case" trigger to read the cost/revenue case.
    (function bizModal() {
      var modal = document.getElementById('biz-modal');
      if (!modal) return;
      window.openBizModal = function () {
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
      };
      window.closeBizModal = function () {
        modal.classList.remove('open');
        document.body.style.overflow = '';
      };
      modal.addEventListener('click', function (e) { if (e.target === modal) closeBizModal(); });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && modal.classList.contains('open')) { e.stopPropagation(); closeBizModal(); }
      }, true);
    })();

    // Product-demo modal — click any product card on the platform slide to play its short demo.
    // Videos live at /deck-assets/product-videos/<slug>.mp4. Until a file exists, a graceful
    // "coming soon" placeholder shows instead of a broken player (driven by the <video> error event).
    (function productDemo() {
      var modal = document.getElementById('eco-modal');
      if (!modal) return;
      var video = document.getElementById('eco-modal-video');
      var soon  = document.getElementById('eco-modal-soon');
      var title = document.getElementById('eco-modal-title');
      var frame = document.getElementById('eco-modal-frame');
      var note  = document.getElementById('eco-modal-note');

      function showSoon()  { frame.style.display = 'none'; video.style.display = 'none'; soon.style.display = 'flex'; }
      function showVideo() { frame.style.display = 'none'; soon.style.display = 'none'; video.style.display = 'block'; }
      function showFrame() { video.style.display = 'none'; soon.style.display = 'none'; frame.style.display = 'block'; }

      video.addEventListener('error', showSoon);
      video.addEventListener('loadeddata', function () {
        showVideo();
        var p = video.play();
        if (p && p.catch) p.catch(function () {});
      });

      window.openProductDemo = function (btn) {
        title.textContent = btn.getAttribute('data-title') || '';
        var frameSrc = btn.getAttribute('data-iframe');
        // Only the Structural demo carries the TAVI price/licence note.
        if (note) note.classList.toggle('show', (btn.getAttribute('data-video') || '').indexOf('structural') >= 0);
        if (frameSrc) {                 // walkthrough / embedded-page mode (e.g. the OS core)
          try { video.pause(); } catch (e) {}
          video.removeAttribute('src');
          showFrame();
          modal.classList.add('open', 'is-frame');
          // /walkthrough is served with a long immutable cache header, so reusing one URL can render a stale shell (blank).
          // A unique (cache-busted) + muted URL each open guarantees a fresh load.
          frame.src = frameSrc + (frameSrc.indexOf('?') >= 0 ? '&' : '?') + 'muted=1&cb=' + Date.now();
        } else {                        // standard muted-video demo
          modal.classList.remove('is-frame');
          frame.removeAttribute('src');
          showSoon();                   // default to the placeholder until the file proves it can play
          video.src = btn.getAttribute('data-video') || '';
          video.muted = true;           // demos open muted; viewer can unmute via the controls
          try { video.load(); } catch (e) {}
          modal.classList.add('open');
        }
        document.body.style.overflow = 'hidden';
      };
      window.closeProductDemo = function () {
        modal.classList.remove('open', 'is-frame');
        document.body.style.overflow = '';
        try { video.pause(); } catch (e) {}
        video.removeAttribute('src');
        try { video.load(); } catch (e) {}
        frame.removeAttribute('src');   // stop the walkthrough
        showSoon();
      };

      modal.addEventListener('click', function (e) { if (e.target === modal) closeProductDemo(); });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && modal.classList.contains('open')) { e.stopPropagation(); closeProductDemo(); }
      }, true);
    })();
  