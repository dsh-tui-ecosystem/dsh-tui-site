import type { Lang, Pair } from '../i18n'

/**
 * 桌宠预览页的数据。三套素材的原始页面放在 public/pets/<id>/，
 * 这里只取预览要用的部分：每个动画的标题、状态、触发事件和逐帧时长。
 * 这些数据从三个原始页面的内嵌数据里一次性提取，与原页面保持一致；
 * 改动画时请同时更新原页面和这里。
 */

export type PetId = 'deepy-whale' | 'deepy-terminal' | 'whale-girl-emoji'

/** 逐帧时长，[ms, n] 表示连续 n 帧都是 ms */
type Durs = (number | [number, number])[]

interface RawAnim {
  key: string
  file: string
  title: string
  en: string
  state: string
  trigger: string
  durs: Durs
}

export interface PetAnim {
  key: string
  title: Pair
  state: string
  trigger: Pair
  durs: number[]
  starts: number[]
  total: number
  /** 精灵表，相对 /pets/ 目录 */
  sheet: string
}

export interface Pet {
  id: PetId
  name: Pair
  short: Pair
  kind: Pair
  desc: Pair
  facts: Pair[]
  /** 完整拆解页链接文字 */
  more: Pair
  /** 精灵表里单帧的像素尺寸 */
  frame: [number, number]
  /** 逻辑像素网格：按它取整数倍放大，像素边缘才干净 */
  grid: [number, number]
  /** 精灵表列数；0 = 一行排完 */
  cols: number
  surface: 'desk' | 'term'
  anims: PetAnim[]
  byKey: Record<string, PetAnim>
}

const DEEPY_ANIMS: RawAnim[] = [
  { key: 'idle', file: 'idle', title: '待机呼吸', en: 'Idle breathing', state: 'idle', trigger: '无任务 / SessionStart', durs: [[50,48]] },
  { key: 'idle-look', file: 'idle-look', title: '东张西望', en: 'Look around', state: 'idle (随机)', trigger: 'idleAnimations 随机池', durs: [[50,68]] },
  { key: 'idle-spout', file: 'idle-spout', title: '开心喷水', en: 'Water spout', state: 'idle (随机)', trigger: 'idleAnimations 随机池', durs: [[50,64]] },
  { key: 'thinking', file: 'thinking', title: '思考中', en: 'Thinking', state: 'thinking', trigger: 'UserPromptSubmit（刚收到提问）', durs: [[50,48]] },
  { key: 'typing', file: 'typing', title: '敲代码', en: 'Typing', state: 'working', trigger: 'PreToolUse / PostToolUse（1 个会话在跑工具）', durs: [[50,48]] },
  { key: 'music', file: 'music', title: '戴耳机听歌', en: 'Headphones groove', state: 'juggling / working', trigger: 'SubagentStart（1 个子代理）或 2 个会话并行', durs: [[50,32]] },
  { key: 'conducting', file: 'conducting', title: '带领小鲸鱼分身', en: 'Sub-agent squad', state: 'juggling (2+)', trigger: 'SubagentStart（≥2 个子代理）', durs: [[50,48]] },
  { key: 'building', file: 'building', title: '戴安全帽砌砖', en: 'Building', state: 'working (3+)', trigger: '3 个以上会话同时干活', durs: [[50,48]] },
  { key: 'error', file: 'error', title: '出错啦', en: 'Error', state: 'error', trigger: 'PostToolUseFailure / StopFailure', durs: [[50,48]] },
  { key: 'happy', file: 'happy', title: '任务完成！', en: 'Task complete', state: 'attention', trigger: 'Stop（任务完成）/ PostCompact', durs: [[50,52]] },
  { key: 'notification', file: 'notification', title: '需要你确认', en: 'Notification', state: 'notification', trigger: 'PermissionRequest / Notification', durs: [[50,32]] },
  { key: 'compacting', file: 'compacting', title: '上下文清理（吸入压缩）', en: 'Context compaction', state: 'sweeping', trigger: 'PreCompact（上下文压缩/清理）', durs: [[50,56]] },
  { key: 'carrying', file: 'carrying', title: '搬箱子', en: 'Carrying', state: 'carrying', trigger: 'WorktreeCreate（新建工作树）', durs: [[50,32]] },
  { key: 'sleeping', file: 'sleeping', title: '呼呼大睡', en: 'Sleeping', state: 'sleeping', trigger: '鼠标 60s 无操作 / 免打扰', durs: [[50,64]] },
  { key: 'waking', file: 'waking', title: '惊醒', en: 'Waking up', state: 'waking', trigger: '睡眠中移动鼠标', durs: [[50,30]] },
  { key: 'poke-left', file: 'react-left', title: '戳左边', en: 'Poke (left)', state: 'reaction', trigger: '双击宠物左半边', durs: [[50,40]] },
  { key: 'poke-right', file: 'react-right', title: '戳右边', en: 'Poke (right)', state: 'reaction', trigger: '双击宠物右半边', durs: [[50,40]] },
  { key: 'tickle', file: 'react-double', title: '被挠痒痒', en: 'Tickled', state: 'reaction', trigger: '连续快速点击 4 下', durs: [[50,48]] },
  { key: 'drag', file: 'react-drag', title: '被拎起来', en: 'Dragged', state: 'reaction', trigger: '按住拖动宠物', durs: [[50,24]] },
  { key: 'roam', file: 'roam-hop', title: '蹦跶散步', en: 'Roam hop', state: 'roam', trigger: '自由漫步（Free roam）', durs: [[50,24]] },
]

