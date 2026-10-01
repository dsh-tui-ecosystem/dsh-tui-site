import type { Lang, Pair } from '../i18n'
import type { SpriteAnim, SpriteGeometry, SpriteSet } from './sprites/types'
import { DEEPY_WHALE } from './sprites/deepy-whale'
import { DEEPY_TERMINAL } from './sprites/deepy-terminal'
import { WHALE_GIRL } from './sprites/whale-girl-emoji'

/**
 * 桌宠预览页的数据。三套素材的原始页面放在 public/pets/<id>/，
 * 这里只取预览要用的部分：每个动画的标题、状态和触发事件；逐帧时长在 ./sprites/。
 * 这些数据从三个原始页面的内嵌数据里一次性提取，与原页面保持一致；
 * 改动画时请同时更新原页面和这里。
 */

export type PetId = 'deepy-whale' | 'deepy-terminal' | 'whale-girl-emoji'

/** [key, 标题, 英文标题, Clawd 状态, 触发说明] */
type Meta = [key: string, title: string, en: string, state: string, trigger: string]

export interface PetAnim extends SpriteAnim {
  title: Pair
  state: string
  trigger: Pair
}

export interface Pet extends SpriteGeometry {
  id: PetId
  name: Pair
  short: Pair
  kind: Pair
  desc: Pair
  facts: Pair[]
  /** 完整拆解页链接文字 */
  more: Pair
  surface: 'desk' | 'term'
  anims: PetAnim[]
  byKey: Record<string, PetAnim>
}

const DEEPY_META: Meta[] = [
  ['idle', '待机呼吸', 'Idle breathing', 'idle', '无任务 / SessionStart'],
  ['idle-look', '东张西望', 'Look around', 'idle (随机)', 'idleAnimations 随机池'],
  ['idle-spout', '开心喷水', 'Water spout', 'idle (随机)', 'idleAnimations 随机池'],
  ['thinking', '思考中', 'Thinking', 'thinking', 'UserPromptSubmit（刚收到提问）'],
  ['typing', '敲代码', 'Typing', 'working', 'PreToolUse / PostToolUse（1 个会话在跑工具）'],
  ['music', '戴耳机听歌', 'Headphones groove', 'juggling / working', 'SubagentStart（1 个子代理）或 2 个会话并行'],
  ['conducting', '带领小鲸鱼分身', 'Sub-agent squad', 'juggling (2+)', 'SubagentStart（≥2 个子代理）'],
  ['building', '戴安全帽砌砖', 'Building', 'working (3+)', '3 个以上会话同时干活'],
  ['error', '出错啦', 'Error', 'error', 'PostToolUseFailure / StopFailure'],
  ['happy', '任务完成！', 'Task complete', 'attention', 'Stop（任务完成）/ PostCompact'],
  ['notification', '需要你确认', 'Notification', 'notification', 'PermissionRequest / Notification'],
  ['compacting', '上下文清理（吸入压缩）', 'Context compaction', 'sweeping', 'PreCompact（上下文压缩/清理）'],
  ['carrying', '搬箱子', 'Carrying', 'carrying', 'WorktreeCreate（新建工作树）'],
  ['sleeping', '呼呼大睡', 'Sleeping', 'sleeping', '鼠标 60s 无操作 / 免打扰'],
  ['waking', '惊醒', 'Waking up', 'waking', '睡眠中移动鼠标'],
  ['poke-left', '戳左边', 'Poke (left)', 'reaction', '双击宠物左半边'],
  ['poke-right', '戳右边', 'Poke (right)', 'reaction', '双击宠物右半边'],
  ['tickle', '被挠痒痒', 'Tickled', 'reaction', '连续快速点击 4 下'],
  ['drag', '被拎起来', 'Dragged', 'reaction', '按住拖动宠物'],
  ['roam', '蹦跶散步', 'Roam hop', 'roam', '自由漫步（Free roam）'],
]

