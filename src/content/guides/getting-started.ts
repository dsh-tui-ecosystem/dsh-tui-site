import { type GuideTopic, code, ol, p, repoFile, ul } from './types'

const topic: GuideTopic = {
  zh: {
    slug: 'getting-started',
    locale: 'zh-CN',
    navTitle: '安装与快速开始',
    title: 'dsh-TUI 安装与快速开始',
    description: '安装 dsh-TUI 的完整指南：环境要求、npm 安装、首次启动、恢复会话、更新方式与常见问题。',
    intro: '从准备运行环境到进入第一个 DeepSeek Harness TUI 会话，这里集中说明安装、启动、首次启动看到的界面和日常更新所需的步骤。',
    sections: [
      {
        heading: '运行环境要求',
        paragraphs: ['dsh-TUI 是 DeepSeek Harness 的终端界面插件，需要真实终端 TTY。推荐使用支持现代终端能力的 Windows Terminal、iTerm2、kitty、WezTerm、Ghostty 或常见 Linux 终端。'],
        bullets: ['Node.js ^22.19 或 24 及以上版本', 'pnpm 10 或更高版本', '官方 @deepseek-ai/dsh CLI', '运行模型所需的 DEEPSEEK_API_KEY'],
      },
      {
        heading: '整合包安装（新手推荐）',
        paragraphs: ['不会敲命令？从官网首页下载整合包，解压后双击 install.bat（macOS / Linux 运行 sh install.sh）。脚本会自动检查并安装 Node.js（Windows 下通过 winget）、pnpm、官方 dsh CLI 与 dsh-TUI，并引导配置 DEEPSEEK_API_KEY，全程只需按几次回车。'],
        bullets: ['官网直链：https://dshtui.com（国内可直接访问）', 'GitHub 镜像：ccch1mneyyy/dsh-TUI Releases 的 dsh-tui-setup.zip', 'npm 官方源失败时脚本自动切换 npmmirror 镜像'],
      },
      {
        heading: 'npm 安装与启动',
        blocks: [
          p('全局安装官方 CLI 与 dsh-TUI 插件。插件自带 `dsh-tui` 直达命令，不需要手动修改 DSH 核心文件；首次运行会自动初始化 `dsh-tui` profile（需要 pnpm）。'),
          code('# 全局安装 CLI + 本插件\nnpm install -g @deepseek-ai/dsh @deepseek-harness-tui/dsh-tui\n\n# 启动\ndsh-tui'),
          ul(
            '`dsh-tui --resume`：恢复上次会话；Windows 也可用仓库里的 `dsh-tui.cmd`（等价）。',
            '`dsh-tui safe`：安全模式——只读查看环境、列出 profile 插件并给出修复建议，还能创建干净的救援 profile（见[安全模式](../interface/#safe-mode)）。',
            '`dsh --profile dsh-tui`：与 `dsh-tui` 等价的手工启动方式（`/update` 仅此方式可用）。',
            '运行模型需要 `DEEPSEEK_API_KEY`；环境自检用 `/doctor`。',
            `主验证的 dsh 引擎版本是 \`0.1.7-rc.2\`；兼容列表以 [ADAPTER.md](${repoFile('ADAPTER.md')}) 为准。如果 logo 页出现 ⚠ 版本漂移警告，按提示执行 \`npm i -g @deepseek-ai/dsh@<版本>\` 对齐 dsh 引擎。`,
          ),
        ],
      },
      {
        heading: '首次启动你会看到',
        blocks: [
          ol(
            '**像素鲸鱼顶栏**（约 3.4 秒开场动画，之后定格）：`✦ dsh-TUI` 版本号、`DEEPSEEK / HARNESS` 大字、当前模型与 effort、工作目录，及一行**启动提示**（`/model` · `/help` · `Tab` 补全）；终端变窄时按阶梯降级（见[界面与状态栏](../interface/#header)）。dsh 引擎版本不在验证范围时会出现 **⚠ 版本漂移警告**及对齐命令。',
            '**底部状态栏**：工作状态行、上下文进度条、TPS 仪表与各类实时指标（见[底部状态栏](../interface/#status-bar)）。',
            '**启动提示行**：Logo 下方固定一行 `提示：<随机小技巧> · /tips 更多技巧`，每次启动随机换一条；`/tips` 打开完整技巧面板（`↑/↓` 滚动、`Esc` 关闭）。',
            '**第一次普通启动**（没带 `--resume`、没指定工作区、也没带首条提示词）进入**会话管理界面**先挑工作区，离开后 `~/.dsh-tui/home.json` 记下「已看过」，以后启动直接进对话；界面随时可用 `/resume`、`/home`、`/agentview`、`/bg` 或输入框行首 `⌸` 打开。',
            '输入 `/` 看命令菜单，按 `?` 看快捷键帮助。',
          ),
        ],
      },
      {
        heading: '核心心智模型',
        blocks: [
          ul(
            '命令都可用 **Tab 补全**（带参数时先输入 `/命令 ` 再 Tab）。',
            '非命令输入就是普通对话；**未知命令会作为普通消息发给模型**。',
          ),
        ],
      },
      {
        heading: '更新与故障排查',
        paragraphs: ['TUI 会在后台检查 npm 新版本，发现更新后可输入 /update 自动更新并重启恢复会话。若启动失败，先确认 Node、pnpm 和 dsh 命令均能在当前终端中执行。'],
        bullets: ['使用 node --version 与 pnpm --version 核对版本', '使用 /doctor 检查环境和配置', '确认 API Key 已注入当前 Shell', 'Windows 下优先使用 Windows Terminal 或 PowerShell 7'],
        blocks: [p('dsh 意外退出时，用 `dsh-tui safe` 进入[安全模式与救援 profile](../interface/#safe-mode)。')],
      },
    ],
  },
  en: {
    slug: 'getting-started',
    locale: 'en',
    navTitle: 'Getting started',
    title: 'Install and Start dsh-TUI',
    description: 'Complete dsh-TUI installation guide covering requirements, npm setup, first launch, session resume, updates, and troubleshooting.',
    intro: 'Everything required to open your first DeepSeek Harness session in the dsh-TUI terminal interface: install, launch, what the first screen shows, and how updates work.',
    sections: [
      {
        heading: 'Requirements',
        paragraphs: ['dsh-TUI runs in a real terminal TTY. A modern terminal such as Windows Terminal, iTerm2, kitty, WezTerm, Ghostty, or a common Linux terminal is recommended.'],
        bullets: ['Node.js ^22.19 or version 24 and newer', 'pnpm 10 or newer', 'The official @deepseek-ai/dsh CLI', 'A DEEPSEEK_API_KEY for model access'],
      },
      {
        heading: 'Installer bundle (recommended)',
        paragraphs: ['Prefer not to type commands? Download the bundle from the homepage, extract it, and double-click install.bat (or run sh install.sh on macOS / Linux). The script checks and installs Node.js (winget on Windows), pnpm, the official dsh CLI, and dsh-TUI, then guides you through the DEEPSEEK_API_KEY — just press Enter a few times.'],
        bullets: ['Direct link: https://dshtui.com (accessible in mainland China)', 'GitHub mirror: dsh-tui-setup.zip in ccch1mneyyy/dsh-TUI Releases', 'Falls back to the npmmirror registry when the npm official source fails'],
      },
      {
        heading: 'Install from npm and launch',
        blocks: [
          p('Install the official CLI and the TUI plugin globally. The plugin ships its own `dsh-tui` command and needs no edits to the DSH core; the first run initializes the `dsh-tui` profile automatically (this needs pnpm).'),
          code('# Install the CLI + this plugin\nnpm install -g @deepseek-ai/dsh @deepseek-harness-tui/dsh-tui\n\n# Start\ndsh-tui'),
          ul(
            '`dsh-tui --resume`: resume the last session. On Windows you can also use `dsh-tui.cmd` from the repo (equivalent).',
            '`dsh-tui safe`: safe mode — read-only environment view, lists profile plugins, suggests fixes, and can create a clean rescue profile (see [safe mode](../interface/#safe-mode)).',
            '`dsh --profile dsh-tui`: manual launch, equivalent to `dsh-tui` (`/update` only works this way).',
            'Running a model needs `DEEPSEEK_API_KEY`. Run `/doctor` to check the environment.',
            `The primary verified dsh engine version is \`0.1.7-rc.2\`; see [ADAPTER.md](${repoFile('ADAPTER.md')}) for the compatibility lines. If the logo page shows a ⚠ version-drift warning, align the engine with \`npm i -g @deepseek-ai/dsh@<version>\`.`,
          ),
        ],
      },
      {
        heading: 'What you see on first launch',
        blocks: [
          ol(
            '**Pixel whale header** (~3.4 s intro animation, then frozen): `✦ dsh-TUI` version, `DEEPSEEK / HARNESS` big text, current model and effort, working directory, and a **startup hint** (`/model` · `/help` · `Tab`). Narrow terminals climb down a ladder (see [UI and status bar](../interface/#header)). When the dsh engine is out of the verified range, a **⚠ version-drift warning** appears with the align command.',
            '**Bottom status bar**: working-status row, context bar, TPS gauge, and other live indicators (see [the status bar](../interface/#status-bar)).',
            '**Startup hint line**: one fixed line under the logo with a random tip and a pointer to `/tips` — it changes each launch. `/tips` opens the full tips panel (`↑/↓` scroll, `Esc` close).',
            '**First normal launch** (no `--resume`, no workspace, no prompt) enters the **session manager** to pick a workspace. `~/.dsh-tui/home.json` records "seen" so later launches go straight to chat. Open it any time with `/resume`, `/home`, `/agentview`, `/bg`, or `⌸` at the start of the input line.',
            'Type `/` for the command menu, `?` for the shortcut help.',
          ),
        ],
      },
      {
        heading: 'Core mental model',
        blocks: [
          ul(
            'Every command supports **Tab completion** (for commands with arguments, type `/command ` first, then Tab).',
            'Non-command input is a normal message. **Unknown commands are sent to the model as plain messages**.',
          ),
        ],
      },
      {
        heading: 'Updates and troubleshooting',
        paragraphs: ['When an npm update is found, run /update to upgrade and restart into the current session. If startup fails, verify that Node.js, pnpm, dsh, and the API key are available in the current shell.'],
        bullets: ['Check versions with node --version and pnpm --version', 'Run /doctor for environment diagnostics', 'Verify the API key in the active shell', 'Prefer Windows Terminal or PowerShell 7 on Windows'],
        blocks: [p('If dsh exits unexpectedly, run `dsh-tui safe` for [safe mode and the rescue profile](../interface/#safe-mode).')],
      },
    ],
  },
}

export default topic
