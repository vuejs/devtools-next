export function setDevToolsClientUrl(url: string) {
  window.__VUE_DEVTOOLS_CLIENT_URL__ = url
}

export function getDevToolsClientUrl() {
  return window.__VUE_DEVTOOLS_CLIENT_URL__
}
