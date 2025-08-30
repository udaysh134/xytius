const Command = require("../../Structures/Command.js");
const Discord = require("discord.js");
const config = require("../../Data/config.json");
const aubdycad = require("../../Data/aubdycad.json");
const emojis = require("../../Data/emojis.json");
const pictures = require("../../Data/pictures.json");
const keys = require("../../Data/keys.json");

const Duolingo = require("duolingo-api");
const moment = require("moment");


module.exports = new Command({
    name: "duolingo",
    description: "Provides all basic details and avatar of a Duolingo user.",
    aliases: ["duo"],
    permission: "SendMessages",
    allowedChannels: [`${aubdycad.BotCommands1_C_ID}`, `${aubdycad.BotCommands2_C_ID}`],
    allowedServers: [`${config.TestServer_ID}`, `${config.Aubdycad_ID}`, `${config.XytiusServer_ID}`],
    cooldown: "",
    usage: `${config.prefix}duolingo <duolingo_username>`,
    usageDesc: `*[The command is for integration purpose]*\n\nA simple search command for those who use Duolingo - A learning platform. To use this command, you should know the Username of the person you wanna fetch details of. Just by giving their valid username, you can fetch there realtime details and avatar (if available), right here from Discord.`,
    usageExample: [`${config.prefix}duolingo RandomGuy`, `${config.prefix}duolingo udayshukla05`],
    forTesting: false,
    HUCat: [`gen`, `search`],

    async run(message, args, client) {
        const cmndName = `Duolingo`;
        const cmndEmoji = [`${emojis.DUOLINGO}`];
        const cmndColour = [`78c701`];
        const cmndError = `${config.err_emoji}${config.tls}Duolingo : Command Error!!`;
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
        const noUsernameGiven_Embed = new Discord.MessageEmbed();
        noUsernameGiven_Embed.setTitle(`${cmndError}`);
        noUsernameGiven_Embed.setColor(`${config.err_hex}`);
        noUsernameGiven_Embed.setDescription(`You just forgot to provide me a username. Please provide me a valid Duolingo username to get user's info here.`);
        noUsernameGiven_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
        noUsernameGiven_Embed.setTimestamp(message.createdTimestamp);
        
        // Possible_Error_1
        if(!Username) return message.reply({ embeds: [noUsernameGiven_Embed] });


        /*
        ----------------------------------------------------------------------------------------------------
        Functions
        ----------------------------------------------------------------------------------------------------
        */
        function standardiseCase(value) {
            const splitted = value.split('');
            const firstVal = splitted[0].toUpperCase();
            const otherVal = splitted.slice(1).join('');

            let resultValue = `${firstVal}${otherVal.toLowerCase().replace(/_/g, " ")}`;
            return resultValue;
        }


        function createLine(length) {
            let result = ``;

            for (let i = 0; i < length; i++) {
                result += `-`;
            }

            // result += ` >>`;
            return result;
        }


        async function getUserLangs(details) {
            const courses = details.courses;
            const arrData = [];

            let languages;
            let processed;
            let num = 0;


            courses.map((elem) => {
                processed = `**( ${++num} )** : ${elem.fromLanguage} - ${elem.title}\n⚡ : ${elem.xp.toLocaleString()} xp\n👑 : ${elem.crowns.toLocaleString()} crowns`;

                arrData.push(processed);
                languages = arrData.join(`\n${createLine(50)}\n`);
            });


            return languages;
        }


        /*
        ----------------------------------------------------------------------------------------------------
        Execution
        ----------------------------------------------------------------------------------------------------
        */
        const credential = { username: Username };
        const duo = new Duolingo(credential);


        await duo.getRawData().then(async (userData) => {
            const notValidUser_Embed = new Discord.MessageEmbed();
            notValidUser_Embed.setTitle(`${cmndError}`);
            notValidUser_Embed.setColor(`${config.err_hex}`);
            notValidUser_Embed.setDescription(`The username you gave was not valid and I cannot find any data for that username. Please try using a valid username.`);
            notValidUser_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
            notValidUser_Embed.setTimestamp(message.createdTimestamp);
            
            // Possible_Error_2
            if(userData.users.length === 0) return message.reply({ embeds: [notValidUser_Embed] });



            // Start ================================================== >>>>>
            const m_ = cmndMarker;
            const userDetails = userData.users[0];
            
            const u_name = userDetails.name || userDetails.username || `*None*`;
            const u_username = userDetails.username || `*None*`;
            const u_streak = userDetails.streak === 0 || userDetails.streak === 1 ? `${userDetails.streak} day` : `${userDetails.streak.toLocaleString()} days`;
            const u_totalXp = userDetails.totalXp.toLocaleString() || `0`;
            // const u_totalSpending = userDetails._achievements[2].count.toLocaleString() || `0`;
            // const u_perfectLessons = userDetails._achievements[7].count.toLocaleString() || `0`;
            const u_country = userDetails.profileCountry || `Unknown`;
            const u_betaStatus = `${standardiseCase(userDetails.betaStatus)}`;
            const u_isPlusMember = userDetails.hasPlus === true ? `Yes` : `No`;
            const u_joiningDate = `${moment(userDetails.creationDate * 1000).format('ddd, Do MMM YYYY, h:mm a')}`;
            const u_languages = await getUserLangs(userDetails);
            const u_image = `https:${userDetails.picture}/xxlarge`;

            let index = 0;
            let langHeadline = `LANGUAGES  ${createLine(30)} >>`;



            // Embeds ================================================== >>>>>
            const duolingo_Embed = new Discord.MessageEmbed();
            duolingo_Embed.setTitle(`${cmndEmoji[0]}${config.tls}${cmndName}`);
            duolingo_Embed.setDescription(`${m_}**Name :** ${u_name}\n${m_}**Username :** ${u_username}\n${m_}**Streak :** ${u_streak}\n${m_}**Total xp :** ${u_totalXp}\n${m_}**Country :** ${u_country}\n${m_}**Beta status :** ${u_betaStatus}\n${m_}**Plus member :** ${u_isPlusMember}\n${m_}**Joining date :** ${u_joiningDate}`);
            duolingo_Embed.setColor(`${cmndColour[0]}`);
            duolingo_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
            duolingo_Embed.setTimestamp(message.createdTimestamp);

            do {
                duolingo_Embed.addFields({
                    name: `${langHeadline}`,
                    value: `${u_languages.slice(index, index + 1024)}`,
                    inline: false
                });

                langHeadline = `+ more`;
                index += 1024;
            } while (u_languages.length > index + 1024);


            function getRow(valData) {
                const duolingo_Buttons = new Discord.MessageActionRow();

                duolingo_Buttons.addComponents(
                    new Discord.MessageButton()
                    .setLabel(`Get User Avatar`)
                    .setStyle("LINK")
                    .setURL(`${u_image}`)
                    .setDisabled(valData === `disable`),
                
                    new Discord.MessageButton()
                    .setLabel(`Get Country Codes`)
                    .setStyle("LINK")
                    .setURL(`${keys.duolingo.wiki_countryCodes}`),
                );

                return duolingo_Buttons;
            }



            // Final_Execution ================================================== >>>>>
            if(userDetails.picture.endsWith("default_2")) {
                return message.reply({ embeds: [duolingo_Embed], components: [getRow(`disable`)] });
            } else {
                return message.reply({ embeds: [duolingo_Embed], components: [getRow()] });
            }
        });
    }
});