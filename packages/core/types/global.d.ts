

declare global {
  // @TODO: detail type
  var __VUE_DEVTOOLS_GLOBAL_HOOK__: any
  var __VUE_DEVTOOLS_CLIENT_URL__: string
  var __VUE_DEVTOOLS_GLOBAL_HOOK_BUFFER__: [string, Record<string, unknown>][]
  var __VUE_DEVTOOLS_GLOBAL_HOOK_BUFFER_COLLECT_EVENT__: [string, (payload: unknown[]) => void][]
  var __VUE_DEVTOOLS_STOP_COLLECT_HOOK_BUFFER__: () => void
}

export { }
