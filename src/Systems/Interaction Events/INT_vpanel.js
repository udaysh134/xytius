const Discord = require("discord.js");
const config = require("../../Data/config.json");
const aubdycad = require("../../Data/aubdycad.json");
const emojis = require("../../Data/emojis.json");
const pictures = require("../../Data/pictures.json");

const Canvas = require("canvas");
const moment = require("moment");

const FUNC_loadCanvas = require("../External Functions/FUNC_loadCanvas.js");
const FUNC_createWC = require("../External Functions/FUNC_createWC.js");
const FUNC_welcomeLines = require("../External Functions/FUNC_welcomeLines.js");

    
module.exports = async (client, interaction) => {
    /*
    ----------------------------------------------------------------------------------------------------
    Error Handling
    ----------------------------------------------------------------------------------------------------
    */
    // Possible_Error_1
    if(!interaction.isSelectMenu()) return;


    // Possible_Error_2
    if(!["vpanel_captcha", "vpanel_maths"].includes(interaction.values[0])) return;


    /*
    ----------------------------------------------------------------------------------------------------
    Start
    ----------------------------------------------------------------------------------------------------
    */
    const marker = config.marker;
    const userChannelName = interaction.user.username.toLowerCase().split(" ").join("-");

    const created_CaptchaChnl = interaction.guild.channels.cache.find((chnl) => chnl.name === `${userChannelName}-captcha`);
    const created_MathsChnl = interaction.guild.channels.cache.find((chnl) => chnl.name === `${userChannelName}-maths`);

    const parent_Category_ID = aubdycad.Verifications_CAT_ID;
    const everyone_Role_ID = interaction.guild.id;

    const canvas = Canvas.createCanvas(500, 100);
    const ctx = canvas.getContext("2d");

    const bgImage_Captcha = pictures.verification.captchaBG;
    const captchaColour = `#78b15a`;
    const bgImage_Maths = pictures.verification.mathsBG;
    const mathsColour = `#3c88c2`;

    const timeLimit = 1000 * 60 * 3;
    const noteHeading = `Note ${createLine(40)}`;
    const noteDescription = `\`\`\`You need to complete this verification within 3 minutes or you'll have to manually verify yourself by the staff to get into the server, which can take time.\`\`\``;

    const Aubdycadian_Role = interaction.guild.roles.cache.get(`${aubdycad.Aubdycadian_R_ID}`);

    const VerificationLogs_Chnl = interaction.guild.channels.cache.get(`${aubdycad.VerificationLogs_C_ID}`);
    const JoinedAndLeft_Chnl = interaction.guild.channels.cache.get(`${aubdycad.JoinedAndLeft_C_ID}`);
    const VerificationHelp_Chnl = interaction.guild.channels.cache.get(`${aubdycad.VerificationHelp_C_ID}`);

    const randWelcomeLine = FUNC_welcomeLines();


    /*
    ----------------------------------------------------------------------------------------------------
    Embeds
    ----------------------------------------------------------------------------------------------------
    */
    const Captcha_Embed = new Discord.EmbedBuilder();
    Captcha_Embed.setTitle(`🧩${config.tls}Captcha Verification`);
    Captcha_Embed.setDescription(`Type the code you see below in the image, in **REVERSE** and send it here, for verification. The input should be case-sensitive.`);
    Captcha_Embed.addFields({
        name: `${noteHeading}`,
        value: `${noteDescription}`,
        inline: false
    });
    Captcha_Embed.setColor(`${captchaColour}`);
    Captcha_Embed.setImage(`attachment://Captcha_code.png`);
    Captcha_Embed.setFooter({ text: `${client.user.username} : Your time starts now!! 🕐`, iconURL: client.user.avatarURL({ dynamic: true }) });


    const Maths_Embed = new Discord.EmbedBuilder();
    Maths_Embed.setTitle(`🔢${config.tls}Maths Verification`);
    Maths_Embed.setDescription(`Answer this basic Maths question, you see below in the image and send the result here, for verification.`);
    Maths_Embed.addFields({
        name: `${noteHeading}`,
        value: `${noteDescription}`,
        inline: false
    });
    Maths_Embed.setColor(`${mathsColour}`);
    Maths_Embed.setImage(`attachment://Maths_question.png`);
    Maths_Embed.setFooter({ text: `${client.user.username} : Your time starts now!! 🕐`, iconURL: client.user.avatarURL({ dynamic: true }) });

    
    const rightAnswer_Embed = new Discord.EmbedBuilder();
    rightAnswer_Embed.setTitle(`🔓${config.tls}Verification Completed!!`);
    rightAnswer_Embed.setDescription(`Yep, you got it right. Hold on!!\nAssigning you the membership of this server... ${emojis.ANIMATED_LOADING}`);
    rightAnswer_Embed.setColor(`feac32`);

    const wrongAnswer_Embed = new Discord.EmbedBuilder();
    wrongAnswer_Embed.setTitle(`${config.err_emoji}${config.tls}Verification Error!!`);
    wrongAnswer_Embed.setColor(`${config.err_hex}`);
    wrongAnswer_Embed.setDescription(`The result you gave as your answer, was wrong!! Try re-reading the above message or take your time to answer.`);

    const done_Embed = new Discord.EmbedBuilder();
    done_Embed.setTitle(`✅${config.tls}Done!!`);
    done_Embed.setDescription(`Welcome to the club! You're now an **Aubdycadian**!\nYou can now leave this channel.\n\nThanks for your time and patience!! 🙏\nHave a very good day!! 😊`);
    done_Embed.setColor(`77b255`);


    const timeUp_Embed = new Discord.EmbedBuilder();
    timeUp_Embed.setTitle(`⏱️${config.tls}Time's Up!!`);
    timeUp_Embed.setDescription(`You took 3 minutes and failed in a basic Human Verification. Sorry, you can't be given the membership of this server, for now.\n\nYou need to request for a "**MANUAL VERIFICATION**" in ${VerificationHelp_Chnl} channel, if you wanna get into the server. You'll be then verified by the Staff. Staff members could be offline and can take time, so you may have to wait untill someone catches you up. There's no any other way to get into the server without a Verification (either automatic or manual).`);
    timeUp_Embed.addFields({
        name: `NOTE :`,
        value: `\`\`\`You'll be automatically kicked out of the server, if there's no request for a "Manual Verification", even after 48 hours of joining this server.\`\`\``,
        inline: false
    });
    timeUp_Embed.setColor(`ffffff`);
    timeUp_Embed.setFooter({ text: client.user.username, iconURL: client.user.avatarURL({ dynamic: true }) });
    
    
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


    function checkFirstError() {
        if(created_CaptchaChnl || created_MathsChnl) {
            const alreadyExists_Embed = new Discord.EmbedBuilder();
            alreadyExists_Embed.setTitle(`${config.err_emoji}${config.tls}Error!!`);
            alreadyExists_Embed.setColor(`${config.err_hex}`);
            alreadyExists_Embed.setDescription(`You already have a dedicated channel for you, for verification. You cannot create another one, for different verification. Please go and verify yourself there only.`);
            
            return interaction.reply({ embeds: [alreadyExists_Embed], ephemeral: true });
        } else {
            return `Proceed`;
        }
    }


    function getNewChnlData(mode) {
        const perm = Discord.PermissionsBitField.Flags;

        return {
            name: `${userChannelName}-${mode}`,
            topic: `Verification channel for ${interaction.user.tag}, Mode : ${standardiseCase(mode)}`,
            type: Discord.ChannelType.GuildText,
            nsfw: false,
            parent: `${parent_Category_ID}`,
            permissionOverwrites: [{
                    id: `${everyone_Role_ID}`,
                    deny: [perm.ViewChannel]
                }, {
                    id: `${interaction.user.id}`,
                    allow: [perm.ViewChannel, perm.SendMessages]
                }, {
                    id: `${client.user.id}`,
                    allow: [perm.ViewChannel, perm.ManageChannels, perm.SendMessages, perm.AttachFiles, perm.AddReactions, perm.UseExternalEmojis, perm.UseExternalStickers, perm.ManageMessages, perm.UseApplicationCommands]
                }
            ],
        }
    }


    function informAboutChannel(theChnl) {
        const inform_Embed = new Discord.EmbedBuilder();
        inform_Embed.setTitle(`👍${config.tls}Here you go!!`);
        inform_Embed.setDescription(`Created a dedicated channel for you!!\nFollow this channel - ${theChnl}, to proceed for the Verification.`);
        inform_Embed.setColor(`ffdc5e`);

        interaction.reply({ embeds: [inform_Embed], ephemeral: true });
    }


    function randomString(chars, length) {
        let result = "";
        let characters = `${chars}`;
        let charactersLength = characters.length;
        
        for (let i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }

        return result;
    }


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
    
        let daysText = (days === 1 || days === 0 || days === -1) ? `d` : `d`;
        let hoursText = (hours === 1 || hours === 0 || hours === -1) ? `h` : `h`;
        let minutesText = (minutes === 1 || minutes === 0 || minutes === -1) ? `m` : `m`;
        let secondsText = (seconds === 1 || seconds === 0 || seconds === -1) ? `s` : `s`;
        
        return `${minutes}${minutesText} ${seconds}${secondsText}`;
    }


    async function verifyTheUser(createdChnl, expctdRes, mode, modeQues, vcMessage) {
        const m_ = marker;
        const logMethod = mode === `captcha` ? `${m_}**Method :** ${standardiseCase(mode)}\n${m_}**Code :** ${modeQues}` : `${m_}**Method :** ${standardiseCase(mode)}\n${m_}**Question :** ${modeQues}`;
        const checkInteraction = [];
        const theWelcomeCard = await FUNC_createWC(client, interaction, interaction.user);
        const modeQuesOfVerification = mode === `captcha` ? `"${modeQues}" given Captcha Code` : `"${modeQues}" given Maths Question`;
        const reasonForAddingRole = `Cleared Verification process by "${standardiseCase(mode)}" mode, using this - ${modeQuesOfVerification}.`;


        // Collector_Starts ================================================== >>>>>
        const VC_Filter = (m) => { if(m.author.id === interaction.user.id) return true; };
        const VC_Collector = createdChnl.createMessageCollector({ filter: VC_Filter, time: timeLimit });


        VC_Collector.on("collect", (collectedMessage) => {
            const msgContent = collectedMessage.content;
            const messagingTime = collectedMessage.createdTimestamp;
            const timeTaken = msToTime(messagingTime - vcMessage.createdTimestamp);


            // Failed_Attempt
            if(msgContent !== `${expctdRes}`) return createdChnl.send({ embeds: [wrongAnswer_Embed] }).then((errorMsg) => {
                setTimeout(() => { errorMsg.delete() }, 1000 * 5);
            });
            
            // Successful_Attempt
            checkInteraction.push(`Done!`);
            rightAnswer_Embed.setFooter({ text: `${client.user.username} : You took - ${timeTaken}`, iconURL: client.user.avatarURL({ dynamic: true }) });

            createdChnl.send({ embeds: [rightAnswer_Embed] }).then((rightanswerMsg) => {
                setTimeout(() => {
                    interaction.member.roles.add(Aubdycadian_Role, reasonForAddingRole);

                    rightanswerMsg.edit({ embeds: [done_Embed] }).then((doneMsg) => {
                        setTimeout(() => {
                            const logVerification_Embed = new Discord.EmbedBuilder();
                            logVerification_Embed.setTitle(`🔓${config.tls}Verification Completed!!`);
                            logVerification_Embed.setDescription(`${m_}**User :** ${interaction.user}, ${interaction.user.tag}\n${m_}**User id :** ${interaction.user.id}\n${logMethod}\n${m_}**Time :** ${moment(doneMsg.createdTimestamp).format('ddd, DD MMM YYYY, h:mm:ss a')}\n${m_}**Time taken :** ${timeTaken}`);
                            logVerification_Embed.setColor(Discord.Colors.Green);
                            logVerification_Embed.setThumbnail(interaction.user.avatarURL({ dynamic: true }));

                            // Last_Execution ================================================== >>>>>
                            VerificationLogs_Chnl.send({ embeds: [logVerification_Embed] });
                            JoinedAndLeft_Chnl.send({ content: `Welcome ${interaction.user}!! ${randWelcomeLine}`, files: [theWelcomeCard] });

                            return createdChnl.delete();
                        }, 1000 * 8);
                    });
                }, 1000 * 10);
            });
        });


        VC_Collector.on("end", (collected) => {
            if(checkInteraction.length === 0) {
                let count = 0;
                const attempts = [];

                collected.forEach((val) => {
                    attempts.push(`(${++count}). ${val}`);
                });

                const attemptsDesc = attempts.length !== 0 ? `\`\`\`\n${attempts.join("\n")}\n\`\`\`` : `${config.invChar}`;

                createdChnl.send({ embeds: [timeUp_Embed] }).then((timeupMsg) => {
                    const logVerification_Embed = new Discord.EmbedBuilder();
                    logVerification_Embed.setTitle(`🔒${config.tls}Verification Failed!!`);
                    logVerification_Embed.setDescription(`${m_}**User :** ${interaction.user}, ${interaction.user.tag}\n${m_}**User id :** ${interaction.user.id}\n${logMethod}\n${m_}**Time :** ${moment(timeupMsg.createdTimestamp).format('ddd, DD MMM YYYY, h:mm:ss a')}\n${m_}**Attempts :** ${attempts.length}${attemptsDesc}`);
                    logVerification_Embed.setColor(Discord.Colors.Red);
                    logVerification_Embed.setThumbnail(interaction.user.avatarURL({ dynamic: true }));

                    // Last_Execution ================================================== >>>>>
                    return VerificationLogs_Chnl.send({ embeds: [logVerification_Embed] });
                });
            } else {
                return;
            }
        });
    }


    /*
    ----------------------------------------------------------------------------------------------------
    Execution
    ----------------------------------------------------------------------------------------------------
    */
    // CAPTCHA_Button ================================================== >>>>>
    if(interaction.values[0] === `vpanel_captcha`) {
        // Possible_Error_3
        const firstError = checkFirstError();
        if(firstError !== `Proceed`) return;


        // Post_Selection_Process ================================================== >>>>>
        const newChnlProps = getNewChnlData(`captcha`);

        interaction.guild.channels.create(newChnlProps).then(async (createdChannel) => {
            await informAboutChannel(createdChannel);

            const theCode = randomString(`ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz123456789`, 6);
            const expectedResult = theCode.split("").reverse().join("");


            // Image_Creation ================================================== >>>>>
            await FUNC_loadCanvas(ctx, bgImage_Captcha, 0, 0, 0, canvas.width, canvas.height, false);

            ctx.save();

            ctx.font = `75px Arial`;
            ctx.fillStyle = `${captchaColour}`;
            ctx.textAlign = "center";
            ctx.fillText(`${theCode}`, canvas.width/2, 75);

            const captchaImage = new Discord.AttachmentBuilder(canvas.toBuffer(), { name: `Captcha_code.png` });



            // Main_Execution ================================================== >>>>>
            createdChannel.send({ embeds: [Captcha_Embed], files: [captchaImage] }).then(async (vcMsg) => {
                return await verifyTheUser(createdChannel, expectedResult, `captcha`, theCode, vcMsg);
            });
        });
    }



    // MATHS_Button ================================================== >>>>>
    if(interaction.values[0] === `vpanel_maths`) {
        // Possible_Error_3
        const firstError = checkFirstError();
        if(firstError !== `Proceed`) return;


        // Post_Selection_Process ================================================== >>>>>
        const newChnlProps = getNewChnlData(`maths`);

        interaction.guild.channels.create(newChnlProps).then(async (createdChannel) => {
            await informAboutChannel(createdChannel);

            const firstNum = randomString(`0123456789`, 2);
            const secondNum = randomString(`0123456789`, 1);

            const opratn_Add = parseInt(firstNum) + parseInt(secondNum);
            const opratn_Multiply = parseInt(firstNum) * parseInt(secondNum);

            const opratns = [opratn_Add, opratn_Multiply];
            const random_Opratn = opratns[Math.floor(Math.random() * opratns.length)];

            const quesResult = random_Opratn;
            const quesDisplay = random_Opratn === opratn_Add ? `${firstNum} + ${secondNum}` : `${firstNum} x ${secondNum}`;


            // Image_Creation ================================================== >>>>>
            await FUNC_loadCanvas(ctx, bgImage_Maths, 0, 0, 0, canvas.width, canvas.height, false);

            ctx.save();

            ctx.font = `75px Arial`;
            ctx.fillStyle = `${mathsColour}`;
            ctx.textAlign = "center";
            ctx.fillText(`${quesDisplay}`, canvas.width/2, 75);

            const mathsImage = new Discord.AttachmentBuilder(canvas.toBuffer(), { name: `Maths_question.png` });



            // Main_Execution ================================================== >>>>>
            createdChannel.send({ embeds: [Maths_Embed], files: [mathsImage] }).then(async (vcMsg) => {
                return await verifyTheUser(createdChannel, quesResult, `maths`, quesDisplay, vcMsg);
            });
        });
    }
};