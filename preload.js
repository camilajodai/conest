const { ipcRenderer } = require('electron')

// stt de conexão (verificar se o bd está conectado)

ipcRenderer.send('send-message', "Status do banco de dados:")

ipcRenderer.on('db-status', (event, status) => {
    console.log(status)
})