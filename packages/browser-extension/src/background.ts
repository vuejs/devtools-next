import { isNumeric } from '@vue-devtools-next/shared'

type PortInfo = Record<'tab' | 'name', string | number> & { port: chrome.runtime.Port }
type PortDetail = Record<'devtools' | 'userApp', chrome.runtime.Port>
const ports: Record<string | number, PortDetail> = {}

function initPort(portInfo: PortInfo): Record<'devtools' | 'userApp', chrome.runtime.Port> {
  const { tab, name, port } = portInfo
  ports[tab] ??= {
    devtools: null,
    userApp: null,
  } as unknown as PortDetail
  ports[tab][name] = port
  return ports[tab]
}

function devtoolsUserAppPipe(tabId: string | number) {
  const { devtools, userApp } = ports[tabId]

  function onDevtoolsMessage(message) {
    // @TODO: dev only
    console.log('%cdevtools -> userApp', 'color:#888;', message)
    userApp.postMessage(message)
  }
  devtools.onMessage.addListener(onDevtoolsMessage)

  function onUserAppMessage(message) {
    // @TODO: dev only
    console.log('%cuserApp -> devtools', 'color:#888;', message)
    devtools.postMessage(message)
  }
  userApp.onMessage.addListener(onUserAppMessage)

  function shutdown() {
    const { devtools, userApp } = ports[tabId]
    devtools.onMessage.removeListener(onDevtoolsMessage)
    userApp.onMessage.removeListener(onUserAppMessage)
    devtools?.disconnect()
    userApp?.disconnect()
    ports[tabId] = null as unknown as PortDetail
  }

  devtools.onDisconnect.addListener(shutdown)
  userApp.onDisconnect.addListener(shutdown)
}

chrome.runtime.onConnect.addListener((port) => {
  const portInfo: PortInfo = {
    tab: '',
    name: '',
    port,
  }

  // devtools panel
  if (isNumeric(port.name)) {
    portInfo.tab = port.name
    portInfo.name = 'devtools'
    chrome.scripting.executeScript({
      target: {
        tabId: +port.name,
      },
      files: ['/dist/proxy.js'],
    }, (res) => {
    })
  }
  // userApp (user application)
  else {
    portInfo.tab = port.sender!.tab!.id!
    portInfo.name = 'userApp'
  }

  const tab = initPort(portInfo)

  if (tab.devtools && tab.userApp)
    devtoolsUserAppPipe(portInfo.tab)

  port.onDisconnect.addListener(() => {
    console.log('----port.onDisconnect', port.name)
  })
})
