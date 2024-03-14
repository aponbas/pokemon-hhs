import { pokemon_data } from './pokemon_data.js'

function generateContent(){
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    let pokemon_index = urlParams.get("index");
    let pokemon = getPokemonByIndex(pokemon_index);
    document.getElementById("hp").innerText = pokemon.hp;
    document.getElementById("index").innerText = pokemon.index;
    document.getElementById("type").innerText = pokemon.type;
    document.getElementById("description").innerText = pokemon.name + " is een " + pokemon.type + " type Pokémon.";
    document.getElementById("main_image").src = "/images/" + pokemon.image;
}

function getPokemonByIndex(index){
    console.log(index);
    for (let i = 0; i < pokemon_data.length; i++) {
        let this_pokemon = pokemon_data[i];
        if (this_pokemon.index == index){
            return this_pokemon;
        }
    }
}

generateContent()