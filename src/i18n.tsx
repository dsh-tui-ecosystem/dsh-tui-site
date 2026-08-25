import { createContext, useContext, type ReactNode } from 'react'

export type Lang = 'zh' | 'en'

export interface Pair {
  zh: string
  en: string
}

const LangContext = createContext<Lang>('zh')

export function LangProvider({ lang, children }: { lang: Lang; children: ReactNode }) {
  return <LangContext.Provider value={lang}>{children}</LangContext.Provider>
}

export function useLang(): Lang {
  return useContext(LangContext)
}

/** 返回一个取词函数：t(pair) 按当前语言取 zh / en */
export function useT() {
  const lang = useLang()
  return (pair: Pair): string => pair[lang]
}

/** 扁平词典：独立文案 */
export const strings = {
  'notfound.kicker': { zh: '404 · 页面没有找到', en: '404 · Page not found' },
  'notfound.title': { zh: '页面没有找到', en: 'Page not found' },
  'notfound.desc': {
    zh: '这个地址不存在，或者页面已经移动。',
    en: 'This address does not exist, or the page has moved.',
  },
  'notfound.back': { zh: '返回首页', en: 'Back to home' },

  'home.skip': { zh: '跳到主要内容', en: 'Skip to main content' },

  'nav.aria.main': { zh: '主导航', en: 'Main navigation' },
  'nav.aria.mobile': { zh: '菜单导航', en: 'Menu navigation' },
  'nav.toggleTheme': { zh: '切换深浅色模式', en: 'Toggle dark / light mode' },
  'nav.menu': { zh: '菜单', en: 'Menu' },

  'copy.aria': { zh: '复制命令', en: 'Copy command' },
  'copy.aria.number': { zh: '复制群号', en: 'Copy group number' },
  'copy.done': { zh: '已复制', en: 'Copied' },   // 对勾现在是图标，不必再进播报文本

  'hero.desc': {
    zh: '像素鲸鱼顶栏、实时工作状态行、思考流式展开、双击 Esc 时间回溯、蓝白上下文进度条 + TPS 仪表。零核心改动，纯插件挂载 —— 装上即用，卸了不留补丁。',
    en: 'Pixel-whale top bar, live status line, streaming thinking, double-tap Esc time travel, and a blue-white context progress bar with a TPS gauge. Zero core changes, pure plugin mounting — install and go, uninstall with no residue.',
  },
  'hero.cta.start': { zh: '快速开始', en: 'Get started' },
  'hero.cta.bundle': { zh: '下载整合包', en: 'Download bundle' },
  'hero.cta.showcase': { zh: '看看界面', en: 'See the interface' },
  'hero.whaleAlt': { zh: 'dsh-TUI 像素鲸鱼娘', en: 'dsh-TUI pixel whale girl' },
  'hero.demoNote': {
    zh: '↑ 模拟演示 · 配色跟随主题切换（对应 TUI 的 OSC 11 自动检测）',
    en: "↑ Simulated demo · colors follow the theme (mirrors the TUI's OSC 11 auto-detection)",
  },

  'features.title': { zh: '核心能力', en: 'Core capabilities' },
  'features.desc': {
    zh: 'dsh-TUI 把 Claude Code 的终端体验完整移植到 DSH 插件体系，并为长会话做了性能设计。',
    en: 'dsh-TUI brings the complete Claude Code terminal experience to the DSH plugin system, with performance engineering for long sessions.',
  },

  'showcase.title': { zh: '界面预览', en: 'Interface preview' },
  'showcase.desc': {
    zh: '真实截图，未加滤镜。Gentle Mist Blue 配色：雾蓝只承担品牌、焦点与高亮，正文保持中性灰；启动时通过 OSC 11 查询终端背景色，自动选择浅色/深色调色板。',
    en: 'Real screenshots, no filters. Gentle Mist Blue palette: mist blue carries only brand, focus, and highlights while body text stays neutral gray; on launch the TUI queries the terminal background via OSC 11 and picks the light / dark palette automatically.',
  },
  'showcase.featured.title': {
    zh: '被 DeepSeek Harness 官方公众号收录',
    en: 'Featured by the DeepSeek Harness official account',
  },
  'showcase.featured.desc': {
    zh: '在 DeepSeek Harness 官方公众号推文中，dsh-TUI 作为「内测用户精选插件」展示 —— 那只像素鲸鱼出现在了官方海报的 C 位。',
    en: 'In a DeepSeek Harness official WeChat post, dsh-TUI was showcased as a beta user pick — the pixel whale took center stage on the official poster.',
  },
  'showcase.featured.alt': {
    zh: 'DeepSeek Harness 官方公众号推文收录 dsh-TUI',
    en: 'DeepSeek Harness official WeChat post featuring dsh-TUI',
  },

  'install.title': { zh: 'npm 一条命令安装', en: 'One-command npm install' },
  'install.desc': {
    zh: '前置条件：Node.js ^22.19 或 24 及以上、pnpm 10+、可用的终端 TTY；运行模型需要 DEEPSEEK_API_KEY。dsh CLI 由下面第一步一并装好，不用预先准备。启动后插件会在后台检查 npm 新版本，输入 /update 即可自动更新并重启恢复会话。',
    en: 'Prerequisites: Node.js ^22.19 or 24+, pnpm 10+, and a working terminal TTY; running models requires DEEPSEEK_API_KEY. Step one below installs the dsh CLI, so you do not need it beforehand. After launch the plugin checks npm for new versions in the background — type /update to auto-update, restart, and resume the session.',
  },
  'install.alt.label': { zh: '备选 —— 手工加入 dsh 配置档', en: 'Alternative — add to a dsh profile manually' },
  'install.alt.or': { zh: '或', en: 'or' },

  'bundle.title': { zh: '整合包安装（新手推荐）', en: 'Installer bundle (recommended for beginners)' },
  'bundle.desc': {
    zh: '不想敲命令？下载整合包，解压后双击 install.bat（macOS / Linux 运行 sh install.sh），脚本会自动装好 Node、pnpm、dsh CLI 与 dsh-TUI，并引导配置 API Key。',
    en: 'Prefer not to type commands? Download the bundle, extract it, and double-click install.bat (or run sh install.sh on macOS / Linux). The script installs Node, pnpm, the dsh CLI, and dsh-TUI, then walks you through the API key.',
  },
  'bundle.download': { zh: '下载整合包', en: 'Download bundle' },
  'bundle.mirror': { zh: 'GitHub 镜像', en: 'GitHub mirror' },
  'bundle.step1': { zh: '下载整合包', en: 'Download the bundle' },
  'bundle.step2': { zh: '解压到任意目录', en: 'Extract it anywhere' },
  'bundle.step3': { zh: '双击 install.bat / 运行 sh install.sh', en: 'Double-click install.bat / run sh install.sh' },
  'bundle.note': {
    zh: '国内直连下载 · 自动切换 npm 镜像 · 无需手动安装 Node',
    en: 'Direct download · auto-switches npm mirror · no manual Node setup',
  },

  'shortcuts.title': { zh: '快捷键，全在指尖', en: 'Shortcuts, all at your fingertips' },
  'shortcuts.desc': {
    zh: 'macOS 上 Ctrl+<键> 同时可用 ⌘<键>（需终端支持扩展键盘协议：iTerm2 / kitty / WezTerm / ghostty / tmux）；仅 Ctrl+C / Ctrl+D 保持 Ctrl 不变。',
    en: 'On macOS, Ctrl+<key> also works as ⌘<key> (requires terminal support for the extended keyboard protocol: iTerm2 / kitty / WezTerm / ghostty / tmux); only Ctrl+C / Ctrl+D stay on Ctrl.',
  },
  'shortcuts.note': {
    zh: '复制后自动取消选区，并弹出「已复制 N 个字符」提示；拖拽中按 Esc 取消选区不复制。',
    en: 'After copying, the selection clears automatically and a "Copied N characters" toast appears; press Esc mid-drag to cancel the selection without copying.',
  },

  'commands.title': { zh: 'Claude Code 指令全集复刻', en: 'The complete Claude Code command set, replicated' },
  'commands.desc': {
    zh: '所有本地命令均走 DSH 官方链路。/plan、/goal 来自 DSH 命令注册表插件，随插件自动并入 / 菜单。',
    en: 'All local commands go through official DSH pipelines. /plan and /goal come from the DSH command-registry plugin and merge into the / menu automatically.',
  },

  'arch.title': { zh: '零核心改动，纯插件挂载', en: 'Zero core changes, pure plugin mounting' },
  'arch.desc': {
    zh: 'TUI 只负责交互与呈现。会话日志是对话真源，模型调用、工具执行、fork/resume、compaction 与持久化继续由 DSH 服务拥有。',
    en: 'The TUI owns only interaction and presentation. The session log is the source of truth; model calls, tool execution, fork/resume, compaction, and persistence remain owned by DSH services.',
  },
  'arch.pipeNote': {
    zh: '高亮处即 dsh-TUI 的挂载点：Cordis patch 层叠在 dsh-base 之上，卸载后不留核心补丁。',
    en: 'The highlight marks the dsh-TUI mount point: the Cordis patch layers on top of dsh-base and leaves no core patch behind when removed.',
  },

  'guides.title': { zh: '深入了解 dsh-TUI', en: 'Dive deeper into dsh-TUI' },
  'guides.desc': {
    zh: '按主题阅读安装、功能、命令、快捷键与架构说明。',
    en: 'Read by topic: installation, features, commands, shortcuts, and architecture.',
  },
  'guides.more': { zh: '查看指南', en: 'Read guide' },

  'faq.title': { zh: '常见问题', en: 'Frequently asked questions' },
  'faq.desc': {
    zh: '关于 dsh-TUI 的定位、安装、平台支持与插件边界。',
    en: 'Positioning, installation, platform support, and plugin boundaries of dsh-TUI.',
  },

  'footer.cta.title': { zh: '探索未至之境', en: 'Explore the unexplored' },   // terminal.tagline 保持标题式：那是逐字复刻产品自身的输出
  'footer.cta.sub': {
    zh: '一条命令，把鲸鱼放进你的终端。',
    en: 'One command puts a whale in your terminal.',
  },
  'footer.brand': {
    zh: 'DeepSeek Harness 的 Claude Code 风格终端界面插件。献给偏爱 CLI 的各位极客。',
    en: 'A Claude Code-style terminal interface plugin for DeepSeek Harness. For CLI-loving geeks everywhere.',
  },
  'community.title': { zh: '加入社区', en: 'Join the community' },
  'community.desc': {
    zh: 'dsh-TUI 插件交流群同时开在 QQ 和微信。安装、配置、终端兼容性的问题都可以直接问，也欢迎来提需求。',
    en: 'The dsh-TUI plugin community runs on both QQ and WeChat. Ask about installation, configuration, and terminal compatibility, or bring a feature request.',
  },
  // 卡片上原本四行里有三行不带区分信息：群名两张卡完全相同，
  // 「扫码加入…」在同屏说了三次（section 描述里已有一次）。只留下真正区分两者的。
  'footer.community.qq': { zh: 'QQ 群', en: 'QQ group' },
  'footer.community.wechat': { zh: '微信群', en: 'WeChat group' },
  'community.qqNumberLabel': { zh: '群号', en: 'Group no.' },
  'community.qqNumber': { zh: '572549239', en: '572549239' },
  'community.wechatNote': { zh: '微信扫码直接入群', en: 'Scan with WeChat to join' },
  'footer.community.qqAlt': { zh: 'QQ 群二维码', en: 'QQ group QR code' },
  'footer.community.wechatAlt': { zh: '微信群二维码', en: 'WeChat group QR code' },
  'footer.community.qrPending': { zh: '二维码加载失败，请刷新页面', en: 'QR code failed to load — refresh the page' },

  'terminal.tagline': { zh: '探索未至之境！', en: 'Explore the Unexplored!' },
  'terminal.busy': {
    zh: '执行中 · 0 工具 · 想{s}s 干0s · 🔥 9.1k',
    en: 'running · 0 tools · thought {s}s worked 0s · 🔥 9.1k',
  },
  'terminal.idle': {
    zh: '没报错 · 0 工具 · 想{s}s 干0s · 🔥 9.1k',
    en: 'no errors · 0 tools · thought {s}s worked 0s · 🔥 9.1k',
  },
  'terminal.line1': {
    zh: '你好！👋 我是你的编码助手。有什么想做的吗？比如：',
    en: "Hi! 👋 I'm your coding assistant. What can I do for you? For example:",
  },
  'terminal.line2': {
    zh: '- 写代码 / 修 bug / 重构项目',
    en: '- Write code / fix bugs / refactor projects',
  },
  'terminal.line3': {
    zh: '- 查资料、做调研、写文档',
    en: '- Research, dig into topics, write docs',
  },
  'terminal.line4': {
    zh: '- 搭个新项目或小实验',
    en: '- Spin up a new project or a quick experiment',
  },
  'terminal.line5': { zh: '直接说需求就行。', en: 'Just say what you need.' },
} satisfies Record<string, Pair>

