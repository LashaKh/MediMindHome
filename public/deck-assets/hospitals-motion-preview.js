// Shared hospital motion controller. Comparison controls are opt-in at the caller.
export const MODES = ['active', 'journeys', 'depth', 'cinematic'];
export const DEPARTMENTS = {
  revenue: { x: 24, y: 47, accent: '#398d75', en: 'Finance', ka: 'ფინანსები', icon: 'M4 5h12v10H4z M7 8h6 M7 11h3' },
  resources: { x: 77, y: 48, accent: '#447ca4', en: 'Resources', ka: 'რესურსები', icon: 'M4 5h5v5H4z M11 5h5v5h-5z M4 12h5v4H4z M11 12h5v4h-5z' },
  time: { x: 35, y: 65, accent: '#737ca3', en: 'Clinical team', ka: 'სამედიცინო გუნდი', icon: 'M7 5a3 3 0 1 0 6 0a3 3 0 1 0-6 0 M4 17v-2a6 6 0 0 1 12 0v2' },
  care: { x: 63, y: 64, accent: '#3b8799', en: 'Patient care', ka: 'პაციენტზე ზრუნვა', icon: 'M3 10h4l2-5l3 10l2-5h3' }
};
const SVG_NS = 'http://www.w3.org/2000/svg';

export function normalizeMode(value) {
  return MODES.includes(value) ? value : 'active';
}

// Movement follows the actual curved connector, starting at the hospital end.
export function routeKeyframes(path, samples = 45) {
  const length = path.getTotalLength();
  return Array.from({ length: samples + 1 }, (_, index) => {
    const fraction = index / samples;
    const point = path.getPointAtLength(length * (1 - fraction));
    return {
      transform: `translate(${point.x}px, ${point.y}px)`,
      opacity: index === 0 || index === samples ? 0 : 1,
      offset: fraction
    };
  });
}

