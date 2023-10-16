const axios = require('axios');
require('dotenv').config();
console.log(process.env.BOT_TOKEN);
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
    let firstPokemonWeight;
    let secondPokemonWeight;
    if (!interaction.isChatInputCommand()) return;
    if(interaction.commandName === 'pokemonweightcompare') {

        const firstPokemon = interaction.options.get('first-pokemon').value;
        const secondPokemon = interaction.options.get('second-pokemon').value;
        console.log(`First Pokemon: ${firstPokemon}, secondPokemon: ${secondPokemon}`)
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
                console.log(response.data.main_region.name)
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
        axios.get(`https://pokeapi.co/api/v2/pokemon//${pokemonName.toLowerCase()}`)
        .then(response => {
            console.log(response.data.types.length)
            let typeString = "";
            for (pokemonType in response.data.types) {

                if(counter < response.data.types.length) {
                    console.log(response.data.types[pokemonType].type.name)
                    typeString = typeString + response.data.types[pokemonType].type.name + " and "
                } else {
                    typeString = typeString + response.data.types[pokemonType].type.name
                }
                counter++;
            }


            interaction.reply(`The typing(s) for ${pokemonName} are ${typeString}`)
            console.log(typeString)
            
        })
        .catch(error => {
            interaction.reply(`The List Main Region for Generation command didn't work, this is probably due to entering in a generation number that does not exist.`)
            console.log(error)
        })
    }

})
client.login(process.env.BOT_TOKEN);