const { ipcRenderer, contextBridge } = require('electron')

// stt de conexão (verificar se o bd está conectado)
contextBridge.exposeInMainWorld('api', {
    openClient: () => ipcRenderer.send('open-client'),
    openProduto: () => ipcRenderer.send('open-produto'),
    openFornec: () => ipcRenderer.send('open-fornec'),
    openRelatorio: () => ipcRenderer.send('open-relatorio'),
    newClient: (cliente) => ipcRenderer.send('new-client', cliente),
    dbMessage: (message) => ipcRenderer.on('db-message', message),
    newFornecedor: (fornecedor) => ipcRenderer.send('new-fornecedor', fornecedor),
    infoSearchDialog: () => ipcRenderer.send('dialog-infoSearchDialog'),
    focusSearch: (args) => ipcRenderer.on('focus-search', args),
    searchCliente: (nomeCliente) => ipcRenderer.send('search-cliente', nomeCliente),
    nameCliente: (args) => ipcRenderer.on('name-cliente', args),
    clearSearch: (args) => ipcRenderer.on('clear-search', args),
    dataCliente: (dadosCliente) => ipcRenderer.on('data-cliente', dadosCliente),
    resetForm: (args) => ipcRenderer.on('reset-form', args),
    updateClient: (cliente) => ipcRenderer.send('update-client', cliente),
    deleteClient: (idCli) => ipcRenderer.send('delete-client', idCli),
    
    searchFornecedor: (razaoFornecedor) => ipcRenderer.send('search-fornecedor', razaoFornecedor),
    nameFornecedor: (args) => ipcRenderer.on('name-fornecedor', args),
    dataFornecedor: (dadosFornecedor) => ipcRenderer.on('data-fornecedor', dadosFornecedor),
    updateFornecedor: (fornecedor) => ipcRenderer.send('update-fornec', fornecedor),
    deleteFornec: (idFornec) => ipcRenderer.send('delete-fornec', idFornec)
})



ipcRenderer.send('db-conect')


// ipcRenderer.send('send-message', "Status do banco de dados:")

ipcRenderer.on('db-status', (event, status) => {
    console.log(status)
})

// // inserir data na página
// function obterData() {
//     const data = new Date()
//     const options = {
//         weekday: 'long',
//         year: 'numeric',
//         month: 'long',
//         day: 'numeric'
//     }
//     return data.toLocaleDateString('pt-BR', options)
// }

// // interagir diretamente no DOM do documento html (index.html)
// document.getElementById('dataAtual').innerHTML = obterData()