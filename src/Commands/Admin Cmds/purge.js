const Command = require("../../Structures/Command.js");
const Discord = require("discord.js");
const config = require("../../Data/config.json");
const aubdycad = require("../../Data/aubdycad.json");
const emojis = require("../../Data/emojis.json");
const pictures = require("../../Data/pictures.json");
const keys = require("../../Data/keys.json");


module.exports = new Command({
    name: "purge",
    description: "Purge messages from a channel, in bulk at once, with the help of this command.",
    aliases: ["cl", "clear"],
    permission: "Administrator",
    allowedChannels: [],
    allowedServers: [`${config.TestServer_ID}`, `${config.Aubdycad_ID}`, `${config.XytiusServer_ID}`],
    cooldown: "",
    usage: `${config.prefix}purge [user] <amount>`,
    usageDesc: `A simple command to delete messages in bulk from a channel without worrying about deleting one message at a time, repeatedly for minutes. The "user" query is optional, meaning, you can provide a user mention to only delete messages of that user, of the amount you gave, from that channel. This will not affect any messages sent by any other user. Pinned messages are also ignored.`,
    usageExample : [`${config.prefix}purge 5`, `${config.provide}clear 10`, `${config.prefix}cl @RandomGuy#0001 20`],
    forTesting: false,
    HUCat: [`admin`],

    async run(message, args, client) {
        const cmndName = `Purge`;
        const cmndEmoji = [`🧹`, `${emojis.ANIMATED_LOADING}`];
        const cmndColour = [`ffcc4d`];
        const cmndError = `${config.err_emoji}${config.tls}Purge : Command Error!!`;
        const cmndMarker = `${config.marker}`;
        
        /*
        ----------------------------------------------------------------------------------------------------
        Embeds                                                                   
        ----------------------------------------------------------------------------------------------------
        */
        const deleting_Embed = new Discord.EmbedBuilder();
        deleting_Embed.setTitle(`${cmndEmoji[0]}${config.tls}${cmndName}`);
        deleting_Embed.setColor(`${cmndColour[0]}`);
        deleting_Embed.setDescription(`Deleting messages ${cmndEmoji[1]}`);

        const userDone_Embed = new Discord.EmbedBuilder();
        userDone_Embed.setTitle(`${cmndEmoji[0]}${config.tls}${cmndName}`);
        userDone_Embed.setColor(`${cmndColour[0]}`);

        const done_Embed = new Discord.EmbedBuilder();
        done_Embed.setTitle(`${cmndEmoji[0]}${config.tls}${cmndName}`);
        done_Embed.setColor(`${cmndColour[0]}`);

        
        /*
        ----------------------------------------------------------------------------------------------------
        Error Handling                                                                   
        ----------------------------------------------------------------------------------------------------
        */
        const noArgs_Embed = new Discord.EmbedBuilder();
        noArgs_Embed.setTitle(`${cmndError}`);
        noArgs_Embed.setColor(`${config.err_hex}`);
        noArgs_Embed.setDescription(`You didn't specified me, how many messages/whose messages to purge in bulk.`);

        // Possible_Error_1
        if(!args[1]) return message.delete().catch() && message.channel.send({ embeds: [noArgs_Embed] });


        /*
        ----------------------------------------------------------------------------------------------------
        Execution                                                                   
        ----------------------------------------------------------------------------------------------------
        */
        if(args[1].startsWith(`<@`)) {
            const targetAmount = parseInt(args[2]);


            const noAmount_Embed = new Discord.EmbedBuilder();
            noAmount_Embed.setTitle(`${cmndError}`);
            noAmount_Embed.setColor(`${config.err_hex}`);
            noAmount_Embed.setDescription(`You didn't specified me, how many messages of this user to purge in bulk.`);

            // Possible_Error_2
            if(!targetAmount) return message.delete().catch() && message.channel.send({ embeds: [noAmount_Embed] });


            const beyondLimit_Embed = new Discord.EmbedBuilder();
            beyondLimit_Embed.setTitle(`${cmndError}`);
            beyondLimit_Embed.setColor(`${config.err_hex}`);
            beyondLimit_Embed.setDescription(`You cannot use that value here. The minimum and maximum amount for bulk deletion of messages for that user is 2 and 99 respectively.`);

            // Possible_Error_3
            if(targetAmount <= 1 || targetAmount > 99) return message.delete().catch() && message.channel.send({ embeds: [beyondLimit_Embed] });



            // Execution ================================================== >>>>>
            const target = message.mentions.members.first();
            const fetchedMessages = await message.channel.messages.fetch();
            const deletableFetchedMessages = fetchedMessages.filter(messages => !messages.pinned);


            message.delete().catch();

            let i = 0;
            let filteredArr = [];

            deletableFetchedMessages.filter((filteredMessages) => {
                if(filteredMessages.author.id === target.id && targetAmount > i) {
                    filteredArr.push(filteredMessages);
                    i++;
                }
            });

            message.channel.send({ embeds: [deleting_Embed] }).then(async (deletingMsg) => {
                await message.channel.bulkDelete(filteredArr, true).then((deletedMessages) => {
                    userDone_Embed.setDescription(`Last **${deletedMessages.size}** messages of ${target.user} (${target.user.tag}), are now purged from this channel.`);
    
                    deletingMsg.edit({ embeds: [userDone_Embed] }).then((lastMsg) => {
                        setTimeout(() => {
                            lastMsg.delete();
                        }, 1000 * 5);
                    });
                }); 
            });
        } else {
            const amount = parseInt(args[1]);


            const noAlphabets_Embed = new Discord.EmbedBuilder();
            noAlphabets_Embed.setTitle(`${cmndError}`);
            noAlphabets_Embed.setColor(`${config.err_hex}`);
            noAlphabets_Embed.setDescription(`The query you gave me is an alphabet. Please provide a valid number of how many messages you wanna delete as a bulk`);

            // Possible_Error_2
            if(isNaN(args[1])) return message.delete().catch() && message.channel.send({ embeds: [noAlphabets_Embed] });


            const notLimited_Embed = new Discord.EmbedBuilder();
            notLimited_Embed.setTitle(`${cmndError}`);
            notLimited_Embed.setColor(`${config.err_hex}`);
            notLimited_Embed.setDescription(`You cannot use that value here. The minimum and maximum amount for bulk deletion of messages is 2 and 99 respectively.`);

            // Possible_Error_3
            if(amount <= 1 || amount > 99) return message.delete().catch() && message.channel.send({ embeds: [notLimited_Embed] });



            // Execution ================================================== >>>>>
            const allMessages = await message.channel.messages.fetch({ limit: amount + 1 });
            const deletable = allMessages.filter(messages => !messages.pinned);

            
            message.channel.send({ embeds: [deleting_Embed] }).then(async (deletingMsg) => {
                await message.channel.bulkDelete(deletable, true).then((deletedMessages) => {
                    done_Embed.setDescription(`Last **${deletedMessages.size - 1}** messages, are now purged from this channel.`);

                    deletingMsg.edit({ embeds: [done_Embed] }).then((finalMsg) => {
                        setTimeout(() => {
                            finalMsg.delete();
                        }, 1000 * 5);
                    });
                });
            });
        }
    }
});