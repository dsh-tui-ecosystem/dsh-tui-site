# dsh-TUI 官网

为 [dsh-TUI](https://github.com/ccch1mneyyy/dsh-TUI)（DeepSeek Harness 的 Claude Code 风格终端界面插件）制作的官方网站。

[![CI](https://github.com/dsh-tui-ecosystem/dsh-tui-site/actions/workflows/ci.yml/badge.svg)](https://github.com/dsh-tui-ecosystem/dsh-tui-site/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## 贡献

欢迎社区共同维护！本仓库由 `dsh-tui-ecosystem` 组织托管，公开协作流程：

- 任何人可 **Fork + PR** 贡献代码、文案与内容；`main` 分支受保护，需 review 后合并
- 合并到 `main` 后自动构建并部署到 <https://dshtui.com/>
- 插件收录：直接修改 [`public/plugins/plugins.json`](public/plugins/plugins.json) 提 PR，或在官网插件市场页在线提交
- 详细流程见 [CONTRIBUTING.md](CONTRIBUTING.md)

## 技术栈

- React 19 + TypeScript + Vite
- Tailwind CSS 3
- 无后端，纯静态站点

## 本地运行

```sh
npm install
npm run dev      # 开发预览
npm run build    # 构建到 dist/
```

要求 Node ^22.19 或 ≥24。

生产构建会把所有内容页预渲染为完整 HTML，并默认使用 `https://dshtui.com/` 生成绝对 canonical、`og:url` 和 `sitemap.xml`。其他部署可通过环境变量覆盖：

```sh
SITE_URL=https://example.com/ npm run build
```

## 使用指南与设置项参考

使用指南按主题拆在 `src/content/guides/` 下，每个主题一个文件，同时导出中英两版；`src/content/guides.ts` 决定导航顺序和预渲染路由。新增主题时，还要同步 `scripts/check-seo.mjs` 里的 `guideSlugs` 和 `src/i18n.tsx` 里的 `GUIDE_CARDS`。正文支持 `` `code` ``、`**粗体**`、`[链接](url)` 三种行内写法，以及表格、小标题等块（见 `src/content/guides/types.ts`）。

`/settings/`（设置项参考）不手写：构建时由 `scripts/sync-settings.mjs` 从 **某个确定版本** 的 dsh-tui npm 包里取出 `lib/settings.json`（schema v1），写到 `src/content/settings.generated.json`（不入库）再渲染。数据来源按以下顺序取第一个命中的：

| 来源 | 用法 |
|---|---|
| 示例清单 | `DSH_TUI_SETTINGS_FIXTURE=1`：强制用 `src/content/settings.fixture.json` |
| 本地文件 | `DSH_TUI_SETTINGS_FILE=../dsh-TUI/lib/settings.json`：发版前预览本地构建结果 |
| 指定版本 | `DSH_TUI_VERSION=0.11.2`：`npm pack @deepseek-harness-tui/dsh-tui@0.11.2` 后解出 `package/lib/settings.json` |
| 钉住的版本 | `package.json` 的 `config.dshTuiVersion` |
| 兜底 | 都没有时用示例清单，页面顶部会标注「预览数据」 |

- 版本必须是精确的 `x.y.z`，不接受 `latest` 等 dist-tag。
- 一旦指定了版本就不会回退到示例清单：包不存在、包里没有 `lib/settings.json`、`packageVersion` 与请求的版本不一致、`schemaVersion` 不是 1，构建都会失败，线上保留上一版站点。
- 目前还没有附带 `lib/settings.json` 的 dsh-tui 正式版本，所以 `config.dshTuiVersion` 留空，站点显示示例清单。第一个附带该文件的版本发布后，把它填进 `config.dshTuiVersion` 并提 PR。
- 分组标题（通用 / 底栏设置 / 快捷键 / 会话）由站点维护，对应 TUI 里 `/settings` 的子页 id；其余文字全部取自清单本身，站点不做翻译。

## 特性

- 亮 / 暗双模式（默认亮色，选择记忆在浏览器 localStorage）
- 首屏仿真终端动画：复刻 TUI 真实界面（像素鲸鱼顶栏、双流光大字、黄色用户条、斜体 Thinking、三行状态栏），配色跟随主题切换
- 全站响应式：桌面双栏，移动端单栏
- 所有截图素材位于 `public/shots/`

## SEO 与部署

- 构建会预渲染中文、英文首页与 22 个指南页面（11 个主题 × 中英），并把插件市场数据预渲染成可直接抓取的 HTML。
- 全站主名称写作 `dsh-TUI`。`DSHTUI`、`dsh-tui`、`DSH TUI` 等别名放在可见 FAQ、`llms.txt` 和 JSON-LD `alternateName` 里，不堆进每个页面标题。
- 每个内容页都有唯一 title、description、canonical、Open Graph、Twitter Card、双向 `hreflang` 和 JSON-LD；指南页另有面包屑与 TechArticle 数据。
- 构建会自动生成包含全部 canonical 页面和语言关系的 `sitemap.xml`，并在 `robots.txt` 中保持唯一 Sitemap 声明。
- `public/llms.txt` 为 AI 搜索与回答引擎提供项目身份、名称关系、安装方式和权威链接。
- `npm run build` 最后会运行产物级 SEO 检查，包括品牌词、结构化数据、站点地图、robots、插件静态内容和本地资源完整性。
- 可在 GitHub Actions Secrets 中配置 `GOOGLE_SITE_VERIFICATION`、`BING_SITE_VERIFICATION`、`BAIDU_SITE_VERIFICATION`，部署时自动注入对应站长平台验证标签；不要把验证 token 直接提交到仓库。
- `public/_headers` 提供适用于支持 `_headers` 规则的静态托管平台的长期资源缓存配置。
- `deploy/nginx.conf.example` 提供 Nginx 的缓存、gzip 与 404 配置示例。
- 上线后仍需在 Google Search Console、Bing Webmaster Tools 和百度搜索资源平台验证域名、提交 `https://dshtui.com/sitemap.xml`，并请求重新抓取首页；代码优化本身不能保证特定关键词排名。
