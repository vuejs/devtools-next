export function useDevToolsClientState() {
  const localState = useLocalStorage('__VUE_DEVTOOLS_CLIENT_STATE__', {
    isFirstVisit: true,
    route: '/',
  })

  return localState
}
