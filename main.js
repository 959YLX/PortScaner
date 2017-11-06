const {app, BrowserWindow} = require('electron')
const ipcMain = require('electron').ipcMain
const fs = require('fs')

const WORKING_PROCESS_COUNT = 4

let mainWindow = null
let workingProcess = null

let workingProcesses = null

const indexPage = 'index.html'
const workingIndex = 'working.html'

const windowSizeConfig = {
    minWidth: 1200,
    minHeight: 900,
    width: 1200,
    height: 900
}

function createWorkingProcesses() {
    workingProcesses = []
    for (let i = 0; i < WORKING_PROCESS_COUNT; i++) {
        let wp = new BrowserWindow({show: false})
        wp.loadURL(`file://${__dirname}/${workingIndex}`)
        workingProcesses.push(wp)
    }
}

function closeAllWorkingProcess() {
    for (let i = 0; i < workingProcesses.length; i++) {
        workingProcesses[i] = null
    }
    workingProcesses = null
}

function createWorkingProcess() {
    workingProcess = new BrowserWindow({
        show: false
    })
    workingProcess.loadURL(`file://${__dirname}/${workingIndex}`)
}

function createWindow() {
    console.log(WORKING_PROCESS_COUNT);
    mainWindow = new BrowserWindow(windowSizeConfig)
    mainWindow.on('close', () => {
        mainWindow = null
        closeAllWorkingProcess()
    })
    mainWindow.loadURL(`file://${__dirname}/${indexPage}`)
}

ipcMain.on('start_scan', (event, args) => {
    // workingProcess.webContents.send('start_scan', args)
    /*
     * args: [[ip, start, end, method], [ip, start, end, method], ...]
    */
    args.forEach((value, index) => {
        workingProcesses[index].webContents.send('start_scan', value)
    })
})

ipcMain.on('finish_scan', (event, args) => {
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
    createWorkingProcesses()
    createWindow()
})

app.on('window-all-closed', () => {
    if (process.platform != 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (mainWindow == null) {
        createWorkingProcesses()
        createWindow()
    }
})
