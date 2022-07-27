const { app, BrowserWindow, Menu, ipcMain } = require('electron')
const { template } = require('./menuTemplate');
const path = require('path');

win = "";
gameStatus = true;
gameDifficulty = 0;


function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
    
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            enableRemoteModule: true,
            contextIsolation: false,
        }
    })

    win.loadFile(__dirname + '/src/index.html');

    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)


    //Open the DevTools.
    win.webContents.openDevTools();
   

}
ipcMain.on("gameDifficultyChanged", (event, arg) => {
    console.log("dificultad cambiad");
    gameDifficulty = 0;
});

ipcMain.on("gameStatus", (event, arg) => {
    console.log("Mandando estado del juego: " + gameStatus);
    event.reply("gameStatus", [gameStatus,gameDifficulty] );

});



app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }

            console.log(BrowserWindow.getAllWindows().length)
        
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})
