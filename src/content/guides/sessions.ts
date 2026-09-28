import { type GuideTopic, ol, p, table, ul } from './types'

const topic: GuideTopic = {
  zh: {
    slug: 'sessions',
    locale: 'zh-CN',
    navTitle: '会话工作流',
    title: 'dsh-TUI 会话工作流',
    description: 'dsh-TUI 会话生命周期、双击 Esc 时间回溯、模型工作中的消息投递、/btw 侧问、模型与预设切换、问卷审批与 MCP。',
    intro: '会话的新建、恢复、回溯与分叉都由 DeepSeek Harness 持久化；dsh-TUI 负责把这些操作放到键盘和命令上。',
    sections: [
      {
        heading: '会话生命周期',
        blocks: [
          table(['操作', '命令/键', '要点'], [
            ['新建', '`/new`', '无二次确认——旧会话已持久化，随时可 `/resume` 找回；顺带清空 resume 标记'],
            ['恢复', '`/resume`（同 `/home` `/agentview` `/bg` 与输入框行首 `⌸`）', '三合一**会话管理界面**：`←/→` 切栏、打字筛选、`Enter` 进入、`Ctrl+N` 新建、`Ctrl+X` 停后台会话、行内 ★/☆ 固定。切换只是**停放**，回合继续跑；被其他终端占用的会话标红进不去（详见[各场景键位](../shortcuts/#per-scene)）'],
            ['重命名', '`/rename <标题>`', '立即改名并持久化（写入 session/title 事件，会话管理界面里能读回）'],
            ['压缩', '`/compact`', '手动触发 compaction；**回合运行中拒绝**；minimal preset 下不可用；压缩点以 Divider 摘要行呈现'],
            ['导出', '`/export`', '从完整 session log 导出 Markdown（含 thinking 与工具调用分节），文件 `dsh-tui-export-<时间戳>.md` 落在当前会话 cwd'],
            ['清屏', '`/clear`', '只清视图，不动会话日志'],
            ['停止', '会话管理界面 `Ctrl+X`', '停止光标所在的**后台**会话；当前终端正在用的会话停不了（想退出整个 TUI 用 `/exit` 或双击 `Ctrl+C`）'],
            ['退出', '`/exit`（或 `/quit` `/q`）', '空闲 `Ctrl+C` 双击或 `Ctrl+D` 双击也可退出；工作中中断迟迟不收敛时再按 `Ctrl+C`/`Ctrl+D` 强制退出'],
          ]),
          p('命令行恢复：`dsh-tui --resume`（最近会话）/ `dsh-tui --resume <id>`（指定会话），`-c` / `--continue` 等价。'),
        ],
      },
      {
        heading: '时间回溯 rewind（双击 Esc）',
        id: 'rewind',
        blocks: [
          p('**空输入时连按两次 `Esc`**（或 `/rewind`），进入回退选择器：'),
          ol(
            '选择器列出**你自己的消息**（最新在前），`↑/↓` + `Enter` 选中。',
            '若模型正在工作：先取消回合并等落定（最长 30 秒）。',
            '边界取该消息所属回合**开始之前**；**不能回退到第一条消息**。',
            '系统 fork 新会话并回放历史到回退点，**原消息放回输入框**供修改重发。',
            '回退分支留在 `/resume` 列表里，继续用当前模型路由 + 会话自己的 preset。',
          ),
        ],
      },
      {
        heading: '消息投递语义（模型工作中）',
        blocks: [
          p('键位见[发送与投递](../shortcuts/#send)：'),
          ul(
            '`Enter` = **steer**（注入下一步边界，不中断）',
            '`Tab` = **follow-up**（排到回合后）',
            '`Ctrl+Enter` = **interrupt**（打断并发送）',
            '`Alt+Up` 取回最后一条未处理消息',
            '`↑` 召回到的消息若仍排在队列里，会一并把那条排队项撤回（同 `Alt+Up`，避免同一条发两遍）；已被本轮取走时只提示、不撤回',
            '`Esc`（有 pending）中断并重投',
            '`/btw …` 侧问永不打断主回合',
          ),
        ],
      },
      {
        heading: '侧问 /btw 与轨迹场景',
        blocks: [
          p('`/btw <问题>`：复用当前上下文做**无工具、单轮**回答，**不写历史、不计 token**，主回合照常。面板 `↑/↓` 滚动 · `c` 复制 · `Esc` 关闭。'),
          p('`Ctrl+T` 或 `/trace` 整屏查看会话全程时间线（不污染 scrollback）；键位见[各场景键位](../shortcuts/#per-scene)。'),
        ],
      },
      {
        heading: '模型切换与预设',
        blocks: [
          ul(
            '`/model`：选择器。**切换 = fork 会话续聊**（历史保留、仅换路由，旧会话留在 `/resume`）；持久化 `~/.dsh-tui/model.json`。',
            '回合运行中切换会被拒绝。',
            '`/preset` 可选：`standard`（默认全功能）、`ptc`、`minimal`（仅 bash+编辑器，无 compaction）、`cordis`、`liangshen`（梁神模式）。**已产生对话的会话不能切换**（blank-only）：选择只保存为下次 `/new` 的默认。',
            '会话模式用 `Shift+Tab` 循环：default（workspace-write + 审批）→ plan（read-only）→ full（danger-full-access）。',
            '第三方权限预设按 registry 顺序排在末尾。',
            '**批准计划或 `/plan off` 之后，沙箱与审批策略回到进入计划模式之前的状态**。',
          ),
        ],
      },
      {
        heading: '问卷与审批',
        blocks: [
          p('键位见[各场景键位](../shortcuts/#per-scene)。要点：'),
          ul(
            '问卷**最后一行是自由输入行**（直接打字连同选项标签一起提交）。',
            '计划评审**批准必须无反馈文本**。',
            '审批与问卷同时挂起时**审批优先**；后台会话发起的审批会标注来源会话 id 的前 8 位。',
          ),
        ],
      },
      {
        heading: '技能、注册表与 Goals/Todos',
        blocks: [
          ul(
            '`/skills` 浏览技能目录，可直调技能以 `/name` 加入命令菜单（dsh-TUI 不自带通用技能）。',
            '`/plan` `/goal` `/feedback` `/permission` 来自 DSH 注册表，随组合并入 `/` 菜单。',
            '**Goals/Todos 面板自动出现**：模型写入 goal/todo 时在输入框上方实时渲染（🎯 目标 + phase 徽章 + 树形 todo），无需操作。',
          ),
        ],
      },
      {
        heading: 'MCP、工作区与提供方',
        blocks: [
          ul(
            '`/mcp`：按服务器分组列出 `mcp__服务器__工具`；未配置时给出 `cordis.patch.yml` 插入示例。',
            '`/workspace`：`resume` / `rename <名>` / `open <路径|file:// URI>`（打开并新建会话）；`dsh-tui <路径>` 同样接受工作区目标。',
            '`/doctor` 自检：Node/平台、API key、模型路由、cwd、上下文窗口、会话存储、插件宿主。',
            '`/provider` 交互向导管理模型提供方：添加 / 编辑 / 删除；捆绑 dsh-auth 时提供 **OAuth 订阅登录**（ChatGPT / Claude / Grok，免 API key）。',
            '非环境变量密钥写入 `~/.dsh/.credentials.yaml`（0600），界面只显示 `••••••`。自定义端点需填路由名、API key、baseURL 与协议（`openai-completions` / `openai-responses` / `anthropic-messages`）。添加/编辑后运行 `/model` 切换到新路由。',
            '`/init` 创建 AGENTS.md；`/agents` 子代理列表；`/login` `/logout` 凭证管理。',
            '`/permission` `/add-dir` 权限说明；`/hooks` `/connect` 为占位。',
          ),
        ],
      },
    ],
  },
  en: {
    slug: 'sessions',
    locale: 'en',
    navTitle: 'Sessions',
    title: 'dsh-TUI Session Workflow',
    description: 'dsh-TUI session lifecycle, double-Esc rewind, message delivery while the model works, /btw side questions, model and preset switching, approvals, and MCP.',
    intro: 'DeepSeek Harness persists every session, rewind, and fork; dsh-TUI puts those operations on keys and commands.',
    sections: [
      {
        heading: 'Session lifecycle',
        blocks: [
          table(['Action', 'Command/key', 'Notes'], [
            ['New', '`/new`', 'no confirmation — the old session is persisted, always reachable via `/resume`; also clears the resume marker'],
            ['Resume', '`/resume` (same as `/home` `/agentview` `/bg` and `⌸` at the input line start)', "the three-in-one **session manager**: `←/→` switch column, type to filter, `Enter` enter, `Ctrl+N` new, `Ctrl+X` stop background session, `★`/`☆` pin. Switching just parks the session, the turn keeps running; a session taken by another terminal shows red and can't be entered (see [per-scene keys](../shortcuts/#per-scene))"],
            ['Rename', '`/rename <title>`', 'rename immediately and persist (writes a session/title event, readable back in the session manager)'],
            ['Compact', '`/compact`', 'trigger DSH compaction manually; **rejected mid-turn**; unavailable under minimal preset; the compaction point renders as a Divider summary row'],
            ['Export', '`/export`', 'export Markdown from the full session log (thinking and tool-call sections), file `dsh-tui-export-<timestamp>.md` in the current session cwd'],
            ['Clear', '`/clear`', 'clears the view only, never the session log'],
            ['Stop', 'session manager `Ctrl+X`', "stop the **background** session under the cursor; the session the current terminal is using can't be stopped (exit the whole TUI with `/exit` or double-press `Ctrl+C`)"],
            ['Exit', '`/exit` (or `/quit` `/q`)', "double-press `Ctrl+C` or `Ctrl+D` also exits when idle; mid-work, press `Ctrl+C`/`Ctrl+D` again to force quit when the interrupt won't settle"],
          ]),
          p('Command-line resume: `dsh-tui --resume` (last session) / `dsh-tui --resume <id>` (specific session). `-c` / `--continue` are equivalent.'),
        ],
      },
      {
        heading: 'Time-travel rewind (double-press Esc)',
        id: 'rewind',
        blocks: [
          p('**Double-press `Esc` on empty input** (or `/rewind`) to open the rewind selector:'),
          ol(
            'The selector lists **your own messages** (newest first); `↑/↓` + `Enter` to pick.',
            'If the model is working, the turn is cancelled first and allowed to settle (up to 30 s).',
            "The boundary is **before the turn** that message belongs to; you **can't rewind past the first message**.",
            'The system forks a new session, replays history to the rewind point, and **puts the original message back in the input** for editing and resend.',
            "The rewind branch stays in the `/resume` list and keeps the current model routing + the session's own preset.",
          ),
        ],
      },
      {
        heading: 'Message delivery while the model works',
        blocks: [
          p('Keys are on the [shortcuts page](../shortcuts/#send):'),
          ul(
            '`Enter` = **steer** (inject a next-step boundary, no interrupt)',
            '`Tab` = **follow-up** (queue after the turn)',
            '`Ctrl+Enter` = **interrupt** (interrupt and send)',
            '`Alt+Up` brings the last unhandled message back',
            '`↑` recalling a message that is still queued also withdraws that queued entry (same as `Alt+Up`, so the same text is not sent twice); once the running turn claimed it, only a notice appears',
            '`Esc` (with pending) interrupts and re-sends',
            '`/btw …` side questions never interrupt the main turn',
          ),
        ],
      },
      {
        heading: 'Side questions and the trace scene',
        blocks: [
          p('`/btw <question>`: one no-tool, single-turn answer reusing the current context, **not written to history, no token counted**; the main turn carries on. Panel `↑/↓` scroll · `c` copy · `Esc` close.'),
          p('`Ctrl+T` or `/trace` opens a full-screen view of the whole session timeline (it doesn\'t pollute scrollback); keys are on the [per-scene keys](../shortcuts/#per-scene) list.'),
        ],
      },
      {
        heading: 'Model switching and presets',
        blocks: [
          ul(
            '`/model`: selector. **Switching = fork the session** (history kept, only routing changes, the old session stays in `/resume`); persisted to `~/.dsh-tui/model.json`.',
            'Switching is rejected mid-turn.',
            "`/preset` options: `standard` (default full features), `ptc`, `minimal` (bash+editor only, no compaction), `cordis`, `liangshen` (Liangshen mode). **A session that already has messages can't switch** (blank-only): the choice only becomes the default for the next `/new`.",
            'Cycle session mode with `Shift+Tab`: default (workspace-write + approval) → plan (read-only) → full (danger-full-access).',
            'Third-party permission presets follow in registry order at the end.',
            '**After approving a plan or `/plan off`, sandbox and approval policy return to the pre-plan state**.',
          ),
        ],
      },
      {
        heading: 'Questionnaires and approvals',
        blocks: [
          p('Keys are on the [per-scene keys](../shortcuts/#per-scene) list. Key points:'),
          ul(
            'The questionnaire\'s **last line is a free-input line** (typing submits together with the option label).',
            'Plan review **approve must have no feedback text**.',
            'When an approval and a questionnaire hang at once, **approval wins**. An approval raised by a background session is tagged with the first 8 characters of that session id.',
          ),
        ],
      },
      {
        heading: 'Skills, registry, and Goals/Todos',
        blocks: [
          ul(
            '`/skills` browses the skill catalog; a direct-call skill joins the command menu as `/name` (dsh-TUI ships no generic skills).',
            '`/plan` `/goal` `/feedback` `/permission` come from the DSH registry, merged into the `/` menu.',
            '**The Goals/Todos panel appears automatically**: when the model writes a goal/todo, it renders above the input (🎯 goal + phase badge + tree todo), no action needed.',
          ),
        ],
      },
      {
        heading: 'MCP, workspaces, and providers',
        blocks: [
          ul(
            '`/mcp`: lists `mcp__server__tool` grouped by server; shows a `cordis.patch.yml` snippet when unconfigured.',
            '`/workspace`: `resume` / `rename <name>` / `open <path|file:// URI>` (open and start a new session); `dsh-tui <path>` also accepts a workspace target.',
            '`/doctor` checks Node/platform, API key, model routing, cwd, context window, session storage, and plugin host.',
            '`/provider` is an interactive wizard to add / edit / delete model providers; with dsh-auth bound it offers **OAuth subscription login** (ChatGPT / Claude / Grok, no API key).',
            'Non-env-variable keys are written to `~/.dsh/.credentials.yaml` (0600); the UI shows only `••••••`. Custom endpoints need a route name, API key, baseURL, and protocol (`openai-completions` / `openai-responses` / `anthropic-messages`). After add/edit, run `/model` to switch to the new route.',
            '`/init` creates AGENTS.md; `/agents` lists subagents; `/login` `/logout` manage credentials.',
            '`/permission` `/add-dir` explain permissions; `/hooks` `/connect` are placeholders.',
          ),
        ],
      },
    ],
  },
}

export default topic
