/*
 * Shared deck analytics for open (non-invite) decks such as /hospitals.html and /pitch-v4.html.
 * Load it AFTER Reveal.initialize():
 *   <script src="/deck-tracking.js" data-deck="hospitals" data-fallback-token="deck-hospitals"></script>
 *
 * Who the visit is filed under (first match wins):
 *   1. ?t=<invite token> in the URL — a personal link made in /admin/dashboard
 *   2. the investor token from the /briefing gate (same browser tab)
 *   3. data-fallback-token — a shared "everyone on this deck" row in investor_invites
 * Each browser also gets a random visitor id (localStorage) so the dashboard can tell visitors apart.
 *
 * Sends to the track-event edge function: deck_opened, gate_unlocked, slide_view (dwell per
 * slide), click (buttons, links, demo videos), deck_closed (total active seconds).
 * Off on localhost, file://, ?print-pdf and ?preview=1 unless ?track=1. ?debug=1 logs to the console.
 */
(function () {
  var script = document.currentScript;
  var DECK = (script && script.dataset.deck) || location.pathname;
  var FALLBACK = script && script.dataset.fallbackToken;
  var TRACK_URL = 'https://kvsqtolsjggpyvdtdpss.supabase.co/functions/v1/track-event';
  var MAX_DWELL = 600; // cap one slide at 10 minutes so an idle tab does not skew the numbers
  var MAX_CLICKS = 200;

  var params;
  try { params = new URLSearchParams(location.search); } catch (_) { return; }
  var DEBUG = params.get('debug') === '1';
  var forced = params.get('track') === '1';
  var local = location.protocol === 'file:' || /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
  if (!forced && (local || params.has('print-pdf') || params.get('preview') === '1')) return;
  if (typeof Reveal === 'undefined') return;

  function log() { if (DEBUG) { try { console.log.apply(console, ['[deck-tracking]'].concat([].slice.call(arguments))); } catch (_) {} } }

  var token = params.get('t');
  try {
    if (token) sessionStorage.setItem('mm_deck_token', token);
    else token = sessionStorage.getItem('mm_deck_token') || sessionStorage.getItem('mm_briefing_token');
  } catch (_) {}
  token = token || FALLBACK;
  if (!token) return;

  var visitor = 'anon';
  try {
    visitor = localStorage.getItem('mm_visitor');
    if (!visitor) {
      visitor = Math.random().toString(36).slice(2, 10);
      localStorage.setItem('mm_visitor', visitor);
    }
  } catch (_) {}
  var name = null;
  try { name = sessionStorage.getItem('mm_briefing_name'); } catch (_) {}

  function send(type, meta, unload) {
    var body = { deck: DECK, visitor: visitor };
    if (name) body.name = name;
    for (var k in meta) body[k] = meta[k];
    var payload = JSON.stringify({ token: token, event_type: type, metadata: body });
    log(type, body);
    try {
      if (unload && navigator.sendBeacon && navigator.sendBeacon(TRACK_URL, new Blob([payload], { type: 'text/plain' }))) return;
      fetch(TRACK_URL, { method: 'POST', keepalive: true, headers: { 'Content-Type': 'application/json' }, body: payload })
        .catch(function (e) { log('send failed', type, e && e.message); });
    } catch (e) { log('send threw', type, e && e.message); }
  }

  function textOf(el) {
    if (!el) return '';
    var c = (el.querySelector('.lang-en') || el).cloneNode(true);
    var num = c.querySelector && c.querySelector('.label-num');
    if (num) num.parentNode.removeChild(num);
    return (c.textContent || '').replace(/\s+/g, ' ').trim();
  }
  function labelOf(section) {
    if (!section) return '';
    var num = section.querySelector('.slide-label .label-num');
    var text = textOf(section.querySelector('.slide-label')) || textOf(section.querySelector('h1, h2')) || (section.className || '').split(' ')[0];
    return ((num ? num.textContent.trim() + ' ' : '') + text).slice(0, 80);
  }
  function where() {
    var i = Reveal.getIndices ? Reveal.getIndices() : { h: 0 };
    return { slide_index: i.h, slide_v: i.v || 0 };
  }

  var current = null;      // { slide_index, slide_v, slide_label }
  var enteredAt = Date.now();
  var activeSeconds = 0;
  var slidesSeen = 0;
  var clicks = 0;
  var paused = false;      // tab hidden
  var locked = false;      // data-gated="1": password gate still up, so no reading time counts yet
  if (script && script.dataset.gated === '1') {
    try { locked = sessionStorage.getItem('mmh_access') !== '1'; } catch (_) {}
  }
  var closed = false;
  var opened = false;

  function flush(unload) {
    if (!current || paused || locked) { enteredAt = Date.now(); return; }
    var dwell = Math.min(MAX_DWELL, Math.round((Date.now() - enteredAt) / 1000));
    enteredAt = Date.now();
    if (dwell < 1) return;
    activeSeconds += dwell;
    slidesSeen++;
    send('slide_view', { slide_index: current.slide_index, slide_v: current.slide_v, slide_label: current.slide_label, dwell_seconds: dwell }, unload);
  }
  function enter(slide) {
    var w = where();
    current = { slide_index: w.slide_index, slide_v: w.slide_v, slide_label: labelOf(slide || Reveal.getCurrentSlide()) };
    enteredAt = Date.now();
  }

  function onReady() {
    if (opened) return;
    opened = true;
    var unlocked = null;
    try { unlocked = sessionStorage.getItem('mmh_access') === '1'; } catch (_) {}
    send('deck_opened', {
      total_slides: Reveal.getTotalSlides ? Reveal.getTotalSlides() : null,
      viewport: { w: window.innerWidth, h: window.innerHeight },
      referrer: document.referrer || null,
      already_unlocked: unlocked,
      user_agent: navigator.userAgent,
    });
    enter();
  }
  if (Reveal.isReady && Reveal.isReady()) onReady();
  else Reveal.on('ready', onReady);

  Reveal.on('slidechanged', function (e) {
    flush(false);
    enter(e.currentSlide);
  });

  // Password gates dispatch this when the visitor gets in.
  window.addEventListener('mm:unlocked', function () {
    send('gate_unlocked', where());
    locked = false;
    enteredAt = Date.now(); // time behind the gate does not count as reading
  });

  document.addEventListener('click', function (e) {
    if (clicks >= MAX_CLICKS || !e.target || !e.target.closest) return;
    var el = e.target.closest('a, button, [onclick], [data-video], [data-iframe], .gallery-img');
    if (!el) return;
    clicks++;
    var label = el.getAttribute('aria-label') || (el.dataset && el.dataset.title) || el.getAttribute('alt') || textOf(el);
    var meta = where();
    meta.label = (label || el.tagName).replace(/\s+/g, ' ').trim().slice(0, 80);
    if (el.tagName === 'A' && el.getAttribute('href')) meta.href = el.getAttribute('href').slice(0, 200);
    send('click', meta);
  }, true);

  // Tab hidden: bank the time so far, stop the clock until the visitor comes back.
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'hidden') { flush(true); paused = true; }
    else { paused = false; enteredAt = Date.now(); }
  });
  function leave() {
    if (closed) return;
    closed = true;
    flush(true);
    send('deck_closed', { total_dwell_seconds: activeSeconds, slides_viewed: slidesSeen, clicks: clicks }, true);
  }
  window.addEventListener('pagehide', leave);
  window.addEventListener('beforeunload', leave);
})();
