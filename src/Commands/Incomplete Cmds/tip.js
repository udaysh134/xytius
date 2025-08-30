const Command = require("../../Structures/Command.js");
const Discord = require("discord.js");
const config = require("../../Data/config.json");
const aubdycad = require("../../Data/aubdycad.json");
const emojis = require("../../Data/emojis.json");
const pictures = require("../../Data/pictures.json");
const keys = require("../../Data/keys.json");


module.exports = new Command({
    name: "tip",
    description: "Create a custom quick tip for members.",
    aliases: [],
    permission: "Administrator",
    allowedChannels: [],
    allowedServers: [`${config.TestServer_ID}`, `${config.Aubdycad_ID}`, `${config.XytiusServer_ID}`],
    cooldown: "",
    usage: `${config.prefix}tip <description> | [channel]`,
    usageDesc: `The command is simple to use. Just put your description (the tip) right after the command's name and execute it there, if you want your tip to be sent in that channel only. If its something else, meaning if you want to send your tip to another channel, just specify the channel after "|" sign, right after the description.`,
    usageExample: [`${config.prefix}tip Xytius's activity status sometimes shows the total members its serving for and the total servers it is in.`, `${config.prefix}tip Report command comes with privacy features like (1). Not letting anyone know, who used the command from which channel. (2). Interactions only continues to private DMs. (3). Giving option to make their reports PUBLIC or PRIVATE.`],
    forTesting: false,
    HUCat: [`admin`],

    async run(message, args, client) {
        const cmndName = `Tip`;
        const cmndEmoji = [`💡`, `✅`];
        const cmndColour = [`ffd983`, `77b255`];
        const cmndError = `${config.err_emoji}${config.tls}Tip Error!!`;
        const cmndMarker = `${config.marker}`;

        /*
        ----------------------------------------------------------------------------------------------------
        Start                                                                   
        ----------------------------------------------------------------------------------------------------
        */
        const breaker = `|`
        const splittedContent = args.join(" ").split(`${breaker}`);
        const description = splittedContent[0].slice(6);
        const channel = message.mentions.channels.last();

        const tip_Image = pictures.tip_cmd.main;


        /*
        ----------------------------------------------------------------------------------------------------
        Error Handling                                                                   
        ----------------------------------------------------------------------------------------------------
        */
        const noArgs_Embed = new Discord.EmbedBuilder();
        noArgs_Embed.setTitle(`${cmndError}`);
        noArgs_Embed.setColor(`${config.err_hex}`);
        noArgs_Embed.setDescription(`You didn't provided me any description for your tip you wanna display.`);

        // Possible_Error_1
        if(!args[1]) return message.delete().catch() && message.channel.send({ embeds: [noArgs_Embed] });


        /*
        ----------------------------------------------------------------------------------------------------
        Execution                                                                   
        ----------------------------------------------------------------------------------------------------
        */
        if(!message.content.includes(`${breaker}`)) {
            // Embeds ================================================== >>>>>
            const tip_Embed = new Discord.EmbedBuilder();
            tip_Embed.setTitle(`${cmndEmoji[0]}${config.tls}${cmndName}`);
            tip_Embed.setColor(`${cmndColour[0]}`);
            tip_Embed.setDescription(`${description}`);
            tip_Embed.setFooter({ text: client.user.username, iconURL: client.user.avatarURL({ dynamic: true }) });
            tip_Embed.setImage(`${tip_Image}`);
            tip_Embed.setTimestamp(message.createdTimestamp);


            // Execution ================================================== >>>>>
            message.delete().catch();
            return message.channel.send({ embeds: [tip_Embed] });
        } else {
            const noChannel_Embed = new Discord.EmbedBuilder();
            noChannel_Embed.setTitle(`${cmndError}`);
            noChannel_Embed.setColor(`${config.err_hex}`);
            noChannel_Embed.setDescription(`You just forgot to provide me the channel to send this tip in. Use "\`${config.prefix}usage\`" command for this command to get more details on it.`);

            // Possible_Error_2
            if(!splittedContent[1]) return message.delete().catch() && message.channel.send({ embeds: [noChannel_Embed] });


            const notAChannel_Embed = new Discord.EmbedBuilder();
            notAChannel_Embed.setTitle(`${cmndError}`);
            notAChannel_Embed.setColor(`${config.err_hex}`);
            notAChannel_Embed.setDescription(`That is not a channel. Please mention a channel to send this tip in.`);

            // Possible_Error_3
            if(!splittedContent[1].includes("<#") && !splittedContent[1].includes(">")) return message.delete().catch() && message.channel.send({ embeds: [notAChannel_Embed] });


            const botChnlPerms = channel.permissionsFor(client.user, true).toArray();
            const neededBotChnlPerms = [`ViewChannel`, `SendMessages`, `UseExternalEmojis`];

            
            const notHavingPerms_Embed = new Discord.EmbedBuilder();
            notHavingPerms_Embed.setTitle(`${cmndError}`);
            notHavingPerms_Embed.setColor(`${config.err_hex}`);
            notHavingPerms_Embed.setDescription(`I cannot proceed further as I'm lacking necessary permissions. I need **${neededBotChnlPerms.join(", ")}** permissions for ${channel} channel to proceed to the next step.`);

            // Possible_Error_4
            if(!(
                botChnlPerms.includes(`${neededBotChnlPerms[0]}`)
                && botChnlPerms.includes(`${neededBotChnlPerms[1]}`)
                && botChnlPerms.includes(`${neededBotChnlPerms[2]}`)
            )) return message.delete().catch() && message.channel.send({ embeds: [notHavingPerms_Embed] });



            // Embeds ================================================== >>>>>
            const done_Embed = new Discord.EmbedBuilder();
            done_Embed.setTitle(`${cmndEmoji[1]}${config.tls}Done`);
            done_Embed.setColor(`${cmndColour[1]}`);
            done_Embed.setDescription(`Tip sent to ${channel} channel.`);

            const tip_Embed = new Discord.EmbedBuilder();
            tip_Embed.setTitle(`${cmndEmoji[0]}${config.tls}${cmndName}`);
            tip_Embed.setColor(`${cmndColour[0]}`);
            tip_Embed.setDescription(`${description}`);
            tip_Embed.setFooter({ text: client.user.username, iconURL: client.user.avatarURL({ dynamic: true }) });
            tip_Embed.setImage(`${tip_Image}`);
            tip_Embed.setTimestamp(message.createdTimestamp);


            // Execution ================================================== >>>>>
            message.delete().catch();
            return message.channel.send({ embeds: [done_Embed] }).then((doneMsg) => {
                channel.send({ embeds: [tip_Embed] });

                setTimeout(() => {
                    doneMsg.delete();
                }, 1000 * 5);
            });
        }
    } 
});