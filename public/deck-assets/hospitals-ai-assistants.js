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
