import { buildSprites } from './types'

/** Deepy 小鲸鱼：260px 一帧、8 列网格的精灵表；逻辑像素网格 52×52。逐帧时长（毫秒）取自原始导出数据，[ms, n] = 连续 n 帧。 */
export const DEEPY_WHALE = buildSprites('deepy-whale', { frame: [260, 260], grid: [52, 52], cols: 8 }, [
  ['idle', [[50, 48]]],
  ['idle-look', [[50, 68]]],
  ['idle-spout', [[50, 64]]],
  ['thinking', [[50, 48]]],
  ['typing', [[50, 48]]],
  ['music', [[50, 32]]],
  ['conducting', [[50, 48]]],
  ['building', [[50, 48]]],
  ['error', [[50, 48]]],
  ['happy', [[50, 52]]],
  ['notification', [[50, 32]]],
  ['compacting', [[50, 56]]],
  ['carrying', [[50, 32]]],
  ['sleeping', [[50, 64]]],
  ['waking', [[50, 30]]],
  ['poke-left', [[50, 40]], 'react-left'],
  ['poke-right', [[50, 40]], 'react-right'],
  ['tickle', [[50, 48]], 'react-double'],
  ['drag', [[50, 24]], 'react-drag'],
  ['roam', [[50, 24]], 'roam-hop'],
])