export type StringKey = keyof typeof strings

/* ---------------- 结构化数据（数组类文案） ---------------- */

/** 顶栏主导航：只保留首屏漏斗上的页内锚点。
 *  快捷键 / 命令 / 架构 / 常见问题 各自有 Guides 区块的专页与页脚文档链接兜底，
 *  放进顶栏只会把它压成一份目录。 */
export const NAV_LINKS: { href: string; label: Pair }[] = [
  { href: '#features', label: { zh: '特性', en: 'Features' } },
  { href: '#showcase', label: { zh: '预览', en: 'Showcase' } },
  { href: '#install', label: { zh: '安装', en: 'Install' } },
  { href: '#guides', label: { zh: '指南', en: 'Guides' } },
]

/** 站外目的地，和页内锚点分组渲染，不共用同一节奏。 */
export const NAV_SECONDARY: { href: string; label: Pair; external?: boolean }[] = [
  { href: '/plugins/', label: { zh: '插件市场', en: 'Plugins' } },
  { href: 'https://join.dshtui.com/', label: { zh: '加入生态', en: 'Join the ecosystem' }, external: true },
]

/** 首屏徽章。原本四条（npm / license / status / 收录）在页面别处都各有一份：
 *  包名就在下方安装命令里、license 在页脚、status 是顶栏 logo 旁的 chip、
 *  收录 在 Showcase 区块。只保留唯一承载可信度的那条，其余是重复噪音。 */
