import { type GuideTopic, ol, olFrom } from './types'

const topic: GuideTopic = {
  zh: {
    slug: 'tips',
    locale: 'zh-CN',
    navTitle: '常用技巧',
    title: 'dsh-TUI 常用技巧',
    description: 'dsh-TUI 上手、提效与排障技巧：三种消息投递、Alt+Up 取回、/btw 侧问、双击 Esc 回溯、@ 行区间引用、上下文压力与 /compact。',
    intro: '十几条最常用的操作习惯，按上手、效率和排障分组。TUI 里输入 `/tips` 也能随时翻看。',
    sections: [
      {
        heading: '上手',
        blocks: [
          ol(
            '`?` 看快捷键、`/` 看命令，两者都支持 Tab 补全。',
            '不确定环境对不对？先 `/doctor`；想看会话全貌用 `/status`。',
            '中英界面 `/lang en|zh`，即时生效并持久化。',
          ),
        ],
      },
      {
        heading: '效率',
        blocks: [
          olFrom(4,
            '模型工作中三种投递：`Enter` 注入下一步、`Tab` 排队、`Ctrl+Enter` 打断并发送。',
            '`Alt+Up` 取回最后一条未处理消息改完重发，不用重打。',
            '想快速问又不打断主回合、不留历史：`/btw <问题>`。',
            '打错了想重来：**空输入双击 `Esc` 时间回溯**（或 `/rewind`），改完重发。',
            '`@` 在消息任意位置补全文件，`@src/a.ts#L12-14` 精确引用行区间。',
            '`Ctrl+A` 子代理面板：`Enter` 看详情、`X` 中断运行中的子代理。',
            '`Ctrl+O` 展开/收起详情；`Ctrl+T` 看轨迹（`[`/`]` 跳失败点、`/` 字段查询）。',
          ),
        ],
      },
      {
        heading: '排障',
        blocks: [
          olFrom(11,
            '上下文压力 ≥80% 变琥珀、≥95% 转红——该 `/compact` 了（minimal 预设不可用）。',
            '会话管理界面（`/resume`、`/home`、`/agentview`、`/bg` 或输入框行首 `⌸`）：打字筛选、`★` 固定、`Ctrl+X` 停后台会话；切换只是**停放**。',
            '回合运行中 `/compact`、`/model`、`/restart` 会被拒绝——先 `Ctrl+C` 或等回合结束。',
            '`/model` 切换 = fork 续聊（历史保留），持久化后重启与 `/new` 沿用。',
          ),
        ],
      },
    ],
  },
  en: {
    slug: 'tips',
    locale: 'en',
    navTitle: 'Tips',
    title: 'dsh-TUI Tips and Tricks',
    description: 'dsh-TUI tips for getting started, efficiency, and troubleshooting: three delivery modes, Alt+Up recall, /btw side questions, double-Esc rewind, @ line ranges, and /compact.',
    intro: 'A dozen habits worth building, grouped into getting started, efficiency, and troubleshooting. Type `/tips` inside the TUI to browse them any time.',
    sections: [
      {
        heading: 'Getting started',
        blocks: [
          ol(
            '`?` for shortcuts, `/` for commands — both have Tab completion.',
            'Not sure the environment is right? Run `/doctor`; for the whole session, `/status`.',
            'Switch UI language with `/lang en|zh`; it applies immediately and persists.',
          ),
        ],
      },
      {
        heading: 'Efficiency',
        blocks: [
          olFrom(4,
            'Three deliveries while the model works: `Enter` injects a next step, `Tab` queues, `Ctrl+Enter` interrupts and sends.',
            '`Alt+Up` brings the last unhandled message back to edit and resend, no retyping.',
            'A quick question without interrupting the main turn or writing history: `/btw <question>`.',
            'Made a mistake? **Double-press `Esc` on empty input to rewind** (or `/rewind`), edit, and resend.',
            '`@` completes files anywhere in the message; `@src/a.ts#L12-14` cites a precise line range.',
            '`Ctrl+A` opens the subagent panel: `Enter` for details, `X` to interrupt a running subagent.',
            '`Ctrl+O` expands/collapses details; `Ctrl+T` opens the trace (`[`/`]` jump failure, `/` field query).',
          ),
        ],
      },
      {
        heading: 'Troubleshooting',
        blocks: [
          olFrom(11,
            'Context pressure ≥80% turns amber, ≥95% red — time to `/compact` (unavailable under the minimal preset).',
            'Session manager (`/resume`, `/home`, `/agentview`, `/bg`, or `⌸` at the input line start): type to filter, `★` pin, `Ctrl+X` stop a background session; switching just parks it.',
            'Mid-turn, `/compact`, `/model`, and `/restart` are rejected — `Ctrl+C` first or wait for the turn to end.',
            '`/model` switch = fork (history kept), persisted and reused on restart and `/new`.',
          ),
        ],
      },
    ],
  },
}

export default topic
