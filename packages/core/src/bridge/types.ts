export enum BridgeEvents {
  // user app
  DEVTOOLS_STATE_UPDATED = 'devtools-state:updated',
  // router info
  ROUTER_INFO_UPDATED = 'router-info:updated',
  APP_CONNECTED = 'user-app:connected',
  // devtools client
  CLIENT_READY = 'devtools:client-ready',
  // inspector tree
  SEND_INSPECTOR_TREE = 'inspector-tree:send',
  // inspector state
  SEND_INSPECTOR_STATE = 'inspector-state:send',
  // add timeline event
  ADD_TIMELINE_EVENT = 'timeline:add-event',
}
