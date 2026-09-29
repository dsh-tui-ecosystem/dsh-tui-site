import type { GuideTopic } from './types'

const topic: GuideTopic = {
  zh: {
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
  en: {
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
}

export default topic
