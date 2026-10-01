import type { Lang } from '../i18n'

/** 桌宠预览页的两个地址。页面代码单独拆包，客户端靠它决定要不要去取那个 chunk。 */
export function petsRouteLang(path: string): Lang | null {
  if (path === '/pets/') return 'zh'
  if (path === '/en/pets/') return 'en'
  return null
}