const TERMINAL_META: Meta[] = [
  ['idle', '待机', 'Idle', 'idle', '无任务'],
  ['idle-look', '东张西望', 'Look around', 'idle (随机)', '待机随机'],
  ['idle-spout', '开心喷水', 'Water spout', 'idle (随机)', '待机随机'],
  ['thinking', '思考中', 'Thinking', 'thinking', 'UserPromptSubmit'],
  ['typing', '敲代码', 'Typing', 'working', 'PreToolUse / PostToolUse'],
  ['music', '戴耳机听歌', 'Headphones', 'juggling / working', '1 个子代理 / 2 个会话'],
  ['conducting', '带领小鲸鱼分身', 'Sub-agent squad', 'juggling (2+)', 'SubagentStart ×2+'],
  ['building', '安全帽顶砖', 'Building', 'working (3+)', '3 个以上会话'],
  ['error', '出错啦', 'Error', 'error', 'PostToolUseFailure'],
  ['happy', '任务完成', 'Task complete', 'attention', 'Stop'],
  ['notification', '需要你确认', 'Needs you', 'notification', 'PermissionRequest'],
  ['compacting', '上下文清理', 'Context compaction', 'sweeping', 'PreCompact'],
  ['carrying', '顶箱子', 'Carrying', 'carrying', 'WorktreeCreate'],
  ['sleeping', '呼呼大睡', 'Sleeping', 'sleeping', '60 秒无操作'],
  ['waking', '被吵醒', 'Waking up', 'waking', '睡眠中移动鼠标'],
  ['poke-left', '戳左边', 'Poke (left)', 'reaction', '点击左半边'],
  ['poke-right', '戳右边', 'Poke (right)', 'reaction', '点击右半边'],
  ['tickle', '被挠痒痒', 'Tickled', 'reaction', '连续点击 4 下'],
  ['drag', '被拎起来', 'Dragged', 'reaction', '按住拖动'],
  ['swim', '游来游去', 'Swim', 'roam', '自由漫步 / 空闲'],
]

const GIRL_META: Meta[] = [
  ['idle', '待机眨眼', 'Idle', 'idle', 'SessionStart，或者没有活的时候'],
  ['idle-look', '东张西望', 'Look around', 'idle', '待机时随机播放'],
  ['idle-spout', '开心喷水', 'Water spout', 'idle', 'idleAnimations，待机时随机播放'],
  ['thinking', '思考中', 'Thinking', 'thinking', 'UserPromptSubmit，收到提问'],
  ['typing', '敲代码', 'Typing', 'working', 'PreToolUse，1 个会话在跑工具'],
  ['music', '戴耳机听歌', 'Headphones', 'working', 'PreToolUse，2 个会话同时跑工具'],
  ['conducting', '小鲸鱼分身', 'Sub-agents', 'juggling', 'SubagentStart，派出 2 个以上子代理'],
  ['building', '施工中', 'Building', 'working', 'PreToolUse，3 个以上会话同时跑工具'],
  ['error', '出错啦', 'Error', 'error', 'PostToolUseFailure，工具执行失败'],
  ['happy', '任务完成', 'Task complete', 'attention', 'Stop / PostCompact，任务完成'],
  ['notification', '需要你确认', 'Needs you', 'notification', 'PermissionRequest，等你批准'],
  ['compacting', '上下文清理', 'Context compaction', 'sweeping', 'PreCompact，压缩上下文之前'],
  ['carrying', '抱书搬运', 'Carrying', 'carrying', 'WorktreeCreate，新建工作区'],
  ['sleeping', '呼呼大睡', 'Sleeping', 'sleeping', '鼠标 60 秒没动'],
  ['waking', '被吵醒', 'Waking up', 'waking', '睡着时动鼠标或点她'],
  ['poke-left', '戳左边', 'Poke (left)', 'reaction', '单击她的左脸'],
  ['poke-right', '戳右边', 'Poke (right)', 'reaction', '单击她的右脸'],
  ['tickle', '被挠痒痒', 'Tickled', 'reaction', '连续快速点击（1 秒内 3 下以上）'],
  ['drag', '被拎起来', 'Dragged', 'reaction', '按住她拖动'],
  ['swim', '游来游去', 'Swim', 'idle · roam', '自由漫游'],
  ['smile-hearts', '看着微笑冒爱心', 'Smile & hearts', 'bonus', '不绑定事件，可做完成时的随机彩蛋'],
  ['thumbs-up', '看着举大拇指', 'Thumbs up', 'bonus', '不绑定事件，可做完成时的随机彩蛋'],
]

