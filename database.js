/**
 * Módulo de conexão com banco de dados 
 * Uso do framework mongoose (npm i mongoose)
 */

// importar a biblioteca
const mongoose = require('mongoose')

// definir um bd
let url = "mongodb+srv://admin:senac123@clusterconest.ffjytr4.mongodb.net/dbconest"

let = isConnected = false

const dbStatus = async () => {
    if (isConnected === false) {
        await conectar()
    }
}

// metodo para conectar
const conectar = async () => {
    if (isConnected === false) {
        try {
            await mongoose.connect(url)
            isConnected = true
            console.log("mongodb conectado")
            return (isConnected)
        } catch (error) {
            console.log(`problema detectado: ${error.message}`)
        }
    }
}

// metodo para desconectar
const desconectar = async () => {
    if (isConnected === true) {
        try {
            await mongoose.disconnect(url)
            isConnected = false
            console.log("mongodb desconectado")
        } catch (error) {
            console.log(`problema detectado: ${error.message}`)
        }
    }
}

// exportar os metodos conectar e desconectar
module.exports = { dbStatus, desconectar }