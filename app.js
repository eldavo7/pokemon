// 1er branche  V2
// Ajout de pokemon.js

const express = require('express')
const morgan = require('morgan')
const favicon = require('serve-favicon')
const bodyParser = require('body-parser')
const { Sequelize, /* DataTypes */ } = require('sequelize')
const { success, getUniqueId } = require('./helper.js')
const path = require('path') 
const moment = require('moment');

let pokemons = require('./mock-pokemon')
// const PokemonModel = require('./src/models/pokemon.js')


const app = express() 
const port = process.env.PORT || 3000;

// Connexion à MariaDB via Sequelize
const sequelize = new Sequelize(
    'pokedex',  // nom de la base de données
    'root', // utilisateur
    'root', // mot de passe
    {
        host: 'localhost',
        dialect: 'mariadb', // nom du driver
        dialectOptions:  {
            timezone: 'Etc/GMT-2'
        },
        logging: false
    }
)

sequelize.authenticate()
    .then(_ => console.log('La connexion à la base de données a bien été établie'))
    .catch(error => console.error(`Impossible de se connecter à la base de données: ${error}`))

    /* 1-debut

const Pokemon = PokemonModel(sequelize, DataTypes)

sequelize.sync({force: true}) // pour le developement force: true ensuite il faudra le retirer
    .then(_ => {
        console.log('La base de donnees "Pokedex" a bien ete synchronisee.')
// syncronisation de la base de donnees et du code js /src/models/pokemon.js
        
        Pokemon.create({
            name: 'Bulbizzare',
            hp: 25,
            cp: 5,
            picture: 'https://assets.pokemon.com/assets/cms2/img/pokedex/detail/001.png',
            type: ["Plante", "Poisson"].join(),
        }).then(bulbizzare => console.log(bulbizzare.toJSON()))
    })

     -FIN       */


// Middleware
/*
const logger = (req, res, next) => {
    console.log(`URL : ${req.url}`)
    next()
}

app.use(logger)
*/ 
// Même chose 
/*
app.use((req, res, next) => {
    console.log(`URL : ${req.url}`)
    next()
})
*/
// Utilisation de morgan et serve-favicon
app
    .use(favicon(path.join(__dirname, 'public', 'favicon.ico')))  // Corrigez ce chemin
    .use(morgan('dev'))
    .use(bodyParser.json())

app.get('/', (req, res) => res.send('Wewewe le dav ici c le coeur d express'))

// Nouveau point de terminaison, affichant le nombre total de pokemons 
app.get('/api/pokemons', (req, res) => {
    const message = 'La liste des pokemons a bien été récupérée'
    res.json(success(message, pokemons))
})

app.get('/api/pokemons/:id', (req, res) => {
    const id = parseInt(req.params.id)
    const pokemon = pokemons.find(pokemon => pokemon.id === id)
    const message = 'Un pokemon a bien été trouvé'
    res.json(success(message, pokemon))
})

app.post('/api/pokemons', (req, res) => {
    const id = getUniqueId(pokemons)
    const pokemonCreated = { ...req.body, ...{ id: id, created: new Date() } }
    pokemons.push(pokemonCreated)
    const message = `Le pokemon ${pokemonCreated.name} a bien été créé`
    res.json(success(message, pokemonCreated))
})

app.put('/api/pokemons/:id', (req, res) => {
    const id = parseInt(req.params.id)
    const pokemonUpdated = { ...req.body, id: id }
    pokemons = pokemons.map(pokemon => {
        return pokemon.id === id ? pokemonUpdated : pokemon
    })
    const message = `Le pokemon ${pokemonUpdated.name} a bien été modifié`
    res.json(success(message, pokemonUpdated))
}) 

app.delete('/api/pokemons/:id', (req, res) => {
    const id = parseInt(req.params.id)
    const pokemonDeleted = pokemons.find(pokemon => pokemon.id === id)
    pokemons = pokemons.filter(pokemon => pokemon.id !== id)
    const message = `Le pokemon ${pokemonDeleted.name} a bien été supprimé`
    res.json(success(message, pokemonDeleted))
})

app.listen(port, () => console.log(`Notre application Node est démarrée sur : http://localhost:${port}`))
