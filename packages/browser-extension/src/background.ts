import { isNumeric } from '../../shared/src/general'

type PortInfo = Record<'tab' | 'name', string | number> & { port: chrome.runtime.Port }
type PortDetail = Record<'devtools' | 'backend', chrome.runtime.Port>
const ports: Record<string | number, PortDetail> = {}

function initPort(portInfo: PortInfo): Record<'devtools' | 'backend', chrome.runtime.Port> {
  const { tab, name, port } = portInfo
  ports[tab] ??= {
    devtools: null,
    backend: null,
  } as unknown as PortDetail
  ports[tab][name] = port
  return ports[tab]
}

function devtoolsBackendPipe(tabId: string | number) {
  const { devtools, backend } = ports[tabId]

  function onDevtoolsMessage(message) {
    // @TODO: dev only
    console.log('%cdevtools -> backend', 'color:#888;', message)
    backend.postMessage(message)
  }
  devtools.onMessage.addListener(onDevtoolsMessage)

  function onBackendMessage(message) {
    // @TODO: dev only
    console.log('%cbackend -> devtools', 'color:#888;', message)
    devtools.postMessage(message)
  }
  backend.onMessage.addListener(onBackendMessage)

  function shutdown() {
    const { devtools, backend } = ports[tabId]
    devtools.onMessage.removeListener(onDevtoolsMessage)
    backend.onMessage.removeListener(onBackendMessage)
    devtools?.disconnect()
    backend?.disconnect()
    ports[tabId] = null as unknown as PortDetail
  }

  devtools.onDisconnect.addListener(shutdown)
  backend.onDisconnect.addListener(shutdown)
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
  // backend (user application)
  else {
    portInfo.tab = port.sender!.tab!.id!
    portInfo.name = 'backend'
  }

  const tab = initPort(portInfo)

  if (tab.devtools && tab.backend)
    devtoolsBackendPipe(portInfo.tab)

  port.onDisconnect.addListener(() => {
    console.log('----port.onDisconnect', port.name)
  })
})
