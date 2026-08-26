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

## 特性

- 亮 / 暗双模式（默认亮色，选择记忆在浏览器 localStorage）
- 首屏仿真终端动画：复刻 TUI 真实界面（像素鲸鱼顶栏、双流光大字、黄色用户条、斜体 Thinking、三行状态栏），配色跟随主题切换
- 全站响应式：桌面双栏，移动端单栏
- 所有截图素材位于 `public/shots/`

## SEO 与部署

- 构建会预渲染中文、英文首页与 12 个主题页面，并把插件市场数据预渲染成可直接抓取的 HTML。
- 全站围绕 `dsh-TUI` 主名称以及 `DSHTUI`、`dsh-tui`、`DSH TUI`、`DSH` 相关别名建立一致的可见文案、页面标题和结构化数据。
- 每个内容页都有唯一 title、description、canonical、Open Graph、Twitter Card、双向 `hreflang` 和 JSON-LD；指南页另有面包屑与 TechArticle 数据。
- 构建会自动生成包含全部 canonical 页面和语言关系的 `sitemap.xml`，并在 `robots.txt` 中保持唯一 Sitemap 声明。
- `public/llms.txt` 为 AI 搜索与回答引擎提供项目身份、名称关系、安装方式和权威链接。
- `npm run build` 最后会运行产物级 SEO 检查，包括品牌词、结构化数据、站点地图、robots、插件静态内容和本地资源完整性。
- 可在 GitHub Actions Secrets 中配置 `GOOGLE_SITE_VERIFICATION`、`BING_SITE_VERIFICATION`、`BAIDU_SITE_VERIFICATION`，部署时自动注入对应站长平台验证标签；不要把验证 token 直接提交到仓库。
- `public/_headers` 提供适用于支持 `_headers` 规则的静态托管平台的长期资源缓存配置。
- `deploy/nginx.conf.example` 提供 Nginx 的缓存、gzip 与 404 配置示例。
- 上线后仍需在 Google Search Console、Bing Webmaster Tools 和百度搜索资源平台验证域名、提交 `https://dshtui.com/sitemap.xml`，并请求重新抓取首页；代码优化本身不能保证特定关键词排名。