export function createPreview(slide, env = window, options = {}) {
  const doc = slide.ownerDocument;
  const params = new URLSearchParams(env.location.search);
  const comparison = options.comparison !== false;
  let lang = doc.body.classList.contains('lang-active-ka') ? 'ka' :
    doc.body.classList.contains('lang-active-en') ? 'en' : params.get('lang') === 'en' ? 'en' : 'ka';
  const reduced = env.matchMedia('(prefers-reduced-motion: reduce)');
  const mobile = env.matchMedia('(max-width: 768px)');
  const fine = env.matchMedia('(hover: hover) and (pointer: fine)');
  const styles = env.getComputedStyle(slide);
  const easeOut = styles.getPropertyValue('--ease-out').trim();
  const easeInOut = styles.getPropertyValue('--ease-in-out').trim();
  const cards = [...slide.querySelectorAll('[data-hai-benefit]')];
  const routes = [...slide.querySelectorAll('[data-hai-route]')];
  const art = slide.querySelector('.hai-hospital-art');
  const caption = slide.querySelector('.hai-hospital-caption');
  const overview = slide.querySelector('.hai-hospital-overview');
  const map = slide.querySelector('.hai-map');
  const animations = new Set();
  const timers = new Set();
  const listeners = [];
  let selected = null;
  let mode = normalizeMode(options.mode ?? params.get('motion-preview'));
  let input = 'pointer';
  let springFrame = null;
  let lastFrame = 0;
  let disposed = false;
  const position = { x: 0, y: 0, vx: 0, vy: 0, tx: 0, ty: 0 };
  const t = (en, ka) => lang === 'ka' ? ka : en;

  function element(tag, className, text, attributes = {}) {
    const node = doc.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    Object.entries(attributes).forEach(([key, value]) => node.setAttribute(key, value));
    return node;
  }
  function on(target, type, callback, options) {
    target.addEventListener(type, callback, options);
    listeners.push(() => target.removeEventListener(type, callback, options));
  }
  function later(callback, delay) {
    const id = env.setTimeout(() => { timers.delete(id); if (!disposed) callback(); }, delay);
    timers.add(id);
  }
  function animate(node, frames, timing, enabled = true) {
    if (!enabled || options.static || reduced.matches || doc.hidden || typeof node?.animate !== 'function') return;
    const animation = node.animate(frames, timing);
    animations.add(animation);
    animation.onfinish = animation.oncancel = () => animations.delete(animation);
  }
  function clearSequence() {
    timers.forEach(id => env.clearTimeout(id));
    timers.clear();
    animations.forEach(animation => animation.cancel());
    animations.clear();
  }
  function resetDepth() {
    if (springFrame !== null) env.cancelAnimationFrame(springFrame);
    springFrame = null;
    lastFrame = 0;
    Object.keys(position).forEach(key => { position[key] = 0; });
    back.style.transform = '';
    front.style.transform = '';
  }

  const hotspots = element('div', 'hm-hotspots');
  const markers = new Map();
  const glows = new Map();
  Object.entries(DEPARTMENTS).forEach(([key, department]) => {
    const glow = element('span', 'hm-room-glow', undefined, { 'aria-hidden': 'true' });
    glow.style.left = `${department.x}%`;
    glow.style.top = `${department.y}%`;
    const marker = element('button', 'hm-marker', undefined, {
      type: 'button', 'aria-label': department[lang], 'aria-pressed': 'false', 'aria-controls': 'hm-panel', 'data-no-advance': ''
    });
    marker.style.left = `${department.x}%`;
    marker.style.top = `${department.y}%`;
    marker.style.setProperty('--hm-accent', department.accent);
    const icon = doc.createElementNS(SVG_NS, 'svg');
    const path = doc.createElementNS(SVG_NS, 'path');
    icon.setAttribute('viewBox', '0 0 20 20');
    icon.setAttribute('fill', 'none');
    icon.setAttribute('stroke', 'currentColor');
    icon.setAttribute('stroke-width', '1.5');
    icon.setAttribute('aria-hidden', 'true');
    path.setAttribute('d', department.icon);
    icon.append(path);
    marker.append(icon, element('span', 'hm-marker-label', department[lang]));
    hotspots.append(glow, marker);
    markers.set(key, marker);
    glows.set(key, glow);
    on(marker, 'click', event => select(selected === key ? null : key, event.detail !== 0));
  });

  const back = element('div', 'hm-depth-back', undefined, { 'aria-hidden': 'true' });
  back.append(element('div', 'hm-depth-atmosphere'), element('div', 'hm-depth-platform'));
  const front = element('div', 'hm-depth-front', undefined, { 'aria-hidden': 'true' });
  [
    ['data', t('Shared information', 'ერთიანი მონაცემები'), '↔'],
    ['team', t('Connected teams', 'დაკავშირებული გუნდი'), '✓'],
    ['view', t('One complete view', 'სრული სურათი'), '⌘']
  ].forEach(([key, label, icon]) => {
    const badge = element('div', `hm-depth-badge hm-depth-badge--${key}`);
    badge.append(element('i', '', icon), element('span', '', label));
    front.append(badge);
  });
  art.append(back, front, hotspots);

  const journeyHome = element('div', 'hm-journey-home');
  map.after(journeyHome);
  const detail = element('div', 'hm-detail', undefined, { id: 'hm-panel', role: 'region', hidden: '', 'data-no-advance': '' });
  const headingRow = element('div', 'hm-detail-heading');
  const detailHeading = element('h4', '', '', { id: 'hm-detail-title' });
  detail.setAttribute('aria-labelledby', 'hm-detail-title');
  const controls = element('div', 'hm-detail-controls');
  const replay = element('button', '', '↻', { type: 'button', 'aria-label': t('Replay workflow', 'პროცესის გამეორება') });
  const close = element('button', '', '×', { type: 'button', 'aria-label': t('Return to overview', 'სრულ სურათზე დაბრუნება') });
  controls.append(replay, close);
  headingRow.append(detailHeading, controls);
  const steps = element('ol', 'hm-steps');
  const track = element('span', 'hm-progress-track', undefined, { 'aria-hidden': 'true' });
  const progress = element('span', 'hm-progress-fill');
  track.append(progress);
  detail.append(headingRow, steps, element('div', 'hm-example-label', t('Illustrative workflow', 'პროცესის მაგალითი')), track);
  caption.append(detail);
  const journeys = Object.fromEntries(cards.map(card => {
    const key = card.dataset.haiBenefit;
    const panel = slide.querySelector(`[data-hai-panel="${key}"]`);
    return [key, [...panel.querySelectorAll('.hai-step-text')].map(step => step.querySelector(`.lang-${lang}`).textContent.trim())];
  }));

  routes.forEach(route => {
    const department = DEPARTMENTS[route.dataset.haiRoute];
    route.style.setProperty('--hm-accent', department.accent);
    for (const [className, radius] of [['hm-route-token-halo', '8'], ['hm-route-token', '3']]) {
      const token = doc.createElementNS(SVG_NS, 'circle');
      token.setAttribute('class', className);
      token.setAttribute('r', radius);
      token.setAttribute('aria-hidden', 'true');
      route.append(token);
    }
  });
  const announcements = element('span', 'hm-sr-only', '', { role: 'status', 'aria-live': 'polite' });
  announcements.style.cssText = 'position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap';
  slide.append(announcements);

  function placeDetail() {
    const card = cards.find(item => item.dataset.haiBenefit === selected);
    const host = mobile.matches && card ? card.closest('.hai-benefit') : mode === 'journeys' ? journeyHome : caption;
    const focused = doc.activeElement;
    const keepFocus = detail.contains(focused);
    if (detail.parentElement !== host) {
      host.append(detail);
      if (keepFocus) focused.focus({ preventScroll: true });
    }
    overview.hidden = Boolean(selected) && !mobile.matches && mode !== 'journeys';
  }
  function updateStep(index, complete = false) {
    [...steps.children].forEach((step, itemIndex) => {
      step.classList.toggle('is-current', itemIndex === index);
      step.classList.toggle('is-done', itemIndex < index || complete);
      const number = step.querySelector('.hm-step-number');
      number.textContent = itemIndex < index || complete ? '✓' : `0${itemIndex + 1}`;
      if (itemIndex === index && !complete) step.setAttribute('aria-current', 'step');
      else step.removeAttribute('aria-current');
    });
    progress.style.transform = `scaleX(${complete ? 1 : (index + 1) / steps.children.length})`;
  }
  function runWorkflow(enabled) {
    clearSequence();
    const key = selected;
    if (!key) return;
    if (!enabled || options.static || reduced.matches || doc.hidden) {
      updateStep(journeys[key].length - 1, true);
      announcements.textContent = `${DEPARTMENTS[key][lang]}. ${journeys[key].join('. ')}.`;
      return;
    }
    updateStep(0);
    const route = routes.find(item => item.dataset.haiRoute === key);
    const path = route?.querySelector('.hai-route-base');
    const tokens = route ? [...route.querySelectorAll('.hm-route-token, .hm-route-token-halo')] : [];
    const glow = glows.get(key);
    animate(detail, [{ opacity: .5 }, { opacity: 1 }], { duration: 180, easing: easeOut });
    const interval = 1150;
    journeys[key].forEach((label, index) => {
      if (index) later(() => updateStep(index), index * interval);
      if (path && !mobile.matches && typeof path.getTotalLength === 'function') {
        tokens.forEach(token => animate(token, routeKeyframes(path), {
          duration: 1000, delay: index * interval + 80, easing: 'linear', fill: 'backwards'
        }));
      }
      if (mode === 'active' || mode === 'journeys') {
        animate(glow, [
          { opacity: 0, transform: 'translate(-50%, -50%) scale(.95)' },
          { opacity: .9, transform: 'translate(-50%, -50%) scale(1.06)', offset: .4 },
          { opacity: 0, transform: 'translate(-50%, -50%) scale(1.1)' }
        ], { duration: 1000, delay: index * interval, easing: easeInOut });
      }
    });
    if (mode === 'journeys') animate(progress, [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], {
      duration: journeys[key].length * interval, easing: 'linear'
    });
    later(() => {
      updateStep(journeys[key].length - 1, true);
      announcements.textContent = `${DEPARTMENTS[key][lang]}. ${journeys[key][journeys[key].length - 1]}.`;
    }, journeys[key].length * interval);
  }

  function select(key, enabled = true, focusCard = false) {
    clearSequence();
    selected = Object.hasOwn(DEPARTMENTS, key) ? key : null;
    input = enabled ? 'pointer' : 'keyboard';
    slide.dataset.hmInput = input;
    slide.style.setProperty('--hm-accent', selected ? DEPARTMENTS[selected].accent : '#367e9d');
    cards.forEach(card => {
      const active = card.dataset.haiBenefit === selected;
      card.setAttribute('aria-expanded', String(active));
      card.setAttribute('aria-controls', 'hm-panel');
      card.closest('.hai-benefit').classList.toggle('is-selected', active);
    });
    markers.forEach((marker, markerKey) => {
      marker.classList.toggle('is-selected', markerKey === selected);
      marker.setAttribute('aria-pressed', String(markerKey === selected));
    });
    routes.forEach(route => route.classList.toggle('is-active', route.dataset.haiRoute === selected));
    detail.hidden = !selected;
    placeDetail();
    if (!selected) {
      announcements.textContent = '';
      return;
    }
    detailHeading.textContent = DEPARTMENTS[selected][lang];
    steps.replaceChildren(...journeys[selected].map((text, index) => {
      const step = element('li', 'hm-step');
      step.append(element('span', 'hm-step-number', `0${index + 1}`, { 'aria-hidden': 'true' }), element('span', 'hm-step-text', text));
      return step;
    }));
    if (focusCard) cards.find(card => card.dataset.haiBenefit === selected)?.focus({ preventScroll: true });
    runWorkflow(enabled);
  }

  function opening(enabled) {
    clearSequence();
    select(null, false);
    slide.dataset.hmInput = enabled ? 'pointer' : 'keyboard';
    const hospital = slide.querySelector('.hai-hospital-art');
    animate(hospital, [
      { transform: 'translateY(12px) scale(.96)', opacity: 0 },
      { transform: 'translateY(0) scale(1)', opacity: 1 }
    ], { duration: 800, easing: easeOut }, enabled);
    animate(slide.querySelector('.hai-headline'), [{ opacity: 0 }, { opacity: 1 }], {
      duration: 400, delay: 80, easing: easeOut, fill: 'backwards'
    }, enabled);
    animate(slide.querySelector('.hai-hospital-kicker'), [{ opacity: 0 }, { opacity: 1 }], {
      duration: 400, delay: 180, easing: easeOut, fill: 'backwards'
    }, enabled);
    routes.forEach((route, index) => {
      const clipPath = route.dataset.haiSide === 'left' ? 'inset(0 0 0 100%)' : 'inset(0 100% 0 0)';
      animate(route, [{ clipPath, opacity: 0 }, { clipPath: 'inset(0)', opacity: 1 }], {
        duration: 650, delay: 300 + index * 60, easing: easeInOut, fill: 'backwards'
      }, enabled);
    });
    cards.forEach((card, index) => {
      const x = index % 2 === 0 ? 34 : -34;
      const y = index < 2 ? 12 : -12;
      animate(card.closest('.hai-benefit'), [
        { opacity: 0, transform: `translate(${x}px, ${y}px) scale(.97)` },
        { opacity: 1, transform: 'translate(0, 0) scale(1)' }
      ], { duration: 450, delay: 440 + index * 65, easing: easeOut, fill: 'backwards' }, enabled);
    });
    animate(overview, [{ opacity: 0 }, { opacity: 1 }], {
      duration: 400, delay: 680, easing: easeOut, fill: 'backwards'
    }, enabled);
  }

  function setMode(value, enabled = true) {
    clearSequence();
    resetDepth();
    MODES.forEach(item => slide.classList.remove(`hm-mode-${item}`));
    mode = normalizeMode(value);
    slide.classList.add(`hm-mode-${mode}`);
    slide.dataset.hmMode = mode;
    // Hidden marker buttons must also leave the tab order in the quiet variants.
    markers.forEach(marker => { marker.hidden = mode === 'depth' || mode === 'cinematic'; });
    if (mode === 'cinematic') opening(enabled);
    else if (mode === 'active' || mode === 'journeys') select('revenue', enabled);
    else {
      select(null, false);
      slide.dataset.hmInput = enabled ? 'pointer' : 'keyboard';
      [back, front].forEach((layer, index) => animate(layer,
        [{ opacity: 0, transform: 'translateY(5px)' }, { opacity: 1, transform: 'translateY(0)' }],
        { duration: 450, delay: index * 60, easing: easeOut, fill: 'backwards' }, enabled));
    }
    if (comparison) env.parent.postMessage({ type: 'hai-preview-ready', mode }, env.location.origin);
  }

  function setLanguage(value) {
    if ((value !== 'ka' && value !== 'en') || value === lang) return;
    lang = value;
    markers.forEach((marker, key) => {
      marker.setAttribute('aria-label', DEPARTMENTS[key][lang]);
      marker.querySelector('.hm-marker-label').textContent = DEPARTMENTS[key][lang];
    });
    const depthLabels = [t('Shared information', 'ერთიანი მონაცემები'), t('Connected teams', 'დაკავშირებული გუნდი'), t('One complete view', 'სრული სურათი')];
    [...front.children].forEach((badge, index) => { badge.querySelector('span').textContent = depthLabels[index]; });
    replay.setAttribute('aria-label', t('Replay workflow', 'პროცესის გამეორება'));
    close.setAttribute('aria-label', t('Return to overview', 'სრულ სურათზე დაბრუნება'));
    detail.querySelector('.hm-example-label').textContent = t('Illustrative workflow', 'პროცესის მაგალითი');
    cards.forEach(card => {
      const key = card.dataset.haiBenefit;
      journeys[key] = [...slide.querySelectorAll(`[data-hai-panel="${key}"] .hai-step-text`)]
        .map(step => step.querySelector(`.lang-${lang}`).textContent.trim());
    });
    select(selected, false);
  }

  function suspend() {
    clearSequence();
    resetDepth();
    if (selected) updateStep(journeys[selected].length - 1, true);
  }

  function spring(timestamp) {
    const dt = Math.min((timestamp - (lastFrame || timestamp - 16)) / 1000, .032);
    lastFrame = timestamp;
    // Physical spring from the motion skill: mass 1, stiffness 100, damping 10.
    ['x', 'y'].forEach(axis => {
      const velocity = axis === 'x' ? 'vx' : 'vy';
      const target = axis === 'x' ? 'tx' : 'ty';
      position[velocity] += ((position[target] - position[axis]) * 100 - position[velocity] * 10) * dt;
      position[axis] += position[velocity] * dt;
    });
    back.style.transform = `translate(${position.x * -3}px, ${position.y * -2}px)`;
    front.style.transform = `translate(${position.x * 8}px, ${position.y * 5}px)`;
    const settled = Math.abs(position.x - position.tx) + Math.abs(position.y - position.ty) + Math.abs(position.vx) + Math.abs(position.vy) < .005;
    springFrame = settled ? null : env.requestAnimationFrame(spring);
    if (settled) lastFrame = 0;
  }
  function moveDepth(event) {
    if (mode !== 'depth' || !fine.matches || reduced.matches || event.pointerType === 'touch') return;
    const bounds = map.getBoundingClientRect();
    position.tx = Math.max(-1, Math.min(1, (event.clientX - bounds.left) / bounds.width * 2 - 1));
    position.ty = Math.max(-1, Math.min(1, (event.clientY - bounds.top) / bounds.height * 2 - 1));
    if (springFrame === null) springFrame = env.requestAnimationFrame(spring);
  }
  on(map, 'pointermove', moveDepth);
  // Ordinary deck navigation remains enabled outside the comparison page.
  if (comparison) on(slide, 'click', event => event.stopPropagation());
  on(map, 'pointerleave', () => {
    position.tx = position.ty = 0;
    if (mode === 'depth' && springFrame === null && !reduced.matches) springFrame = env.requestAnimationFrame(spring);
  });
  cards.forEach(card => on(card, 'click', event => {
    const key = card.dataset.haiBenefit;
    select(selected === key ? null : key, event.detail !== 0);
  }));
  on(replay, 'click', event => runWorkflow(event.detail !== 0));
  on(close, 'click', () => {
    const card = cards.find(item => item.dataset.haiBenefit === selected);
    select(null, false);
    card?.focus({ preventScroll: true });
  });
  on(slide, 'keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') event.stopPropagation();
    if (event.key === 'Escape' && selected) {
      event.preventDefault();
      event.stopPropagation();
      const card = cards.find(item => item.dataset.haiBenefit === selected);
      select(null, false);
      card?.focus({ preventScroll: true });
    }
  });
  on(mobile, 'change', () => { clearSequence(); placeDetail(); if (selected) updateStep(journeys[selected].length - 1, true); });
  on(reduced, 'change', () => {
    clearSequence(); resetDepth();
    if (selected) updateStep(journeys[selected].length - 1, true);
  });
  on(fine, 'change', resetDepth);
  on(doc, 'visibilitychange', () => {
    if (doc.hidden) {
      clearSequence(); resetDepth();
      if (selected) updateStep(journeys[selected].length - 1, true);
    }
  });
  on(env, 'beforeprint', () => { clearSequence(); resetDepth(); });
  if (comparison) on(env, 'message', event => {
    if (event.origin !== env.location.origin || event.source !== env.parent) return;
    if (event.data?.type === 'hai-preview-mode') setMode(event.data.mode, event.data.animate !== false);
    if (event.data?.type === 'hai-preview-replay') {
      if (mode === 'cinematic') opening(event.data.animate !== false);
      else if (selected) runWorkflow(event.data.animate !== false);
      else setMode(mode, event.data.animate !== false);
    }
  });
  slide.classList.add('hm-preview', 'hai-interactive');
  if (comparison) slide.classList.add('hm-comparison');
  setMode(mode, options.startImmediately !== false && params.get('motion-input') !== 'keyboard');

  return {
    setMode, select, opening, setLanguage, suspend,
    getState: () => ({ mode, selected, animations: animations.size, timers: timers.size, springActive: springFrame !== null }),
    destroy() {
      clearSequence(); resetDepth(); disposed = true;
      listeners.forEach(remove => remove());
    }
  };
}

