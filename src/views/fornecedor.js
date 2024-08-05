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

formFornec.addEventListener('submit', async(event) => {
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