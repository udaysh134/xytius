const Command = require("../../Structures/Command.js");
const Discord = require("discord.js");
const config = require("../../Data/config.json");
const aubdycad = require("../../Data/aubdycad.json");
const emojis = require("../../Data/emojis.json");
const pictures = require("../../Data/pictures.json");
const keys = require("../../Data/keys.json");

const fetch = require("node-fetch");


module.exports = new Command({
    name: "instagram",
    description: "Provides all basic details and avatar of an Instagram user.",
    aliases: ["insta"],
    permission: "SendMessages",
    allowedChannels: [`${aubdycad.BotCommands1_C_ID}`, `${aubdycad.BotCommands2_C_ID}`],
    allowedServers: [`${config.TestServer_ID}`, `${config.Aubdycad_ID}`, `${config.XytiusServer_ID}`],
    cooldown: "",
    usage: `${config.prefix}instagram <instagram_username>`,
    usageDesc: `*[The command is for integration purpose]*\n\nA simple search command for Instagram users. To use this command, you should know the Username of the person you wanna fetch details of. Just by giving their valid username, you can fetch there profile details and avatar, right here from Discord.`,
    usageExample: [`${config.prefix}instagram justinbieber`, `${config.prefix}instagram nike`, `${config.prefix}instagram zayn`],
    forTesting: true,
    HUCat: [`gen`, `search`],

    async run(message, args, client) {
        const cmndName = `Instagram`;
        const cmndEmoji = [`${emojis.INSTAGRAM}`];
        const cmndColour = [`d535af`];
        const cmndError = `${config.err_emoji}${config.tls}Instagram : Command Error!!`;
        const cmndMarker = `${config.marker}`;

        /*
        ----------------------------------------------------------------------------------------------------
        Start
        ----------------------------------------------------------------------------------------------------
        */
        const Username = args.slice(1).join(" ");


        /*
        ----------------------------------------------------------------------------------------------------
        Error Handling
        ----------------------------------------------------------------------------------------------------
        */
        const noUsernameGiven_Embed = new Discord.EmbedBuilder();
        noUsernameGiven_Embed.setTitle(`${cmndError}`);
        noUsernameGiven_Embed.setColor(`${config.err_hex}`);
        noUsernameGiven_Embed.setDescription(`You just forgot to provide me a username. Please provide me a valid Instagram username to get user's info here.`);
        noUsernameGiven_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
        noUsernameGiven_Embed.setTimestamp(message.createdTimestamp);
        
        // Possible_Error_1
        if(!Username) return message.reply({ embeds: [noUsernameGiven_Embed] });


        /*
        ----------------------------------------------------------------------------------------------------
        Execution
        ----------------------------------------------------------------------------------------------------
        */
        const link = `${keys.instagram.link}${Username}`;

        
        await fetch(link).then(async (fetchedData) => {
            const result = await fetchedData.json();


            const notValidUser_Embed = new Discord.EmbedBuilder();
            notValidUser_Embed.setTitle(`${cmndError}`);
            notValidUser_Embed.setColor(`${config.err_hex}`);
            notValidUser_Embed.setDescription(`The username you gave was not valid and I cannot find any data for that username. Please try using a valid username.`);
            notValidUser_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
            notValidUser_Embed.setTimestamp(message.createdTimestamp);
            
            // Possible_Error_2
            if(result.error) return message.reply({ embeds: [notValidUser_Embed] });


            
            // Start ================================================== >>>>>
            const m_ = cmndMarker;

            const u_username = result.username || `*None*`;
            const u_name = result.full_name || `*None*`;
            const u_bio = result.biography || `*None*`;
            const u_posts = result.posts || `*None*`;
            const u_followers = result.followers || `*None*`;
            const u_following = result.following || `*None*`;
            const u_reels = result.reels || `*None*`;
            const u_isPrivate = result.private === true ? `Yes` : `No`;
            const u_isVerified = result.verified === true ? `Yes` : `No`;
            const u_profilePicture = result.profile_pic;



            // Embeds ================================================== >>>>>
            const instagram_Embed = new Discord.EmbedBuilder();
            instagram_Embed.setTitle(`${cmndEmoji[0]}${config.tls}${cmndName}`);
            instagram_Embed.setDescription(`${m_}**Username :** ${u_username}\n${m_}**Name :** ${u_name}\n${m_}**Bio :** ${u_bio}\n${m_}**Posts :** ${u_posts}\n${m_}**Followers :** ${u_followers}\n${m_}**Followings :** ${u_following}\n${m_}**Reels :** ${u_reels}\n${m_}**Is verified :** ${u_isVerified}\n${m_}**Is private :** ${u_isPrivate}`);
            instagram_Embed.setColor(`${cmndColour[0]}`);
            instagram_Embed.setImage(`${u_profilePicture}`);
            instagram_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
            instagram_Embed.setTimestamp(message.createdTimestamp);



            // Execution ================================================== >>>>>
            return message.reply({ embeds: [instagram_Embed] });
        });
    }
});