const TERMINAL_ANIMS: RawAnim[] = [
  { key: 'idle', file: 'idle', title: '待机', en: 'Idle', state: 'idle', trigger: '无任务', durs: [900,90,110,90,700,[160,3],600] },
  { key: 'idle-look', file: 'idle-look', title: '东张西望', en: 'Look around', state: 'idle (随机)', trigger: '待机随机', durs: [500,600,90,100,400,500,140,600,[140,3],500] },
  { key: 'idle-spout', file: 'idle-spout', title: '开心喷水', en: 'Water spout', state: 'idle (随机)', trigger: '待机随机', durs: [500,300,[110,2],130,150,[180,3],350,400] },
  { key: 'thinking', file: 'thinking', title: '思考中', en: 'Thinking', state: 'thinking', trigger: 'UserPromptSubmit', durs: [[220,2],[260,3],300,[180,6],220,[200,3],260] },
  { key: 'typing', file: 'typing', title: '敲代码', en: 'Typing', state: 'working', trigger: 'PreToolUse / PostToolUse', durs: [[170,4],320,120,[170,3],320] },
  { key: 'music', file: 'music', title: '戴耳机听歌', en: 'Headphones', state: 'juggling / working', trigger: '1 个子代理 / 2 个会话', durs: [[150,8]] },
  { key: 'conducting', file: 'conducting', title: '带领小鲸鱼分身', en: 'Sub-agent squad', state: 'juggling (2+)', trigger: 'SubagentStart ×2+', durs: [[150,12]] },
  { key: 'building', file: 'building', title: '安全帽顶砖', en: 'Building', state: 'working (3+)', trigger: '3 个以上会话', durs: [300,[90,2],170,260,90,170,320,[150,2],200] },
  { key: 'error', file: 'error', title: '出错啦', en: 'Error', state: 'error', trigger: 'PostToolUseFailure', durs: [[120,2],[200,3],160,200,300] },
  { key: 'happy', file: 'happy', title: '任务完成', en: 'Task complete', state: 'attention', trigger: 'Stop', durs: [250,130,200,[180,5],400] },
  { key: 'notification', file: 'notification', title: '需要你确认', en: 'Needs you', state: 'notification', trigger: 'PermissionRequest', durs: [[110,8]] },
  { key: 'compacting', file: 'compacting', title: '上下文清理', en: 'Context compaction', state: 'sweeping', trigger: 'PreCompact', durs: [300,[140,4],220,140,200,[220,2],260] },
  { key: 'carrying', file: 'carrying', title: '顶箱子', en: 'Carrying', state: 'carrying', trigger: 'WorktreeCreate', durs: [[170,8]] },
  { key: 'sleeping', file: 'sleeping', title: '呼呼大睡', en: 'Sleeping', state: 'sleeping', trigger: '60 秒无操作', durs: [[320,6]] },
  { key: 'waking', file: 'waking', title: '被吵醒', en: 'Waking up', state: 'waking', trigger: '睡眠中移动鼠标', durs: [400,150,[120,3],200,[90,3],500] },
  { key: 'poke-left', file: 'poke-left', title: '戳左边', en: 'Poke (left)', state: 'reaction', trigger: '点击左半边', durs: [300,[120,2],200,[150,2],260,[200,2],400] },
  { key: 'poke-right', file: 'poke-right', title: '戳右边', en: 'Poke (right)', state: 'reaction', trigger: '点击右半边', durs: [300,[120,2],200,[150,2],260,[200,2],400] },
  { key: 'tickle', file: 'tickle', title: '被挠痒痒', en: 'Tickled', state: 'reaction', trigger: '连续点击 4 下', durs: [[110,10],200,400] },
  { key: 'drag', file: 'drag', title: '被拎起来', en: 'Dragged', state: 'reaction', trigger: '按住拖动', durs: [[100,8]] },
  { key: 'swim', file: 'swim', title: '游来游去', en: 'Swim', state: 'roam', trigger: '自由漫步 / 空闲', durs: [[160,8]] },
]

