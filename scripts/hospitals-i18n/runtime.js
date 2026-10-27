// Catalogue is generated ahead of this adapter by build.mjs. Product names and media stay unchanged.
(() => {
  'use strict';
  const normalize = value => value.replace(/\s+/g, ' ').trim();
  const canonical = value => {
    const template = document.createElement('template');
    template.innerHTML = value;
    return normalize(template.innerHTML);
  };
  const russian = new Map(Object.entries(window.mmHospitalRussian).map(([en, ru]) => [canonical(en), ru]));
  const originalAttributes = new WeakMap();
  const originalText = new WeakMap();
  const currentLanguage = () => document.documentElement.lang;
  const translate = en => russian.get(canonical(en));
  const text = en => {
    if (currentLanguage() !== 'ru') return en;
    const result = translate(en);
    if (result === undefined) return en;
    const template = document.createElement('template');
    template.innerHTML = result;
    return template.content.textContent;
  };

  function addRussian(node) {
    let next = node.nextElementSibling;
    while (next?.matches('.lang-ka, .lang-ru')) {
      if (next.classList.contains('lang-ru')) return;
      next = next.nextElementSibling;
    }
    const result = translate(node.innerHTML);
    if (result === undefined) {
      node.dataset.ruMissing = '';
      console.warn('Missing Russian deck translation:', normalize(node.textContent));
    }
    const clone = node.cloneNode(false);
    clone.classList.replace('lang-en', 'lang-ru');
    clone.removeAttribute('id');
    clone.innerHTML = result ?? node.innerHTML;
    node.insertAdjacentElement('afterend', clone);
  }

  function attributes(node) {
    let originals = originalAttributes.get(node);
    if (!originals) { originals = new Map(); originalAttributes.set(node, originals); }
    for (const attribute of ['aria-label', 'alt', 'title', 'placeholder']) {
      if (!node.hasAttribute(attribute)) continue;
      if (!originals.has(attribute)) originals.set(attribute, node.getAttribute(attribute));
      const original = originals.get(attribute);
      const source = original.split(' / ')[0];
      const value = currentLanguage() === 'ru' ? text(source) : original;
      if (node.getAttribute(attribute) !== value) node.setAttribute(attribute, value);
    }
  }

  function plainText(node) {
    const now = node.textContent;
    if (translate(now) !== undefined) originalText.set(node, now);
    const original = originalText.get(node);
    if (original === undefined) return;
    const value = currentLanguage() === 'ru' ? text(original) : original;
    if (node.textContent !== value) node.textContent = value;
  }

  function hydrate(root) {
    if (root.nodeType !== Node.ELEMENT_NODE && root.nodeType !== Node.DOCUMENT_NODE && root.nodeType !== Node.DOCUMENT_FRAGMENT_NODE) return;
    if (root.matches?.('.lang-en')) addRussian(root);
    root.querySelectorAll('.lang-en').forEach(addRussian);
    root.querySelectorAll('template').forEach(template => hydrate(template.content));
    if (root.matches?.('[aria-label], [alt], [title], [placeholder]')) attributes(root);
    root.querySelectorAll('[aria-label], [alt], [title], [placeholder]').forEach(attributes);
    if (root.matches?.('[data-mm-i18n], #hc-err, #hc-gate h1, #hc-gate p, #hc-gate button')) plainText(root);
    root.querySelectorAll('[data-mm-i18n], #hc-err, #hc-gate h1, #hc-gate p, #hc-gate button').forEach(plainText);
  }

  window.mmHospitalI18n = { text, translate, hydrate };
  const title = document.title;
  function languageChanged() {
    hydrate(document);
    document.title = currentLanguage() === 'ru' ? text(title) : title;
    document.querySelectorAll('.lang-toggle button').forEach(button => {
      button.setAttribute('aria-pressed', String(button.classList.contains('btn-' + currentLanguage())));
    });
  }
  function start() {
    languageChanged();
    new MutationObserver(records => {
      for (const record of records) {
        record.addedNodes.forEach(node => { if (node.nodeType === Node.ELEMENT_NODE) hydrate(node); });
        if (record.target.nodeType === Node.ELEMENT_NODE && record.target.matches('[data-mm-i18n], #hc-err')) plainText(record.target);
      }
    }).observe(document.body, { childList: true, subtree: true });
    new MutationObserver(languageChanged).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