export const HERO_BADGES: { k: Pair; v: Pair }[] = [
  { k: { zh: '收录', en: 'featured' }, v: { zh: 'DSH 官方公众号', en: 'DSH Official WeChat' } },
]

export interface FeatureCellData {
  title: Pair
  desc: Pair
  tags: Pair[]
  span: string
  meter?: boolean
}

export const FEATURE_CELLS: FeatureCellData[] = [
  {
    title: { zh: '终端原生交互', en: 'Terminal-native interaction' },
    desc: {
      zh: '流式 Markdown、结构化工具卡、命令与文件补全、@ 文件引用（消息任意位置补全，发送时自动附加文件内容）、历史搜索、消息选择，inline / alternate-screen 两种渲染模式，/lang 中英界面一键切换。',
      en: 'Streamed Markdown, structured tool cards, command and file completion, @ file references (complete anywhere in a message, file contents attached automatically on send), history search, message selection, inline / alternate-screen rendering modes, and one-tap Chinese / English switching via /lang.',
    },
    tags: [
      { zh: '流式 Markdown', en: 'Streamed Markdown' },
      { zh: '@ 文件引用', en: '@ file refs' },
      { zh: '历史搜索', en: 'History search' },
      { zh: '中英双语', en: 'CN / EN bilingual' },
    ],
    span: 'md:col-span-3',
  },
  {
    title: { zh: '可观察的 Agent 状态', en: 'Observable agent status' },
    desc: {
      zh: '实时工作状态行、上下文分段进度、TPS 仪表、缓存命中率、推理等级、输入/输出 token 与 Git/会话信息 —— Agent 在做什么，一眼可见。',
      en: 'Live status line, segmented context progress, TPS gauge, cache hit rate, reasoning level, input / output tokens, and Git / session info — what the agent is doing, visible at a glance.',
    },
    tags: [
      { zh: '上下文进度条', en: 'Context progress' },
      { zh: 'TPS 仪表', en: 'TPS gauge' },
      { zh: '缓存命中率', en: 'Cache hit rate' },
    ],
    span: 'md:col-span-3',
    meter: true,
  },
  {
    title: { zh: '完整会话工作流', en: 'Complete session workflow' },
    desc: {
      zh: '/resume 恢复、/new 新会话、/compact 压缩、/export 导出、/btw 侧问、模型切换，以及双击 Esc 发起的会话 rewind / fork 时间回溯。',
      en: '/resume to restore, /new for a fresh session, /compact to compress, /export to export, /btw for side questions, model switching, and session rewind / fork time travel via double-tap Esc.',
    },
    tags: [
      { zh: '/resume', en: '/resume' },
      { zh: '/compact', en: '/compact' },
      { zh: '双击 Esc 回溯', en: 'Double-tap Esc rewind' },
    ],
    span: 'md:col-span-2',
  },
  {
    title: { zh: 'DSH 官方能力接入', en: 'Official DSH capabilities' },
    desc: {
      zh: 'Agent preset、Skills、MCP、Goals、Todos、子代理、ask_user_question 问卷，全部通过现有服务或注册表连接，不重复造轮子。',
      en: 'Agent presets, Skills, MCP, Goals, Todos, sub-agents, and ask_user_question questionnaires — all connected through existing services or registries, no wheels reinvented.',
    },
    tags: [
      { zh: 'Agent preset', en: 'Agent preset' },
      { zh: 'MCP', en: 'MCP' },
      { zh: '子代理', en: 'Sub-agents' },
    ],
    span: 'md:col-span-2',
  },
  {
    title: { zh: '为长会话设计', en: 'Built for long sessions' },
    desc: {
      zh: '事件驱动投影、差分终端输出、消息虚拟化、回放合并与有界缓存 —— 每帧成本从 O(全会话) 降到 O(可视窗口)，渲染与内存不随会话膨胀。',
      en: 'Event-driven projection, differential terminal output, message virtualization, replay merging, and bounded caches — per-frame cost drops from O(entire session) to O(visible window); rendering and memory stop growing with the session.',
    },
    tags: [
      { zh: '布局级虚拟化', en: 'Layout-level virtualization' },
      { zh: '差分渲染', en: 'Differential rendering' },
      { zh: '有界缓存', en: 'Bounded caches' },
    ],
    span: 'md:col-span-2',
  },
]

