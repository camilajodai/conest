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