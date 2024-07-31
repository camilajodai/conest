const { ipcRenderer, contextBridge } = require('electron')

// stt de conexão (verificar se o bd está conectado)
contextBridge.exposeInMainWorld('api', {
    openClient: () => ipcRenderer.send('open-client'),
    openProduto: () => ipcRenderer.send('open-produto'),
    openFornec: () => ipcRenderer.send('open-fornec'),
    openRelatorio: () => ipcRenderer.send('open-relatorio'),
    newClient: (cliente) => ipcRenderer.send('new-client', cliente),
    dbMessage: (message) => ipcRenderer.on('db-message', message)
    
})



ipcRenderer.send('db-conect')


// ipcRenderer.send('send-message', "Status do banco de dados:")

ipcRenderer.on('db-status', (event, status) => {
    console.log(status)
})

// inserir data na página
function obterData() {
    const data = new Date()
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }
    return data.toLocaleDateString('pt-BR', options)
}

// interagir diretamente no DOM do documento html (index.html)
window.addEventListener('DOMContentLoaded', () => {
    const dataAtual = document.getElementById('dataAtual').innerHTML = obterData()
})