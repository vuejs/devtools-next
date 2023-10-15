chrome.devtools.panels.create(
  'Vue',
  'icons/128.png',
  'pages/devtools-panel.html',
  (panel) => {
    panel.onShown.addListener((window) => {

    })
  },
)
