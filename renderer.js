const { ipcRenderer } = require('electron')

const mainForm = document.getElementById('main-form')
mainForm.addEventListener('submit', (e) => {
    e.preventDefault()
    ipcRenderer.send('redirect', 'https://bbb.lozaa.ir/b/bbb-' + e.target[0].value)
})

const handleMeetingClick = (code) => {
    ipcRenderer.send('redirect', 'https://bbb.lozaa.ir/b/bbb-' + code)
}

const addForm = document.getElementById('add-form')
let meetings = []
addForm.addEventListener('submit', (e) => {
    e.preventDefault()
    meetings.push({ name: e.target[0].value, code: e.target[1].value })
    document.getElementById('meetings-list').innerHTML += `<div class="meeting" onclick="handleMeetingClick('${e.target[1].value}')">
        <div class="meeting-name"> ${e.target[0].value} </div> 
        <div class="meeting-code"> ${e.target[1].value} </div>
        </div>`
    ipcRenderer.send('save-meetings', meetings)
})

ipcRenderer.on('meetings-list', (e, meetingsList) => {
    meetings = meetingsList
    meetings.map(value => {
        document.getElementById('meetings-list').innerHTML += `<div class="meeting" onclick="handleMeetingClick('${value.code}')">
            <div class="meeting-name"> ${value.name} </div> 
            <div class="meeting-code"> ${value.code} </div> 
            </div>`
    })
})
ipcRenderer.send('ready')
