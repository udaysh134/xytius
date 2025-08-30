const Command = require("../../Structures/Command.js");
const Discord = require("discord.js");
const config = require("../../Data/config.json");
const aubdycad = require("../../Data/aubdycad.json");
const emojis = require("../../Data/emojis.json");
const pictures = require("../../Data/pictures.json");
const keys = require("../../Data/keys.json");

const afk_DB = require("../../Schemas/afk_DB");


module.exports = new Command({
    name: "afk",
    description: "Sets an AFK prompt for you to let others know, you're away from keys.",
    aliases: [],
    permission: "SendMessages",
    allowedChannels: [`${aubdycad.ModCmds_C_ID}`, `${aubdycad.BotCommands1_C_ID}`, `${aubdycad.BotCommands2_C_ID}`],
    allowedServers: [`${config.Aubdycad_ID}`],
    cooldown: "",
    usage: `${config.prefix}afk <reason>`,
    usageDesc: `To use this command, you need to know the first most important thing. Only users who are either Admins, or Moderators, or Server Boosters, or users who are on or above level 20 in this server, will be able to use this afk system. No other users are eligible for this, except mentioned ones. Once you're eligible, you can use this system without any issue.\n\nNow to set an AFK for yourself, you only need to give a valid reason why no one can chat with you untill the AFK is over, while using this command. You don't need to do anything extra to remove your AFK status. Once you message anything, anywhere in the server, your AFK status will be updated and will be gone.`,
    usageExample: [`${config.prefix}afk I'm gonna get a Doritos for me.`, `${config.prefix}afk Have an urgent meeting to attend.`],
    forTesting: false,
    HUCat: [`gen`, `general`],

    async run(message, args, client) {
        const cmndName = `Afk`;
        const cmndEmoji = [`😴`];
        const cmndColour = [`ffa500`];
        const cmndError = `${config.err_emoji}${config.tls}Afk : Command Error!!`;
        const cmndMarker = `${config.marker}`;

        /*
        ----------------------------------------------------------------------------------------------------
        Start                                                                   
        ----------------------------------------------------------------------------------------------------
        */
        const Admin_Perm = message.member.permissions.has(Discord.PermissionFlagsBits.Administrator);

        const Moderator_Role = message.member.roles.cache.get(`${aubdycad.Moderator_R_ID}`);
        const ServerBooster_Role = message.member.roles.cache.get(`${aubdycad.ServerBooster_R_ID}`);
        const Lvl20_Role = message.member.roles.cache.get(`${aubdycad.Lvl20_R_ID}`);

        const reason = args.slice(1).join(" ");


        /*
        ----------------------------------------------------------------------------------------------------
        Error Handling                                                                   
        ----------------------------------------------------------------------------------------------------
        */
        const notEligible_Embed = new Discord.EmbedBuilder();
        notEligible_Embed.setTitle(`${cmndError}`);
        notEligible_Embed.setColor(`${config.err_hex}`);
        notEligible_Embed.setDescription(`Sorry, you don't have permission to use this command as you're not currently eligible for this. The command is for only **Admins**, **Moderators**, **Server Boosters** and to those who're at or above **Level-20** in this server.`);
        notEligible_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
        notEligible_Embed.setTimestamp(message.createdTimestamp);

        // Possible_Error_1
        if(
            !Admin_Perm &&
            !Moderator_Role &&
            !ServerBooster_Role &&
            !Lvl20_Role
        ) return message.reply({ embeds: [notEligible_Embed] });


        const noReason_Embed = new Discord.EmbedBuilder();
        noReason_Embed.setTitle(`${cmndError}`);
        noReason_Embed.setColor(`${config.err_hex}`);
        noReason_Embed.setDescription(`You just forgot to provide me a valid reason. Please provide me the reason why you're going away-from-keys (afk). This will help members of the server to get to know why can't they talk to you at the time.`);
        noReason_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
        noReason_Embed.setTimestamp(message.createdTimestamp);

        // Possible_Error_2
        if(!reason) return message.reply({ embeds: [noReason_Embed] });


        /*
        ----------------------------------------------------------------------------------------------------
        Embeds                                                                   
        ----------------------------------------------------------------------------------------------------
        */
        const afk_Embed = new Discord.EmbedBuilder();
        afk_Embed.setTitle(`${cmndEmoji[0]}${config.tls}${cmndName} Set`);
        afk_Embed.setDescription(`\`\`\`${message.author.tag}, your afk is now active. Any member, mentioning you, will be informed that you're away from keys.\`\`\``);
        afk_Embed.setColor(`${cmndColour[0]}`);
        afk_Embed.addFields({
            name: `${cmndMarker}Reason from you :`, 
            value: `${reason}`,
            inline: false
        });


        /*
        ----------------------------------------------------------------------------------------------------
        Execution                                                                   
        ----------------------------------------------------------------------------------------------------
        */
        message.delete().catch();

        await afk_DB.findOne({
            GuildID: message.guild.id,
            UserID: message.author.id,
        }).then(async (foundDoc) => {
            if(foundDoc) {
                await afk_DB.deleteOne({
                    GuildID: message.guild.id,
                    UserID: message.author.id,
                }).then(() => {
                    afk_DB.create({
                        GuildID: message.guild.id,
                        UserID: message.author.id,
                        Time: message.createdTimestamp,
                        Reason: reason
                    }).then(() => {
                        return message.channel.send({ embeds: [afk_Embed] });
                    });
                });
            } else {
                afk_DB.create({
                    GuildID: message.guild.id,
                    UserID: message.author.id,
                    Time: message.createdTimestamp,
                    Reason: reason
                }).then(() => {
                    return message.channel.send({ embeds: [afk_Embed] });
                });
            }
        });
    }
});