import { type GuideTopic, p, repoDoc, table, ul } from './types'

const topic: GuideTopic = {
  zh: {
    slug: 'customization',
    locale: 'zh-CN',
    navTitle: '模型、主题与语言',
    title: 'dsh-TUI 模型、预设、主题与语言',
    description: 'dsh-TUI 模型选择、推理强度、Agent 预设、主题与自定义主题、界面语言，以及 ~/.dsh-tui 偏好文件与常用环境变量。',
    intro: '模型、推理强度、预设、主题和语言都能在会话里用命令切换，并持久化到 `~/.dsh-tui/`；环境变量可以在启动时覆盖它们。',
    sections: [
      {
        heading: '一览',
        blocks: [
          table(['项', '命令', '说明'], [
            ['模型', '`/model`', '选择器；**切换 = fork 会话续聊**（历史保留、仅换路由）；持久化 `~/.dsh-tui/model.json`，重启与 `/new` 沿用。从没选过的话，用内置默认模型（当前为 `deepseek-flash`）'],
            ['推理强度', '`/effort`', '滑杆（`←/→` 实时）或 `/effort <id>`；`/effort status` 看当前；新会话默认档在 `/settings` → 默认推理强度'],
            ['Agent 预设', '`/preset`', '`standard` / `ptc`（旧 0.1.1 名 `code`）/ `minimal` / `cordis` / **梁神模式 `liangshen`**；**已开始会话不可切换**'],
            ['主题', '`/theme`', '`auto`（OSC 11 跟随终端背景）/ `light` / `dark` / `dark-ansi`；`/theme <名>` 直接切；`/theme status` 看解析结果'],
            ['自定义主题', '手动', `\`~/.dsh-tui/themes/<名>.json\`，\`{base, colors}\` 格式，选中即热切换；命名为 \`auto\` 会被内置遮蔽（详见[主题文档](${repoDoc('themes.md')})）`],
            ['语言', '`/lang`', '`en` / `zh` 热切换；优先级 `DSH_TUI_LANG` > profile 配置（旧版 settings.yaml 用户层 > cordis.yml）> 持久化'],
            ['状态行动画', '`/activity`', '选择器或 `/activity frames <名>`；默认 `moon8`，`random` 随机'],
          ]),
          p('**主题优先级**：`DSH_TUI_THEME` > `~/.dsh-tui/theme.json` > OSC 11 终端背景检测 > dark 回退。'),
        ],
      },
      {
        heading: '偏好文件',
        blocks: [
          p('`~/.dsh-tui/` 下的偏好文件均为 best-effort，文件损坏时回退默认值：'),
          ul('`theme.json`、`model.json`、`agent-preset.json`、`effort.json`、`working-activity.json`、`lang.json`、`trajectory.json`、`resume.txt` / `last-used.json`、`themes/<名>.json`'),
          p('界面行为类设置（布局、状态栏、快捷键等）不在这里，而是在 `/settings` 里编辑，见[设置项参考](../settings/)。'),
        ],
      },
      {
        heading: '常用环境变量',
        blocks: [
          ul(
            '`DSH_TUI_LANG`、`DSH_TUI_THEME`、`DSH_TUI_PRESET`、`DSH_TUI_PERSONA`',
            '`DSH_TUI_DISABLE_MOUSE`、`DSH_TUI_DISABLE_TERMINAL_IMAGES`、`DSH_TUI_IMAGE_PROTOCOL`、`DSH_TUI_ACCESSIBILITY`（无障碍：关动画/图形预览）',
            '`DSH_TUI_RESUME_SESSION`、`DSH_TUI_WORKSPACE_TARGET`、`DSH_TUI_SESSION_ROOT`、`DSH_TUI_DEBUG`、`DSH_TUI_RENDER_LOG`（帧取证）',
            '`DEEPSEEK_API_KEY`、`DEEPSEEK_BASE_URL`、`VISUAL`/`EDITOR`（`Ctrl+G` 外部编辑器）、`DSH_PERMISSION_MODE`',
          ),
        ],
      },
    ],
  },
  en: {
    slug: 'customization',
    locale: 'en',
    navTitle: 'Models and themes',
    title: 'dsh-TUI Models, Presets, Themes, and Language',
    description: 'Choose dsh-TUI models, reasoning effort, agent presets, themes and custom themes, and UI language; plus the ~/.dsh-tui preference files and common environment variables.',
    intro: 'Model, reasoning effort, preset, theme, and language can all be switched with commands inside a session and are persisted under `~/.dsh-tui/`; environment variables override them at launch.',
    sections: [
      {
        heading: 'Overview',
        blocks: [
          table(['Item', 'Command', 'Notes'], [
            ['Model', '`/model`', 'selector; **switching = fork the session** (history kept, routing only); persisted to `~/.dsh-tui/model.json`, reused on restart and `/new`. Never chosen → built-in default (currently `deepseek-flash`)'],
            ['Reasoning effort', '`/effort`', 'slider (`←/→` live) or `/effort <id>`; `/effort status` for current; the new-session default is set in `/settings` → default reasoning effort'],
            ['Agent preset', '`/preset`', "`standard` / `ptc` (old 0.1.1 name `code`) / `minimal` / `cordis` / **Liangshen mode `liangshen`**; **can't switch an already-started session**"],
            ['Theme', '`/theme`', '`auto` (OSC 11 follows terminal background) / `light` / `dark` / `dark-ansi`; `/theme <name>` direct; `/theme status` for the result'],
            ['Custom theme', 'manual', `\`~/.dsh-tui/themes/<name>.json\`, \`{base, colors}\` format, hot-swap on select; naming it \`auto\` gets shadowed by the built-in (see the [themes docs](${repoDoc('themes.en.md')}))`],
            ['Language', '`/lang`', '`en` / `zh` hot switch; priority `DSH_TUI_LANG` > profile config (legacy: settings.yaml user layer > cordis.yml) > persisted'],
            ['Status animation', '`/activity`', 'selector or `/activity frames <name>`; default `moon8`, `random` randomizes'],
          ]),
          p('**Theme priority**: `DSH_TUI_THEME` > `~/.dsh-tui/theme.json` > OSC 11 terminal-background detection > dark fallback.'),
        ],
      },
      {
        heading: 'Preference files',
        blocks: [
          p('Preference files under `~/.dsh-tui/` are all best-effort; a damaged file falls back to the default:'),
          ul('`theme.json`, `model.json`, `agent-preset.json`, `effort.json`, `working-activity.json`, `lang.json`, `trajectory.json`, `resume.txt` / `last-used.json`, `themes/<name>.json`'),
          p('Interface settings (layout, status bar, shortcuts, and so on) are edited in `/settings` instead; see the [settings reference](../settings/).'),
        ],
      },
      {
        heading: 'Common environment variables',
        blocks: [
          ul(
            '`DSH_TUI_LANG`, `DSH_TUI_THEME`, `DSH_TUI_PRESET`, `DSH_TUI_PERSONA`',
            '`DSH_TUI_DISABLE_MOUSE`, `DSH_TUI_DISABLE_TERMINAL_IMAGES`, `DSH_TUI_IMAGE_PROTOCOL`, `DSH_TUI_ACCESSIBILITY` (accessibility: no animation/graphics preview)',
            '`DSH_TUI_RESUME_SESSION`, `DSH_TUI_WORKSPACE_TARGET`, `DSH_TUI_SESSION_ROOT`, `DSH_TUI_DEBUG`, `DSH_TUI_RENDER_LOG` (frame capture)',
            '`DEEPSEEK_API_KEY`, `DEEPSEEK_BASE_URL`, `VISUAL`/`EDITOR` (`Ctrl+G` external editor), `DSH_PERMISSION_MODE`',
          ),
        ],
      },
    ],
  },
}

export default topic
