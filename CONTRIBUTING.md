# 贡献指南

欢迎一起来维护 dsh-TUI 官网！本仓库由 `dsh-tui-ecosystem` 组织托管，任何形式的贡献（修 bug、加功能、改文案、收录插件）都欢迎。

## 快速开始

```sh
# 需要 Node ^22.19 或 ≥24，以及 bun（https://bun.sh）
bun install
bun run dev        # 本地开发，http://localhost:3000
bun run lint       # ESLint 检查
bun run build      # 生产构建（含预渲染与 SEO 检查）
```

依赖由 `bun.lock` 锁定，CI 用 `bun install --frozen-lockfile`。改动依赖后记得把 `bun.lock` 一起提交。

## 提 PR 的流程

1. **Fork** 本仓库，从 `main` 切一个分支：`git checkout -b feat/xxx`
2. 完成改动，本地跑通 `bun run lint` 和 `bun run build`
3. 推送分支，向 `main` 提 Pull Request
4. 描述清楚改了什么、为什么；视觉改动请附截图
5. CI 自动跑 lint + 构建，通过后等待核心维护者 review 合并

> 注意：`main` 分支受保护，任何改动（包括维护者）都必须走 PR 并至少 1 人 review。

## 插件收录（plugins.json）

插件市场数据在 [`public/plugins/plugins.json`](public/plugins/plugins.json)，通过两种方式收录：

- **PR 直达**：直接修改 `plugins.json` 提 PR，自动校验通过后合并
- **在线提交**：官网插件市场页在线表单提交，经审批后由维护者同步更新

收录字段：`name`（唯一标识）、`displayName`、`description`（一句话简介）、`author`、`repo`（仓库链接）、`npm`（可选）、`tags`（标签）、`kind`（`core` / `plugin` / `template`）。不要收录无法验证来源或明显侵权的内容。

## 不要提交的东西

- 任何密钥、token、Cookie（`.local/`、`.wrangler/` 等本地目录严禁入库）
- 构建产物（`dist/`、`.ssr/`，已在 .gitignore 中排除）
- 未经授权的截图素材

## 分支与发布

- `main`：正式分支，合并后自动部署到 https://dshtui.com/
- 发布由 GitHub Actions 完成：合并到 `main` → CI 构建 → Cloudflare Pages 部署

有任何疑问，开 Issue 或到 [GitHub Discussions](https://github.com/dsh-tui-ecosystem/dsh-tui-site/discussions) 讨论。
