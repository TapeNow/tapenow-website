<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="public/brand/v2/lockup-dark.svg">
    <img src="public/brand/v2/lockup-light.svg" width="220" alt="TapeNow">
  </picture>
</p>

<p align="center">
  <strong>Build with your agent. Ship it onchain.</strong><br>
  Source of <a href="https://tapenow.dev">tapenow.dev</a>, the TapeNow homepage.
</p>

<p align="center">
  <a href="https://github.com/TapeNow/tapenow-website/actions/workflows/ci.yml"><img src="https://github.com/TapeNow/tapenow-website/actions/workflows/ci.yml/badge.svg" alt="CI"></a>
  &nbsp;<code>Apache-2.0</code>
</p>

<p align="center"><b>English</b> · <a href="README.zh-CN.md">简体中文</a></p>

---

## About TapeNow

[TapeNow](https://tapenow.dev) is a release workbench for web projects in the TapeOut ecosystem. Import a build, share a private preview, keep every version as a signed archive, and publish to **BSC, X Layer and Base**. With **WebMCP**, your AI agent can prepare releases with you inside the workbench; you approve every consequential action.

- Workbench: <https://app.tapenow.dev> (limited public beta)
- User manual (English / 中文): <https://app.tapenow.dev/docs/manual/>
- Feedback: use the feedback button in the workbench, or open <https://app.tapenow.dev/?feedback=1>

This repository contains **only the public homepage**. The workbench itself is developed in a separate repository.

## What is here

```
public/
├── index.html          Homepage (bilingual: English / 简体中文, ?lang=en|zh-CN)
├── privacy.html        Privacy notice
├── terms.html          Beta terms
├── 404.html            Not-found page
├── home/               Product screenshots (English UI) and their sources (ASSETS.json)
├── brand/              Logos, icons, theme and font subsets (see TRADEMARKS.md)
├── _headers            Security and cache headers
├── robots.txt · sitemap.xml
scripts/
├── check.mjs           Pre-publish checks (references, bilingual pairs, no emails or credentials)
└── build-font.py       Rebuilds the Chinese font subset from the shipped text
wrangler.jsonc          Cloudflare static-assets deployment for tapenow.dev
```

The site is plain HTML and CSS with a small inline script for the language switch and animations. It has no build step and no runtime dependencies.

## Develop

Requires Node.js 22.16+.

```bash
npm ci
npm run dev        # local preview through wrangler
npm run check      # run before every commit
```

You can also open `public/index.html` directly, although absolute paths such as `/brand/...` resolve correctly only through `npm run dev`.

**Chinese copy.** The Chinese font is a subset that only contains the characters the site uses. After you add new Chinese text, run `python3 scripts/build-font.py` (needs `pip install fonttools brotli`). If you skip this, new characters fall back to the system font.

**Content rules.** Show only real product behaviour. Do not add invented user numbers, testimonials or performance claims. Label demos as demos. Every Chinese `<span class="zh">` needs a matching English `<span class="en">`, and `npm run check` enforces this.

## Deploy

Deploys go through GitHub Actions only:

1. Bump `version` in `package.json`.
2. Push a matching tag: `git tag -a vX.Y.Z -m "…" && git push origin vX.Y.Z`.
3. CI runs the checks, deploys with `wrangler deploy`, and confirms that the homepage is live.

Maintainers can also run the workflow manually with **deploy** selected. The workflow needs the repository secrets `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`.

## Contributing

Issues and pull requests for typos, translations, accessibility and layout fixes are welcome. Report product bugs through the [feedback form](https://app.tapenow.dev/?feedback=1). Report security issues privately as described in [SECURITY.md](SECURITY.md).

## License

The code and text in this repository are licensed under the [Apache License 2.0](LICENSE). The TapeNow name, logos and brand assets are **not** covered by that license; see [TRADEMARKS.md](TRADEMARKS.md). The bundled fonts are under the SIL Open Font License; their license texts are in `public/brand/v2/fonts/`.
