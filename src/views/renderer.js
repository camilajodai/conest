function client() {
    api.openClient()
}

function fornec() {
    api.openFornec()
}

function produto() {
    api.openProduto()
}

function relatorio() {
    api.openRelatorio()
}

// alteração do ícone do status do banco de dados
api.dbMessage((event, message) => {
    console.log(message)
    if (message === "conectado") {
        document.getElementById('status').src = "../public/img/dbon.png"
    } else {
        document.getElementById('status').src = "../public/img/dboff.png"
    }
})

// inserir data na página
function obterData() {
    const data = new Date()
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }
    return data.toLocaleDateString('pt-BR', options)
}

// interagir diretamente no DOM do documento html (index.html)
document.getElementById('dataAtual').innerHTML = obterData()