/** 英文触发说明：三套素材共用一套 hook 映射，按动画 key 取 */
const TRIGGER_EN: Record<string, string> = {
  idle: 'SessionStart, or nothing to do',
  'idle-look': 'Random idle animation',
  'idle-spout': 'idleAnimations (random)',
  thinking: 'UserPromptSubmit — a prompt just arrived',
  typing: 'PreToolUse — one session running tools',
  music: 'Two sessions running tools at once',
  conducting: 'SubagentStart — two or more subagents',
  building: 'Three or more sessions at work',
  error: 'PostToolUseFailure',
  happy: 'Stop / PostCompact — task complete',
  notification: 'PermissionRequest — waiting for you',
  compacting: 'PreCompact — context compaction',
  carrying: 'WorktreeCreate — new worktree',
  sleeping: 'No mouse activity for 60 s',
  waking: 'Mouse moves while asleep',
  'poke-left': 'Click the left side',
  'poke-right': 'Click the right side',
  tickle: 'Several quick clicks',
  drag: 'Press and drag',
  roam: 'Free roam',
  swim: 'Free roam',
  'smile-hearts': 'Bonus — not bound to an event',
  'thumbs-up': 'Bonus — not bound to an event',
}

type PetInfo = Omit<Pet, keyof SpriteGeometry | 'id' | 'anims' | 'byKey'>

function build(sprites: SpriteSet, meta: Meta[], info: PetInfo): Pet {
  const anims = meta.map(([key, title, en, state, trigger]): PetAnim => ({
    ...sprites.anims[key],
    title: { zh: title, en },
    state,
    trigger: { zh: trigger, en: TRIGGER_EN[key] ?? trigger },
  }))
  return {
    id: sprites.id as PetId,
    frame: sprites.frame,
    grid: sprites.grid,
    cols: sprites.cols,
    ...info,
    anims,
    byKey: Object.fromEntries(anims.map((a) => [a.key, a])),
  }
}

