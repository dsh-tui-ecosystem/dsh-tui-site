/**
 * 三套桌宠的精灵表与逐帧时长。每套单独一个模块：首页只用到终端版 Deepy 和鲸娘，
 * 打包时就只把这两套的时长数据放进主包，Deepy 桌面版留在 /pets/ 的分包里。
 * 精灵表文件在 public/pets/<set>/assets/sheets/<file>.png。
 */

export interface SpriteGeometry {
  /** 精灵表里单帧的像素尺寸 */
  frame: [number, number]
  /** 逻辑像素网格：按它取整数倍放大，像素边缘才干净 */
  grid: [number, number]
  /** 精灵表列数；0 = 一行排完 */
  cols: number
}

export interface SpriteAnim {
  key: string
  durs: number[]
  starts: number[]
  total: number
  /** 精灵表路径，相对 /pets/ 目录 */
  sheet: string
}

export interface SpriteSet extends SpriteGeometry {
  id: string
  /** 按原页面顺序 */
  list: SpriteAnim[]
  anims: Record<string, SpriteAnim>
}

/** 逐帧时长，[ms, n] 表示连续 n 帧都是 ms */
type Durs = (number | [number, number])[]

export function buildSprites(id: string, geometry: SpriteGeometry, raw: [key: string, durs: Durs, file?: string][]): SpriteSet {
  const list = raw.map(([key, packed, file = key]): SpriteAnim => {
    const durs = packed.flatMap((d) => (Array.isArray(d) ? Array<number>(d[1]).fill(d[0]) : [d]))
    const starts: number[] = []
    let total = 0
    for (const d of durs) {
      starts.push(total)
      total += d
    }
    return { key, durs, starts, total, sheet: `${id}/assets/sheets/${file}.png` }
  })
  return { id, ...geometry, list, anims: Object.fromEntries(list.map((a) => [a.key, a])) }
}