export interface ShowcaseShot {
  src: string
  avif: string
  webp: string
  cap: Pair
  file: string
}

export const SHOWCASE_SHOTS: ShowcaseShot[] = [
  {
    src: './shots/splash.png',
    avif: './shots/splash-800.avif 800w, ./shots/splash-1600.avif 1600w',
    webp: './shots/splash-800.webp 800w, ./shots/splash-1600.webp 1600w',
    cap: { zh: '首屏 —— 像素鲸鱼顶栏 · 双流光大字 · 工作状态行', en: 'Splash — pixel-whale top bar · dual-shine wordmark · status line' },
    file: 'splash.png',
  },
  {
    src: './shots/working-line.png',
    avif: './shots/working-line-800.avif 800w, ./shots/working-line-1600.avif 1600w',
    webp: './shots/working-line-800.webp 800w, ./shots/working-line-1600.webp 1600w',
    cap: { zh: '工作中 —— 工具卡 · Todos 面板 · 上下文进度条 + TPS 仪表', en: 'Working — tool cards · Todos panel · context progress bar + TPS gauge' },
    file: 'working-line.png',
  },
]

export const INSTALL_STEPS: { no: string; title: Pair; cmd: string; note: Pair }[] = [
  {
    no: '1',
    title: { zh: '全局安装 CLI + 插件', en: 'Install CLI + plugin globally' },
    cmd: 'npm install -g @deepseek-ai/dsh @deepseek-harness-tui/dsh-tui',
    note: { zh: '插件自带 dsh-tui 直达命令。', en: 'The package ships the dsh-tui shortcut command.' },
  },
  {
    no: '2',
    title: { zh: '启动', en: 'Launch' },
    cmd: 'dsh-tui',
    note: { zh: '首次运行自动初始化 dsh-tui profile（需 pnpm 10+）。', en: 'First run auto-initializes the dsh-tui profile (requires pnpm 10+).' },
  },
  {
    no: '3',
    title: { zh: '恢复上次会话', en: 'Resume the last session' },
    cmd: 'dsh-tui --resume',
    note: { zh: 'Windows 也可用仓库里的 dsh-tui.cmd，效果等价。', en: 'On Windows, the dsh-tui.cmd in the repo works exactly the same.' },
  },
]

