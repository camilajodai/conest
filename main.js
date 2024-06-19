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
let client
let fornec
let produto

const clientWindow= () => {
  // se a janela about não estiver aberta(bug 1)
  if (!client) {
    client = new BrowserWindow({
      width: 360, //largura
      height: 220,  //altura
      resizable: false, //evitar o redimensionamento
      autoHideMenuBar: true, //esconder menu
      icon: './src/public/img/icon.png' //ícone
    })
  }

  client.loadFile('./src/views/cliente.html')
  // reabrir a janela se estiver fechada
  client.on('closed', () => {
    client = null
  })

}

const produtoWindow= () => {
  // se a janela about não estiver aberta(bug 1)
  if (!produto) {
    produto = new BrowserWindow({
      width: 360, //largura
      height: 220,  //altura
      resizable: false, //evitar o redimensionamento
      autoHideMenuBar: true, //esconder menu
      icon: './src/public/img/icon.png' //ícone
    })
  }

  produto.loadFile('./src/views/produto.html')
  // reabrir a janela se estiver fechada
  produto.on('closed', () => {
    produto = null
  })

}

const fornecWindow = () => {
  // se a janela about não estiver aberta(bug 1)
  if (!fornec) {
    fornec = new BrowserWindow({
      width: 360, //largura
      height: 220,  //altura
      resizable: false, //evitar o redimensionamento
      autoHideMenuBar: true, //esconder menu
      icon: './src/public/img/icon.png' //ícone
    })
  }

  fornec.loadFile('./src/views/fornec.html')
  // reabrir a janela se estiver fechada
  fornec.on('closed', () => {
    fornec = null
  })

}

const aboutWindow = () => {
  // se a janela about não estiver aberta(bug 1)
  if (!about) {
    about = new BrowserWindow({
      width: 360, //largura
      height: 300,  //altura
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