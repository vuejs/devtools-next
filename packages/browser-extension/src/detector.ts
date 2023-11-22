function detect(win: Window) {
  const detector = {
    delay: 1000,
    retry: 10,
  }

  function runDetect() {
    // @TODO: check nuxt
  // @ts-expect-error types
    const vueDetected = !!(window.__VUE__)
    if (vueDetected) {
      win.postMessage({
        devtoolsEnabled: window.__VUE_DEVTOOLS_GLOBAL_HOOK__ && window.__VUE_DEVTOOLS_GLOBAL_HOOK__.enabled,
        vueDetected: true,
        vitePluginDetected: !!window.__VUE_DEVTOOLS_VITE_PLUGIN_DETECTED__,
        vitePluginClientUrl: window.__VUE_DEVTOOLS_VITE_PLUGIN_CLIENT_URL__,
      }, '*')
      return
    }

    if (detector.retry > 0) {
      detector.retry--
      setTimeout(() => {
        runDetect()
      }, detector.delay)
      detector.delay *= 5
    }
  }

  setTimeout(() => {
    runDetect()
  }, 100)
}

if (document instanceof HTMLDocument)
  detect(window)
