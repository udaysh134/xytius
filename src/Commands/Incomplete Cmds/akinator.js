const Command = require("../../Structures/Command.js");
const Discord = require("discord.js");
const config = require("../../Data/config.json");
const aubdycad = require("../../Data/aubdycad.json");
const emojis = require("../../Data/emojis.json");
const pictures = require("../../Data/pictures.json");
const keys = require("../../Data/keys.json");

const valSys_Aki = require("../../Data/Others/valSys_Aki.js");
const akinator = require("discord.js-akinator");


module.exports = new Command({
    name: "akinator",
    description: "Play an interactive Akinator game, being within Discord.",
    aliases: [],
    permission: "SendMessages",
    allowedChannels: [`${aubdycad.BotCommands1_C_ID}`, `${aubdycad.BotCommands2_C_ID}`],
    allowedServers: [`${config.TestServer_ID}`, `${config.Aubdycad_ID}`, `${config.XytiusServer_ID}`],
    cooldown: "",
    usage: `${config.prefix}akinator`,
    usageDesc: `If you're not well aware of what Akinator is, first consider having a glance [here](https://en.m.wikipedia.org/wiki/Akinator). Now that you know what it is, that's it!! That's what you need to know. This command basically sets up a game of Akinator for you. The clean and interactive command first asks you to what type did you thought of, making it specific under a category. The game then starts guessing what exactly you thought of in your mind.\n\nThe command provides you few options, like as in the main game, from which you can proceed to other questions. You can also cancel the game at any time, if you don't wanna continue anymore.`,
    usageExample: [`${config.prefix}akinator`],
    forTesting: true,
    HUCat: [`gen`, `fun`],

    async run(message, args, client) {
        const cmndName = valSys_Aki.cmndName;
        const cmndEmoji = valSys_Aki.cmndEmoji;
        const cmndColour = valSys_Aki.cmndColour;
        const cmndError = valSys_Aki.cmndError;
        const cmndMarker = valSys_Aki.cmndMarker;

        /*
        ----------------------------------------------------------------------------------------------------
        Embeds
        ----------------------------------------------------------------------------------------------------
        */
        const starter_Embed = new Discord.MessageEmbed();
        starter_Embed.setTitle(`${cmndEmoji[0]}${config.tls}${cmndName}`);
        starter_Embed.setDescription(`Think of anything or anyone in your mind, and I'll guess it. Dare to defeat me...`);
        starter_Embed.setColor(`${cmndColour[0]}`);


        const options_Embed = new Discord.MessageEmbed();
        options_Embed.setTitle(`${cmndEmoji[0]}${config.tls}${cmndName}`);
        options_Embed.setDescription(`Select one of the catagory given below, about **what you thought of**, in your mind. Please be appropriate to get a correct answer as your final result.`);
        options_Embed.setColor(`${cmndColour[0]}`);
        options_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
        options_Embed.setTimestamp(message.createdTimestamp);

        const options_Buttons = new Discord.MessageActionRow().addComponents(
            new Discord.MessageButton()
            .setCustomId(`akinator_character`)
            .setLabel(`Character`)
            .setStyle(`SECONDARY`),
        
            new Discord.MessageButton()
            .setCustomId(`akinator_animal`)
            .setLabel(`Animal`)
            .setStyle(`SECONDARY`),

            new Discord.MessageButton()
            .setCustomId(`akinator_object`)
            .setLabel(`Object`)
            .setStyle(`SECONDARY`),
        );


        const notClicked_Embed = new Discord.MessageEmbed();
        notClicked_Embed.setTitle(`${cmndError}`);
        notClicked_Embed.setDescription(`You didn't chose any options, within time. I cannot proceed further without your interaction. Restart the game to play again.`);
        notClicked_Embed.setColor(`${config.err_hex}`);
        notClicked_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
        notClicked_Embed.setTimestamp(message.createdTimestamp);
        

        /*
        ----------------------------------------------------------------------------------------------------
        Execution
        ----------------------------------------------------------------------------------------------------
        */
        message.reply({ embeds: [starter_Embed] }).then((starterMsg) => {
            setTimeout(() => {
                starterMsg.edit({ embeds: [options_Embed], components: [options_Buttons] }).then((optionsMsg) => {
                    const akinator_Collector = message.channel.createMessageComponentCollector({ time: 1000 * 30 });
                    const checkInteraction = [];

                    akinator_Collector.on(`collect`, async (interaction) => {
                        const notYouCanDo_Embed = new Discord.MessageEmbed();
                        notYouCanDo_Embed.setTitle(`${cmndError}`);
                        notYouCanDo_Embed.setColor(`${config.err_hex}`);
                        notYouCanDo_Embed.setDescription(`Oh oh!! Sorry ${interaction.user.tag}, but you cannot do that. Only ${message.author.tag} can use the button.`);
    
                        // Possible_Error_1
                        if(interaction.user.id !== message.author.id) return interaction.reply({ embeds: [notYouCanDo_Embed], ephemeral: true });
    
    
                        if(interaction.customId === `akinator_character`) {
                            checkInteraction.push(`Button clicked`);
                            interaction.deferUpdate();

                            optionsMsg.delete();
                            
                            akinator(message, {
                                language: "en",
                                childMode: true,
                                gameType: "character",
                                useButtons: true,
                                embedColor: `${cmndColour[0]}`
                            });
                        }


                        if(interaction.customId === `akinator_animal`) {
                            checkInteraction.push(`Button clicked`);
                            interaction.deferUpdate();

                            optionsMsg.delete();
                            
                            akinator(message, {
                                language: "en",
                                childMode: true,
                                gameType: "animal",
                                useButtons: true,
                                embedColor: `${cmndColour[0]}`
                            });
                        }


                        if(interaction.customId === `akinator_object`) {
                            checkInteraction.push(`Button clicked`);
                            interaction.deferUpdate();

                            optionsMsg.delete();
                            
                            akinator(message, {
                                language: "en",
                                childMode: true,
                                gameType: "object",
                                useButtons: true,
                                embedColor: `${cmndColour[0]}`
                            });
                        }
                    });
    
    
                    akinator_Collector.on(`end`, async () => {
                        options_Buttons.components[0].setDisabled(true);
                        options_Buttons.components[1].setDisabled(true);
                        options_Buttons.components[2].setDisabled(true);


                        if(checkInteraction.length !== 0) {
                            // Do Nothing
                        } else {
                            return optionsMsg.edit({ embeds: [notClicked_Embed], components: [options_Buttons] });
                        }
                    });
                });
            }, 1000 * 6);
        });
    }
});