const GIRL_ANIMS: RawAnim[] = [
  { key: 'idle', file: 'idle', title: '待机眨眼', en: 'Idle', state: 'idle', trigger: 'SessionStart，或者没有活的时候', durs: [700,[280,2],240,360,60,90,60,650,[280,2],240,420,60,80,60,140,60,80,60,800] },
  { key: 'idle-look', file: 'idle-look', title: '东张西望', en: 'Look around', state: 'idle', trigger: '待机时随机播放', durs: [500,420,70,80,70,380,420,110,420,[140,3],400] },
  { key: 'idle-spout', file: 'idle-spout', title: '开心喷水', en: 'Water spout', state: 'idle', trigger: 'idleAnimations，待机时随机播放', durs: [450,260,[110,2],130,150,[170,3],350,400] },
  { key: 'thinking', file: 'thinking', title: '思考中', en: 'Thinking', state: 'thinking', trigger: 'UserPromptSubmit，收到提问', durs: [[220,2],[260,3],300,[170,6],90,110,[200,2],260] },
  { key: 'typing', file: 'typing', title: '敲代码', en: 'Typing', state: 'working', trigger: 'PreToolUse，1 个会话在跑工具', durs: [150,170,150,170,150,170,210,150,170,150,170,150,170,210] },
  { key: 'music', file: 'music', title: '戴耳机听歌', en: 'Headphones', state: 'working', trigger: 'PreToolUse，2 个会话同时跑工具', durs: [[150,8]] },
  { key: 'conducting', file: 'conducting', title: '小鲸鱼分身', en: 'Sub-agents', state: 'juggling', trigger: 'SubagentStart，派出 2 个以上子代理', durs: [[150,12]] },
  { key: 'building', file: 'building', title: '施工中', en: 'Building', state: 'working', trigger: 'PreToolUse，3 个以上会话同时跑工具', durs: [130,100,80,90,100,120,90,[130,2],100,80,90,100,120,90,[130,2],100,80,90,100,120,90,130] },
  { key: 'error', file: 'error', title: '出错啦', en: 'Error', state: 'error', trigger: 'PostToolUseFailure，工具执行失败', durs: [90,[80,3],90,[200,2],160,200,300] },
  { key: 'happy', file: 'happy', title: '任务完成', en: 'Task complete', state: 'attention', trigger: 'Stop / PostCompact，任务完成', durs: [200,[90,2],[100,4],[110,2],120,400] },
  { key: 'notification', file: 'notification', title: '需要你确认', en: 'Needs you', state: 'notification', trigger: 'PermissionRequest，等你批准', durs: [[110,8]] },
  { key: 'compacting', file: 'compacting', title: '上下文清理', en: 'Context compaction', state: 'sweeping', trigger: 'PreCompact，压缩上下文之前', durs: [300,[130,4],200,100,160,220,240] },
  { key: 'carrying', file: 'carrying', title: '抱书搬运', en: 'Carrying', state: 'carrying', trigger: 'WorktreeCreate，新建工作区', durs: [[140,8]] },
  { key: 'sleeping', file: 'sleeping', title: '呼呼大睡', en: 'Sleeping', state: 'sleeping', trigger: '鼠标 60 秒没动', durs: [[330,6]] },
  { key: 'waking', file: 'waking', title: '被吵醒', en: 'Waking up', state: 'waking', trigger: '睡着时动鼠标或点她', durs: [420,110,120,[100,2],110,200,70,80,70,500] },
  { key: 'poke-left', file: 'poke-left', title: '戳左边', en: 'Poke (left)', state: 'reaction', trigger: '单击她的左脸', durs: [300,110,[90,2],200,[140,2],240,[200,2],400] },
  { key: 'poke-right', file: 'poke-right', title: '戳右边', en: 'Poke (right)', state: 'reaction', trigger: '单击她的右脸', durs: [300,110,[90,2],200,[140,2],240,[200,2],400] },
  { key: 'tickle', file: 'tickle', title: '被挠痒痒', en: 'Tickled', state: 'reaction', trigger: '连续快速点击（1 秒内 3 下以上）', durs: [[90,12],200,400] },
  { key: 'drag', file: 'drag', title: '被拎起来', en: 'Dragged', state: 'reaction', trigger: '按住她拖动', durs: [[90,10]] },
  { key: 'swim', file: 'swim', title: '游来游去', en: 'Swim', state: 'idle · roam', trigger: '自由漫游', durs: [[150,8]] },
  { key: 'smile-hearts', file: 'smile-hearts', title: '看着微笑冒爱心', en: 'Smile & hearts', state: 'bonus', trigger: '不绑定事件，可做完成时的随机彩蛋', durs: [[100,16]] },
  { key: 'thumbs-up', file: 'thumbs-up', title: '看着举大拇指', en: 'Thumbs up', state: 'bonus', trigger: '不绑定事件，可做完成时的随机彩蛋', durs: [160,120,90,[80,2],100,[110,2],90,110,320,[100,2],400] },
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

function build(
  id: PetId,
  raw: RawAnim[],
  meta: Omit<Pet, 'id' | 'anims' | 'byKey'>,
): Pet {
  const anims = raw.map((a): PetAnim => {
    const durs = a.durs.flatMap((d) => (Array.isArray(d) ? Array<number>(d[1]).fill(d[0]) : [d]))
    const starts: number[] = []
    let total = 0
    for (const d of durs) {
      starts.push(total)
      total += d
    }
    return {
      key: a.key,
      title: { zh: a.title, en: a.en },
      state: a.state,
      trigger: { zh: a.trigger, en: TRIGGER_EN[a.key] ?? a.trigger },
      durs,
      starts,
      total,
      sheet: `${id}/assets/sheets/${a.file}.png`,
    }
  })
  return { id, ...meta, anims, byKey: Object.fromEntries(anims.map((a) => [a.key, a])) }
}

export const PETS: Pet[] = [
  build('deepy-whale', DEEPY_ANIMS, {
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
    frame: [260, 260],
    grid: [52, 52],
    cols: 8,
    surface: 'desk',
  }),
  build('deepy-terminal', TERMINAL_ANIMS, {
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
    frame: [42, 30],
    grid: [42, 30],
    cols: 0,
    surface: 'term',
  }),
  build('whale-girl-emoji', GIRL_ANIMS, {
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
    frame: [69, 66],
    grid: [69, 66],
    cols: 0,
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
