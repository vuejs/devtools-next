const body = document.getElementsByTagName('body')[0]
const head = document.getElementsByTagName('head')[0]

const clientUrl = chrome.runtime.getURL('../client/index.html')

// create overlay link stylesheet
const link = document.createElement('link')
link.rel = 'stylesheet'
link.href = chrome.runtime.getURL('../overlay/devtools-overlay.css')
head.appendChild(link)

// create overlay script
const script = document.createElement('script')
script.src = chrome.runtime.getURL('../overlay/devtools-overlay.js')

link.onload = () => {
  // append overlay to body
  body.appendChild(script)
}

// inject devtools client url variable
const meta = document.createElement('meta')
meta.setAttribute('name', '__VUE_DEVTOOLS_CLIENT_URL__')
meta.setAttribute('content', clientUrl)
head.appendChild(meta)
