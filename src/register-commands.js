require('dotenv').config();
const {REST, Routes, ApplicationCommandOptionType} = require('discord.js');
console.log(process.env.BOT_TOKEN)
const commands = [
    {
        name: 'pokemonweightcompare',
        description: 'See which pokemon is heavier!',
        options: [
            {
                name: 'first-pokemon',
                description: "The first pokemon to compare weight to",
                type: ApplicationCommandOptionType.String,
                required: true
            },
            {
                name: 'second-pokemon',
                description: "The second pokemon to compare weight to",
                type: ApplicationCommandOptionType.String,
                required: true
            }
        ]
    },
    {
        name: 'listmainregionforgeneration',
        description: 'This will list the main region when given the generation number you would like to know!',
        options: [
            {
                name: 'generation-number',
                description: "the generation number to find out the main region used in that generation",
                type: ApplicationCommandOptionType.Number,
                required: true
            }
        ]
    },
    {
        name: 'getthepokemontyping',
        description: 'This will give the pokemon type given the pokemon name',
        options: [
            {
                name: 'pokemon-name',
                description: "the name of the pokemon we want the type for",
                type: ApplicationCommandOptionType.String,
                required: true
            }
        ]
    },
    {
        name: 'checkifpokemonisinregion',
        description: 'Give a Pokemon name and check to see if it is in the specified region you pick (example, is charizard in johto region)',
        options: [
            {
                name: 'pokemon-name',
                description: "the name of the pokemon we want to see what region it is a part of",
                type: ApplicationCommandOptionType.String,
                required: true
            },
            {
                name: 'region',
                description: "the name of the pokemon we want to see what region it is a part of",
                type: ApplicationCommandOptionType.String,
                choices: [
                    {
                        name: 'Kanto',
                        value: 'Kanto'
                    },
                    {
                        name: 'Johto',
                        value: 'Johto'
                    }
                ],
                required: true
            }
        ]
    }
];

const rest = new REST({version: '10'}).setToken(process.env.BOT_TOKEN);

(async () => {
    try {
        console.log('Registering slash commands....')
        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), {body: commands}
        )
        console.log('Finished registering slash commands....')
    } catch (error) {
        console.log(error)
    }
})();