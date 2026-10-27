(() => {
  const dialog = document.getElementById('hbd-player');
  const openers = document.querySelectorAll('[data-hbd-play]');
  if (!dialog || !openers.length) return;

  const frame = dialog.querySelector('[data-hbd-frame]');
  let keyboardBeforeOpen;
  let activeOpener;
  openers.forEach((opener) => opener.addEventListener('click', () => {
    if (dialog.open) return;
    activeOpener = opener;
    keyboardBeforeOpen = window.Reveal.getConfig().keyboard;
    window.Reveal.configure({ keyboard: false });
    const player = document.createElement('iframe');
    player.src = 'https://www.youtube-nocookie.com/embed/v7lRW_ZYDmc?autoplay=1&rel=0&playsinline=1';
    player.title = document.documentElement.lang === 'ka' ? 'MediMind AI ტვინის დემო' : window.mmHospitalI18n.text('MediMind AI Brain demo');
    player.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    player.allowFullscreen = true;
    player.referrerPolicy = 'strict-origin-when-cross-origin';
    frame.replaceChildren(player);
    dialog.showModal();
  }));
  dialog.querySelector('[data-hbd-close]').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right ||
        event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    frame.replaceChildren();
    window.Reveal.configure({ keyboard: keyboardBeforeOpen });
    activeOpener?.focus({ preventScroll: true });
  });
  window.Reveal.on('slidechanged', () => { if (dialog.open) dialog.close(); });

  // Preserve the existing detail windows while keeping deck navigation paused.
  const enhanceDetails = (id, openName, closeName) => {
    const modal = document.getElementById(id);
    const open = window[openName];
    const close = window[closeName];
    if (!modal || !open || !close) return;
    let returnFocus;
    let keyboard;
    window[openName] = (...args) => {
      if (modal.classList.contains('open')) return;
      returnFocus = document.activeElement;
      keyboard = window.Reveal.getConfig().keyboard;
      window.Reveal.configure({ keyboard: false });
      open(...args);
      modal.querySelector('button').focus();
    };
    window[closeName] = () => {
      if (!modal.classList.contains('open')) return;
      close();
      window.Reveal.configure({ keyboard });
      returnFocus?.focus({ preventScroll: true });
    };
    modal.addEventListener('keydown', (event) => {
      if (event.key !== 'Tab') return;
      const focusable = [...modal.querySelectorAll('button, a[href], video[controls], iframe, [tabindex="0"]')]
        .filter((element) => element.getClientRects().length > 0);
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault(); first.focus();
      }
    });
  };
  enhanceDetails('case-modal', 'openCaseModal', 'closeCaseModal');
  enhanceDetails('biz-modal', 'openBizModal', 'closeBizModal');
  enhanceDetails('eco-modal', 'openProductDemo', 'closeProductDemo');
})();
