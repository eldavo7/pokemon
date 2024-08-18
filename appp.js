/* ici c la base dune api rest
const express = require('express')
const app = express()
const port = 3000

app.get('/', (req,res) => res.send('hello2 le dav ici c le coeur d espress'))

app.get('/api/pokemons/:id', (req,res) => {
    const id = req.params.id
    res.send(`Vous avez demande la carte numero ${id}`)
})


app.listen(port, () => console.log(`Notre application Node est démarrée sur : http://localhost:${port}`))
*/

// nodemon redemarre l api rest sans devoir a chaque foit couper et relancer le serveur

const express = require('express')
const morgan = require('morgan')
const favicon = require('serve-favicon')
const bodyParser = require('body-parser')
const { Sequelize } = require('sequelize')

const moment = require('moment');


const { success, getUniqueId } = require('./helper.js')
let pokemons = require('./mock-pokemon.js')

const app = express()
const port = 3000

//on se connecte a mariadb via sequelize
const sequelize = new Sequelize(
    'pokedex',  // nom de la base de donnee
    'root', // id de la bdd  / nom_d_utilisateur
    'root', //mdp
    {
        host: 'localhost',
        dialect: 'mariadb', //nom du driver
        dialectOptions:  {
            timezone: 'Etc/GMT-2'
        },
    logging: false
    }
)

sequelize.authenticate()
    .then(_ => console.log('La connexion a la base de donnees a bien ete etablie'))
    .catch(error => console.error(`Impossible de se connecter a la base de donnees ${error}`))

//Middelware
/*
const logger = (req, res, next) => {
    console.log(`URL : ${req.url}`)
    next()
}

app.use(logger)
*/ 
//Meme chose 
/*
app.use((req, res, next) => {
    console.log(`URL : ${req.url}`)
    next()
})
*/
//En utilisant npm install morgan --save-dev / favicon autre middelware de npm
app
    .use(favicon(__dirname + 'favicon.ico'))
    .use(morgan('dev'))
    .use(bodyParser.json())



app.get('/', (req,res) => res.send('hello2 le dav ici c le coeur d espress'))

// Le nouveau point de terminaison, affichant le nombre total de pokemons 
/* Ancien
app.get('/api/pokemons', (req,res) => {
    res.send(`Il y a ${pokemons.length} pokemons dans pokedex pour le moment`)
})
*/

//Nouveau
// On retorune la liste des pokemons au format JSON, avec un message 
app.get('/api/pokemons', (req,res) => {
    const message = 'La liste des pokemons a bien ete recuperee'
    res.json(success(message,pokemons))
})

app.get('/api/pokemons/:id', (req,res) => {
    const id = parseInt(req.params.id)
    const pokemon = pokemons.find(pokemon => pokemon.id === id)
//  res.send(`Vous avez demande le pokemon ${pokemon.name}`)
//  res.json(pokemon)
    const message = 'Un pokmon a bien ete trouvé'
    res.json(success(message, pokemon))
})

app.post('/api/pokemons', (req, res) => {
    const id = getUniqueId(pokemons)
    const pokemonCreated = {...req.body, ...{id: id, created: new Date()}}
    pokemons.push(pokemonCreated)
    const message = `Le pokemon ${pokemonCreated.name} a bien ete cree`
    res.json(success(message, pokemonCreated))
})

app.put('/api/pokemons/:id', (req, res) => {
    const id = parseInt(req.params.id)
    const pokemonUpdated = { ...req.body, id: id}
    pokemons = pokemons.map(pokemon => {
        return pokemon.id === id ? pokemonUpdated : pokemon
    })
    const message = `Le pokemon ${pokemonUpdated.name} a bien ete modifie`
    res.json(success(message, pokemonUpdated))
}) 

app.delete('/api/pokemons/:id' , (req, res) => {
    const id = parseInt(req.params.id)
    const pokemonDeleted = pokemons.find(pokemon => pokemon.id === id)
    pokemons.filter(pokemon => pokemon.id !== id)
    const message = `Le pokemon ${pokemonDeleted.name} a bien ete supprime`
    res.json(success(message, pokemonDeleted))
})

app.listen(port, () => console.log(`Notre application Node est démarrée sur : http://localhost:${port}`))

