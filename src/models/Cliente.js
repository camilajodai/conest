// modelo de dados MODEL clientes

const {model, Schema} = require ('mongoose')

const clienteSchema = new Schema({
    nomeCliente: {
        type: String
    },
    foneCliente: {
        type: String
    },
    emailCliente: {
        type: String
    }
})

module.exports = model('Cliente', clienteSchema)