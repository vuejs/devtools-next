import { VIEW_MODE_STORAGE_KEY } from './../../shared/src/constants'

const body = document.getElementsByTagName('body')[0]

const clientUrl = chrome.runtime.getURL('../client/index.html')

// create detector script
const detector = document.createElement('script')
detector.src = chrome.runtime.getURL('../dist/detector.js')
detector.onload = () => {
  detector.parentNode!.removeChild(detector)
}
body.appendChild(detector)

function init() {
  const body = document.getElementsByTagName('body')[0]
  const head = document.getElementsByTagName('head')[0]

  // create overlay link stylesheet
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = chrome.runtime.getURL('../overlay/devtools-overlay.css')

  // create overlay script
  const script = document.createElement('script')
  script.src = chrome.runtime.getURL('../overlay/devtools-overlay.js')
  head.appendChild(link)
  link.onload = () => {
    // append overlay to body
    body.appendChild(script)
  }

  // inject devtools client url variable
  // de-depulicate
  if (head.querySelector('meta[name="__VUE_DEVTOOLS_CLIENT_URL__"]'))
    return

  const meta = document.createElement('meta')
  meta.setAttribute('name', '__VUE_DEVTOOLS_CLIENT_URL__')
  meta.setAttribute('content', clientUrl)
  head.appendChild(meta)
}

function toggleViewMode(mode: 'overlay' | 'panel') {
  window.postMessage({
    source: '__VUE_DEVTOOLS_OVERLAY__',
    payload: {
      event: 'toggle-view-mode',
      data: mode,
    },
  }, '*')
}

window.addEventListener('message', async (e) => {
  if (e.source === window && e.data.vueDetected) {
    chrome.runtime.sendMessage(e.data)
    const storage = await chrome.storage.local.get(VIEW_MODE_STORAGE_KEY)
    const viewMode = storage[VIEW_MODE_STORAGE_KEY] ?? 'overlay'
    const data = e.data
    if (data.devtoolsEnabled && viewMode === 'overlay')
      init()
  }
  else if (e.data.source === '__VUE_DEVTOOLS_PROXY__' && e.data.payload.event === 'toggle-view-mode') {
    if (e.data.payload.data === 'panel') {
      toggleViewMode('panel')
    }

    else {
      const link = document.querySelector('link[href^="chrome-extension://"][href*="/devtools-overlay.css"]')
      const script = document.querySelector('script[src^="chrome-extension://"][src*="/devtools-overlay.js"]')

      // init
      if (!link || !script)
        init()
      // restore
      else
        toggleViewMode('overlay')
    }
  }
})
