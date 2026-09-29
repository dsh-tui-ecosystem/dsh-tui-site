import type { GuideTopic } from './types'

const topic: GuideTopic = {
  zh: {
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
  en: {
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
}

export default topic
