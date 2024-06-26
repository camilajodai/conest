function buscarcep() {
    let cep = (frmFornec.inputCep.value)
    let urlAPI = `https://viacep.com.br/ws/${cep}/json/`
    fetch(urlAPI)
        .then((response) => { //obter os dados
            return response.json()
        })
        .then((dados) => { //manipular os dados obtidos
            frmFornec.inputLogradouro.value = `${dados.logradouro}`
            frmFornec.inputBairro.value = `${dados.bairro}`
            frmFornec.inputCidade.value = `${dados.localidade}`
            frmFornec.inputUfvalue = `${dados.uf}`
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