export const PETS: Pet[] = [
  build(DEEPY_WHALE, DEEPY_META, {
    name: { zh: 'Deepy 小鲸鱼', en: 'Deepy the whale' },
    short: { zh: 'Deepy', en: 'Deepy' },
    kind: { zh: '桌面版 · Clawd on Desk 主题包', en: 'Desktop · Clawd on Desk theme' },
    desc: {
      zh: '给 DeepSeek 驱动的编程 agent 做的像素桌宠：思考时冒云，跑工具时趴在键盘后写代码，开子代理就用尾巴打拍子带一群小分身干活，出错冒烟，完成了就空翻庆祝。所有动作都用 squash & stretch 和阻尼弹簧做出 Q 弹手感。',
      en: 'A pixel desk pet for DeepSeek-powered coding agents. It puffs a thought cloud while thinking, types behind a keyboard while tools run, conducts a squad of mini clones for subagents, smokes on errors and backflips when a task is done — all with squash & stretch and damped springs.',
    },
    facts: [
      { zh: '20 个动图', en: '20 animations' },
      { zh: '52×52 像素网格', en: '52×52 pixel grid' },
      { zh: '20 fps · 50ms/帧', en: '20 fps · 50 ms/frame' },
      { zh: '通过 Clawd 官方主题校验', en: 'Passes Clawd theme validation' },
    ],
    more: { zh: '逐帧运动逻辑与主题包下载', en: 'Frame-by-frame breakdown & theme pack' },
    surface: 'desk',
  }),
  build(DEEPY_TERMINAL, TERMINAL_META, {
    name: { zh: 'Deepy 终端版', en: 'Deepy, terminal edition' },
    short: { zh: 'Deepy · 终端', en: 'Deepy · TUI' },
    kind: { zh: '终端版 · 42 列 × 15 行', en: 'Terminal · 42 × 15 cells' },
    desc: {
      zh: '放在终端页里的版本。小鲸鱼趴着不动，只换表情、摆尾巴、在身边冒出小道具，所有动静都收在它自己那一小块地方里。每一帧都是整像素的静态画面，用半块字符 ▀ 画出来，正好 42 列 × 15 行。',
      en: 'The version that lives inside a terminal. The whale stays put and only changes its face, swishes its tail and pops out little props, all within its own small patch. Every frame is whole-pixel art drawn with ▀ half-block characters — exactly 42 columns × 15 rows.',
    },
    facts: [
      { zh: '20 个动画', en: '20 animations' },
      { zh: '42×30 像素', en: '42×30 pixels' },
      { zh: '半块字符 ▀ 渲染', en: 'Drawn with ▀ half blocks' },
      { zh: '附 Python / Node 终端播放器', en: 'Python & Node terminal players' },
    ],
    more: { zh: '逐帧拆解与终端素材包', en: 'Frame-by-frame breakdown & terminal kit' },
    surface: 'term',
  }),
  build(WHALE_GIRL, GIRL_META, {
    name: { zh: '鲸娘像素表情集', en: 'Whale Girl pixel stickers' },
    short: { zh: '鲸娘', en: 'Whale Girl' },
    kind: { zh: '表情集 · 22 个循环', en: 'Sticker set · 22 loops' },
    desc: {
      zh: '同一个鲸娘，22 个动作：待机、思考、敲代码、戴耳机听歌、小鲸鱼分身、搭积木施工、抱书搬运、出错、任务完成、被戳、被拎起来……弹性全部靠整格像素做出来，呆毛、耳鳍、长发都晚一拍甩，尾巴绕着根部摆。',
      en: 'One whale girl, 22 loops: idling, thinking, typing, headphones on, sub-agent clones, building, carrying books, errors, task complete, pokes, being picked up… Every bounce is made of whole pixels, with the ahoge, ear fins and long hair trailing a beat behind.',
    },
    facts: [
      { zh: '22 个循环动图', en: '22 loops' },
      { zh: '69×66 逻辑像素', en: '69×66 logical pixels' },
      { zh: '导出放大 8×', en: 'Exported at 8×' },
      { zh: '透明底 GIF', en: 'Transparent GIFs' },
    ],
    more: { zh: '逐帧拆解、分层骨骼与 GIF 下载', en: 'Frame breakdown, layer rig & GIF downloads' },
    surface: 'desk',
  }),
]

export const PET_BY_ID = Object.fromEntries(PETS.map((p) => [p.id, p])) as Record<PetId, Pet>

export const PET_FRAME_COUNT = PETS.reduce((n, p) => n + p.anims.reduce((m, a) => m + a.durs.length, 0), 0)
export const PET_ANIM_COUNT = PETS.reduce((n, p) => n + p.anims.length, 0)

/** 状态名里的“随机”在英文页换掉，其余是 Clawd 的原始状态码 */
export function stateLabel(state: string, lang: Lang) {
  return lang === 'en' ? state.replaceAll('随机', 'random') : state
}

export interface PetEvent {
  code: string
  name: Pair
  key: string
  /** 某套素材里对应动画的 key 不同时在这里改写 */
  alt?: Partial<Record<PetId, string>>
  /** 临时状态：播放这么多遍后回到之前的状态 */
  loops?: number
}