export const SHORTCUT_KEYS: { keys: string[]; desc: Pair; hi?: boolean }[] = [
  { keys: ['Enter'], desc: { zh: '发送（Shift+Enter 换行）；命令菜单打开时执行选中项', en: 'Send (Shift+Enter for a newline); runs the selected item when the command menu is open' } },
  { keys: ['Ctrl+C'], desc: { zh: '中断当前回合；空闲时连按两次退出', en: 'Interrupt the current turn; press twice while idle to quit' } },
  { keys: ['Esc', 'Esc'], desc: { zh: '空输入双击 = 时间回溯（rewind / fork）', en: 'Double-tap on empty input = time travel (rewind / fork)' }, hi: true },
  { keys: ['Ctrl+O'], desc: { zh: '展开 / 收起详情：思考全文、工具参数与输出', en: 'Expand / collapse details: full thinking, tool params and output' } },
  { keys: ['Ctrl+R'], desc: { zh: '历史消息搜索', en: 'Search message history' } },
  { keys: ['/'], desc: { zh: '会话内全文搜索，n / N 跳转', en: 'Full-text search within the session, n / N to jump between matches' } },
  { keys: ['Tab'], desc: { zh: '命令 / @ 文件补全，目录可继续深入', en: 'Command / @ file completion; directories can be drilled into' } },
  { keys: ['Ctrl+V'], desc: { zh: '粘贴文本；Explorer 复制的文件 / 图片 → 插入文件路径', en: 'Paste text; files / images copied in Explorer insert as file paths' } },
  { keys: ['?'], desc: { zh: '快捷键菜单', en: 'Shortcut menu' } },
  { keys: ['Shift+↑'], desc: { zh: '消息选择模式，Enter 展开单条', en: 'Message selection mode; Enter expands a single message' } },
]

