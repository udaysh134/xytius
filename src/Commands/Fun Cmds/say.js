const Command = require("../../Structures/Command.js");
const Discord = require("discord.js");
const config = require("../../Data/config.json");
const aubdycad = require("../../Data/aubdycad.json");
const emojis = require("../../Data/emojis.json");
const pictures = require("../../Data/pictures.json");
const keys = require("../../Data/keys.json");


module.exports = new Command({
    name: "say",
    description: "Let the bot speak for you, whatever you wanna say.",
    aliases: [],
    permission: "SendMessages",
    allowedChannels: [`${aubdycad.GeneralChats_C_ID}`, `${aubdycad.BotCommands1_C_ID}`, `${aubdycad.BotCommands2_C_ID}`],
    allowedServers: [`${config.TestServer_ID}`, `${config.Aubdycad_ID}`, `${config.XytiusServer_ID}`],
    cooldown: "",
    usage: `${config.prefix}say <text>`,
    usageDesc: `This command lets you say whatever you want, from bot's account. Means Xytius itself will say whaever you'd like to, but with it's mouth. Your message will get deleted right after you use the command so that nobody can see, when you used the command.`,
    usageExample: [`${config.prefix}say I'm a superhero`, `${config.prefix}say Discord's CEO is the real Wumpus.`, `${config.prefix}say @RandomGuy#0001 is not an idiot.`],
    forTesting: false,
    HUCat: [`gen`, `fun`],

    async run(message, args, client) {
        const cmndName = `Say`;
        const cmndEmoji = [];
        const cmndColour = [`2f3136`];
        const cmndError = `${config.err_emoji}${config.tls}Say : Command Error!!`;
        const cmndMarker = `${config.marker}`;

        /*
        ----------------------------------------------------------------------------------------------------
        Start                                                                   
        ----------------------------------------------------------------------------------------------------
        */
        const description = args.slice(1).join(" ");


        /*
        ----------------------------------------------------------------------------------------------------
        Error Handling                                                                   
        ----------------------------------------------------------------------------------------------------
        */
        const noDescription_Embed = new Discord.EmbedBuilder();
        noDescription_Embed.setTitle(`${cmndError}`);
        noDescription_Embed.setColor(`${config.err_hex}`);
        noDescription_Embed.setDescription(`You didn't provided me any description for your message. Please describe your content about what you wanna let the bot say.`);
        noDescription_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
        noDescription_Embed.setTimestamp(message.createdTimestamp);

        // Possible_Error_1
        if(!description) return message.reply({ embeds: [noDescription_Embed] });


        const notThatLong_Embed = new Discord.EmbedBuilder();
        notThatLong_Embed.setTitle(`${cmndError}`);
        notThatLong_Embed.setColor(`${config.err_hex}`);
        notThatLong_Embed.setDescription(`Sorry, I cannot send that long message, that's my limit from Discord itself.`);
        notThatLong_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
        notThatLong_Embed.setTimestamp(message.createdTimestamp);

        // Possible_Error_2
        if(description.length >= 4000) return message.reply({ embeds: [notThatLong_Embed] });


        /*
        ----------------------------------------------------------------------------------------------------
        Execution                                                                   
        ----------------------------------------------------------------------------------------------------
        */
        const say_Embed = new Discord.EmbedBuilder();
        say_Embed.setColor(`${cmndColour[0]}`);
        say_Embed.setDescription(`${description}\n\n|| said by - ${message.author} ||`);

        message.delete().catch();
        return message.channel.send({ embeds: [say_Embed] });
    } 
});