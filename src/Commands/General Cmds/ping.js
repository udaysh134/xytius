const Command = require("../../Structures/Command.js");
const Discord = require("discord.js");
const config = require("../../Data/config.json");
const aubdycad = require("../../Data/aubdycad.json");
const emojis = require("../../Data/emojis.json");
const pictures = require("../../Data/pictures.json");
const keys = require("../../Data/keys.json");

const { connection } = require("mongoose");


module.exports = new Command({
    name: "ping",
    description: "Chek the latency of responses from the bot.",
    aliases: [],
    permission: "SendMessages",
    allowedChannels: [`${aubdycad.BotCommands1_C_ID}`, `${aubdycad.BotCommands2_C_ID}`],
    allowedServers: [`${config.TestServer_ID}`, `${config.Aubdycad_ID}`, `${config.XytiusServer_ID}`],
    cooldown: "",
    usage: `${config.prefix}ping`,
    usageDesc: `A simple command to check how much time (in milliseconds) the Bot took to respond to the given input. This latency could vary every single time you use the command. The command also provides three more technical details about the Bot. This includes, the latency of the response from the connection established to run the Bot, Database status and for how long the Bot is up since the last restart.`,
    usageExample: [`${config.prefix}ping`],
    forTesting: false,
    HUCat: [`gen`, `general`],

    async run(message, args, client) {
        const cmndName = `Ping`;
        const cmndEmoji = [`⏳`, `${emojis.ANIMATED_LOADING}`];
        const cmndColour = [`d4db42`, `2f3136`];
        const cmndError = `${config.err_emoji}${config.tls}Ping : Command Error!!`;
        const cmndMarker = `${config.marker}`;

        /*
        ----------------------------------------------------------------------------------------------------
        Embeds                                                                   
        ----------------------------------------------------------------------------------------------------
        */
        const thinking_Embed = new Discord.EmbedBuilder();
        thinking_Embed.setTitle(`${cmndEmoji[1]} Thinking of it...`);
        thinking_Embed.setColor(`${cmndColour[0]}`);

        const ping_Embed = new Discord.EmbedBuilder();
        ping_Embed.setColor(`${cmndColour[0]}`);

        const ping_Button = new Discord.ActionRowBuilder().addComponents(
            new Discord.ButtonBuilder()
            .setCustomId(`ping_viewMore`)
            .setLabel(`View more`)
            .setEmoji(`🔽`)
            .setStyle(Discord.ButtonStyle.Secondary)
        );

        const ping2_Embed = new Discord.EmbedBuilder();
        ping2_Embed.setTitle(`${cmndEmoji[0]}${config.tls}${cmndName} Pong`);
        ping2_Embed.setColor(`${cmndColour[0]}`);


        /*
        ----------------------------------------------------------------------------------------------------
        Functions                                                                   
        ----------------------------------------------------------------------------------------------------
        */
        function msToTime(duration) {
            let totalSeconds = (duration / 1000);
            
            let days = Math.floor(totalSeconds / 86400);
            totalSeconds %= 86400;
            let hours = Math.floor(totalSeconds / 3600);
            totalSeconds %= 3600;
            let minutes = Math.floor(totalSeconds / 60);
            let seconds = Math.floor(totalSeconds % 60);
        
            let daysText = (days === 1 || days === 0 || days === -1) ? `d` : `d`;
            let hoursText = (hours === 1 || hours === 0 || hours === -1) ? `h` : `h`;
            let minutesText = (minutes === 1 || minutes === 0 || minutes === -1) ? `m` : `m`;
            let secondsText = (seconds === 1 || seconds === 0 || seconds === -1) ? `s` : `s`;
            
            return `${days}${daysText} ${hours}${hoursText} ${minutes}${minutesText} ${seconds}${secondsText}`;
        }


        function databaseReadystate(value) {
            let status = ` `;
            
            switch (value) {
                case 0: status = `Disconnected`
                break;
                case 1: status = `Connected`
                break;
                case 2: status = `Connecting`
                break;
                case 3: status = `Disconnecting`
                break;
            }
            
            return status;
        }


        /*
        ----------------------------------------------------------------------------------------------------
        Execution                                                                   
        ----------------------------------------------------------------------------------------------------
        */
        message.reply({ embeds: [thinking_Embed] }).then((thinkingMsg) => {
            const latency = thinkingMsg.createdTimestamp - message.createdTimestamp;
            const pingStatus_Emoji = latency <= 200 ? `🟢` : latency > 200 && latency <= 400 ? `🟡` : latency > 400 && latency <= 600 ? `🟠` : `🔴`;
            const pingStatus_Text = latency <= 200 ? `Excellent` : latency > 200 && latency <= 400 ? `Choppy` : latency > 400 && latency <= 600 ? `High` : `Severe`;

            ping_Embed.setTitle(`${pingStatus_Emoji}${config.tls}${cmndName}`);
            ping_Embed.setDescription(`**${latency}** ms (${pingStatus_Text})`);

            thinkingMsg.edit({ embeds: [ping_Embed], components: [ping_Button] }).then((pingMsg) => {
                const ping_Collector = message.channel.createMessageComponentCollector({ time: 1000 * 10 });
                const checkInteraction = [];

                ping_Collector.on(`collect`, async (interaction) => {
                    const notYouCanDo_Embed = new Discord.EmbedBuilder();
                    notYouCanDo_Embed.setTitle(`${cmndError}`);
                    notYouCanDo_Embed.setColor(`${config.err_hex}`);
                    notYouCanDo_Embed.setDescription(`Oh oh!! Sorry ${interaction.user.tag}, but you cannot do that. Only ${message.author.tag} can use the button.`);

                    // Possible_Error_1
                    if(interaction.user.id !== message.author.id) return interaction.reply({ embeds: [notYouCanDo_Embed], ephemeral: true });


                    if(interaction.customId === `ping_viewMore`) {
                        checkInteraction.push(`Button clicked`);
                        interaction.deferUpdate();

                        const apiPing = client.ws.ping;
                        const databaseConnection = databaseReadystate(connection.readyState);
                        const botUptime = msToTime(client.uptime);

                        ping2_Embed.setDescription(`${cmndMarker}**Latency :** ${latency} ms\n${cmndMarker}**API ping :** ${apiPing} ms\n${cmndMarker}**Database :** ${databaseConnection}\n${cmndMarker}**Bot uptime :** ${botUptime}`);
                        pingMsg.edit({ embeds: [ping2_Embed], components: [] });
                        
                        return ping_Collector.stop();
                    }
                });


                ping_Collector.on(`end`, async () => {
                    ping_Button.components[0].setDisabled(true);

                    if(checkInteraction.length !== 0) return;
                    return pingMsg.edit({ embeds: [ping_Embed], components: [ping_Button] });
                });
            });
        }); 
    }
});