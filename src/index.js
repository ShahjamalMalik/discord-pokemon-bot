//"StAuth10222: I John Doe, 123456 certify that this material is my original work. No other person's work has been used without due acknowledgement. I have not made my work available to anyone else."
const axios = require('axios');
require('dotenv').config();
const {Client, IntentsBitField, ClientApplication} = require('discord.js');
let username;
let msg;
const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent
    ]
});

client.on('ready', (c) => {
    
   
    console.log(`${c.user.tag} is up and running!`);
    
});

client.on('messageCreate', (message) => {

    username = message.author.username;
    msg = message.content;

    if(message.author.bot) {
        return;
    }
    if(msg === "Hey") {
        message.reply(`Hello ${username}, you just sent: ${msg}`)
    }
    

});

client.on('interactionCreate', (interaction) => {

    if (!interaction.isChatInputCommand()) return;
    if(interaction.commandName === 'pokemonweightcompare') {
        let firstPokemonWeight;
        let secondPokemonWeight;
        const firstPokemon = interaction.options.get('first-pokemon').value;
        const secondPokemon = interaction.options.get('second-pokemon').value;
        let endpoints = [`https://pokeapi.co/api/v2/pokemon/${firstPokemon.toLowerCase()}`, `https://pokeapi.co/api/v2/pokemon/${secondPokemon.toLowerCase()}`]
        axios.all(endpoints.map((endpoint) => axios.get(endpoint)))
        .then(response => {
                firstPokemonWeight = response[0].data.weight
                secondPokemonWeight = response[1].data.weight
                if(firstPokemonWeight > secondPokemonWeight) {
                    interaction.reply(`${firstPokemon}'s weight (${firstPokemonWeight}) is greater than ${secondPokemon}'s weight (${secondPokemonWeight})`)

                } else {
                    interaction.reply(`${secondPokemon}'s weight (${secondPokemonWeight}) is greater than ${firstPokemon}'s weight (${firstPokemonWeight})`)
                }
            })
        .catch(error => {
            interaction.reply(`The Pokemon Weight Compare didn't work, it's most likely because you spelled one or more of the Pokemon(s) name wrong`)
            console.log(error)
        })
    }
    if(interaction.commandName === 'listmainregionforgeneration') {
        const generationNumber = interaction.options.get('generation-number').value;
        axios.get(`https://pokeapi.co/api/v2/generation/${generationNumber}`)
            .then(response => {
                interaction.reply(`The main region in Generation ${generationNumber} is: ${response.data.main_region.name}`)
            })
            .catch(error => {
                interaction.reply(`The List Main Region for Generation command didn't work, this is probably due to entering in a generation number that does not exist.`)
                console.log(error)
            })
        
    }
    if(interaction.commandName === 'getthepokemontyping') {
        const pokemonName = interaction.options.get('pokemon-name').value;
        let counter = 1;
        axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`)
        .then(response => {
            let typeString = "";
            for (pokemonType in response.data.types) {

                if(counter < response.data.types.length) {
                    typeString = typeString + response.data.types[pokemonType].type.name + " and "
                } else {
                    typeString = typeString + response.data.types[pokemonType].type.name
                }
                counter++;
            }


            interaction.reply(`The typing(s) for ${pokemonName} are ${typeString}`)
            
        })
        .catch(error => {
            interaction.reply(`The Get the Pokemon Typing command didn't work, this is probably due to entering in a Pokemon that does not exist.`)
            console.log(error)
        })
    }
    if(interaction.commandName === 'checkifpokemonisinregion') {
        const pokemonName = interaction.options.get('pokemon-name').value;
        const region = interaction.options.get('region').value;
        let isMatch = false;
        let regionName;
        axios.get(`https://pokeapi.co/api/v2/pokedex/${region}`)
        .then(response => {
            regionName = response.data.name;
            for(object of response.data.pokemon_entries) {
                if(object.pokemon_species.name === pokemonName.toLowerCase()) {
                    isMatch = true;
                    break;
                }
            }
            if(isMatch) {
                interaction.reply(`${pokemonName} is found in ${regionName}`)
            } else {
                interaction.reply(`${pokemonName} is not found in ${regionName}`)
            }          
        })
        .catch(error => {
            interaction.reply(`The Check if Pokemon is in Region didn't work.`)
            console.log(error)
        })
    }
    if(interaction.commandName === 'whosebasestatstotalishigher') {
        let firstPokemonBaseStats = 0;
        let secondPokemonBaseStats = 0;
        const firstPokemon = interaction.options.get('first-pokemon').value;
        const secondPokemon = interaction.options.get('second-pokemon').value;
        let endpoints = [`https://pokeapi.co/api/v2/pokemon/${firstPokemon.toLowerCase()}`, `https://pokeapi.co/api/v2/pokemon/${secondPokemon.toLowerCase()}`]
        axios.all(endpoints.map((endpoint) => axios.get(endpoint)))
        .then(response => {
            for(object of response[0].data.stats) {
                firstPokemonBaseStats += object.base_stat
            }
            for(object of response[1].data.stats) {
                secondPokemonBaseStats += object.base_stat
            }
                if(firstPokemonBaseStats > secondPokemonBaseStats) {
                    interaction.reply(`${firstPokemon}'s total base stats (${firstPokemonBaseStats}) is greater than ${secondPokemon}'s total basestats (${secondPokemonBaseStats})`)

                } else {
                    interaction.reply(`${secondPokemon}'s weight (${secondPokemonBaseStats}) is greater than ${firstPokemon}'s weight (${firstPokemonBaseStats})`)
                }
            })
        .catch(error => {
            interaction.reply(`The Pokemon Total Base Stats Compare didn't work, it's most likely because you spelled one or more of the Pokemon(s) name wrong`)
            console.log(error)
        })
    }

})
client.login(process.env.BOT_TOKEN);