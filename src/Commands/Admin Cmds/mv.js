const Command = require("../../Structures/Command.js");
const Discord = require("discord.js");
const config = require("../../Data/config.json");
const aubdycad = require("../../Data/aubdycad.json");
const emojis = require("../../Data/emojis.json");
const pictures = require("../../Data/pictures.json");
const keys = require("../../Data/keys.json");

const moment = require("moment");
const FUNC_createWC = require("../../Systems/External Functions/FUNC_createWC.js");
const FUNC_welcomeLines = require("../../Systems/External Functions/FUNC_welcomeLines.js");


module.exports = new Command({
    name: "mv",
    description: "Used to manually verify a member to provide them membership of the server.",
    aliases: [],
    permission: "Administrator",
    allowedChannels: [],
    allowedServers: [`${config.Aubdycad_ID}`],
    cooldown: "",
    usage: `${config.prefix}mv <user_id> [date_&_time / time_in_milliseconds]`,
    usageDesc: `MV stands for "Manual Verification". This command can be used if anyhow, the verification of the user was failed and he/she/they needs to be verified for getting membership of the server. Second use case could be, if a bot is invited and needs to be verified (which, because of the system established, cannot verify itself even if the verification system is working fine).\n\nProviding member's id is necessary. For time, you can either provide whole text by yourself (like Day, Date & Time of action) or simply the time, in milliseconds (which, if you know JavaScript/NodeJS well, you're expected to know about it). You can also leave it empty, as query for time is optional. This will take the time when you used the command.`,
    usageExample: [`${config.prefix}mv 886291251119419432`, `${config.prefix}mv 886291251119419432 Tue, 34th Jan 2030, 12:61 am`, `${config.prefix}mv 886291251119419432 1658290410715`],
    forTesting: false,
    HUCat: [`admin`],

    async run(message, args, client) {
        const cmndName = `Manual Verification`;
        const cmndEmoji = [`🔐`, `✅`, `❌`];
        const cmndColour = [`ffac33`, `77b255`];
        const cmndError = `${config.err_emoji}${config.tls}MV : Command Error!!`;
        const cmndMarker = `${config.marker}`;

        /*
        ----------------------------------------------------------------------------------------------------
        Start                                                                   
        ----------------------------------------------------------------------------------------------------
        */
        const Aubdycadian_Role = await message.guild.roles.fetch(`${aubdycad.Aubdycadian_R_ID}`).catch(() => { return `None` });
        const MvUsers_Chnl = message.guild.channels.cache.get(`${aubdycad.MvUsers_C_ID}`);
        const JoinedAndLeft_Chnl = message.guild.channels.cache.get(`${aubdycad.JoinedAndLeft_C_ID}`);

        const targetId = args[1];
        const fetchedMember = await message.guild.members.fetch(`${targetId}`).catch(() => { return `None` });
        const givenTime = args.slice(2).join(" ");

        const msgCreatedTime = `${moment(message.createdTimestamp).format('ddd, Do MMM YYYY')} at ${moment(message.createdTimestamp).format('h:mm:ss a')}`;

        const otherInfoArr = [];
        const infoDetail = [
            `${cmndEmoji[1]} : Explicit timing was provided.`,
            `${cmndEmoji[2]} : No explicit timing was provided.`,
            `${cmndEmoji[1]} : Already had the pass.`,
            `${cmndEmoji[2]} : Didn't already had the pass.`
        ];

        let displayTime;
        let accountType;
        let otherInfo;


        /*
        ----------------------------------------------------------------------------------------------------
        Error handling                                                                   
        ----------------------------------------------------------------------------------------------------
        */
        const noAubdycadianRole_Embed = new Discord.EmbedBuilder();
        noAubdycadianRole_Embed.setTitle(`${cmndError}`);
        noAubdycadianRole_Embed.setColor(`${config.err_hex}`);
        noAubdycadianRole_Embed.setDescription(`I cannot find the specified role to work with. And hence, I cannot proceed further.`);

        // Possible_Error_1
        if(Aubdycadian_Role === undefined || Aubdycadian_Role === null || Aubdycadian_Role === `None`) return message.delete().catch() && message.channel.send({ embeds: [noAubdycadianRole_Embed] });


        const noChannel_Embed = new Discord.EmbedBuilder();
        noChannel_Embed.setTitle(`${cmndError}`);
        noChannel_Embed.setColor(`${config.err_hex}`);
        noChannel_Embed.setDescription(`I cannot find the specified channel to work with. And hence, I cannot proceed further.`);

        // Possible_Error_2
        if(MvUsers_Chnl === undefined || MvUsers_Chnl === null) return message.delete().catch() && message.channel.send({ embeds: [noChannel_Embed] });


        const botChnlPerms = MvUsers_Chnl.permissionsFor(client.user, true).toArray();
        const neededBotChnlPerms = [`ViewChannel`, `SendMessages`, `UseExternalEmojis`];

        const notHavingPerms_Embed = new Discord.EmbedBuilder();
        notHavingPerms_Embed.setTitle(`${cmndError}`);
        notHavingPerms_Embed.setColor(`${config.err_hex}`);
        notHavingPerms_Embed.setDescription(`I cannot proceed further as I'm lacking necessary permissions. I need **${neededBotChnlPerms.join(", ")}** permissions for ${MvUsers_Chnl} channel to proceed to the next step.`);

        // Possible_Error_3
        if(!(
            botChnlPerms.includes(`${neededBotChnlPerms[0]}`)
            && botChnlPerms.includes(`${neededBotChnlPerms[1]}`)
            && botChnlPerms.includes(`${neededBotChnlPerms[2]}`)
        )) return message.delete().catch() && message.channel.send({ embeds: [notHavingPerms_Embed] });
            

        const noID_Embed = new Discord.EmbedBuilder();
        noID_Embed.setTitle(`${cmndError}`);
        noID_Embed.setColor(`${config.err_hex}`);
        noID_Embed.setDescription(`You just forgot to provide me the id of the user to involve, in the mv-users list.`);

        // Possible_Error_4
        if(!targetId) return message.delete().catch() && message.channel.send({ embeds: [noID_Embed] });


        const invalidId_Embed = new Discord.EmbedBuilder();
        invalidId_Embed.setTitle(`${cmndError}`);
        invalidId_Embed.setColor(`${config.err_hex}`);
        invalidId_Embed.setDescription(`The id you provided me is invalid. Please provide me a valid id of the user, you wanna add in manually verified list.`);

        // Possible_Error_5
        if(fetchedMember === `None`) return message.delete().catch() && message.channel.send({ embeds: [invalidId_Embed] });


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
        Execution                                                                   
        ----------------------------------------------------------------------------------------------------
        */
        message.delete().catch();
        
        const membsAubdycadianRole = fetchedMember.roles.cache.get(`${aubdycad.Aubdycadian_R_ID}`);
        const theWelcomeCard = await FUNC_createWC(client, message, fetchedMember.user);
        const randWelcomeLine = FUNC_welcomeLines();


        if(membsAubdycadianRole === undefined) {
            fetchedMember.roles.add(Aubdycadian_Role);
            otherInfoArr.push(infoDetail[3]);
        } else {
            otherInfoArr.push(infoDetail[2]);
        }


        if(givenTime === `` || givenTime === ` `) {
            otherInfoArr.push(infoDetail[1]);
            displayTime = `${msgCreatedTime}`;
        } else {
            if(!isNaN(givenTime)) {
                const date = new Date(parseInt(givenTime));
                const dateString = date.toDateString().split(" ");
                const timeString = date.toLocaleTimeString();
                const wholeTime = `${dateString[0]}, ${dateString.slice(1).join(" ")} at ${timeString}`;
                
                otherInfoArr.push(infoDetail[0]);
                displayTime = `${wholeTime}`;
            } else {
                otherInfoArr.push(infoDetail[0]);
                displayTime = `\`${givenTime}\``;
            }
        }

        accountType = fetchedMember.user.bot === true ? `Bot` : `User`;
        otherInfo = `${otherInfoArr.join("\n")}`;


        // Embeds ================================================== >>>>>
        const done_Embed = new Discord.EmbedBuilder();
        done_Embed.setTitle(`${cmndEmoji[1]}${config.tls}Done`);
        done_Embed.setDescription(`Record added!!`);
        done_Embed.setColor(`${cmndColour[1]}`);


        const MV_Embed = new Discord.EmbedBuilder();
        MV_Embed.setTitle(`${cmndEmoji[0]}${config.tls}${cmndName}`);
        MV_Embed.setColor(`${cmndColour[0]}`);
        MV_Embed.setDescription(`${cmndMarker}**User :** ${fetchedMember}, ${fetchedMember.user.tag}\n${cmndMarker}**User id :** ${fetchedMember.user.id}\n${cmndMarker}**Account type :** ${accountType}\n${cmndMarker}**Action by :** ${message.author}, ${message.author.tag}\n${cmndMarker}**From :** ${message.channel} channel\n${cmndMarker}**Time :** ${displayTime}\n${createLine(50)}\n${cmndMarker}**Other info :**\`\`\`\n${otherInfo}\n\`\`\``);
        MV_Embed.setThumbnail(fetchedMember.user.avatarURL({ dynamic: true }));
        MV_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
        MV_Embed.setTimestamp(message.createdTimestamp);



        // Main Execution ================================================== >>>>>
        MvUsers_Chnl.send({ embeds: [MV_Embed] }).then(() => {
            message.channel.send({ embeds: [done_Embed] }).then((doneMsg) => {
                setTimeout(() => {
                    doneMsg.delete();
                }, 1000 * 5);
            });
        });

        return JoinedAndLeft_Chnl.send({ content: `Welcome, ${fetchedMember}!! ${randWelcomeLine}`, files: [theWelcomeCard] });
    }
});