export function useDevToolsClientState() {
  const state = useLocalStorage('__VUE_DEVTOOLS_CLIENT_STATE__', {
    isFirstVisit: true,
    route: '/',
  })

  return state
}
