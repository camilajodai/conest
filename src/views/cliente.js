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

// Alterar comportamento do ENTER dentro do formulário (UX)
document.getElementById('frmCliente').addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault()
        // executar a função associada ao botão Buscar
        buscarCliente()
    }
})


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
        let setarNomeCliente = document.getElementById('inputSearch').value.trim()
        document.getElementById('inputName').value = setarNomeCliente
        document.getElementById('inputSearch').value = ""
        document.getElementById('inputSearch').disabled = false
        document.getElementById('inputName').focus()
        btnRead.disabled = true
        btnCreate.disabled = false
        
    })
    // limpa a caixa de busca e  seta o foco
    api.clearSearch((args) => {
        document.getElementById('inputSearch').value = ""
        document.getElementById('inputSearch').focus()
    })
    
}

// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< //



// CRUD UPDATE >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< //



// CRUD DELETE >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< //


// RESET DO FORMULÁRIO
function resetForm() {
    document.getElementById('inputSearch').focus()
    btnCreate.disabled = true
    btnUpdate.disabled = true
    btnDelete.disabled = true
    document.getElementById('inputSearch').disabled = false
    btnRead.disabled = false
}