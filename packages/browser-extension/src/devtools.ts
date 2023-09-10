// inject devtools client

const body = document.getElementsByTagName('body')[0]

// const iframe = document.createElement('iframe')
// iframe.src = chrome.runtime.getURL('../client/devtools-client.html')
// body.appendChild(iframe)

const head = document.getElementsByTagName('head')[0]

// create link stylesheet
const link = document.createElement('link')
link.rel = 'stylesheet'
link.href = chrome.runtime.getURL('../overlay/devtools-overlay.css')

// create script
const script = document.createElement('script')
script.src = chrome.runtime.getURL('../overlay/devtools-overlay.js')

// append to head
head.appendChild(link)

// append to body
body.appendChild(script)
