/**
 * Módulo de conexão com banco de dados 
 * Uso do framework mongoose (npm i mongoose)
 */

// importar a biblioteca
const mongoose = require('mongoose')

// definir um bd
let url = "mongodb://admin:pti%402018@10.26.45.204:27017/?authSource=admin"

// metodo para conectar
const conectar = async () => {
    try {
        await mongoose.connect(url)
        console.log("mongodb conectado")
    } catch (error) {
        console.log(`problema detectado: ${error.message}`)
    }
}

// metodo para desconectar
const desconectar = async () => {
    try {
        await mongoose.disconnect(url)
        console.log("mongodb desconectado")
    } catch (error) {
        console.log(`problema detectado: ${error.message}`)
    }
}

// exportar os metodos conectar e desconectar
module.exports = { conectar, desconectar }