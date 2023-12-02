export enum BridgeEvents {
  // user app
  DEVTOOLS_STATE_UPDATED = 'devtools-state:updated',
  // custom tabs
  CUSTOM_TABS_UPDATED = 'custom-tabs:updated',
  // router info
  ROUTER_INFO_UPDATED = 'router-info:updated',
  // router
  ROUTER = 'router',
  APP_CONNECTED = 'user-app:connected',
  // devtools client
  CLIENT_READY = 'devtools:client-ready',
  // inspector tree
  SEND_INSPECTOR_TREE = 'inspector-tree:send',
  // inspector state
  SEND_INSPECTOR_STATE = 'inspector-state:send',

  // edit related things (components/pinia/route, etc...) they are all fired the same event
  // so that we can decouple the specific logic to the `devtools-kit` package.
  EDIT_STATE = 'state:edit',
  // add timeline event
  ADD_TIMELINE_EVENT = 'timeline:add-event',
}
