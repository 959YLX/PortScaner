const {app, BrowserWindow} = require('electron')
const ipcMain = require('electron').ipcMain

let mainWindow = null
let workingProcess = null

const indexPage = 'index.html'
const workingIndex = 'working.html'

const windowSizeConfig = {
    minWidth: 1100,
    minHeight: 800,
    width: 1100,
    height: 800
}

function createWorkingProcess() {
    workingProcess = new BrowserWindow({
        show: false
    })
    workingProcess.loadURL(`file://${__dirname}/${workingIndex}`)
}

function createWindow() {
    mainWindow = new BrowserWindow(windowSizeConfig)
    mainWindow.on('close', () => {
        mainWindow = null
        workingProcess = null
    })
    mainWindow.loadURL(`file://${__dirname}/${indexPage}`)
}

ipcMain.on('start_scan', (event, args) => {
    workingProcess.webContents.send('start_scan', args)
})

ipcMain.on('finish_scan', (event, args) => {
    mainWindow.webContents.send('finish_scan', args)
})

app.on('ready', () => {
    createWorkingProcess()
    createWindow()
})

app.on('window-all-closed', () => {
    if (process.platform != 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (mainWindow == null) {
        createWorkingProcess()
        createWindow()
    }
})
