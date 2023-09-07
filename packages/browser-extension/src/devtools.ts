// inject devtools client

const body = document.getElementsByTagName('body')[0]

const iframe = document.createElement('iframe')
iframe.src = chrome.runtime.getURL('../client/devtools-client.html')
body.appendChild(iframe)
