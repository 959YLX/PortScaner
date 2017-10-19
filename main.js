const {app, BrowserWindow} = require('electron')
let mainWindow = null
const indexPage = 'index.html'
const windowSizeConfig = {
    width: 1000,
    height: 800
}

function createWindow() {
    mainWindow = new BrowserWindow(windowSizeConfig)
    mainWindow.on('close', () => {
        mainWindow = null
    })
    mainWindow.loadURL(`file://${__dirname}/${indexPage}`)
}

app.on('ready', () => {
    createWindow()
})

app.on('window-all-closed', () => {
    if (process.platform != 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (mainWindow == null) {
        createWindow()
    }
})
