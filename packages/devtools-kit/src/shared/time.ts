// import { target } from '@vue/devtools-shared'

export function now() {
  // if (target.performance)
  //   return target.performance.now()
  // else if (target.perf_hooks.performance)
  //   return target.perf_hooks.performance.now()

  // else
  return Date.now()
}
