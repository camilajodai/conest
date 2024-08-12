/**
 * processo de renderização 
 * clientes
 */

// Mudar propriedades do documento ao iniciar (UX)
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('inputSearch').focus()
    btnCreate.disabled = true
    btnUpdate.disabled = true
    btnDelete.disabled = true
})

// FUNÇÃO PARA MANIPULAR A TECLA ENTER
function teclaEnter(event) {
    if (event.key === 'Enter') {
        event.preventDefault()
        // executar a função associada ao botão Buscar
        buscarCliente()
    }
}

// ADICIONAR O MANIPULADOR DA TECLA ENTER
document.getElementById('frmCliente').addEventListener('keydown', teclaEnter)

// REMOVER MANIPULADOR DA TECLA ENTER
function removerEnter() {
    document.getElementById('frmCliente').removeEventListener('keydown', teclaEnter)
}


// CRUD CREATE >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// captura dos inputs do formulário (passo 1)
let formCliente = document.getElementById('frmCliente')
let nomeCliente = document.getElementById('inputName')
let foneCliente = document.getElementById('inputFone')
let emailCliente = document.getElementById('inputAddress')
// evento relacionado ao botao (passo 1 slide)
formCliente.addEventListener('submit', async (event) => {
    event.preventDefault()
    console.log(nomeCliente.value, foneCliente.value, emailCliente.value)
    // empacotar os dados em um objeto e enviar ao main.js (passo 2)
    const cliente = {
        nomeCli: nomeCliente.value,
        foneCli: foneCliente.value,
        emailCli: emailCliente.value
    }
    api.newClient(cliente)
    // limpar os dados do form após envio
    formCliente.reset()
})
// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< //


// CRUD READ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

// array (vetor) usado na renderizaçao dos dados do cliente
let arrayCliente = []
// funçaõ que vai enviar ao main
function buscarCliente() {
    let nomeCliente = document.getElementById('inputSearch').value.trim()
    // validação (UX)
    if (nomeCliente === "") {
        // validar campo obrigatório
        api.infoSearchDialog()

    } else {
        // enviar o pedido de busca junto com o nome do cliente
        api.searchCliente(nomeCliente)
    }
    // foco no campo de busca
    api.focusSearch((args) => {
        document.getElementById('inputSearch').focus()
    })
    // setar o nome do cliente
    api.nameCliente((args) => {
        // restaurar o comportamento padrão da tecla enter
        removerEnter()
        let setarNomeCliente = document.getElementById('inputSearch').value
        document.getElementById('inputName').value += setarNomeCliente
        // document.getElementById('inputId').value = ""
        // document.getElementById('inputFone').value = ""
        // document.getElementById('inputAddress').value = ""
        document.getElementById('inputSearch').value = ""
        document.getElementById('inputSearch').disabled = false
        document.getElementById('inputSearch').blur()
        btnRead.disabled = true
        btnCreate.disabled = false

    })
    // limpa a caixa de busca e  seta o foco
    api.clearSearch((args) => {
        document.getElementById('inputSearch').value = ""
        document.getElementById('inputSearch').focus()
    })
    // receber do main.js os dados do cliente PASSO 4
    api.dataCliente((event, dadosCliente) => {
        arrayCliente = JSON.parse(dadosCliente)
        console.log(arrayCliente)
        
        // PASSO 5 (final) percorrer o array, extrair os dados e setar os campos de texto do formulário
    arrayCliente.forEach((c) => {
        document.getElementById('inputId').value = c._id,
        document.getElementById('inputName').value = c.nomeCliente,
        document.getElementById('inputFone').value = c.foneCliente,
        document.getElementById('inputAddress').value = c.emailCliente
        // limpar a caixa de busca
        document.getElementById('inputSearch').value = ""
        document.getElementById('inputSearch').disabled = true
        document.getElementById("inputSearch").blur()
        // ativar os botões update e delete
        document.getElementById('btnUpdate').disabled = false
        document.getElementById('btnDelete').disabled = false
    })
    })
}

// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< //



// CRUD UPDATE >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< //



// CRUD DELETE >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< //



// RESET DO FORMULÁRIO
api.resetForm((args) => {
    resetForm()   
})


function resetForm() {
    document.getElementById('inputSearch').disabled = false    
    document.getElementById('inputSearch').focus() 
    btnCreate.disabled = true
    btnRead.disabled = false
    btnUpdate.disabled = true
    btnDelete.disabled = true
    
    document.getElementById("frmCliente").addEventListener("keydown", teclaEnter)
}