<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="public/brand/v2/lockup-dark.svg">
    <img src="public/brand/v2/lockup-light.svg" width="220" alt="TapeNow">
  </picture>
</p>

<p align="center">
  <strong>和 Agent 一起，把作品发布到链上。</strong><br>
  TapeNow 官网 <a href="https://tapenow.dev">tapenow.dev</a> 的源码。
</p>

<p align="center">
  <a href="https://github.com/TapeNow/tapenow-website/actions/workflows/ci.yml"><img src="https://github.com/TapeNow/tapenow-website/actions/workflows/ci.yml/badge.svg" alt="CI"></a>
  &nbsp;<code>Apache-2.0</code>
</p>

<p align="center"><a href="README.md">English</a> · <b>简体中文</b></p>

---

## 关于 TapeNow

[TapeNow](https://tapenow.dev) 是 TapeOut 生态的网页作品发布工作台。你可以导入构建产物、分享私有预览、把每个版本保存为带签名的归档，并发布到 **BSC、X Layer 和 Base**。借助 **WebMCP**，你的 AI Agent 可以在工作台里和你一起准备发布；每一个重要操作都由你确认。

- 工作台：<https://app.tapenow.dev>（限量公开测试）
- 用户手册（English / 中文）：<https://app.tapenow.dev/docs/manual/>
- 反馈：在工作台里点击反馈按钮，或打开 <https://app.tapenow.dev/?feedback=1>

本仓库**只包含公开的官网首页**，工作台本身在另一个仓库中开发。

## 仓库内容

```
public/
├── index.html          首页（中英双语，可用 ?lang=en|zh-CN 指定语言）
├── privacy.html        隐私说明
├── terms.html          测试条款
├── 404.html            页面不存在
├── home/               产品截图（英文界面）及来源说明（ASSETS.json）
├── brand/              Logo、图标、主题样式和字体子集（见 TRADEMARKS.md）
├── _headers            安全与缓存响应头
├── robots.txt · sitemap.xml
scripts/
├── check.mjs           发布前检查（引用是否存在、中英配对、不含邮箱或凭据）
└── build-font.py       按页面实际用到的文字重新生成中文字体子集
wrangler.jsonc          tapenow.dev 的 Cloudflare 静态资源部署配置
```

网站是纯 HTML 和 CSS，只有一小段内联脚本负责语言切换和动画。不需要构建步骤，也没有运行时依赖。

## 本地开发

需要 Node.js 22.16 或更高版本。

```bash
npm ci
npm run dev        # 通过 wrangler 本地预览
npm run check      # 每次提交前运行
```

也可以直接用浏览器打开 `public/index.html`，但 `/brand/...` 这类绝对路径只有通过 `npm run dev` 才能正确加载。

**中文文字**：中文字体是子集，只包含页面用到的字。新增中文后，请运行 `python3 scripts/build-font.py`（需要先 `pip install fonttools brotli`）。不运行的话，新增的字会退回系统字体显示。

**内容规则**：只展示产品真实的功能和表现。不放虚构的用户数、评价或性能数据；演示内容必须标明是演示。每个中文 `<span class="zh">` 都必须有对应的英文 `<span class="en">`，`npm run check` 会自动检查。

## 部署

只通过 GitHub Actions 部署：

1. 修改 `package.json` 里的 `version`。
2. 推送对应的标签：`git tag -a vX.Y.Z -m "…" && git push origin vX.Y.Z`。
3. CI 会运行检查，执行 `wrangler deploy`，并确认首页已经上线。

维护者也可以手动运行工作流，并勾选 **deploy**。工作流需要仓库加密变量 `CLOUDFLARE_API_TOKEN` 和 `CLOUDFLARE_ACCOUNT_ID`。

## 参与贡献

欢迎就错别字、翻译、无障碍和排版问题提交 Issue 或 Pull Request。产品使用中的问题请通过[反馈表单](https://app.tapenow.dev/?feedback=1)告诉我们。安全问题请按 [SECURITY.md](SECURITY.md) 的说明私下报告。

## 许可证

本仓库的代码和文字采用 [Apache License 2.0](LICENSE)。TapeNow 名称、Logo 和品牌素材**不在**此许可范围内，详见 [TRADEMARKS.md](TRADEMARKS.md)。附带的字体采用 SIL Open Font License，许可证原文在 `public/brand/v2/fonts/`。
