const Event = require("../../Structures/Event.js");
const Discord = require("discord.js");
const config = require("../../Data/config.json");

const ms = require("ms");
const cooldowns_DB = require("../../Schemas/cooldowns_DB.js");

const MSG_dmLogs = require("../../Systems/Message Events/MSG_dmLogs");
const MSG_aiChats = require("../../Systems/Message Events/MSG_aiChats");
const MSG_mention = require("../../Systems/Message Events/MSG_mention");
const MSG_afk = require("../../Systems/Message Events/MSG_afk");
const MSG_feedback = require("../../Systems/Message Events/MSG_feedback");

const STCK_feedback = require("../../Systems/Stick Messages/STCK_feedback");


module.exports = new Event("messageCreate", async (client, message) => {
    console.log(`[${message.author.tag}]: ${message.content}`);
    
    if(message.author.bot) return;

    /*
    ----------------------------------------------------------------------------------------------------
    Miscellaneous Tasks
    ----------------------------------------------------------------------------------------------------
    */
    MSG_dmLogs(client, message);
    MSG_aiChats(client, message);
    MSG_mention(client, message);
    MSG_afk(client, message);
    MSG_feedback(client, message);

    STCK_feedback(client, message);
    

    /*
    ----------------------------------------------------------------------------------------------------
    Start
    ----------------------------------------------------------------------------------------------------
    */
    if(!message.content.startsWith(client.prefix)) return;

    const args = message.content.substring(client.prefix.length).trimStart().split(/ +/);
    const command = client.commands.find(cmd => cmd.name == args[0].toLowerCase()) || client.aliases.get(args[0].toLowerCase());

    const evntError = `${config.err_emoji}${config.tls}Command Error!!`;
    const evntMarker = config.marker;
    const timeoutTime = 15;


    /*
    ----------------------------------------------------------------------------------------------------
    Functions
    ----------------------------------------------------------------------------------------------------
    */
    function createLine(length) {
        let result = ``;

        for (let i = 0; i < length; i++) {
            result += `-`;
        }

        result += ` >>`;
        return result;
    }


    function msToTime(duration) {
        let totalSeconds = (duration / 1000);
        let days = Math.floor(totalSeconds / 86400);
            totalSeconds %= 86400;
        let hours = Math.floor(totalSeconds / 3600);
            totalSeconds %= 3600;
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = Math.floor(totalSeconds % 60);

        let daysText = (days === 1 || days === 0 || days === -1) ? `day` : `days`;
        let hoursText = (hours === 1 || hours === 0 || hours === -1) ? `hour` : `hours`;
        let minutesText = (minutes === 1 || minutes === 0 || minutes === -1) ? `minute` : `minutes`;
        let secondsText = (seconds === 1 || seconds === 0 || seconds === -1) ? `second` : `seconds`;

        return `${days} ${daysText}, ${hours} ${hoursText}, ${minutes} ${minutesText}, ${seconds} ${secondsText}`;
    }


    /*
    ----------------------------------------------------------------------------------------------------
    Error Handling
    ----------------------------------------------------------------------------------------------------
    */
    // Invalid Command ================================================== >>>>>
    const cmdNotExists_Embed = new Discord.EmbedBuilder();
    cmdNotExists_Embed.setTitle(`${evntError}`);
    cmdNotExists_Embed.setColor(`${config.err_hex}`);
    cmdNotExists_Embed.setDescription(`Sorry, "*${args[0]}*" command does not exists in me. If you're lost, just use "\`${config.prefix}help\`" command to get to know about commands you can use, or alternatively, use "\`${config.prefix}usage\`" command to get more info for a particular command.`);
    cmdNotExists_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
    cmdNotExists_Embed.setTimestamp(message.createdTimestamp);
    
    // Possible_Error_1
    if(!command) return message.reply({ embeds: [cmdNotExists_Embed] }).then((Msg) => { setTimeout(() => { Msg.delete() }, 1000 * timeoutTime); });



    // Only for Teasting ================================================== >>>>>
    const forTesting = command.forTesting;

    const onlyForTesting_Embed = new Discord.EmbedBuilder();
    onlyForTesting_Embed.setTitle(`${evntError}`);
    onlyForTesting_Embed.setColor(`${config.err_hex}`);
    onlyForTesting_Embed.setDescription(`Sorry, this command is not currenly open for everyone out here. This is because, the developer is still working on it. This could be either a new update or a fix for something or maybe else. You can try this again later to check if its up for you or not.`);
    onlyForTesting_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
    onlyForTesting_Embed.setTimestamp(message.createdTimestamp);
    
    // Possible_Error_2
    if(
        forTesting === true
        && message.author.id !== config.uday_ID
    ) return message.reply({ embeds: [onlyForTesting_Embed] }).then((Msg) => { setTimeout(() => { Msg.delete() }, 1000 * timeoutTime); });



    // Ineligible for Usage ================================================== >>>>>
    const permission = message.member.permissions.has(command.permission, true);

    const notHavingPerm_Embed = new Discord.EmbedBuilder();
    notHavingPerm_Embed.setTitle(`${evntError}`);
    notHavingPerm_Embed.setColor(`${config.err_hex}`);
    notHavingPerm_Embed.setDescription(`Sorry, you cannot proceed, as you don't have permission to use this particular command. Try your hands on some other commands. Use "\`${config.prefix}help\`" command to get to know more about commands you can use.`);
    notHavingPerm_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
    notHavingPerm_Embed.setTimestamp(message.createdTimestamp);
    
    // Possible_Error_3
    if(!permission) return message.reply({ embeds: [notHavingPerm_Embed] }).then((Msg) => { setTimeout(() => { Msg.delete() }, 1000 * timeoutTime); });



    // Channel not allowed ================================================== >>>>>
    const allowedChannels = command.allowedChannels;    
    const Aubdycad_Server = client.guilds.cache.get(`${config.Aubdycad_ID}`);
    const fetchedChannelsArr = [];

    allowedChannels.forEach((id) => {
        const fetchedChannel = Aubdycad_Server.channels.cache.get(`${id}`);
        fetchedChannelsArr.push(fetchedChannel);
    });

    const usableChannels = fetchedChannelsArr.length === 0 ? `None` : `${fetchedChannelsArr.join(", ")}`;

    const notAllowedChnl_Embed = new Discord.EmbedBuilder();
    notAllowedChnl_Embed.setTitle(`${evntError}`);
    notAllowedChnl_Embed.setColor(`${config.err_hex}`);
    notAllowedChnl_Embed.setDescription(`Sorry, this command is not allowed in this channel. This is a channel specific command and you can use this command in channels given below.\n${createLine(40)}\n${usableChannels}`);
    notAllowedChnl_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
    notAllowedChnl_Embed.setTimestamp(message.createdTimestamp);
    
    // Possible_Error_4
    if(
        !(allowedChannels.includes(message.channel.id))
        && message.guild.id === config.Aubdycad_ID
        && message.author.id !== config.uday_ID
    ) return message.reply({ embeds: [notAllowedChnl_Embed] }).then((Msg) => { setTimeout(() => { Msg.delete() }, 1000 * timeoutTime); });



    // Server not allowed ================================================== >>>>>
    const allowedServers = command.allowedServers;

    const notAllowedSrvr_Embed = new Discord.EmbedBuilder();
    notAllowedSrvr_Embed.setTitle(`${evntError}`);
    notAllowedSrvr_Embed.setColor(`${config.err_hex}`);
    notAllowedSrvr_Embed.setDescription(`Sorry, this command is not allowed in this server. This is a server specific command and you can use this command in only the servers listed in my brain.`);
    notAllowedSrvr_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
    notAllowedSrvr_Embed.setTimestamp(message.createdTimestamp);
    
    // Possible_Error_5
    if(!(allowedServers.includes(message.guild.id))) return message.reply({ embeds: [notAllowedSrvr_Embed] }).then((Msg) => { setTimeout(() => { Msg.delete() }, 1000 * timeoutTime); });



    // Cooldown Exists ================================================== >>>>>
    if(
        command.cooldown !== ``
        && message.guild.id === config.Aubdycad_ID
        && message.author.id !== config.uday_ID
    ) {
        const cooldown = ms(`${command.cooldown}`);
        const expireTime = Date.now() + cooldown;

        const foundData = await cooldowns_DB.findOne({
            GuildID: message.guild.id,
            UserID: message.author.id,
            CommandName: command.name,
        });

        if (foundData !== null) {
            const foundCooldown = foundData.Cooldown;
            const remainingTime = msToTime(foundCooldown - Date.now());

            const cooldown_Embed = new Discord.EmbedBuilder();
            cooldown_Embed.setTitle(`${evntError}`);
            cooldown_Embed.setColor(`${config.err_hex}`);
            cooldown_Embed.setDescription(`Hold on, ${message.author.tag}!! You're currently on a cooldown for this command and can only use this command again after the cooldown period is over.`);
            cooldown_Embed.addFields({
                name: `${evntMarker}Time left untill next usage :`,
                value: `\`\`\`${remainingTime}\`\`\``,
                inline: false
            });
            cooldown_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
            cooldown_Embed.setTimestamp(message.createdTimestamp);

            // Possible_Error_6
            return message.reply({ embeds: [cooldown_Embed] }).then((Msg) => { setTimeout(() => { Msg.delete() }, 1000 * timeoutTime); });
        } else {
            cooldowns_DB.create({
                GuildID: message.guild.id,
                UserID: message.author.id,
                CommandName: command.name,
                Cooldown: expireTime,
            });
        }
    }


    /*
    ----------------------------------------------------------------------------------------------------
    Execution
    ----------------------------------------------------------------------------------------------------
    */
    command.run(message, args, client);
});