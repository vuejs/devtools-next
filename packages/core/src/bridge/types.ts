export enum BridgeEvents {
  // user app
  DEVTOOLS_STATE_UPDATED = 'devtools-state:updated',
  APP_CONNECTED = 'user-app:connected',
  // devtools client
  CLIENT_READY = 'devtools:client-ready',
  // inspector tree
  SEND_INSPECTOR_TREE = 'inspector-tree:send',
  // inspector state
  SEND_INSPECTOR_STATE = 'inspector-state:send',

  // edit related things
  COMPONENT_EDIT_STATE = 'component:edit-state',
  PINIA_EDIT_STATE = 'pinia:edit-state',
  ROUTE_EDIT_STATE = 'route:edit-state',
}
