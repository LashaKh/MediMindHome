# Russian hospital deck

Preview: http://localhost:5173/hospitals.html?lang=ru

The cover language switch supports English, Georgian and Russian. Query links take
priority over the saved session language; switching updates the shareable URL.

Edit `ru.json` for Russian copy. Keys are the existing English HTML or text, with
whitespace normalised. Preserve numbers, product names, links and formatting tags.
`runtime.js` inserts Russian counterparts for the existing bilingual blocks,
including template content and dynamically created dialogs. English and Georgian
source copy stays in place. Direct-text animation and booking UI call the same
catalogue. Product recordings, screenshots and third-party embeds remain original
media; this does not dub videos or translate another service's interface.

`npm run build` checks translation coverage and rebuilds the Russian assets automatically.
For a quick local rebuild, run `node scripts/hospitals-i18n/build.mjs`. It validates nonempty
copy and matching formatting tags, builds the public JS and CSS, and updates
cache hashes in `public/hospitals.html`. The generated stylesheet mirrors existing
English display rules for Russian while hiding inactive languages. Add only
Russian-specific layout adjustments to `russian-layout.css`.

Generated assets: `public/deck-assets/hospitals-russian.js` and `.css`.
