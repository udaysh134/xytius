const Command = require("../../Structures/Command.js");
const Discord = require("discord.js");
const config = require("../../Data/config.json");
const aubdycad = require("../../Data/aubdycad.json");
const emojis = require("../../Data/emojis.json");
const pictures = require("../../Data/pictures.json");
const keys = require("../../Data/keys.json");

const Canvas = require("canvas");


module.exports = new Command({
    name: "avatar",
    description: "Grab Discord profile picture of any user from/in Discord.",
    aliases: ["pfp", "dp"],
    permission: "SendMessages",
    allowedChannels: [`${aubdycad.BotCommands1_C_ID}`, `${aubdycad.BotCommands2_C_ID}`],
    allowedServers: [`${config.TestServer_ID}`, `${config.Aubdycad_ID}`, `${config.XytiusServer_ID}`],
    cooldown: "",
    usage: `${config.prefix}avatar [user_mention / user_id]`,
    usageDesc: `To fetch anyone's Discord profile picture (avatar) from anywhere (within the platform), you need to have that user's "User ID". Use that ID as the second query. You can do the same by mentioning (tagging) anyone, but this is limited only to the server you're in. If not provided any query, you'll get your own avatar as a result.\n\nThe resulting avatar will always be in \`.webp\` format (by default), but you'll always have options to view / download the same avatar in \`.jpg\` / \`.jpeg\` / \`.png\` format. The avatar image of any user is always in 4096 * 4096 resolution (exception exists).`,
    usageExample: [`${config.prefix}avatar`, `${config.prefix}avatar @RandomGuy#0001`, `${config.prefix}avatar 886291251119419432`],
    forTesting: false,
    HUCat: [`gen`, `general`],

    async run(message, args, client) {
        const cmndName = `Avatar`;
        const cmndEmoji = [`🎴`];
        const cmndColour = [`ffffff`];
        const cmndError = `${config.err_emoji}${config.tls}Avatar : Command Error!!`;
        const cmndMarker = `${config.marker}`;

        /*
        ----------------------------------------------------------------------------------------------------
        Start                                                                   
        ----------------------------------------------------------------------------------------------------
        */
        const target = message.mentions.users.first();
        const alphabet = isNaN(args[1]);

        const canvas = Canvas.createCanvas(2048, 2048);
        const context = canvas.getContext("2d");
        

        /*
        ----------------------------------------------------------------------------------------------------
        Functions                                                                   
        ----------------------------------------------------------------------------------------------------
        */
        function componentToHex(c) {
            let hex = c.toString(16);
            return hex.length == 1 ? "0" + hex : hex;
        }

        function rgbToHex(r, g, b) {
            return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
        }


        async function getPFPColour(userImg) {
            let palette = { r: 0, g: 0, b: 0 };
            let count = 0;

            await Canvas.loadImage(userImg).then((img) => {
                context.drawImage(img, 0, 0, canvas.width, canvas.height);
            });

            const imgData = context.getImageData(0, 0, canvas.width, canvas.height);
            const dataLength = imgData.data.length;


            for (let i = 0; i < dataLength; i += 4) {
                palette.r += imgData.data[i];
                palette.g += imgData.data[i + 1];
                palette.b += imgData.data[i + 2];

                count++;
            }
    
            palette.r = Math.floor(palette.r / count);
            palette.g = Math.floor(palette.g / count);
            palette.b = Math.floor(palette.b / count);

            const finalHex = `${rgbToHex(palette.r, palette.g, palette.b)}`;
            return finalHex;
        }


        async function mainEmbed(embed, user) {
            const colour = await getPFPColour(user.avatarURL({ extension: "png" }));

            embed.setTitle(`${cmndEmoji[0]}${config.tls}${cmndName}`);
            embed.setColor(`${colour}`);
            embed.setDescription(`**${user.username}'s avatar**\nView in : [jpg](${user.avatarURL({ extension: "jpg", size: 4096 })}) | [jpeg](${user.avatarURL({ extension: "jpeg", size: 4096 })}) | [png](${user.avatarURL({ extension: "png", size: 4096 })}) | [webp](${user.avatarURL({ dynamic: true, size: 4096 })})`);
            embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
            embed.setImage(user.avatarURL({ dynamic: true, size: 4096 }));
            embed.setTimestamp(message.createdTimestamp);
        }


        /*
        ----------------------------------------------------------------------------------------------------
        Execution                                                                   
        ----------------------------------------------------------------------------------------------------
        */
        if(!args[1]) {
            const selfAvatar_Embed = new Discord.EmbedBuilder();
            await mainEmbed(selfAvatar_Embed, message.author);

            return message.reply({ embeds: [selfAvatar_Embed] });
        } else if(target && args[1].startsWith("<@")) {
            const targetAvatar_Embed = new Discord.EmbedBuilder();
            await mainEmbed(targetAvatar_Embed, target);

            return message.reply({ embeds: [targetAvatar_Embed] });
        } else if(!alphabet) {
            const targetId = args[1];
            const fetchedUser = await client.users.fetch(`${targetId}`).catch(() => { return `None` });


            const invalidID_Embed = new Discord.EmbedBuilder();
            invalidID_Embed.setTitle(`${cmndError}`);
            invalidID_Embed.setColor(`${config.err_hex}`);
            invalidID_Embed.setDescription(`The query you provided me is wrong. Please provide me a valid ID/mention of the user/member to get their avatar.`);
            invalidID_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
            invalidID_Embed.setTimestamp(message.createdTimestamp);

            // Possible_Error_1
            if(fetchedUser === `None`) return message.reply({ embeds: [invalidID_Embed] });


            
            // Execution ================================================== >>>>>
            message.delete().catch();

            const targetIdAvatar_Embed = new Discord.EmbedBuilder();
            await mainEmbed(targetIdAvatar_Embed, fetchedUser);

            return message.channel.send({ embeds: [targetIdAvatar_Embed] });
        } else {
            const unknownError_Embed = new Discord.EmbedBuilder();
            unknownError_Embed.setTitle(`${cmndError}`);
            unknownError_Embed.setColor(`${config.err_hex}`);
            unknownError_Embed.setDescription(`An unknown error just occured!! You probably did something wrong. Use "\`${config.prefix}usage\`" command for this command to get more details on it.`);
            unknownError_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
            unknownError_Embed.setTimestamp(message.createdTimestamp);

            // Possible_Error_1
            return message.reply({ embeds: [unknownError_Embed] });
        }
    } 
});