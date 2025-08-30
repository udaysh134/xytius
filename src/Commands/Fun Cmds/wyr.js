const Command = require("../../Structures/Command.js");
const Discord = require("discord.js");
const config = require("../../Data/config.json");
const aubdycad = require("../../Data/aubdycad.json");
const emojis = require("../../Data/emojis.json");
const pictures = require("../../Data/pictures.json");
const keys = require("../../Data/keys.json");

const fetch = require("node-fetch");


module.exports = new Command({
    name: "wyr",
    description: "Gives you two choices to choose between and see what others would do.",
    aliases: [],
    permission: "SendMessages",
    allowedChannels: [`${aubdycad.WouldYouRather_TC_ID}`],
    allowedServers: [`${config.TestServer_ID}`, `${config.Aubdycad_ID}`, `${config.XytiusServer_ID}`],
    cooldown: "",
    usage: `${config.prefix}wyr [choice_1 | choice_2]`,
    usageDesc: `As name says, "wyr" (Would you rather?), the command gives you two choices to choose in between. See, would you rather choose first or second option.\n\nNormally, you don't need to give any query while using this command. The optional queries are not for everyone. The command is usable in a specific channel only. This is, to see public opinions on different topics at one place.`,
    usageExample: [`${config.prefix}wyr`, `${config.prefix}wyr choose blue pill | Or choose red pill`],
    forTesting: false,
    HUCat: [`gen`, `fun`],

    async run(message, args, client) {
        const cmndName = `Would you rather...`;
        const cmndEmoji = [`💊`, `1️⃣`, `2️⃣`];
        const cmndColour = [`ffffff`];
        const cmndError = `${config.err_emoji}${config.tls}WYR : Command Error!!`;
        const cmndMarker = `${config.marker}`;

        /*
        ----------------------------------------------------------------------------------------------------
        Start
        ----------------------------------------------------------------------------------------------------
        */
        const link = keys.wyr.link;
        const result = await fetch(link).then((res) => res.json());

        const Admin_Perm = message.member.permissions.has(Discord.PermissionFlagsBits.Administrator);


        /*
        ----------------------------------------------------------------------------------------------------
        Execution
        ----------------------------------------------------------------------------------------------------
        */
        async function wyrResult(embed, op_1, op_2) {
            embed.setTitle(`${cmndEmoji[0]}${config.tls}${cmndName}`);
            embed.setColor(`${cmndColour[0]}`);
            embed.addFields({
                name: `Option : 1`,
                value: `\`\`\`${op_1}\`\`\``,
                inline: true
            }, {
                name: `Option : 2`,
                value: `\`\`\`${op_2}\`\`\``,
                inline: true
            });

            return message.channel.send({ embeds: [embed] }).then((wyrMsg) => {
                wyrMsg.react(`${cmndEmoji[1]}`);
                wyrMsg.react(`${cmndEmoji[2]}`);
            });
        }

        
        /*
        ----------------------------------------------------------------------------------------------------
        Execution
        ----------------------------------------------------------------------------------------------------
        */
        if(args[1]) {
            message.delete().catch();

            
            const noPermission_Embed = new Discord.EmbedBuilder();
            noPermission_Embed.setTitle(`${cmndError}`);
            noPermission_Embed.setColor(`${config.err_hex}`);
            noPermission_Embed.setDescription(`Sorry, you cannot do that, as you lack permissions for it. Only Admins can do that.`);
            noPermission_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
            noPermission_Embed.setTimestamp(message.createdTimestamp);
            
            // Possible_Error_1
            if(!Admin_Perm) return message.channel.send({ embeds: [noPermission_Embed] });


            
            const content = `${message.content}`;
            const seperator = '|';
            const splittedContent = content.split(`${seperator}`);
            const option_1 = splittedContent[0].slice(6);
            const option_2 = splittedContent[1];



            const noOption2_Embed = new Discord.EmbedBuilder();
            noOption2_Embed.setTitle(`${cmndError}`);
            noOption2_Embed.setColor(`${config.err_hex}`);
            noOption2_Embed.setDescription(`I cannot accept only one option, as you need two option in a "Would You Rather" game. Please provide me one more option to proceed further.`);
            noOption2_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
            noOption2_Embed.setTimestamp(message.createdTimestamp);
            
            // Possible_Error_2
            if(!option_2) return message.channel.send({ embeds: [noOption2_Embed] });


            const noOption3_Embed = new Discord.EmbedBuilder();
            noOption3_Embed.setTitle(`${cmndError}`);
            noOption3_Embed.setColor(`${config.err_hex}`);
            noOption3_Embed.setDescription(`I cannot accept third option, as you need only two option in a "Would You Rather" game. Please provide me only two options to proceed further.`);
            noOption3_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
            noOption3_Embed.setTimestamp(message.createdTimestamp);
            
            // Possible_Error_3
            if(splittedContent[2]) return message.channel.send({ embeds: [noOption3_Embed] });



            // Execution ================================================== >>>>>
            const wyrPersonal_Embed = new Discord.EmbedBuilder();
            return await wyrResult(wyrPersonal_Embed, option_1, option_2);
        } else {
            const wyrNormal_Embed = new Discord.EmbedBuilder();
            return await wyrResult(wyrNormal_Embed, result.ops1, result.ops2);
        }
    }
});