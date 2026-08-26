export type SiteLocale = 'zh-CN' | 'en'

export interface GuideSection {
  heading: string
  paragraphs?: string[]
  bullets?: string[]
  code?: string
}

export interface GuidePageData {
  slug: string
  locale: SiteLocale
  navTitle: string
  title: string
  description: string
  intro: string
  sections: GuideSection[]
}

const zh: GuidePageData[] = [
  {
    slug: 'getting-started',
    locale: 'zh-CN',
    navTitle: '安装与快速开始',
    title: 'dsh-TUI 安装与快速开始',
    description: '安装 dsh-TUI 的完整指南：环境要求、npm 安装、首次启动、恢复会话、更新方式与常见问题。',
    intro: '从准备运行环境到进入第一个 DeepSeek Harness TUI 会话，这里集中说明安装、启动和日常更新所需的步骤。',
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
        heading: 'npm 一键安装',
        paragraphs: ['全局安装官方 CLI 与 dsh-TUI 插件。插件会提供 dsh-tui 直达命令，不需要手动修改 DSH 核心文件。'],
        code: 'npm install -g @deepseek-ai/dsh @deepseek-harness-tui/dsh-tui',
      },
      {
        heading: '首次启动与会话恢复',
        paragraphs: ['首次运行会自动初始化 dsh-tui profile。后续可以直接启动新会话，或使用 --resume 恢复上一次会话。'],
        code: 'dsh-tui\n\n# 恢复最近会话\ndsh-tui --resume',
      },
      {
        heading: '更新与故障排查',
        paragraphs: ['TUI 会在后台检查 npm 新版本，发现更新后可输入 /update 自动更新并重启恢复会话。若启动失败，先确认 Node、pnpm 和 dsh 命令均能在当前终端中执行。'],
        bullets: ['使用 node --version 与 pnpm --version 核对版本', '使用 /doctor 检查环境和配置', '确认 API Key 已注入当前 Shell', 'Windows 下优先使用 Windows Terminal 或 PowerShell 7'],
      },
    ],
  },
  {
    slug: 'features',
    locale: 'zh-CN',
    navTitle: '功能特性',
    title: 'dsh-TUI 功能特性',
    description: '了解 dsh-TUI 的终端交互、实时 Agent 状态、会话工作流、长会话性能和 DeepSeek Harness 能力接入。',
    intro: 'dsh-TUI 不只是视觉主题，而是一套围绕编码 Agent 工作流设计的全屏终端交互层。',
    sections: [
      {
        heading: '终端原生交互',
        paragraphs: ['支持流式 Markdown、结构化工具卡、命令与文件补全、消息历史搜索和选择。@ 文件引用可以出现在消息任意位置，发送时自动附加文件内容或目录信息。'],
        bullets: ['inline 与 alternate-screen 两种渲染模式', '命令和文件路径自动补全', '中英文界面切换', '文本、文件与图片路径粘贴'],
      },
      {
        heading: '可观察的 Agent 状态',
        paragraphs: ['状态区会展示实时工作活动、上下文占用、TPS、缓存命中率、推理等级、输入输出 token、Git 分支与会话信息，帮助用户判断 Agent 是否仍在工作以及资源消耗情况。'],
      },
      {
        heading: '完整会话工作流',
        paragraphs: ['通过 /new、/resume、/compact、/export 和 /btw 管理会话；双击 Esc 可以发起 rewind / fork，从历史消息位置继续探索另一条路径。'],
      },
      {
        heading: '长会话性能设计',
        paragraphs: ['事件驱动投影、差分终端输出、消息虚拟化、回放合并和有界缓存共同控制渲染成本，使屏幕外的消息子树不参与布局。'],
      },
    ],
  },
  {
    slug: 'commands',
    locale: 'zh-CN',
    navTitle: '命令参考',
    title: 'dsh-TUI Slash Commands 命令参考',
    description: 'dsh-TUI 斜杠命令参考，涵盖会话、模型、状态、账号策略、技能、MCP、Goals 与开发辅助命令。',
    intro: '在输入框键入 / 即可打开命令菜单。所有本地命令都通过 DeepSeek Harness 官方服务或插件注册表执行。',
    sections: [
      { heading: '会话管理', paragraphs: ['/new 创建新会话，/resume 恢复历史会话，/rename 重命名，/clear 清理显示，/compact 压缩上下文，/export 导出 Markdown，/trace 查看轨迹时间线。'] },
      { heading: '状态与模型', paragraphs: ['/status、/cost、/doctor 和 /config 用于查看会话、token、环境与配置；/model、/thinking、/tokens、/theme 和 /lang 控制模型及界面行为。'] },
      { heading: '账号、策略与扩展', paragraphs: ['/login、/logout、/permissions、/add-dir、/hooks、/mcp 和 /memory 提供凭证状态、权限边界、目录范围及扩展连接信息。'] },
      { heading: '技能与开发辅助', paragraphs: ['/audit、/bug、/review、/practice、/pr_comments、/release-notes 和 /vuln-check 连接相应技能；/agents、/update、/terminal-setup、/help 与 /exit 负责代理、更新和终端生命周期。'] },
    ],
  },
  {
    slug: 'shortcuts',
    locale: 'zh-CN',
    navTitle: '快捷键',
    title: 'dsh-TUI 快捷键与终端操作',
    description: 'dsh-TUI 键盘快捷键、鼠标操作、macOS 修饰键与终端兼容性说明。',
    intro: '快捷键围绕终端肌肉记忆设计。支持扩展键盘协议的终端可在 macOS 上同时使用 Command 组合键。',
    sections: [
      { heading: '输入与执行', bullets: ['Enter 发送，Shift+Enter 换行', 'Ctrl+C 中断当前回合，空闲时连续按两次退出', 'Tab 补全命令与 @ 文件路径', 'Ctrl+V 粘贴文本或文件路径'] },
      { heading: '浏览与会话', bullets: ['Ctrl+O 展开或收起思考、工具参数和输出', 'Ctrl+R 搜索历史消息', '/ 进入会话全文搜索，n / N 跳转', '空输入时双击 Esc 发起时间回溯'] },
      { heading: '鼠标与选择', paragraphs: ['全屏模式支持滚轮浏览、拖拽选择、双击选词和三击选行。选区可以通过 OSC 52 或系统剪贴板工具复制。'] },
      { heading: '终端兼容性', paragraphs: ['iTerm2、kitty、WezTerm、Ghostty 和 tmux 等终端可提供更完整的扩展键盘支持。macOS Terminal.app 会消费部分 Command 快捷键，此时继续使用 Ctrl 组合键。'] },
    ],
  },
  {
    slug: 'architecture',
    locale: 'zh-CN',
    navTitle: '架构与安全',
    title: 'dsh-TUI 架构、性能与\u200b安全边界',
    description: '了解 dsh-TUI 的 Cordis 插件挂载、事件投影、终端渲染、长会话虚拟化以及安全边界。',
    intro: 'dsh-TUI 只负责交互和呈现。会话日志、模型调用、工具执行、fork、compaction 和持久化仍由 DeepSeek Harness 服务拥有。',
    sections: [
      { heading: '插件挂载链路', code: 'dsh profile\n  → dsh-base\n  → dsh-TUI Cordis patch\n  → Agent preset + DSH services\n  → session / event\n  → Channel projection\n  → React components\n  → Ink / Yoga renderer\n  → terminal' },
      { heading: '事件驱动渲染', paragraphs: ['session/event 事件流被投影为增量界面状态，终端输出只提交差分，滚动和选区状态独立维护。'] },
      { heading: '布局级虚拟化', paragraphs: ['屏幕外消息行使用测量高度占位符，其子树不参与 Yoga 布局，使长会话每帧成本接近 O(可视窗口)。'] },
      { heading: '安全边界', paragraphs: ['dsh-TUI 不实现独立沙箱，而是沿用当前 DSH profile 的文件、Shell、sandbox 与 approval 策略。在包含敏感凭证或不可信代码的环境中运行前，应检查 profile 配置。'] },
    ],
  },
  {
    slug: 'faq',
    locale: 'zh-CN',
    navTitle: '常见问题',
    title: 'dsh-TUI 常见问题',
    description: 'dsh-TUI 常见问题：DSHTUI、dsh-tui 与 DSH 的名称关系，以及安装、平台、会话恢复、更新和终端兼容性。',
    intro: '集中回答 dsh-TUI（DSHTUI）名称、安装和使用时最常见的问题。',
    sections: [
      { heading: 'dsh-TUI 是什么？', paragraphs: ['它是 DeepSeek Harness 的 Claude Code 风格全屏终端界面插件，提供终端交互、结构化工具展示、实时 Agent 状态和完整会话工作流。'] },
      { heading: 'DSHTUI、dsh-tui 和 DSH 分别指什么？', paragraphs: ['dsh-TUI 是项目的标准写法；DSHTUI、dsh-tui、DSH TUI 都指同一个项目。DSH 是底层 DeepSeek Harness 的简称。'] },
      { heading: '会修改 DeepSeek Harness 核心吗？', paragraphs: ['不会。它通过 Cordis patch 作为插件挂载，卸载后不会留下核心补丁。'] },
      { heading: '支持哪些系统？', paragraphs: ['支持 Windows、macOS 和 Linux。终端对扩展键盘、OSC 52 和系统剪贴板的支持程度可能不同。'] },
      { heading: '如何恢复和更新？', paragraphs: ['使用 dsh-tui --resume 恢复最近会话；收到更新提示后输入 /update 自动升级并重启恢复。'] },
      { heading: '为什么部分快捷键无效？', paragraphs: ['先确认终端是否支持扩展键盘协议。macOS Terminal.app 会消费部分 Command 组合键，可以改用 Ctrl 或切换到 iTerm2、kitty、WezTerm、Ghostty。'] },
    ],
  },
]