export const SHORTCUT_MOUSE: { k: Pair; v: Pair }[] = [
  { k: { zh: '拖拽选择', en: 'Drag selection' }, v: { zh: '应用内文本选区，松开即复制（OSC 52 + 原生兜底）', en: 'In-app text selection; release to copy (OSC 52 + native fallback)' } },
  { k: { zh: '双击 / 三击', en: 'Double / triple click' }, v: { zh: '选词 / 选行，同样即选即复制', en: 'Select word / line — copied on select as well' } },
  { k: { zh: '滚轮', en: 'Wheel' }, v: { zh: '滚动消息列表（fullscreen 模式）', en: 'Scroll the message list (fullscreen mode)' } },
]

export const COMMAND_GROUPS: { name: Pair; en: string; cmds: string[] }[] = [
  { name: { zh: '会话', en: 'Session' }, en: 'session', cmds: ['/new', '/resume', '/rename', '/clear', '/compact', '/export', '/trace'] },
  { name: { zh: '状态', en: 'Status' }, en: 'status', cmds: ['/status', '/cost', '/doctor', '/config', '/init'] },
  { name: { zh: '模型', en: 'Model' }, en: 'model', cmds: ['/model', '/thinking', '/tokens', '/theme', '/lang'] },
  { name: { zh: '账号 / 策略', en: 'Account / Policy' }, en: 'account', cmds: ['/login', '/logout', '/permissions', '/add-dir', '/hooks', '/mcp', '/memory'] },
  { name: { zh: '技能', en: 'Skills' }, en: 'skills', cmds: ['/audit', '/bug', '/review', '/practice', '/pr_comments', '/release-notes', '/vuln-check'] },
  { name: { zh: '其它', en: 'Misc' }, en: 'misc', cmds: ['/agents', '/update', '/vim', '/terminal-setup', '/connect', '/help', '/exit'] },
  { name: { zh: '注册表', en: 'Registry' }, en: 'registry', cmds: ['/plan', '/goal'] },
]

export const ARCH_PIPE: Pair[] = [
  { zh: 'dsh profile', en: 'dsh profile' },
  { zh: 'dsh-base', en: 'dsh-base' },
  { zh: 'Cordis patch', en: 'Cordis patch' },
  { zh: 'Agent preset + DSH services', en: 'Agent preset + DSH services' },
  { zh: 'session / event', en: 'session / event' },
  { zh: 'Channel 投影', en: 'Channel projection' },
  { zh: 'React 组件', en: 'React components' },
  { zh: 'Ink / Yoga 渲染器', en: 'Ink / Yoga renderer' },
  { zh: 'terminal', en: 'terminal' },
]

