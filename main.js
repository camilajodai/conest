const { ipcMain, Menu, shell } = require('electron')
const { app, BrowserWindow } = require('electron/main')
const path = require('node:path')
// importar o módulo de conexão
const { conectar, desconectar } = require('./database.js')

// janela principal (definir o objeto win como variavel publica)
let win
const createWindow = () => {
    win = new BrowserWindow({
        width: 800,
        height: 600,
        icon: './src/public/img/package.png',
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })

    Menu.setApplicationMenu(Menu.buildFromTemplate(template))
    win.loadFile('./src/views/index.html')
}

let about // resolver bug de abertuda de varias janelas

const aboutWindow = () => {
  // se a janela about não estiver aberta(bug 1)
  if (!about) {
    about = new BrowserWindow({
      width: 360, //largura
      height: 260,  //altura
      resizable: false, //evitar o redimensionamento
      autoHideMenuBar: true, //esconder menu
      icon: './src/public/img/about.png' //ícone
    })
  }

  about.loadFile('./src/views/sobre.html')
  // reabrir a janela se estiver fechada
  about.on('closed', () => {
    about = null
  })

}

// iniciar a aplicação
app.whenReady().then(() => {

    // status de conexão com o banco de dados
    ipcMain.on('send-message', (event, message) => {
        console.log(`<<< ${message}`)
        statusConexao()
    })

    // desconectar do banco ao encerrar a janela
    app.on('before-quit', async () => {
        await desconectar()
    })

    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

const template = [
    {
      label: 'Arquivo',
      submenu: [
        {
          label: 'Sair',
          click: () => app.quit(),
          accelerator: 'Alt+F4'
        }
      ]
    },
    {
        label: 'Ajuda',
        submenu: [
          {
            label: 'Sobre',
            click: () => aboutWindow(),
          }
        ]
      }
]

ipcMain.on('open-about', () => {
    aboutWindow()
  })
// -------------------------------------------
// função que verifica o status da conexão
const statusConexao = async () => {
    try {
        await conectar()
        win.webContents.send('db-status', "Banco de Dados conectado.")
    } catch (error) {
        win.webContents.send('db-status', `ERRO DE CONEXÃO ${error.message}`)
    }
}