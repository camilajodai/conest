const { ipcMain, Menu, shell, dialog } = require('electron')
const { app, BrowserWindow } = require('electron/main')
const path = require('node:path')
// importar o módulo de conexão
const { dbStatus, desconectar } = require('./database.js')
let dbCon = null
const clienteModel = require('./src/models/Cliente.js')
const fornecedorModel = require('./src/models/Fornecedor.js')

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
let relatorio

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
      modal: true,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js')
      }
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
      modal: true,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js')
      }
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
      modal: true,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js')
      }
    })


    fornec.loadFile('./src/views/fornec.html')
  }
}

const relatorioWindow = () => {
  const father = BrowserWindow.getFocusedWindow()
  if (father) {
    const relatorio = new BrowserWindow({
      width: 1280,
      height: 720,
      icon: './src/public/img/report.png',
      autoHideMenuBar: true,
      resizable: false,
      parent: father,
      modal: true,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js')
      }
    })


    relatorio.loadFile('./src/views/relatorio.html')
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
      minimizable: false,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js')
      }
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

  ipcMain.on('db-conect', async (event, message) => {
    dbCon = await dbStatus()
    event.reply('db-message', "conectado")
  })

  // desconectar do banco ao encerrar a janela
  app.on('before-quit', async () => {
    await desconectar(dbCon)
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
    label: 'Relatórios',
    click: () => relatorioWindow(),
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


ipcMain.on('open-relatorio', () => {
  relatorioWindow()
})

// -------------------------------------------
// função que verifica o status da conexão
const statusConexao = async () => {
  try {
    await conectar()
    win.webContents.send('db-status', "Banco de dados conectado.")
  } catch (error) {
    win.webContents.send('db-status', `ERRO DE CONEXÃO ${error.message}`)
  }
}


// CRUD CREATE >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< //
ipcMain.on('new-client', async (event, cliente) => {
  console.log(cliente) //teste do passo 2
  // passo 3 - cadastrar o cliente no mongodb
  try {
    // extarir os dados do objeto
    const novoCliente = new clienteModel({
      nomeCliente: cliente.nomeCli,
      foneCliente: cliente.foneCli,
      emailCliente: cliente.emailCli
    })
    await novoCliente.save() //save() - mongoose
    dialog.showMessageBox({
      type: "info",
      title: "Aviso",
      message: "Cliente cadastrado com sucesso",
      buttons: ['Ok']
    })
  } catch (error) {
    console.log(error)
  }
})


// CRUD CREATE >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< //
ipcMain.on('new-fornecedor', async (event, fornecedor) => {
  console.log(fornecedor) //teste do passo 2
  // passo 3 - cadastrar o cliente no mongodb
  try {
    // extarir os dados do objeto
    const novoFornecedor = new fornecedorModel({
      razaoFornecedor: fornecedor.razaoFornec,
      foneFornecedor: fornecedor.foneFornec,
      cnpjFornecedor: fornecedor.cnpjFornec,
      emailFornecedor: fornecedor.emailFornec,
      cepFornecedor: fornecedor.cepFornec,
      logradouroFornecedor: fornecedor.logradouroFornec,
      numeroFornecedor: fornecedor.numeroFornec,
      bairroFornecedor: fornecedor.bairroFornec,
      cidadeFornecedor: fornecedor.cidadeFornec,
      ufFornecedor: fornecedor.ufFornec,
      complementoFornecedor: fornecedor.complementoFornec
    })
    await novoFornecedor.save() //save() - mongoose
    dialog.showMessageBox({
      type: "info",
      title: "Aviso",
      message: "Fornecedor cadastrado com sucesso",
      buttons: ['Ok']
    })
  } catch (error) {
    console.log(error)
  }
})


// CRUD READ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< //



// CRUD UPDATE >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< //



// CRUD DELETE >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< //