/** 按 Clawd on Desk 的 hook → 状态映射；三套素材共用 */
export const PET_EVENTS: PetEvent[] = [
  { code: 'SessionStart', name: { zh: '空闲待机', en: 'Idle' }, key: 'idle' },
  { code: 'UserPromptSubmit', name: { zh: '收到提问', en: 'Prompt received' }, key: 'thinking' },
  { code: 'PreToolUse', name: { zh: '跑工具写代码', en: 'Running a tool' }, key: 'typing' },
  { code: 'PreToolUse ×2', name: { zh: '两个会话并行', en: '2 sessions' }, key: 'music' },
  { code: 'PreToolUse ×3', name: { zh: '三个以上会话', en: '3+ sessions' }, key: 'building' },
  { code: 'SubagentStart ×3', name: { zh: '开子代理分身', en: 'Subagents' }, key: 'conducting' },
  { code: 'PostToolUseFailure', name: { zh: '工具报错', en: 'Tool failed' }, key: 'error', loops: 2 },
  { code: 'Stop', name: { zh: '任务完成', en: 'Task complete' }, key: 'happy', loops: 2 },
  { code: 'PermissionRequest', name: { zh: '需要你确认', en: 'Needs approval' }, key: 'notification', loops: 3 },
  { code: 'PreCompact', name: { zh: '上下文清理', en: 'Compacting' }, key: 'compacting' },
  { code: 'WorktreeCreate', name: { zh: '新建工作树', en: 'New worktree' }, key: 'carrying', loops: 2 },
  { code: 'idle 60s', name: { zh: '睡着了', en: 'Dozed off' }, key: 'sleeping' },
  { code: 'mousemove', name: { zh: '把它吵醒', en: 'Wake it up' }, key: 'waking', loops: 1 },
  { code: 'idleAnimations', name: { zh: '开心喷水', en: 'Happy spout' }, key: 'idle-spout', loops: 1 },
  { code: 'free roam', name: { zh: '游来游去', en: 'Free roam' }, key: 'swim', alt: { 'deepy-whale': 'roam' } },
  { code: 'drag', name: { zh: '拎起来', en: 'Picked up' }, key: 'drag' },
]

/** 自动演示：一次典型的 agent 会话，[事件, 停留毫秒] */
export const PET_DEMO: [string, number][] = [
  ['SessionStart', 2400],
  ['UserPromptSubmit', 2800],
  ['PreToolUse', 3200],
  ['SubagentStart ×3', 3600],
  ['PostToolUseFailure', 2800],
  ['PreToolUse ×3', 3600],
  ['PermissionRequest', 2800],
  ['PreCompact', 3400],
  ['Stop', 3200],
  ['idleAnimations', 3000],
  ['idle 60s', 4800],
  ['mousemove', 2000],
]

export function animFor(pet: Pet, ev: PetEvent) {
  return pet.byKey[ev.alt?.[pet.id] ?? ev.key] ?? pet.byKey.idle
}

export const PETS_COPY = {
  title: { zh: '桌宠动态预览', en: 'Desk pets, live' },
  kicker: { zh: 'DESK PETS · 3 SETS', en: 'DESK PETS · 3 SETS' },
  intro: {
    zh: '三套像素桌宠，跟着 agent 的 hook 事件换动作：收到提问时思考，跑工具时敲键盘，出错冒烟，任务完成就庆祝。下面的事件会同时发给三只；也可以直接点它们，戳左边或右边。',
    en: 'Three sets of pixel desk pets that change what they are doing as agent hook events arrive: they think on a new prompt, type while tools run, smoke on errors and celebrate when a task is done. Each event below goes to all three at once — or click a pet to poke its left or right side.',
  },
  breadcrumb: { zh: '桌宠预览', en: 'Desk pets' },
  listener: { zh: 'hook listener · 3 只桌宠', en: 'hook listener · 3 pets' },
  auto: { zh: '自动演示', en: 'Auto demo' },
  events: { zh: '模拟 agent 事件', en: 'Simulate agent events' },
  waiting: { zh: '等待 hook 事件…', en: 'Waiting for hook events…' },
  poke: { zh: '戳一下', en: 'Poke' },
  pokeHint: { zh: '点它们可以戳一下', en: 'Click a pet to poke it' },
  open: { zh: '打开', en: 'Open' },
  galleryTitle: { zh: '全部动作', en: 'Every animation' },
  galleryDesc: {
    zh: '每张卡片都按导出时的真实帧时长循环。完整页面里还能逐帧拖动、看缓动曲线和图层，并下载 GIF 与素材包。',
    en: 'Each card loops at the exact frame timings it was exported with. The full pages let you scrub frame by frame, read the easing curves and layers, and download the GIFs and packs.',
  },
  setsLabel: { zh: '素材集', en: 'Sets' },
  frames: { zh: '帧', en: 'frames' },
  zhOnly: { zh: '', en: ' (in Chinese)' },
  footer: { zh: 'dsh-TUI · 桌宠预览', en: 'dsh-TUI · desk pets' },
  hover: { zh: '悬停播放', en: 'Hover to play' },
} satisfies Record<string, Pair>
