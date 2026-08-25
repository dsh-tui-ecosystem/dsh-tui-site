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
bun install
bun run dev      # 开发预览
bun run build    # 构建到 dist/
```

要求 Node ^22.19 或 ≥24，包管理与脚本运行用 [bun](https://bun.sh)。

生产构建会把首页预渲染为完整 HTML。部署时建议提供正式站点 URL，以生成绝对 canonical、`og:url` 和 `sitemap.xml`：

```sh
SITE_URL=https://example.com/ bun run build
```

## 特性

- 亮 / 暗双模式（默认亮色，选择记忆在浏览器 localStorage）
- 首屏仿真终端动画：复刻 TUI 真实界面（像素鲸鱼顶栏、双流光大字、黄色用户条、斜体 Thinking、三行状态栏），配色跟随主题切换
- 全站响应式：桌面双栏，移动端单栏
- 所有截图素材位于 `public/shots/`

## SEO 与部署

- 构建会预渲染中文、英文首页与 12 个主题页面，并运行产物级 SEO 检查。
- 设置 `SITE_URL` 后会生成绝对 canonical、`hreflang`、`og:url` 与包含全部路由的 `sitemap.xml`。
- `public/_headers` 提供适用于支持 `_headers` 规则的静态托管平台的长期资源缓存配置。
- `deploy/nginx.conf.example` 提供 Nginx 的缓存、gzip 与 404 配置示例。
- 上线后应通过搜索引擎的 URL 检查工具核对渲染 HTML、canonical、语言版本和 Core Web Vitals。
