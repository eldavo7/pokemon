/*
const success = (message, data) => {
    return {
        message: message,
        data: data
    }
}

exports.success
*/
//const pokemons = require("./mock-pokemon")

  

// OU c la meme chose ----------------------

/*
exports.success = (message, data) => {
    return {
        message: message,
        data: data
    }
}
*/

// OU c la meme chose ---------------------------

exports.success = (message, data) => {
    return { message, data }
}

//===============================================================

//pour generer un id unique j utilise cette methode qui est attache a un 
//bout de code sur app.js

exports.getUniqueId = (pokemons) => {
    const pokemonsIds = pokemons.map(pokemon => pokemon.id); // on retourne un tableau avec id unique
    const maxId = pokemonsIds.reduce((a, b) => Math.max(a, b));  // on calcul l id le plus grand par rapport a l id existant 
    const uniqueId = maxId + 1; // Ajout de 1 pour obtenir un nouvel identifiant unique
    return uniqueId;
};



