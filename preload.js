const { ipcRenderer } = require("electron")


window.addEventListener('contextmenu', (e) => {
    e.preventDefault()
    // ipcRenderer.send('show-context-menu')
    console.log('context menu',e)
})
  
  ipcRenderer.on('context-menu-command', (e, command) => {
    // ...
  })
  