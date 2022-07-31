const { app, BrowserWindow, Menu, ipcMain } = require('electron')
const path = require('path');

win = "";
gameStatus = true;
gameDifficulty = 0;


function createWindow() {
    const win = new BrowserWindow({
        width: 900,
        height: 700,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            enableRemoteModule: true,
            contextIsolation: false,
        }
    })

    win.loadFile(__dirname + '/src/index.html');
    win.removeMenu();

    //Open the DevTools.
    win.webContents.openDevTools();

    ipcMain.on('new-game', (event, arg) => {
        win.reload();
    });

}



app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }

        console.log(BrowserWindow.getAllWindows().length)

    })

    ipcMain.on('exit-game', (event, arg) => {
        app.quit();
    });
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})
