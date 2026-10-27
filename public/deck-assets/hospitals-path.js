// Keep research readable outside the presentation's scaled canvas.
(() => {
  const dialog = document.getElementById('hpath-research');
  const opener = document.querySelector('[data-hpath-research]');
  if (!dialog || !opener) return;

  let keyboardBeforeOpen;
  opener.addEventListener('click', () => {
    keyboardBeforeOpen = window.Reveal.getConfig().keyboard;
    window.Reveal.configure({ keyboard: false });
    dialog.showModal();
    dialog.scrollTop = 0;
  });
  dialog.querySelector('[data-hpath-close]').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right ||
        event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    window.Reveal.configure({ keyboard: keyboardBeforeOpen });
    opener.focus({ preventScroll: true });
  });
})();
