function buscarCep() {
    let cep = (frmFornecedor.inputCep.value)
    let urlAPI = `https://viacep.com.br/ws/${cep}/json/`
    // uso de promisse para recuperar os dados do webservices (API)
    fetch(urlAPI)
        .then((response) => { //obter os dados
            return response.json()
        })
        .then((dados) => { //manipular os dados obtidos
            frmFornecedor.inputLogradouro.value = `${dados.logradouro}`
            frmFornecedor.inputBairro.value = `${dados.bairro}`
            frmFornecedor.inputCidade.value = `${dados.localidade}`
            frmFornecedor.inputUf.value = `${dados.uf}`
        })
        .catch((error) => {
            console.log(`Erro ao obter o endereço: ${error}`)
        })
    }

const input = document.getElementById('inputFone')

input.addEventListener('input', () => {
    if (input.value.length > 15) {
        input.value = input.value.slice(0, 15)
    }
})

const inputCnpj = document.getElementById('inputCnpj')

inputCnpj.addEventListener('input', () => {
    if (inputCnpj.value.length > 15) {
        inputCnpj.value = inputCnpj.value.slice(0, 15)
    }
})