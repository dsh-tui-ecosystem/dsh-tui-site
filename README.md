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

`/settings/`（设置项参考）不手写：构建时由 `scripts/sync-settings.mjs` 从 **某个确定版本** 的 dsh-tui npm 包里取出 `lib/settings.json`（schema v1），写到 `src/content/settings.generated.json`（不入库）再渲染。

**本地开发与 PR 构建**（`npm run dev` / `npm run build` / CI）按以下顺序取第一个命中的来源：

| 来源 | 用法 |
|---|---|
| 示例清单 | `DSH_TUI_SETTINGS_FIXTURE=1`：强制用 `src/content/settings.fixture.json` |
| 本地文件 | `DSH_TUI_SETTINGS_FILE=../dsh-TUI/lib/settings.json`：发版前预览本地构建结果 |
| 指定版本 | `DSH_TUI_VERSION=0.11.2`：`npm pack @deepseek-harness-tui/dsh-tui@0.11.2` 后解出 `package/lib/settings.json` |
| 钉住的版本 | `package.json` 的 `config.dshTuiVersion` |
| 兜底 | 都没有时用示例清单，页面顶部会标注「预览数据」 |

**生产构建**（部署工作流设置 `DSH_TUI_SETTINGS_PRODUCTION=1`）只用已发布的数据，示例清单和本地文件都会被拒绝。版本按 `DSH_TUI_VERSION` → `config.dshTuiVersion` → npm `latest` dist-tag 解析出的精确版本 的顺序确定。

- 「上一次部署的是哪个版本」只记在一个地方：npm 的 `latest`。发版部署（dispatch）用的就是刚发布、已成为 `latest` 的版本，之后普通的 push 部署读到的也是它，不需要回写仓库，也不会悄悄退回示例清单。
- `config.dshTuiVersion` 平时留空；只有想让线上停在某个版本（例如新版本的清单有问题）时才填，填了会覆盖 `latest`。
- 只发到 `next` 等其他 dist-tag 的预发布版本，dispatch 那一次会用它，下一次 push 部署回到 `latest`。
- 版本必须是精确的 `x.y.z`（`latest` 只在生产构建内部解析成精确版本后使用）。一旦确定了版本就不会回退：包不存在、包里没有 `lib/settings.json`、`packageVersion` 与请求的版本不一致、`schemaVersion` 不是 1，构建都会失败，线上保留上一版站点。
- **合并时机**：目前 npm `latest`（0.11.1）还不带 `lib/settings.json`，生产构建会因此失败。本改动要在第一个附带该文件的 dsh-tui 版本成为 `latest` 之后再合并。
- 分组标题与顺序取自清单的 `groups`（与 TUI 里 `/settings` 的子页一致）；某个设置项的 `group` 不在 `groups` 里时，以原始 id 作标题排在最后。页面上的设置文字全部取自清单，站点不做翻译。

### 发版自动更新

`.github/workflows/deploy.yml` 除了 push 到 `main`，还接受两种触发：

- `repository_dispatch`，类型 `dsh-tui-published`，payload `{"version": "x.y.z"}`
- 手动运行（workflow_dispatch），填写 `version` 输入

dsh-TUI 的发布流程在 `npm publish` 之后发出 dispatch 即可，需要一个对本仓库有写权限的 token（classic PAT 的 `repo` scope，或 fine-grained token 的 Contents: Read and write），存为 dsh-TUI 仓库的 secret。本仓库不需要新增任何 secret。

```sh
gh api repos/dsh-tui-ecosystem/dsh-tui-site/dispatches \
  -f event_type=dsh-tui-published \
  -f 'client_payload[version]=0.11.2'
```

dispatch 往往比 Release 资产和 registry 都快，工作流对两者都有限次等待：

- 一键安装整合包：带版本时先等 `v<version>` Release 上的 `dsh-tui-setup.zip`（60 秒间隔，最多 15 次）；等不到或没带版本时，用最近一个带该资产的正式 Release。
- 设置清单：`npm pack` 以 60 秒间隔最多重试 10 次（`DSH_TUI_PACK_RETRIES`）。

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