export const ARCH_POINTS: { t: Pair; d: Pair }[] = [
  {
    t: { zh: 'Gentle Mist Blue 配色', en: 'Gentle Mist Blue palette' },
    d: {
      zh: '雾蓝只承担品牌、焦点、交互与高亮，正文保持中性灰；OSC 11 自动检测终端背景，无响应时回退深色。',
      en: 'Mist blue carries only brand, focus, interaction, and highlights while body text stays neutral gray; OSC 11 auto-detects the terminal background and falls back to dark when there is no response.',
    },
  },
  {
    t: { zh: '事件驱动渲染', en: 'Event-driven rendering' },
    d: {
      zh: 'session/event 事件流 → 增量差分渲染，滚动状态独立维护，终端输出只做差分。',
      en: 'The session/event stream drives incremental differential rendering; scroll state is maintained independently and terminal output commits only diffs.',
    },
  },
  {
    t: { zh: '布局级虚拟化', en: 'Layout-level virtualization' },
    d: {
      zh: '屏幕外消息行渲染为「量高占位符」，子树完全不参与布局 —— 长会话每帧成本 O(可视窗口)。',
      en: 'Off-screen message rows render as measured-height placeholders whose subtrees skip layout entirely — per-frame cost for long sessions is O(visible window).',
    },
  },
  {
    t: { zh: '上下文进度条 + TPS 仪表', en: 'Context progress bar + TPS gauge' },
    d: {
      zh: '最大余数法分段着色 + 多级缩略读数；流式 1/8 格 gauge、min-max sparkline、速度语义色（≥50 绿 / ≥20 黄 / <20 红）。',
      en: 'Largest-remainder segmented coloring plus multi-level abbreviated readouts; streaming 1/8-cell gauge, min-max sparkline, and speed-semantic colors (≥50 green / ≥20 yellow / <20 red).',
    },
  },
  {
    t: { zh: 'working-activity 生态', en: 'The working-activity ecosystem' },
    d: {
      zh: '工作状态行消费 dsh-working-activity 的 log-only activity/status 事件，与 Web UI 同一数据源。',
      en: 'The status line consumes log-only activity/status events from dsh-working-activity — the same data source as the Web UI.',
    },
  },
  {
    t: { zh: '安全边界', en: 'Security boundary' },
    d: {
      zh: '不实现独立沙箱，沿用当前 DSH profile 的文件、Shell、sandbox 与 approval 策略；含敏感凭证的环境请先检查 profile 配置。',
      en: 'No separate sandbox: the TUI inherits the file, shell, sandbox, and approval policies of the current DSH profile; check the profile config first in environments with sensitive credentials.',
    },
  },
]

export const GUIDE_CARDS: { href: string; title: Pair; desc: Pair }[] = [
  { href: './getting-started/', title: { zh: '安装与快速开始', en: 'Getting started' }, desc: { zh: '环境要求、npm 安装、启动、恢复与更新。', en: 'Requirements, npm install, launch, resume, and updates.' } },
  { href: './features/', title: { zh: '功能特性', en: 'Features' }, desc: { zh: '终端交互、Agent 状态、会话工作流与性能。', en: 'Terminal interaction, agent status, session workflow, and performance.' } },
  { href: './commands/', title: { zh: '命令参考', en: 'Commands' }, desc: { zh: '会话、模型、技能、MCP 与开发辅助命令。', en: 'Session, model, skills, MCP, and developer commands.' } },
  { href: './shortcuts/', title: { zh: '快捷键', en: 'Shortcuts' }, desc: { zh: '键盘、鼠标、剪贴板与终端兼容性。', en: 'Keyboard, mouse, clipboard, and terminal compatibility.' } },
  { href: './architecture/', title: { zh: '架构与安全', en: 'Architecture' }, desc: { zh: '插件挂载、事件投影、虚拟化和安全边界。', en: 'Plugin mounting, event projection, virtualization, and security boundaries.' } },
  { href: './faq/', title: { zh: '常见问题', en: 'FAQ' }, desc: { zh: '安装、平台、更新和会话恢复问题。', en: 'Installation, platforms, updates, and session recovery.' } },
]

