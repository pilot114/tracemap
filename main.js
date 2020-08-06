const {app, BrowserWindow} = require('electron')
const path = require('path')
let win

function createWindow() {
    win = new BrowserWindow({
        width: 1680,
        height: 900,
        minWidth: 1000,
        minHeight: 720,
        resizable: true,
        backgroundColor: '#333',
        title: 'Tracemap',
        icon: path.join(__dirname, 'src/assets/icons/png/512x512.png'),
        webPreferences: {
            nodeIntegration: true,
            preload: path.join(__dirname, 'preload.js')
        }
    })

    win.loadFile('public/index.html')

    win.webContents.openDevTools()

    win.on('closed', () => {
        win = null
    })
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
})
