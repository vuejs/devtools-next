import { target } from '@vue/devtools-shared'

target.__VUE_DEVTOOLS_ENV__ ??= {
  vitePluginDetected: false,
}

export function getDevToolsEnv() {
  return target.__VUE_DEVTOOLS_ENV__
}

export function setDevToolsEnv(env: Partial<any>) {
  target.__VUE_DEVTOOLS_ENV__ = {
    ...target.__VUE_DEVTOOLS_ENV__,
    ...env,
  }
}
