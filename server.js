const express = require('express')
const mongoose = require('mongoose')
const requireDir = require('require-dir')
require('dotenv-safe').config()

// iniciando app
const port = process.env.PORT || 8000
const app = express()
app.use(express.json())

// //////////////////////////////////////////// BD
mongoose.connect(process.env.CONNECTION_STRING_BD, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log(`MongoDB is on!`)
}).catch(err => {
    console.log(`MongoDB: ${err}`)
})
mongoose.set('useFindAndModify', true)
mongoose.set('useUnifiedTopology', true)

// //////////////////////////////////////////// models
requireDir('./src/models')

// //////////////////////////////////////////// controllets
const TwitterController = require('./src/controllers/TwitterController')

// //////////////////////////////////////////// rotas 
app.get('/perfil/:perfil?', TwitterController.mostraTweets)
app.get('/coletar/:perfil?', TwitterController.coletarFintwit)
app.get('/mostrar/:perfil?', TwitterController.mostrarFintwit)
app.post('/freq', TwitterController.calcularFrequencia)
app.get('/pordata/tweets', TwitterController.tweetsPorData)
app.get('/pordata/qtweets', TwitterController.qntTweetsPorData)

app.listen(port, () => {
    console.log(`On PORT ${port}!`)
})