const en: GuidePageData[] = [
  {
    slug: 'getting-started', locale: 'en', navTitle: 'Getting started', title: 'Install and Start dsh-TUI',
    description: 'Complete dsh-TUI installation guide covering requirements, npm setup, first launch, session resume, updates, and troubleshooting.',
    intro: 'Everything required to open your first DeepSeek Harness session in the dsh-TUI terminal interface.',
    sections: [
      { heading: 'Requirements', paragraphs: ['dsh-TUI runs in a real terminal TTY. A modern terminal such as Windows Terminal, iTerm2, kitty, WezTerm, Ghostty, or a common Linux terminal is recommended.'], bullets: ['Node.js ^22.19 or version 24 and newer', 'pnpm 10 or newer', 'The official @deepseek-ai/dsh CLI', 'A DEEPSEEK_API_KEY for model access'] },
      { heading: 'Installer bundle (recommended)', paragraphs: ['Prefer not to type commands? Download the bundle from the homepage, extract it, and double-click install.bat (or run sh install.sh on macOS / Linux). The script checks and installs Node.js (winget on Windows), pnpm, the official dsh CLI, and dsh-TUI, then guides you through the DEEPSEEK_API_KEY — just press Enter a few times.'], bullets: ['Direct link: https://dshtui.com (accessible in mainland China)', 'GitHub mirror: dsh-tui-setup.zip in ccch1mneyyy/dsh-TUI Releases', 'Falls back to the npmmirror registry when the npm official source fails'] },
      { heading: 'Install from npm', paragraphs: ['Install the official CLI and the TUI plugin globally. The package provides the dsh-tui command and does not require edits to the DSH core.'], code: 'npm install -g @deepseek-ai/dsh @deepseek-harness-tui/dsh-tui' },
      { heading: 'Start or resume a session', paragraphs: ['The first run initializes the dsh-tui profile automatically. Use --resume to reopen the latest session.'], code: 'dsh-tui\n\n# Resume the latest session\ndsh-tui --resume' },
      { heading: 'Updates and troubleshooting', paragraphs: ['When an npm update is found, run /update to upgrade and restart into the current session. If startup fails, verify that Node.js, pnpm, dsh, and the API key are available in the current shell.'], bullets: ['Check versions with node --version and pnpm --version', 'Run /doctor for environment diagnostics', 'Verify the API key in the active shell', 'Prefer Windows Terminal or PowerShell 7 on Windows'] },
    ],
  },
  {
    slug: 'features', locale: 'en', navTitle: 'Features', title: 'dsh-TUI Features',
    description: 'Explore dsh-TUI terminal interaction, observable agent status, session workflows, long-session performance, and DeepSeek Harness integration.',
    intro: 'dsh-TUI is a complete terminal interaction layer designed around coding-agent workflows, not only a visual theme.',
    sections: [
      { heading: 'Terminal-native interaction', paragraphs: ['Stream Markdown, inspect structured tool cards, complete commands and file paths, search message history, and attach files with @ references anywhere in a message.'], bullets: ['Inline and alternate-screen rendering', 'Command and file completion', 'Chinese and English interface modes', 'Text, file, and image-path paste support'] },
      { heading: 'Observable agent status', paragraphs: ['The status area exposes activity, context usage, TPS, cache hit rate, reasoning level, token counts, Git branch, and session details.'] },
      { heading: 'Complete session workflow', paragraphs: ['Create, resume, compact, export, and branch sessions. Double-tap Escape on an empty prompt to rewind and fork from an earlier message.'] },
      { heading: 'Built for long sessions', paragraphs: ['Event projection, differential terminal output, message virtualization, replay merging, and bounded caches keep rendering cost tied to the visible window.'] },
    ],
  },
  {
    slug: 'commands', locale: 'en', navTitle: 'Commands', title: 'dsh-TUI Slash Command Reference',
    description: 'Reference for dsh-TUI session, model, status, policy, skills, MCP, Goals, and developer slash commands.',
    intro: 'Type / in the prompt to open the command menu. Local commands use official DeepSeek Harness services or plugin registries.',
    sections: [
      { heading: 'Session commands', paragraphs: ['/new creates a session; /resume reopens one; /rename changes its label; /clear resets the display; /compact reduces context; /export writes Markdown; and /trace opens the activity timeline.'] },
      { heading: 'Status and model commands', paragraphs: ['/status, /cost, /doctor, and /config inspect the session and environment. /model, /thinking, /tokens, /theme, and /lang control model and interface behavior.'] },
      { heading: 'Accounts, policy, and extensions', paragraphs: ['/login, /logout, /permissions, /add-dir, /hooks, /mcp, and /memory describe credentials, boundaries, working directories, and extensions.'] },
      { heading: 'Skills and utilities', paragraphs: ['/audit, /bug, /review, /practice, /pr_comments, /release-notes, and /vuln-check connect specialized skills. /agents, /update, /terminal-setup, /help, and /exit manage the runtime.'] },
    ],
  },
  {
    slug: 'shortcuts', locale: 'en', navTitle: 'Shortcuts', title: 'dsh-TUI Keyboard Shortcuts',
    description: 'dsh-TUI keyboard shortcuts, mouse controls, macOS modifiers, clipboard behavior, and terminal compatibility.',
    intro: 'The keybindings follow common terminal habits. Terminals with extended keyboard protocols can also expose Command shortcuts on macOS.',
    sections: [
      { heading: 'Input and execution', bullets: ['Enter sends; Shift+Enter inserts a newline', 'Ctrl+C interrupts; press twice while idle to exit', 'Tab completes commands and @ file paths', 'Ctrl+V pastes text or file paths'] },
      { heading: 'Navigation and sessions', bullets: ['Ctrl+O expands thinking and tool details', 'Ctrl+R searches prompt history', '/ opens full-session search; n and N navigate matches', 'Double-tap Escape on an empty prompt to rewind'] },
      { heading: 'Mouse selection', paragraphs: ['Fullscreen mode supports wheel scrolling, drag selection, double-click word selection, and triple-click line selection. OSC 52 or native clipboard tools copy the selection.'] },
      { heading: 'Terminal compatibility', paragraphs: ['iTerm2, kitty, WezTerm, Ghostty, and tmux provide the most complete extended-keyboard experience. Terminal.app consumes some Command shortcuts, so use Ctrl there.'] },
    ],
  },
  {
    slug: 'architecture', locale: 'en', navTitle: 'Architecture', title: 'dsh-TUI Architecture and Security Boundaries',
    description: 'Understand dsh-TUI Cordis mounting, event projection, terminal rendering, long-session virtualization, and security boundaries.',
    intro: 'dsh-TUI owns interaction and presentation. DeepSeek Harness services continue to own session logs, model calls, tools, forks, compaction, and persistence.',
    sections: [
      { heading: 'Plugin mounting pipeline', code: 'dsh profile\n  → dsh-base\n  → dsh-TUI Cordis patch\n  → Agent preset + DSH services\n  → session / event\n  → Channel projection\n  → React components\n  → Ink / Yoga renderer\n  → terminal' },
      { heading: 'Event-driven rendering', paragraphs: ['The session/event stream is projected into incremental UI state. Terminal output is differential while scrolling and selection remain independent.'] },
      { heading: 'Layout-level virtualization', paragraphs: ['Off-screen messages become measured-height placeholders and their child trees leave Yoga layout, keeping per-frame work close to O(visible window).'] },
      { heading: 'Security boundary', paragraphs: ['dsh-TUI does not implement a separate sandbox. It inherits file, shell, sandbox, and approval policy from the active DSH profile. Review that profile before opening untrusted code or credential-rich environments.'] },
    ],
  },
  {
    slug: 'faq', locale: 'en', navTitle: 'FAQ',     title: 'dsh-TUI Frequently Asked Questions',
    description: 'Answers about the DSHTUI, dsh-tui, and DSH names, plus requirements, platforms, session recovery, updates, and terminal compatibility.',
    intro: 'Answers to common questions about the dsh-TUI (DSHTUI) name, installation, and use.',
    sections: [
      { heading: 'What is dsh-TUI?', paragraphs: ['It is a Claude Code-style fullscreen terminal interface plugin for DeepSeek Harness, with structured tool output, observable agent status, and complete session workflows.'] },
      { heading: 'What do DSHTUI, dsh-tui, and DSH mean?', paragraphs: ['dsh-TUI is the styled project name; DSHTUI, dsh-tui, and DSH TUI all refer to the same project. DSH abbreviates the underlying DeepSeek Harness.'] },
      { heading: 'Does it modify the DSH core?', paragraphs: ['No. It mounts through a Cordis patch and leaves no core patch behind when removed.'] },
      { heading: 'Which operating systems are supported?', paragraphs: ['Windows, macOS, and Linux are supported. Extended keyboard, OSC 52, and clipboard capabilities vary by terminal.'] },
      { heading: 'How do resume and updates work?', paragraphs: ['Run dsh-tui --resume to reopen the latest session. When an update is available, /update upgrades the package and restarts into the session.'] },
      { heading: 'Why does a shortcut not work?', paragraphs: ['Check whether the terminal supports extended keyboard protocols. On macOS Terminal.app, use Ctrl or switch to iTerm2, kitty, WezTerm, or Ghostty.'] },
    ],
  },
]

export const GUIDE_PAGES = [...zh, ...en]

export function guidePath(page: GuidePageData) {
  return page.locale === 'en' ? `/en/${page.slug}/` : `/${page.slug}/`
}

export function getGuidePage(path: string) {
  return GUIDE_PAGES.find((page) => guidePath(page) === path)
}