export const FAQ_ITEMS: { question: Pair; answer: Pair }[] = [
  {
    question: { zh: 'dsh-TUI 是什么？', en: 'What is dsh-TUI?' },
    answer: {
      zh: 'dsh-TUI 是 DeepSeek Harness 的 Claude Code 风格全屏终端界面插件，提供流式 Markdown、结构化工具卡、会话管理、实时 Agent 状态和终端原生交互。',
      en: 'dsh-TUI is a Claude Code-style fullscreen terminal interface plugin for DeepSeek Harness, with streamed Markdown, structured tool cards, session management, live agent status, and terminal-native interaction.',
    },
  },
  {
    question: { zh: '如何安装 dsh-TUI？', en: 'How do I install dsh-TUI?' },
    answer: {
      zh: '准备 Node.js ^22.19 或 24 及以上版本与 pnpm 10+，全局安装官方 dsh CLI 和 dsh-TUI 插件，然后运行 dsh-tui 即可启动。运行模型还需要配置 DEEPSEEK_API_KEY。',
      en: 'Get Node.js ^22.19 or version 24+ and pnpm 10+, globally install the official dsh CLI and the dsh-TUI plugin, then run dsh-tui to start. Running models also requires a configured DEEPSEEK_API_KEY.',
    },
  },
  {
    question: { zh: '支持哪些操作系统？', en: 'Which operating systems are supported?' },
    answer: {
      zh: '支持 Windows、macOS 和 Linux。不同终端对扩展键盘协议、剪贴板和 OSC 52 的支持可能有所不同。',
      en: 'Windows, macOS, and Linux are supported. Terminal support for the extended keyboard protocol, clipboard, and OSC 52 may vary.',
    },
  },
  {
    question: { zh: '安装插件会修改 DeepSeek Harness 核心吗？', en: 'Does installing the plugin modify the DeepSeek Harness core?' },
    answer: {
      zh: '不会。dsh-TUI 通过 Cordis patch 作为插件挂载，会话、模型调用、工具执行与持久化仍由现有 DSH 服务负责；卸载后不会留下核心补丁。',
      en: 'No. dsh-TUI mounts as a plugin through a Cordis patch; sessions, model calls, tool execution, and persistence stay with the existing DSH services, and no core patch remains after uninstall.',
    },
  },
]

export const FOOTER_GROUPS: { name: Pair; links: { label: Pair; href: string }[] }[] = [
  {
    name: { zh: '项目', en: 'Project' },
    links: [
      { label: { zh: 'GitHub 仓库', en: 'GitHub repo' }, href: 'https://github.com/ccch1mneyyy/dsh-TUI' },
      { label: { zh: 'npm 包', en: 'npm package' }, href: 'https://www.npmjs.com/package/@deepseek-harness-tui/dsh-tui' },
      { label: { zh: 'Issues', en: 'Issues' }, href: 'https://github.com/ccch1mneyyy/dsh-TUI/issues' },
      { label: { zh: 'MIT License', en: 'MIT License' }, href: 'https://github.com/ccch1mneyyy/dsh-TUI/blob/main/LICENSE' },
    ],
  },
  {
    name: { zh: '文档', en: 'Docs' },
    links: [
      { label: { zh: '安装与快速开始', en: 'Getting started' }, href: 'https://github.com/ccch1mneyyy/dsh-TUI/blob/main/docs/getting-started.md' },
      { label: { zh: '配置参考', en: 'Configuration' }, href: 'https://github.com/ccch1mneyyy/dsh-TUI/blob/main/docs/configuration.md' },
      { label: { zh: '主题系统', en: 'Themes' }, href: 'https://github.com/ccch1mneyyy/dsh-TUI/blob/main/docs/themes.md' },
      { label: { zh: '架构与限制', en: 'Architecture & limits' }, href: 'https://github.com/ccch1mneyyy/dsh-TUI/blob/main/docs/architecture.md' },
    ],
  },
  {
    name: { zh: '社区', en: 'Community' },
    links: [
      { label: { zh: 'QQ 群', en: 'QQ group' }, href: '#contact' },
      { label: { zh: '微信群', en: 'WeChat group' }, href: '#contact' },
      { label: { zh: 'Discussions', en: 'Discussions' }, href: 'https://github.com/dsh-tui-ecosystem/dsh-tui-site/discussions' },
    ],
  },
  {
    name: { zh: '生态', en: 'Ecosystem' },
    links: [
      { label: { zh: 'dsh-working-activity', en: 'dsh-working-activity' }, href: 'https://github.com/ccch1mneyyy/dsh-working-activity' },
      { label: { zh: '社区友链', en: 'Community links' }, href: 'https://github.com/ccch1mneyyy/dsh-TUI/blob/main/docs/links.md' },
      { label: { zh: '贡献指南', en: 'Contributing' }, href: 'https://github.com/ccch1mneyyy/dsh-TUI/blob/main/docs/contributing.md' },
    ],
  },
]