async function start() {
  if (!new URLSearchParams(window.location.search).has('motion-preview')) return;
  const slide = document.getElementById('hospital-ai-assistants');
  if (!slide || !window.Reveal) return;
  const stylesheet = document.createElement('link');
  stylesheet.rel = 'stylesheet';
  stylesheet.href = '/deck-assets/hospitals-motion-preview.css?v=3a881c782a';
  const stylesReady = new Promise((resolve, reject) => {
    stylesheet.addEventListener('load', resolve, { once: true });
    stylesheet.addEventListener('error', () => reject(new Error('Motion preview stylesheet failed to load.')), { once: true });
  });
  document.head.append(stylesheet);
  const revealReady = window.Reveal.isReady() ? Promise.resolve() : new Promise(resolve => window.Reveal.on('ready', resolve));
  const image = slide.querySelector('.hai-hospital-art img');
  await Promise.all([stylesReady, revealReady, document.fonts.ready, image.decode()]);
  window.Reveal.configure({ controls: false, progress: false, keyboard: false, touch: false, overview: false });
  window.Reveal.slide(window.Reveal.getIndices(slide).h);
  const preview = createPreview(slide);
  window.addEventListener('pagehide', () => preview.destroy(), { once: true });
}

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  start().catch(error => {
    console.error('Could not load the hospital motion preview.', error);
    window.parent.postMessage({ type: 'hai-preview-error' }, window.location.origin);
  });
}
