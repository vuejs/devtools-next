export enum BridgeEvents {
  // user app
  APP_CONNECTED = 'user-app:connected',
  COMPONENT_COUNT_UPDATED = 'user-app:component-count-updated',
  GET_USER_APP_DATA_REQUEST = 'user-app:get-data-request',
  GET_USER_APP_DATA_RESPONSE = 'user-app:get-data-response',
  // devtools client
  CLIENT_READY = 'devtools:client-ready',
  GET_DEVTOOLS_CLIENT_DATA_REQUEST = 'devtools:get-data-request',
  GET_DEVTOOLS_CLIENT_DATA_RESPONSE = 'devtools:get-data-response',
}
