document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('inputSearch').focus()
    btnCreate.disabled = true
    btnUpdate.disabled = true
    btnDelete.disabled = true
})

let formFornec = document.getElementById('frmFornecedor')
let razaoFornecedor = document.getElementById('inputRazao')
let foneFornecedor = document.getElementById('inputFone')
let cnpjFornecedor = document.getElementById('inputCnpj')
let emailFornecedor = document.getElementById('inputAddress')
let cepFornecedor = document.getElementById('inputCep')
let logradouroFornecedor = document.getElementById('inputLogradouro')
let numeroFornecedor = document.getElementById('inputNumero')
let bairroFornecedor = document.getElementById('inputBairro')
let cidadeFornecedor = document.getElementById('inputCidade')
let ufFornecedor = document.getElementById('uf')
let complementoFornecedor = document.getElementById('inputComplemento')

formFornec.addEventListener('submit', async (event) => {
    event.preventDefault()
    console.log(razaoFornecedor.value, foneFornecedor.value, cnpjFornecedor.value, emailFornecedor.value, cepFornecedor.value, logradouroFornecedor.value, numeroFornecedor.value, bairroFornecedor.value, cidadeFornecedor.value, ufFornecedor.value, complementoFornecedor.value)
    // empacotar os dados em um objeto e enviar ao main.js (passo 2)
    const fornecedor = {
        razaoFornec: razaoFornecedor.value,
        foneFornec: foneFornecedor.value,
        cnpjFornec: cnpjFornecedor.value,
        emailFornec: emailFornecedor.value,
        cepFornec: cepFornecedor.value,
        logradouroFornec: logradouroFornecedor.value,
        numeroFornec: numeroFornecedor.value,
        bairroFornec: bairroFornecedor.value,
        cidadeFornec: cidadeFornecedor.value,
        ufFornec: ufFornecedor.value,
        complementoFornec: complementoFornecedor.value,
    }
    api.newFornecedor(fornecedor)
    // limpar os dados do form após envio
    formFornec.reset()
})

// CRUD READ >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
let arrayFornecedor = []

function buscarFornecedor() {
    let nomeFornecedor = document.getElementById('inputSearch').value.trim()

    if (nomeFornecedor === "") {
        api.infoSearchDialog()
    } else {
        api.searchFornecedor(nomeFornecedor)
    }
    api.focusSearch((args) => {
        document.getElementById('inputSearch').focus()
    })

    api.nameFornecedor((args) => {

        let setarRazaoFornec = document.getElementById('inputSearch').value
        document.getElementById('inputRazao').value += setarRazaoFornec

        document.getElementById('inputSearch').value = ""
        document.getElementById('inputSearch').disabled = true
        document.getElementById('inputSearch').blur()
        btnRead.disabled = true
        btnCreate.disabled = false
    })

    api.clearSearch((args) => {
        document.getElementById('inputSearch').value = ""
        document.getElementById('inputSearch').focus()
    })

    api.dataFornecedor((event, dadosFornecedor) => {
        arrayFornecedor = JSON.parse(dadosFornecedor)
        console.log(arrayFornecedor)

        arrayFornecedor.forEach((f) => {
            document.getElementById('inputId').value = f._id,
                document.getElementById('inputRazao').value = f.razaoFornecedor,
                document.getElementById('inputFone').value = f.foneFornecedor,
                document.getElementById('inputCnpj').value = f.cnpjFornecedor,
                document.getElementById('inputAddress').value = f.emailFornecedor,
                document.getElementById('inputCep').value = f.cepFornecedor,
                document.getElementById('inputLogradouro').value = f.logradouroFornecedor,
                document.getElementById('inputNumero').value = f.numeroFornecedor,
                document.getElementById('inputBairro').value = f.numeroFornecedor,
                document.getElementById('inputCidade').value = f.cidadeFornecedor,
                document.getElementById('uf').value = f.ufFornecedor,
                document.getElementById('inputComplemento').value = f.complementoFornecedor

            document.getElementById('inputSearch').value = ""
            document.getElementById('inputSearch').disabled = true
            document.getElementById("inputSearch").blur()

            document.getElementById('btnUpdate').disabled = false
            document.getElementById('btnDelete').disabled = false
        })
    })







}

// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
api.resetForm((args) => {
    resetForm()   
})

function resetForm() {
    document.getElementById('inputId').value = ""
    document.getElementById('inputName').value = ""
    document.getElementById('inputFone').value = ""
    document.getElementById('inputAddress').value = ""
    document.getElementById('inputSearch').disabled = false    
    document.getElementById('inputSearch').focus() 
    btnCreate.disabled = true
    btnRead.disabled = false
    btnUpdate.disabled = true
    btnDelete.disabled = true
}