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
    event.reply('reset-form')
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
    event.reply('reset-form')
  } catch (error) {
    console.log(error)
  }
})


// CRUD READ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

// aviso (busca: campo obrigatório)
ipcMain.on('dialog-infoSearchDialog', (event) => {
  dialog.showMessageBox({
    type: 'warning',
    title: 'Atenção',
    message: 'Preencha o campo de busca',
    buttons: ['Ok']
  })
  event.reply('focus-search')
})
// recebimento do pedido de busca do cliente pelo nome (PASSO 1)
ipcMain.on('search-cliente', async (event, nomeCliente) => {
  console.log(nomeCliente)
  // PASSO 2: busca no banco de dados
  try {
    // find() - método de busca
    const dadosCliente = await clienteModel.find({ nomeCliente: new RegExp(nomeCliente, 'i') })
    console.log(dadosCliente) //passo 3
    //(UX) caso o cliente n esteja cadastrado
    if (dadosCliente.length === 0) {
      dialog.showMessageBox({
        type: 'warning',
        title: 'Aviso',
        message: 'Cliente não cadastrado. \nDeseja cadastrar esse cliente?',
        buttons: ['Sim', 'Não'],
        defaultId: 0
      }).then((result) => {
        if (result.response === 0) {
          //setar o nome do cliente
          event.reply('name-cliente')
        } else {
          // limpar a caixa de busca
          event.reply('clear-search')
        }
      })
    } else { //passo 4 - envia os dados do cliente ao renderizador
      event.reply('data-cliente', JSON.stringify(dadosCliente))
    }
  } catch (error) {
    console.log(error)
  }
})

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> FORNEC
ipcMain.on('search-fornecedor', async (event, razaoFornecedor) => {
  console.log(razaoFornecedor)
  try {
    const dadosFornecedor = await fornecedorModel.find({ razaoFornecedor: new RegExp(razaoFornecedor, 'i') })
    console.log(dadosFornecedor)
    if (dadosFornecedor.length === 0) {
      dialog.showMessageBox({
        type: 'warning',
        title: 'Aviso',
        message: 'Fornecedor não cadastrado. \nDeseja cadastrar esse fornecedor?',
        buttons: ['Sim', 'Não'],
        defaultId: 0
      }).then((result) => {
        if (result.response === 0) {
          event.reply('name-fornecedor')
        } else {
          event.reply('clear-search')
        }
      })
    } else {
      event.reply('data-fornecedor', JSON.stringify(dadosFornecedor))
    }
  } catch (error) {
    console.log(error)
  }
})


// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< //



// CRUD UPDATE >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
ipcMain.on('update-client', async (event, cliente) => {
  console.log(cliente)

  try {
    const clienteEditado = await clienteModel.findByIdAndUpdate(
      cliente.idCli, {
      nomeCliente: cliente.nomeCli,
      foneCliente: cliente.foneCli,
      emailCliente: cliente.emailCli
    },
      {
        new: true
      }
    )
    dialog.showMessageBox({
      type: "info",
      title: "Aviso",
      message: "Cliente editado com sucesso",
      buttons: ['Ok']
    })
    event.reply('reset-form')
  } catch (error) {
    console.log(error)
  }
})

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
ipcMain.on('update-fornec', async (event, fornecedor) => {
  if(fornecedor.razaoFornec === "" ||
  fornecedor.cnpjFornec === "" ||
  fornecedor.foneFornec === "" ||
  fornecedor.emailFornec === "" ||
  fornecedor.cepFornec === "" ||
  fornecedor.logradouroFornec === "" ||
  fornecedor.numeroFornec === "" ||
  fornecedor.bairroFornec === "" ||
  fornecedor.cidadeFornec === "" ||
  fornecedor.ufFornec === ""
  ){
      dialog.showMessageBox({
          type:'error',
          title: "Atenção!",
          message: "Preencha os campos vazios"
      })
      return
  }
  try {
    const fornecedorEditado = await fornecedorModel.findByIdAndUpdate(
      fornecedor.idFornec, {
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
    },
      {
        new: true
      }
    )
    dialog.showMessageBox({
      type: "info",
      title: "Aviso",
      message: "Fornecedor editado com sucesso",
      buttons: ['Ok']
    })
    event.reply('reset-form')
  } catch (error) {
    console.log(error)
  }
})

// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< //



// CRUD DELETE >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
ipcMain.on('delete-client', (event, idCli) => {
  console.log(idCli)
  // confimar a exclusão
  dialog.showMessageBox({
    type: 'warning',
    title: 'ATENÇÃO',
    message: 'Tem certeza que deseja excluir este cliente?',
    buttons: ['Sim', 'Não'],
    defaultId: 0
  }).then (async(result) => {
    if (result.response === 0) {
      //passo 3 - excluir cliente do banco
      try {
        await clienteModel.findByIdAndDelete(idCli)
        dialog.showMessageBox({
          type: "info",
          title: "Aviso",
          message: "Cliente excluído com sucesso",
          buttons: ['Ok']
        })
        event.reply('reset-form')
      } catch (error) {
        console.log(error)
      }
    }
  })

})

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
ipcMain.on('delete-fornec', (event, idFornec) => {
  console.log(idFornec)
  // confimar a exclusão
  dialog.showMessageBox({
    type: 'warning',
    title: 'ATENÇÃO',
    message: 'Tem certeza que deseja excluir este fornecedor?',
    buttons: ['Sim', 'Não'],
    defaultId: 0
  }).then (async(result) => {
    if (result.response === 0) {
      //passo 3 - excluir cliente do banco
      try {
        await fornecedorModel.findByIdAndDelete(idFornec)
        dialog.showMessageBox({
          type: "info",
          title: "Aviso",
          message: "Fornecedor excluído com sucesso",
          buttons: ['Ok']
        })
        event.reply('reset-form')
      } catch (error) {
        console.log(error)
      }
    }
  })

})
// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< //