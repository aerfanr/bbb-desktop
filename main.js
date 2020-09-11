const { app, BrowserWindow, ipcMain, Menu } = require('electron')
const { autoUpdater } = require('electron-updater')
const fs = require('fs')
const path = require('path')

const createMainWindow = () => {
    const mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        }
    })

    mainWindow.loadFile('index.html')
    // mainWindow.webContents.openDevTools()

    Menu.setApplicationMenu(null)

    ipcMain.on('redirect', (e, url) => {
        createMeetingWindow(url)
    })

    ipcMain.on('save-meetings', (e, meetings) => {
        const data = JSON.stringify(meetings)
        fs.writeFile(path.join(app.getPath('userData'), 'data.json'), data, (e) => { if (e) { console.error(e) } })
    })

    ipcMain.on('ready', (e) => {
        let data = '[]'
        try {
            data = fs.readFileSync(path.join(app.getPath('userData'), 'data.json'))
        } catch (e) {
            console.log(e)
        }
        e.reply('meetings-list', JSON.parse(data))
    })

    autoUpdater.checkForUpdatesAndNotify()
}

const createMeetingWindow = (url) => {
    const meetingWindow = new BrowserWindow()
    meetingWindow.loadURL(url)
}

app.whenReady().then(createMainWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createMainWindow()
    }
})
