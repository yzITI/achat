export function debounce (func, timeout = 300) {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => { func.apply(this, args) }, timeout)
  }
}

export function throttle(fn, delay) {
  let lastTime = 0
  return function (...args) {
    let now = Date.now()
    if (now - lastTime >= delay) {
      fn.apply(this, args)
      lastTime = now
    }
  }
}
