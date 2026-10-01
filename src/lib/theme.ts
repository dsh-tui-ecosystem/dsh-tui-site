/** 主题翻转会同时改动全站近千个元素的 color / background / border，
 *  这些过渡一起触发就会糊成一片，所以切换期间整体压掉过渡，让它瞬切。
 *
 *  移除必须同步做完：过渡是否启动在样式重算那一刻就定下来了，
 *  下面的强制回流已经让新值在 transition:none 生效期间完成重算。
 *  用 requestAnimationFrame 延后移除会在后台标签页里永远不触发
 *  （rAF 在不渲染的标签页中不排程），全站过渡会就此永久失效。 */
function withoutTransitions(swap: () => void) {
  const style = document.createElement('style')
  style.append(document.createTextNode('*,*::before,*::after{transition:none !important}'))
  document.head.appendChild(style)
  swap()
  void document.body.offsetHeight // 强制重算，新值在无过渡状态下落定
  style.remove()
}

/** 亮 / 暗切换，并记进 localStorage（index.html 首屏脚本会读它） */
export function toggleTheme() {
  withoutTransitions(() => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'
    document.documentElement.dataset.theme = next
    try {
      localStorage.setItem('dsh-tui-theme', next)
    } catch {
      /* ignore */
    }
  })
}
