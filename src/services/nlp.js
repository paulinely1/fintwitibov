const fs = require('fs')
const sw = require('./stop_words_pt')

const carregaLibOntoPt = () => {

    let lib = []

    let endereco = "/Users/paulinelymorgan/git/fintwit/src/services/synsets_polarizados_ontopt06.txt"
    // endereco = "/Users/paulinelymorgan/git/fintwit/src/services/ex_lib.txt"
    const data = fs.readFileSync(endereco, {encoding:'utf8', flag:'r'})

    let lido = data.toString().split('\n')
    lido.pop()

    for(let linha of lido){
        let pol = parseInt(linha.split(':')[0]) 
        let lexemas = linha.split(':')[2].replace(/(\[|\]|\s)/g,'')

        lib.push([pol, lexemas.split(',')])
    }

    return lib
}

// metodo que retorna frase como objeto de palavras e suas respectivas frequencias
const geraListaDeFrequenciasDasPalavras = str => {

    const listaTokens = []
    const tokensUnicos = new Set()
    const tokensUnicosFrequencia = []
    let linhas = str.split('\n')

    for(let linha of linhas){
        let tokens = atomizador(linha)
        tokens.forEach(t => {
            listaTokens.push(t)
            tokensUnicos.add(t)
        })
    }

    for(let token of tokensUnicos){
        let qnt = listaTokens.filter(t => t == token).length
        tokensUnicosFrequencia.push({
            't': token,
            'f': qnt
        })
    }

    return tokensUnicosFrequencia
}

// metodo para atomizador frases em palavras e suas respectivas frequencias
const atomizador = frase => {

    const proibidos = [';', ',', '.', ':', '(', ')', '{', '}', '[', ']', '…', '!', '?']
    let palavrasComFrequencias = []
    
    frase = frase.split(' ')

    for(let i = 0; i < frase.length; i++){
        palavra = frase[i].toLowerCase()
        
        if(eUmaURL(palavra)) continue // elimina urls
        if(palavra.indexOf('@') != -1) continue // elimina mencoes
        if(sw.stopword(palavra)) continue // elimina stopwords

        // elimina caracteres proibidos
        let charsFiltrados = palavra.split('').filter(char => ( 
            !proibidos.includes(char)
        ))
        let palavraFiltrada = charsFiltrados.join('')

        if(palavraFiltrada != "") palavrasComFrequencias.push(palavraFiltrada)
    }
    
    return palavrasComFrequencias
}

// metodo para verificar se string é URL ou não
const eUmaURL = str => {

    let eRegular = new RegExp(/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi)

    return str.match(eRegular) ? true : false
}

exports.frequencias = geraListaDeFrequenciasDasPalavras
exports.atomizador = atomizador
exports.ontopt = carregaLibOntoPt