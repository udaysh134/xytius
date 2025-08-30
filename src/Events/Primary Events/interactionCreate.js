const Event = require("../../Structures/Event.js");
const Discord = require("discord.js");
const config = require("../../Data/config.json");

const INT_nickname = require(`../../Systems/Interaction Events/INT_nickname.js`);
const INT_vpanel = require(`../../Systems/Interaction Events/INT_vpanel.js`);


module.exports = new Event("interactionCreate", async (client, interaction) => {
    /*
    ----------------------------------------------------------------------------------------------------
    Start
    ----------------------------------------------------------------------------------------------------
    */
    const evntError = `${config.err_emoji}${config.tls}Slash Command Error!!`;


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


    /*
    ----------------------------------------------------------------------------------------------------
    Error Handling
    ----------------------------------------------------------------------------------------------------
    */
    if(interaction.isCommand() || interaction.isChatInputCommand() || interaction.isContextMenuCommand()) {
        const command = client.commands.get(interaction.commandName);
        
        // Invalid Command ================================================== >>>>>
        if(!command) {
            const error_Embed = new Discord.EmbedBuilder();
            error_Embed.setTitle(`${evntError}`);
            error_Embed.setColor(`${config.err_hex}`);
            error_Embed.setDescription(`An unknown error just occured while executing the command. Please try this command after sometime.`);
            error_Embed.setFooter({ text: interaction.user.username, iconURL: interaction.user.avatarURL({ dynamic: true }) });
            error_Embed.setTimestamp(interaction.createdTimestamp);
            
            // Possible_Error_1
            interaction.reply({ embeds: [error_Embed], ephemeral: true });
            return client.commands.delete(interaction.commandName);
        }



        // Ineligible for Usage ================================================== >>>>>
        const permission = interaction.member.permissions.has(command.permission, true);

        const notHavingPerm_Embed = new Discord.EmbedBuilder();
        notHavingPerm_Embed.setTitle(`${evntError}`);
        notHavingPerm_Embed.setColor(`${config.err_hex}`);
        notHavingPerm_Embed.setDescription(`Sorry, you cannot proceed, as you don't have permission to use this particular command. Try your hands on some other commands.`);
        notHavingPerm_Embed.setFooter({ text: interaction.user.username, iconURL: interaction.user.avatarURL({ dynamic: true }) });
        notHavingPerm_Embed.setTimestamp(interaction.createdTimestamp);

        // Possible_Error_2
        if (!permission) return interaction.reply({ embeds: [notHavingPerm_Embed], ephemeral: true });



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
        notAllowedChnl_Embed.setDescription(`Sorry, this command is not allowed in this channel. This is a channel specific command and you can use this command in channels given below.\n${createLine(60)}\n${usableChannels}`);
        notAllowedChnl_Embed.setFooter({ text: interaction.user.username, iconURL: interaction.user.avatarURL({ dynamic: true }) });
        notAllowedChnl_Embed.setTimestamp(interaction.createdTimestamp);

        // Possible_Error_3
        if (
            !(allowedChannels.includes(interaction.channel.id))
            && interaction.guild.id === config.Aubdycad_ID
            && interaction.user.id !== config.uday_ID
        ) return interaction.reply({ embeds: [notAllowedChnl_Embed], ephemeral: true });


        
        // Server not allowed ================================================== >>>>>
        const allowedServers = command.allowedServers;

        const notAllowedSrvr_Embed = new Discord.EmbedBuilder();
        notAllowedSrvr_Embed.setTitle(`${evntError}`);
        notAllowedSrvr_Embed.setColor(`${config.err_hex}`);
        notAllowedSrvr_Embed.setDescription(`Sorry, this command is not allowed in this server. This is a server specific command and you can use this command in only the servers listed in my brain.`);
        notAllowedSrvr_Embed.setFooter({ text: interaction.user.username, iconURL: interaction.user.avatarURL({ dynamic: true }) });
        notAllowedSrvr_Embed.setTimestamp(interaction.createdTimestamp);

        // Possible_Error_4
        if (!(allowedServers.includes(interaction.guild.id))) return interaction.reply({ embeds: [notAllowedSrvr_Embed], ephemeral: true });




        // Final Execution ================================================== >>>>>
        command.execute(client, interaction);
    }


    /*
    ----------------------------------------------------------------------------------------------------
    Interactions
    ----------------------------------------------------------------------------------------------------
    */
    INT_nickname(client, interaction);
    INT_vpanel(client, interaction);
});