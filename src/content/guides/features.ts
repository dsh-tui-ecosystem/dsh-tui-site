import type { GuideTopic } from './types'

const topic: GuideTopic = {
  zh: {
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
  en: {
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
}

export default topic
