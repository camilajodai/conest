const { ipcMain, Menu, shell } = require('electron')
const { app, BrowserWindow } = require('electron/main')
const path = require('node:path')
// importar o módulo de conexão
const { conectar, desconectar } = require('./database.js')

// janela principal (definir o objeto win como variavel publica)
let win
const createWindow = () => {
  win = new BrowserWindow({
    width: 1280,
    height: 720,
    icon: './src/public/img/package.png',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  Menu.setApplicationMenu(Menu.buildFromTemplate(template))
  win.loadFile('./src/views/index.html')
}

let about // resolver bug de abertuda de varias janelas
let client
let fornec
let produto

const clientWindow = () => {
  const father = BrowserWindow.getFocusedWindow()
  if (father) {
    const client = new BrowserWindow({
      width: 1280,
      height: 720,
      icon: './src/public/img/client.png',
      autoHideMenuBar: true,
      resizable: false,
      parent: father,
      modal: true
    })
    client.loadFile('./src/views/cliente.html')
  }
}
const produtoWindow = () => {
  const father = BrowserWindow.getFocusedWindow()
  if (father) {
    const produto = new BrowserWindow({
      width: 1280,
      height: 720,
      icon: './src/public/img/produc.png',
      autoHideMenuBar: true,
      resizable: false,
      parent: father,
      modal: true
    })

    produto.loadFile('./src/views/produto.html')
  }
}

const fornecWindow = () => {
  const father = BrowserWindow.getFocusedWindow()
  if (father) {
    const fornec = new BrowserWindow({
      width: 1280,
      height: 720,
      icon: './src/public/img/provider.png',
      autoHideMenuBar: true,
      resizable: false,
      parent: father,
      modal: true
    })


    fornec.loadFile('./src/views/fornec.html')
  }
}

const aboutWindow = () => {
  const father = BrowserWindow.getFocusedWindow()
  if (father) {
    const about = new BrowserWindow({
      width: 360,
      height: 290,
      icon: './src/public/img/about.png',
      autoHideMenuBar: true,
      resizable: false,
      parent: father,
      modal: true,
      minimizable: false
    })


    about.loadFile('./src/views/sobre.html')
  }
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
        label: 'Clientes',
        click: () => clientWindow(),
      },
      {
        label: 'Fornecedores',
        click: () => fornecWindow(),
      },
      {
        label: 'Produtos',
        click: () => produtoWindow(),
      },
      {
        label: 'Sair',
        click: () => app.quit(),
        accelerator: 'Alt+F4'
      }
    ]
  },
  {
    label: 'Exibir',
    submenu: [
      {
        label: 'Recarregar',
        role: 'reload',
      },
      {
        label: 'Ferramentas do desenvolvedor',
        role: "toggleDevTools",
      },
      {
        type: 'separator'
      },
      {
        label: 'Aplicar zoom',
        role: 'zoomIn',
      },
      {
        label: 'Reduzir',
        role: 'zoomOut',
      },
      {
        label: 'Restaurar o zoom padrão',
        role: 'resetZoom',
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

ipcMain.on('open-client', () => {
  clientWindow()
})

ipcMain.on('open-fornec', () => {
  fornecWindow()
})

ipcMain.on('open-produto', () => {
  produtoWindow()
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