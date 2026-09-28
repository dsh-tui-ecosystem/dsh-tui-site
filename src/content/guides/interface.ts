import { type GuideTopic, h3, p, ul } from './types'

const topic: GuideTopic = {
  zh: {
    slug: 'interface',
    locale: 'zh-CN',
    navTitle: '界面与状态栏',
    title: 'dsh-TUI 界面、状态栏与终端要求',
    description: 'dsh-TUI 开屏鲸鱼 Logo 区、底部三行状态栏、/settings 设置编辑器、终端与图片预览要求，以及 dsh-tui safe 安全模式。',
    intro: '空会话顶部是鲸鱼 Logo 区，输入框下方是三行状态栏；这里说明每块区域显示什么、怎么开关，以及对终端的要求。',
    sections: [
      {
        heading: '开屏 Logo 区',
        id: 'header',
        blocks: [
          p('空会话顶部是鲸鱼 Logo 区（随对话滚动消失）：'),
          ul(
            '**开场动画**（约 3.4 秒，每次启动三选一，`/deepseek` 彩蛋重掷）：经典 / 爱心 / 睡觉。',
            '**欢迎期闲置动画**（`whaleIdle`，默认开）：摆鱼鳍、眨眼、拍尾巴，空闲 10 秒入睡冒 Z；**点击冒爱心唤醒**。',
            '**女仆娘立绘**（`whaleGirl`，默认关）：把标题的像素鲸鱼换成作者绘制的女仆娘——**最优先**走终端图像协议（Kitty/Sixel）的真图渲染；终端不支持（如内联模式）时回落到字符画版女仆娘。**点她一下**会换成「高兴鲸娘」几秒再自动回安静版；开始第一个任务后定格、不再响应点击。',
            '开始第一个 agent 任务后定格为静态帧（`/new` 重新进入欢迎期）。',
            '鲸鱼右侧文字列：`✦ dsh-TUI v版本号` → 块体大字 `DEEPSEEK / HARNESS`（加粗字形，两行等宽、中间空一行）→ 当前模型 + effort → 工作目录 → 启动提示行。',
            '大字字面按**本地日期**轮换（8 款：加粗 / 方角实心 / 半立体 / 宽体 / 点阵灰度 / 镂空模板 / 细笔 / 方板）：同一天内恒定、隔天换一款，与启动时刻无关。想固定看某一款，就在 `/settings → 开屏大字字体`（`splashFont`）选它——选具体某款即 pin 住，选回「按天轮换」（默认）恢复轮换；改完立即生效。',
            '版本不在验证范围时多出 **⚠ 版本漂移警告**（附对齐命令）。',
            '鲸鱼下方居中欢迎语：`探索未至之境！`',
            '终端变窄按**内容区列数**逐档降级：**≥ 97 列**鲸鱼 + 大字；**55–96 列**只留大字（先撤鲸鱼）；**40–54 列**只留鲸鱼；**< 40 列**退成一行 `DeepSeek Harness` 纯文字。门槛随字面宽度浮动（97 列是 6 列字身那几款的数；最宽的 `wide` 要 113 列，5 列的 `classic`/`slab` 96 列就够）。',
            '像素鲸鱼原图与闲置行为移植自 [dsh-ui-whale](https://github.com/lhh010/dsh-ui-whale)（作者 [@lhh010](https://github.com/lhh010)），特此致谢。',
          ),
          h3('超长单行折叠（默认开）'),
          ul(
            '**单行超过 1000 字符**的文本折叠为 `… 已折叠 N 字符（点击或 ctrl+o 展开）` 标记。',
            '展开：**鼠标点这一行**（工具卡点卡面）再点收起；键盘用 `Ctrl+O`。',
            '思考（thinking）行不折叠。',
          ),
        ],
      },
      {
        heading: '底部状态栏',
        id: 'status-bar',
        blocks: [
          p('输入框下方共三行，每个字段都能在 `/settings` 的「底栏设置」里单独开关。'),
          h3('第 1 行：上下文分段进度条'),
          p('由 `statusBar.contextBar` 控制，默认开。'),
          ul(
            '按内容类型分段着色（system / prompt / assistant / thinking / tools）。',
            '条上唯一文字是最右缘读数 `13k/64k 19.5%`（窄屏只显示 `19.5%`）。',
            '读数按占用率变色：<80% 灰蓝，**≥80% 琥珀、≥95% 红**。',
            '悬停整条弹出图例：色块 + 名称 + token 数（窄屏自动改用短名）。',
          ),
          h3('第 2 行：状态字段'),
          ul(
            '左组：模型 → TPS → thinking → mode → ctx → cache 缓存命中率 → tokens（`1.2k→340` 输入→输出）→ cost（`≈¥0.05 谷`，**估算是参考，以平台账单为准**，仅官方模型显示）。',
            '右组：git 分支 → 工作目录（紧凑模式仅 basename）→ 会话标题 → 短会话 ID（`#` + 前 8 位，方便 `--resume` 定位）。',
            '`statusBar.compact` 时左右合并为单行。',
            '默认开：compact、model、thinking、cwd、contextUsage、cache、cost、goal、contextBar。',
            '默认关：tokens、tps、gitBranch、sessionTitle、sessionId、mode、activity、trajectory。',
          ),
          h3('第 3 行：提示、工作活动与迷你轨迹条'),
          ul(
            '空闲显示 `? for shortcuts`、运行中 `esc to interrupt`、选择中 `esc to return to input`。',
            '空闲还显示 working-activity 动画帧（`statusBar.activity` 开），上下文 ≥80% 琥珀、≥95% 红。',
            '右侧**迷你轨迹条 MiniWake**（`statusBar.trajectory`，默认关）：会话投影为密度字形，颜色区分通道，失败列染红；窄屏降格/隐藏。',
          ),
          h3('TPS 仪表'),
          p('由 `statusBar.tps` 控制，默认关。流式中显示实时 gauge + `N tps`，回合后显示 sparkline；速度 **≥50 绿 / ≥20 黄 / <20 红**。'),
        ],
      },
      {
        heading: '/settings 设置编辑器',
        id: 'settings-editor',
        blocks: [
          p('`/settings` 打开插件设置编辑器；**改动自动保存**，`Esc` 直接退出。dsh-tui 自身区块在 0.1.7 写入当前 profile 的 `cordis.patch.yml`，旧版写入 settings.yaml 用户层。多数设置实时生效；全屏和图片预览开关需 `/restart`。'),
          p('每个设置项的类型、默认值、可选值和说明见[设置项参考](../settings/)，它直接取自对应 dsh-TUI 发布版本随包附带的设置清单。下面补充几项的细节：'),
          ul(
            '**effortDefault**：模型没有该档时自动就近降级并弹提示；优先级 settings 用户层 > cordis `effort` > 上次 `/effort`（effort.json）> 模型默认。',
            '**scrollGutter**：scrollbar 轨道可直接拖；`Shift`/`Alt`/`Ctrl`+拖动仍是文字选择。',
            '**pageMargin**：自定义 `NxM` = 左右 `N` 列、上下 `M` 行（上限 8x4）；只填 `N` 则上下 1 行。',
          ),
          p('未声明 TUI 区块的命名空间以只读形式列出，需手工编辑 profile 配置（旧版为 `~/.dsh/settings.yaml`）。以下设置**不在 /settings 内**，改 `$DSH_HOME/profiles/dsh-tui/cordis.patch.yml`：provider / model / cwd / preset / workspace / sessionId / modes，以及启动级 `effort` 键。'),
        ],
      },
      {
        heading: '终端要求',
        id: 'terminal',
        blocks: [
          ul(
            '必须交互 TTY；推荐 Windows Terminal（≥110 列、等宽、TrueColor）。',
            'macOS 的 ⌘ 修饰键需要扩展键盘协议（iTerm2 / kitty / WezTerm / ghostty / tmux）；Terminal.app 用 Ctrl。',
            'VS Code：装 companion 扩展 `dsh-tui-vscode`（拿到 **IDE 选区通道**，需 ≥ 0.7.0），或直接在集成终端运行 `dsh-tui`。',
            '**图片**：缩略图与大图预览需要 Kitty graphics 或 Sixel（自动探测，Kitty 优先）。`DSH_TUI_IMAGE_PROTOCOL=auto|kitty|sixel|none` 覆盖协议，`DSH_TUI_DISABLE_TERMINAL_IMAGES=1` 强制关闭。tmux/screen、非 TTY、无障碍模式下只显示文字，不影响把图片发给模型。',
            '环境自检：`/doctor`。',
          ),
        ],
      },
      {
        heading: '安全模式与救援 profile',
        id: 'safe-mode',
        blocks: [
          p('dsh 意外退出时，`dsh-tui safe` 安全模式给出**只读**的环境诊断、profile 插件清单和修复指引。'),
          ul(
            '**两个入口**：手动跑 `dsh-tui safe`；或 dsh 非零退出后按屏幕提示进入（非交互环境只打一行提示）。',
            '**只读范围**：诊断/清单/指引都不改状态。例外：重试正常启动、创建/复用空白救援 profile（只写 `$DSH_HOME/profiles/dsh-tui-safe/`）。',
            '**救援 profile 先要证明干净**（无第三方插件、无 `cordis.patch.yml` 条目），证不出就拒绝并打印处理方法。',
            '**非交互**：`dsh-tui safe --rescue` 只报告结论（就绪退出 0，被拒绝退出 1）。',
            '**修复命令要自己执行**（安全模式只列出）：`dsh plugin --profile dsh-tui remove <第三方插件>` 移除可疑插件；`dsh plugin --profile dsh-tui add @deepseek-harness-tui/dsh-tui@<版本>` 重装对齐；`dsh-tui doctor` 环境诊断。',
          ),
        ],
      },
    ],
  },
  en: {
    slug: 'interface',
    locale: 'en',
    navTitle: 'Interface',
    title: 'dsh-TUI Interface, Status Bar, and Terminal Requirements',
    description: 'The dsh-TUI splash header, the three-row status bar, the /settings editor, terminal and image-preview requirements, and dsh-tui safe mode.',
    intro: 'An empty session opens with the whale header, and three status rows sit under the input. This page covers what each area shows, how to toggle it, and what the terminal needs to support.',
    sections: [
      {
        heading: 'Splash header',
        id: 'header',
        blocks: [
          p('An empty session shows the whale logo area at the top (it scrolls away with the conversation):'),
          ul(
            '**Intro animation** (~3.4 s, one of three picked each launch; the `/deepseek` easter egg re-rolls): classic / heart / sleep.',
            '**Welcome idle animation** (`whaleIdle`, default on): fin, blink, tail wag, sleeps with Z after 10 s idle; **click to show a heart and wake it**.',
            '**Maid portrait** (`whaleGirl`, default off): swaps the header\'s pixel whale for the author-drawn maid — first as a **real raster** through the terminal image protocols (Kitty/Sixel); terminals without graphics support fall back to the character-art maid. **Click her** and she turns into the "happy" portrait for a few seconds, then eases back on her own; the first agent task freezes her (no more reactions).',
            'After the first agent task, the header freezes to a static frame (`/new` re-enters the welcome period).',
            'Text column right of the whale: `✦ dsh-TUI v<version>` → `DEEPSEEK / HARNESS` big text (bold glyphs, both rows the same width, one blank row between) → current model + effort → working directory → startup hint line.',
            'The big-text face rotates by **local date** (eight faces: bold / square / bevel / wide / dot / stencil / classic / slab): the same day always shows the same one, independent of launch time. To keep one face, pick it in `/settings → Splash font` (`splashFont`) — choosing a specific face pins it, choosing "Daily rotation" (the default) restores the rotation; it applies immediately.',
            'Out of the verified range, a **⚠ version-drift warning** appears (with the align command).',
            'A centered tagline sits under the whale.',
            'Narrow terminals climb down a ladder on the **content-area** width: **≥ 97 columns** whale + big text; **55–96** the big text alone (the whale goes first); **40–54** the whale alone; **< 40** a single plain `DeepSeek Harness` line. The thresholds follow the face width (97 columns is the 6-column faces; the widest, `wide`, needs 113, and the 5-column `classic`/`slab` fit at 96).',
            'Pixel whale art and idle behavior are ported from [dsh-ui-whale](https://github.com/lhh010/dsh-ui-whale) (author [@lhh010](https://github.com/lhh010)), with thanks.',
          ),
          h3('Long single-line fold (default on)'),
          ul(
            'Text with **a single line over 1000 characters** folds into a "folded N characters (click or ctrl+o to expand)" marker.',
            'Expand: **click the line** (tool card: click the card) to unfold, click again to fold; keyboard `Ctrl+O`.',
            "Thinking lines don't fold.",
          ),
        ],
      },
      {
        heading: 'Bottom status bar',
        id: 'status-bar',
        blocks: [
          p('Three rows sit under the input. Every field has its own toggle in the status-bar page of `/settings`.'),
          h3('Row 1: context segment bar'),
          p('Controlled by `statusBar.contextBar`, default on.'),
          ul(
            'Colored by content type (system / prompt / assistant / thinking / tools).',
            'The only text on the bar is the right-edge reading `13k/64k 19.5%` (narrow screens show only `19.5%`).',
            'The reading colors by usage: <80% gray-blue, **≥80% amber, ≥95% red**.',
            'Hover the bar for the legend: color block + name + token count (narrow screens shorten the names).',
          ),
          h3('Row 2: status fields'),
          ul(
            'Left group: model → TPS → thinking → mode → ctx → cache hit rate → tokens (`1.2k→340` input→output) → cost (`≈¥0.05`, **an estimate; the platform bill is authoritative**; official models only).',
            'Right group: git branch → working directory (basename only in compact mode) → session title → short session ID (`#` + first 8 chars, for `--resume`).',
            '`statusBar.compact` merges the two sides into one row.',
            'Default on: compact, model, thinking, cwd, contextUsage, cache, cost, goal, contextBar.',
            'Default off: tokens, tps, gitBranch, sessionTitle, sessionId, mode, activity, trajectory.',
          ),
          h3('Row 3: hints, working activity, and mini trace bar'),
          ul(
            'Idle shows `? for shortcuts`, running `esc to interrupt`, selecting `esc to return to input`.',
            'Idle also shows the working-activity animation (`statusBar.activity` on); context ≥80% turns amber, ≥95% red.',
            'Right-side **mini trace bar MiniWake** (`statusBar.trajectory`, default off): the session projected as density glyphs, color per channel, failures red; degrades or hides on narrow screens.',
          ),
          h3('TPS gauge'),
          p('Controlled by `statusBar.tps`, default off. Streaming shows a live gauge + `N tps`, and a sparkline after the turn; speed **≥50 green / ≥20 yellow / <20 red**.'),
        ],
      },
      {
        heading: 'The /settings editor',
        id: 'settings-editor',
        blocks: [
          p('`/settings` opens the plugin settings editor; **changes save automatically**, and `Esc` exits directly. On dsh 0.1.7 the dsh-tui block writes to the active profile\'s `cordis.patch.yml`; older hosts use the settings.yaml user layer. Most settings apply live; fullscreen and image preview need `/restart`.'),
          p('The type, default, options, and description of every key are in the [settings reference](../settings/), generated from the settings manifest shipped with the matching dsh-TUI release. A few extra details:'),
          ul(
            '**effortDefault**: when the model lacks that level, it drops one level and shows a notice; priority is settings user layer > cordis `effort` > last `/effort` (effort.json) > model default.',
            '**scrollGutter**: the scrollbar track can be dragged directly; `Shift`/`Alt`/`Ctrl`+drag is still text selection.',
            '**pageMargin**: custom `NxM` = `N` columns left/right, `M` rows top/bottom (cap 8x4); only `N` means 1 row top/bottom.',
          ),
          p('Namespaces not declared as TUI blocks are listed read-only; edit the profile config by hand (`~/.dsh/settings.yaml` on older hosts). These settings are **not in /settings** — edit `$DSH_HOME/profiles/dsh-tui/cordis.patch.yml`: provider / model / cwd / preset / workspace / sessionId / modes, plus the startup-level `effort` key.'),
        ],
      },
      {
        heading: 'Terminal requirements',
        id: 'terminal',
        blocks: [
          ul(
            'Interactive TTY required; Windows Terminal recommended (≥110 columns, monospace, TrueColor).',
            'The macOS `⌘` modifier needs the extended keyboard protocol (iTerm2 / kitty / WezTerm / ghostty / tmux); in Terminal.app, use Ctrl.',
            'VS Code: install the companion extension `dsh-tui-vscode` for the **IDE selection channel** (needs ≥ 0.7.0), or run `dsh-tui` directly in the integrated terminal.',
            '**Images**: thumbnails and full preview need Kitty graphics or Sixel (auto-detected, Kitty preferred). `DSH_TUI_IMAGE_PROTOCOL=auto|kitty|sixel|none` overrides the protocol; `DSH_TUI_DISABLE_TERMINAL_IMAGES=1` forces preview off. tmux/screen, non-TTY, and accessibility mode show text only; sending images to the model is unaffected.',
            'Environment check: `/doctor`.',
          ),
        ],
      },
      {
        heading: 'Safe mode and the rescue profile',
        id: 'safe-mode',
        blocks: [
          p('When dsh exits unexpectedly, `dsh-tui safe` gives a **read-only** environment diagnosis, the profile plugin list, and fix guidance.'),
          ul(
            '**Two entry points**: run `dsh-tui safe` manually, or follow the on-screen prompt after a non-zero dsh exit (non-interactive environments just print a line).',
            '**Read-only scope**: diagnosis, list, and guidance change no state. Exceptions: retrying a normal startup, and creating or reusing a blank rescue profile (writes only `$DSH_HOME/profiles/dsh-tui-safe/`).',
            '**The rescue profile must prove clean first** (no third-party plugins, no `cordis.patch.yml` entries); otherwise it refuses and prints how to handle it.',
            '**Non-interactive**: `dsh-tui safe --rescue` only reports the verdict (ready exits 0, refused exits 1).',
            '**Run the fix commands yourself** (safe mode only lists them): `dsh plugin --profile dsh-tui remove <third-party-plugin>` removes a suspicious plugin; `dsh plugin --profile dsh-tui add @deepseek-harness-tui/dsh-tui@<version>` reinstalls to align; `dsh-tui doctor` runs the environment diagnosis.',
          ),
        ],
      },
    ],
  },
}

export default topic
