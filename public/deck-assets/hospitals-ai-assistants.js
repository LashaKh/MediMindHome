// Keep fact explanations and capability details outside Reveal's scaled canvas.
(() => {
  document.querySelectorAll('.hai-dialog').forEach((dialog) => {
    const close = dialog.querySelector('[data-hai-close]');
    if (!close) return;

    let returnFocus;
    let previousKeyboard;
    document.querySelectorAll(`[data-hai-open][aria-controls="${dialog.id}"]`).forEach((opener) => {
      opener.addEventListener('click', () => {
        if (dialog.open) return;
        returnFocus = opener;
        previousKeyboard = window.Reveal.getConfig().keyboard;
        window.Reveal.configure({ keyboard: false });
        dialog.showModal();
        close.focus({ preventScroll: true });
        const target = document.getElementById(opener.dataset.haiOpen);
        const header = dialog.querySelector('.hpath-dialog-head');
        dialog.scrollTop = target ? Math.max(0, target.offsetTop - header.offsetHeight - 20) : 0;
      });
    });
    close.addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', (event) => {
      if (event.target !== dialog) return;
      const bounds = dialog.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right ||
          event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
    });
    dialog.addEventListener('close', () => {
      window.Reveal.configure({ keyboard: previousKeyboard });
      returnFocus?.focus({ preventScroll: true });
    });
  });
})();

// One entrance per visit; each selected benefit explains one illustrative workflow.
(() => {
  if (new URLSearchParams(window.location.search).has('motion-preview')) return;
  const slide = document.getElementById('hospital-ai-assistants');
  if (slide?.dataset.haiExperience === 'journeys') return;
  if (!slide || !window.Reveal) return;

  const triggers = [...slide.querySelectorAll('[data-hai-benefit]')];
  const panels = [...slide.querySelectorAll('[data-hai-panel]')];
  const routes = [...slide.querySelectorAll('[data-hai-route]')];
  const workflow = slide.querySelector('.hai-workflow-deck');
  const home = slide.querySelector('#hai-workflow-home');
  const overview = slide.querySelector('.hai-hospital-overview');
  const reset = slide.querySelector('[data-hai-reset]');
  if (!triggers.length || !workflow || !home || !overview || !reset) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const mobile = window.matchMedia('(max-width: 768px)');
  const print = window.matchMedia('print');
  const printExport = new URLSearchParams(window.location.search).has('print-pdf');
  const styles = getComputedStyle(slide);
  const easeOut = styles.getPropertyValue('--ease-out').trim();
  const easeInOut = styles.getPropertyValue('--ease-in-out').trim();
  const animations = new Set();
  let selected = null;
  let entered = false;

  function cancelMotion() {
    animations.forEach((animation) => animation.cancel());
    animations.clear();
  }

  function animate(element, frames, timing) {
    if (!element || reduced.matches || print.matches || printExport || typeof element.animate !== 'function') return;
    const animation = element.animate(frames, timing);
    animations.add(animation);
    animation.onfinish = animation.oncancel = () => animations.delete(animation);
  }

  function illuminate(route, delay = 0, entrance = false) {
    const start = route.dataset.haiSide === 'left' ? 'inset(0 0 0 100%)' : 'inset(0 100% 0 0)';
    animate(route.querySelector('.hai-route-signal'), [
      { opacity: 0, clipPath: start, offset: 0 },
      { opacity: 1, clipPath: 'inset(0 0 0 0)', offset: .75 },
      { opacity: entrance ? 0 : 1, clipPath: 'inset(0 0 0 0)', offset: 1 }
    ], { duration: 700, delay, easing: easeInOut });
  }

  function placeWorkflow() {
    const trigger = triggers.find((item) => item.dataset.haiBenefit === selected);
    const host = mobile.matches && trigger ? trigger.closest('.hai-benefit') : home;
    const focused = document.activeElement;
    const restoreFocus = !workflow.hidden && workflow.contains(focused);
    if (workflow.parentElement !== host) {
      host.append(workflow);
      if (restoreFocus) focused.focus({ preventScroll: true });
    }
    overview.hidden = Boolean(selected) && !mobile.matches;
  }

  function select(key, keyboard = false) {
    cancelMotion();
    selected = key;
    slide.dataset.haiInput = keyboard ? 'keyboard' : 'pointer';
    triggers.forEach((trigger) => {
      const active = trigger.dataset.haiBenefit === key;
      trigger.setAttribute('aria-expanded', String(active));
      trigger.closest('.hai-benefit').classList.toggle('is-selected', active);
    });
    panels.forEach((panel) => { panel.hidden = panel.dataset.haiPanel !== key; });
    routes.forEach((route) => { route.classList.toggle('is-active', route.dataset.haiRoute === key); });
    workflow.hidden = !key;
    placeWorkflow();
    if (!key || keyboard) return;

    const panel = panels.find((item) => item.dataset.haiPanel === key);
    const route = routes.find((item) => item.dataset.haiRoute === key);
    if (route && !mobile.matches) illuminate(route);
    // Only the highlight moves; the workflow text is always fully readable.
    animate(panel, [{ opacity: .4 }, { opacity: 1 }], { duration: 180, easing: easeOut });
    panel.querySelectorAll('.hai-step-signal').forEach((signal, index) => {
      animate(signal, [{ opacity: 0 }, { opacity: 1, offset: .2 }, { opacity: 1, offset: .65 }, { opacity: 0 }],
        { duration: 600, delay: index * 400, easing: easeOut });
    });
  }

  function returnToOverview() {
    const trigger = triggers.find((item) => item.dataset.haiBenefit === selected);
    select(null, true);
    trigger?.focus({ preventScroll: true });
  }

  triggers.forEach((trigger) => {
    trigger.addEventListener('click', (event) => {
      const key = trigger.dataset.haiBenefit;
      select(selected === key ? null : key, event.detail === 0);
    });
  });
  reset.addEventListener('click', returnToOverview);
  [...triggers, reset].forEach((control) => {
    control.addEventListener('keydown', (event) => {
      // Preserve native button activation without advancing the presentation.
      if (event.key === 'Enter' || event.key === ' ') event.stopPropagation();
    });
  });
  slide.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && selected) {
      event.preventDefault();
      event.stopPropagation();
      returnToOverview();
    }
  });

  function onSlide({ currentSlide }) {
    if (currentSlide !== slide) {
      select(null, true);
      return;
    }
    if (entered) return;
    entered = true;
    const entrances = [
      [triggers[0].closest('.hai-benefit'), 0],
      [triggers[1].closest('.hai-benefit'), 60],
      [slide.querySelector('.hai-hospital-art'), 120],
      [triggers[2].closest('.hai-benefit'), 240],
      [triggers[3].closest('.hai-benefit'), 300]
    ];
    entrances.forEach(([element, delay]) => {
      animate(element, [{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'translateY(0)' }],
        { duration: 300, delay, fill: 'backwards', easing: easeOut });
    });
    if (!mobile.matches) routes.forEach((route, index) => illuminate(route, 120 + index * 60, true));
  }

  mobile.addEventListener('change', () => { cancelMotion(); placeWorkflow(); });
  reduced.addEventListener('change', cancelMotion);
  window.addEventListener('beforeprint', () => select(null, true));
  select(null);
  slide.classList.add('hai-interactive');
  window.Reveal.on('ready', onSlide);
  window.Reveal.on('slidechanged', onSlide);
  if (window.Reveal.isReady()) onSlide({ currentSlide: window.Reveal.getCurrentSlide() });
})();
