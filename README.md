# SAHUCONNECT

Responsive, pre-rendered React website built from the supplied company profile and the twelve sequential design references.

## Run

```sh
npm install
npm run dev
```

On Windows PowerShell, use `npm.cmd` if execution policy blocks `npm.ps1`.

```sh
npm run build
npm run preview
npm test
```

Deploy the `dist` directory to a static host. Each route has its own pre-rendered HTML document; no backend or runtime server is required. Routes: `/`, `/company/`, `/services/`, `/presence/`, `/contact/`.

## Content and assets

- `src/source.json`: complete verbatim DOCX paragraph and table extraction.
- `src/content.js`: content references and replaceable image manifest.
- `src/components.jsx`: shared header, footer, contact cards, tables and sections.
- `src/App.jsx`: five page compositions.
- `src/styles.css`: reference-based design system and responsive layouts.
- `docs/content-review.md`: source anomalies requiring client verification.
- `docs/assets.md`: image sources and generated-image prompts.

Content edits should be made against the original document, then reflected in `source.json`. Do not silently correct factual source anomalies. All telephone and email links use the source details exactly. There is no simulated submission form, newsletter, social profile, or video link.

Images are illustrative placeholders, not claims that they depict company facilities or personnel. Replace assets through the manifest and preserve each section's crop. No external image or font requests are needed by visitors.

The reference's orange buttons use dark text for accessible contrast. The reference's blog grid holds documented achievements. Leadership uses neutral team icons instead of fictitious photographs. Long source tables are available on supporting pages with locally scrollable containers on mobile.
