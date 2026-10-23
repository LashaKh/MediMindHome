/* Verified scheduler configuration lives on the CTA: shared data-booking-url or per-format overrides. */
(() => {
  const slide = document.getElementById('hospital-meeting');
  const booking = slide?.querySelector('[data-hmeeting-booking]');
  if (!slide || !booking) return;
  const requestLabel = slide.querySelector('[data-hmeeting-request-label]');
  const bookingLabel = slide.querySelector('[data-hmeeting-booking-label]');
  const requestHelp = slide.querySelector('[data-hmeeting-request-help]');
  const bookingHelp = slide.querySelector('[data-hmeeting-booking-help]');
  const formats = slide.querySelectorAll('input[name="hmeeting-format"]');
  let requestHref;
  let calendarUrl;
  let keyboardBeforeOpen;
  let activeOpener;
  let loadTimer;

  // This lives outside the scaled Reveal canvas; native dialog supplies focus containment and Escape.
  const dialog = document.createElement('dialog');
  dialog.id = 'hmeeting-booking-dialog';
  dialog.className = 'hmeeting-dialog';
  dialog.setAttribute('aria-labelledby', 'hmeeting-dialog-title');
  dialog.setAttribute('aria-describedby', 'hmeeting-dialog-description');
  dialog.setAttribute('data-no-advance', '');
  dialog.innerHTML = `
    <header class="hmeeting-dialog-header">
      <div><h2 id="hmeeting-dialog-title"><span class="lang-ka">შეხვედრა MediMind-ის გუნდთან</span><span class="lang-en">Meet the MediMind team</span></h2>
      <p id="hmeeting-dialog-description"><span data-hmeeting-dialog-format></span> · <span class="lang-ka">30 წუთი</span><span class="lang-en">30 minutes</span></p></div>
      <button type="button" class="hmeeting-dialog-close" aria-label="Close booking / დაჯავშნის დახურვა" autofocus>×</button>
    </header>
    <div class="hmeeting-dialog-calendar"><p class="hmeeting-dialog-status" role="status" aria-live="polite"></p><div class="hmeeting-dialog-frame"></div></div>
    <footer class="hmeeting-dialog-footer"><p><span class="lang-ka">კალენდარი არ ჩანს?</span><span class="lang-en">Calendar not displaying?</span></p><a data-hmeeting-email><span class="lang-ka">მოითხოვეთ შეხვედრა ელფოსტით</span><span class="lang-en">Request a meeting by email</span></a></footer>`;
  document.body.append(dialog);
  const closeButton = dialog.querySelector('.hmeeting-dialog-close');
  const frame = dialog.querySelector('.hmeeting-dialog-frame');
  const status = dialog.querySelector('.hmeeting-dialog-status');
  const email = dialog.querySelector('[data-hmeeting-email]');
  const formatDescription = dialog.querySelector('[data-hmeeting-dialog-format]');

  function updateBooking() {
    const hospital = slide.querySelector('input[name="hmeeting-format"]:checked')?.value === 'hospital';
    const configuredUrl = ((hospital ? booking.dataset.bookingUrlHospital : booking.dataset.bookingUrlOnline) || booking.dataset.bookingUrl || '').trim();
    calendarUrl = undefined;
    // Only full HTTPS addresses can activate booking wording. Empty configuration remains a request.
    if (/^https:\/\/[^\s/]+(?:\/[^\s]*)?$/.test(configuredUrl)) {
      try { calendarUrl = new URL(configuredUrl); }
      catch { calendarUrl = undefined; /* Malformed configuration keeps the email-request fallback. */ }
    }
    const georgian = document.documentElement.lang === 'ka';
    const format = georgian ? (hospital ? 'ჩვენს კლინიკაში' : 'ვიდეოზარი') : (hospital ? 'At our hospital' : 'Video call');
    const subject = georgian ? '30-წუთიანი შეხვედრა MediMind-ის გუნდთან' : '30-minute meeting with the MediMind team';
    const body = georgian
      ? `გამარჯობა,\n\nმსურს MediMind-ის გუნდთან 30-წუთიანი შეხვედრა.\nფორმატი: ${format}\nკლინიკა: \nმოსახერხებელი დრო: \nმთავარი საჭიროება: \n\nგთხოვთ, დამიდასტუროთ დრო.\n`
      : `Hello,\n\nI would like to request a 30-minute meeting with the MediMind team.\nFormat: ${format}\nHospital: \nPreferred times: \nMain need: \n\nPlease confirm a suitable time.\n`;
    requestHref = `mailto:team@medimind.md?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    booking.href = calendarUrl ? '#hmeeting-booking-dialog' : requestHref;
    booking.dataset.bookingMode = calendarUrl ? 'calendar' : 'request';
    booking.removeAttribute('target');
    booking.removeAttribute('rel');
    if (calendarUrl) booking.setAttribute('aria-haspopup', 'dialog');
    else booking.removeAttribute('aria-haspopup');
    requestLabel.hidden = Boolean(calendarUrl);
    bookingLabel.hidden = !calendarUrl;
    requestHelp.hidden = Boolean(calendarUrl);
    bookingHelp.hidden = !calendarUrl;
    email.href = requestHref;
    formatDescription.textContent = georgian ? (hospital ? 'თქვენს კლინიკაში' : 'ვიდეოზარი') : (hospital ? 'At your hospital' : 'Video call');
  }

  function showLoadFallback() {
    if (!dialog.open) return;
    status.hidden = false;
    status.textContent = document.documentElement.lang === 'ka'
      ? 'თუ კალენდარი არ ჩანს, შეხვედრა ქვემოთ მითითებული ელფოსტით მოითხოვეთ.'
      : 'If the calendar stays blank, request a meeting by email below.';
  }

  booking.addEventListener('click', (event) => {
    if (!calendarUrl) return;
    event.preventDefault();
    if (dialog.open) return;
    activeOpener = document.activeElement;
    keyboardBeforeOpen = window.Reveal.getConfig().keyboard;
    window.Reveal.configure({ keyboard: false });
    status.hidden = false;
    status.textContent = document.documentElement.lang === 'ka' ? 'კალენდარი იტვირთება…' : 'Loading calendar…';
    const player = document.createElement('iframe');
    const embedUrl = new URL(calendarUrl);
    embedUrl.searchParams.set('gv', 'true');
    player.title = document.documentElement.lang === 'ka' ? 'MediMind-ის შეხვედრის დაჯავშნის კალენდარი' : 'MediMind meeting booking calendar';
    player.referrerPolicy = 'strict-origin-when-cross-origin';
    player.addEventListener('load', () => { if (frame.firstElementChild !== player) return; clearTimeout(loadTimer); status.hidden = true; }, { once: true });
    player.addEventListener('error', () => { if (frame.firstElementChild !== player) return; clearTimeout(loadTimer); showLoadFallback(); }, { once: true });
    player.src = embedUrl.href;
    frame.replaceChildren(player);
    dialog.showModal();
    closeButton.focus();
    loadTimer = setTimeout(showLoadFallback, 12000);
  });
  closeButton.addEventListener('click', () => dialog.close());
  dialog.addEventListener('keydown', (event) => {
    if (event.key !== 'Tab') return;
    if (event.shiftKey && document.activeElement === closeButton) {
      event.preventDefault(); email.focus();
    } else if (!event.shiftKey && document.activeElement === email) {
      event.preventDefault(); closeButton.focus();
    }
  });
  dialog.addEventListener('click', (event) => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    clearTimeout(loadTimer);
    frame.replaceChildren();
    window.Reveal.configure({ keyboard: keyboardBeforeOpen });
    (activeOpener || booking).focus({ preventScroll: true });
  });
  window.Reveal.on('slidechanged', () => { if (dialog.open) dialog.close(); });
  formats.forEach((input) => {
    input.addEventListener('change', updateBooking);
    input.addEventListener('keydown', (event) => event.stopPropagation());
  });
  new MutationObserver(updateBooking).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  new MutationObserver(updateBooking).observe(booking, { attributes: true, attributeFilter: ['data-booking-url', 'data-booking-url-online', 'data-booking-url-hospital'] });
  updateBooking();
})();
