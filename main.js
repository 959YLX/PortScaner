const {app, BrowserWindow} = require('electron')
const ipcMain = require('electron').ipcMain
const fs = require('fs')

let mainWindow = null
let workingProcess = null

const indexPage = 'index.html'
const workingIndex = 'working.html'

const windowSizeConfig = {
    minWidth: 1200,
    minHeight: 900,
    width: 1200,
    height: 900
}

function createWorkingProcess() {
    // workingProcess = new BrowserWindow({
    //     show: false
    // })
    workingProcess = new BrowserWindow(windowSizeConfig)
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
    console.log("main " + args[0]);
    // mainWindow.webContents.send('finish_scan', args)
    mainWindow.webContents.send(args[1][0], args)
})

ipcMain.on('save', (event, args) => {
    let file_path = args[0]
    let file_contain = args[1]
    fs.writeFile(file_path, file_contain, (error) => {
        event.sender.send('save_finish', error)
    })
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
