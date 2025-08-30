const Command = require("../../Structures/Command.js");
const Discord = require("discord.js");
const config = require("../../Data/config.json");
const aubdycad = require("../../Data/aubdycad.json");
const emojis = require("../../Data/emojis.json");
const pictures = require("../../Data/pictures.json");
const keys = require("../../Data/keys.json");


module.exports = new Command({
    name: "poll",
    description: "An advanced voting/polling command for creating polls of upto 20 choices, at a time.",
    aliases: [],
    permission: "Administrator",
    allowedChannels: [],
    allowedServers: [`${config.TestServer_ID}`, `${config.Aubdycad_ID}`, `${config.XytiusServer_ID}`],
    cooldown: "",
    usage: `${config.prefix}poll <topic> | <choice_1> | <choice_2> | [choice_3] ..... [choice_20]`,
    usageDesc: `The command gives you option to create an opinion poll of multiple choices. Atleast two choices are mandatory for a poll to be valid. At max 20 choices can be made for wide variety of opinions on a topic. Polls can also be checked once, before finally posting it publicaly or can also be canceled if mind changes anywhere.`,
    usageExample: [`${config.prefix}poll What is a pancake made of? | Cucumber, Plastic, Mud | Egg, Milk, Flour`, `${config.prefix}poll Which mobile game do you like most? | Minecraft | PUBG | Fortnite | Call of Duty | Genshin Impact | Clash of Clans | Pokemon GO | Candy Crush Saga | 8 Ball Pool | Angry Birds | Tetris | None (other than Minecraft)`],
    forTesting: false,
    HUCat: [`admin`],

    async run(message, args, client) {
        const cmndName = `Poll`;
        const cmndEmoji = [`🗳`, `✅`, `💢`, `${emojis.ANIMATED_LOADING}`];
        const cmndColour = [`5dadec`, `77b255`, `be1931`];
        const cmndError = `${config.err_emoji}${config.tls}Poll : Command Error!!`;
        const cmndMarker = `🔸 `;

        /*
        ----------------------------------------------------------------------------------------------------
        Start                                                                   
        ----------------------------------------------------------------------------------------------------
        */
        const msgCont = message.content;
        const breaker = "|";
        const splittedContent = args.join(" ").split(`${breaker}`);
        const pollTopic = splittedContent[0].slice(5);
        const option_2 = splittedContent[2];
        const option_21 = splittedContent[21];

        const conf = `${cmndEmoji[0]}${config.tls}${cmndName} Confirmation`;
        const conf_done = `${cmndEmoji[1]}${config.tls}${cmndName} Confirmation Done`;
        const conf_cancelled = `${cmndEmoji[2]}${config.tls}${cmndName} Confirmation Cancelled`;
        const conf_expired = `${cmndEmoji[2]}${config.tls}${cmndName} Confirmation Expired`;

        let allOptions = splittedContent.slice(1);
        let optionsArr = [];
        let alphabetsEmojis = [`🇦`, `🇧`, `🇨`, `🇩`, `🇪`, `🇫`, `🇬`, `🇭`, `🇮`, `🇯`, `🇰`, `🇱`, `🇲`, `🇳`, `🇴`, `🇵`, `🇶`, `🇷`, `🇸`, `🇹`];
        let emojiCount = 0;


        /*
        ----------------------------------------------------------------------------------------------------
        Error Handling                                                                   
        ----------------------------------------------------------------------------------------------------
        */
        const noSpace_Embed = new Discord.EmbedBuilder();
        noSpace_Embed.setTitle(`${cmndError}`);
        noSpace_Embed.setColor(`${config.err_hex}`);
        noSpace_Embed.setDescription(`Sorry, but for this command (specifically), you cannot give a space after the prefix. Please use this command without any space after prefix ( \`${config.prefix}\` ).`);

        // Possible_Error_1
        if(msgCont.startsWith(`${config.prefix} `)) return message.delete().catch() && message.channel.send({ embeds: [noSpace_Embed] });


        const noOptions_Embed = new Discord.EmbedBuilder();
        noOptions_Embed.setTitle(`${cmndError}`);
        noOptions_Embed.setColor(`${config.err_hex}`);
        noOptions_Embed.setDescription(`You didn't provided me any options for the poll. Use "\`${config.prefix}usage\`" command for this command to get more details on it.`);

        // Possible_Error_2
        if(!msgCont.includes(`${breaker}`)) return message.delete().catch() && message.channel.send({ embeds: [noOptions_Embed] });


        const noPollTopic_Embed = new Discord.EmbedBuilder();
        noPollTopic_Embed.setTitle(`${cmndError}`);
        noPollTopic_Embed.setColor(`${config.err_hex}`);
        noPollTopic_Embed.setDescription(`The way you used the command is wrong. You didn't provided me the topic for your poll. Use "\`${config.prefix}usage\`" command for this command to get more details on it.`);

        // Possible_Error_3
        if(pollTopic === ` ` || pollTopic === ``) return message.delete().catch() && message.channel.send({ embeds: [noPollTopic_Embed] });


        const noMinOptions_Embed = new Discord.EmbedBuilder();
        noMinOptions_Embed.setTitle(`${cmndError}`);
        noMinOptions_Embed.setColor(`${config.err_hex}`);
        noMinOptions_Embed.setDescription(`You must provide me atleast 2 options for your poll, as options limit is at least 2 and at max 20 (which I guess, is huge). There's no reason to create a poll, if only 1 option is provided.`);

        // Possible_Error_4
        if(!option_2) return message.delete().catch() && message.channel.send({ embeds: [noMinOptions_Embed] });


        const not21stOption_Embed = new Discord.EmbedBuilder();
        not21stOption_Embed.setTitle(`${cmndError}`);
        not21stOption_Embed.setColor(`${config.err_hex}`);
        not21stOption_Embed.setDescription(`Are you testing me? Because I don't think, you need that much options for a poll. Anyways, maximum options I can provide is 20 (which, in itself is mind-blowing). Hence, I cannot accept 21st option.`);

        // Possible_Error_5
        if(option_21) return message.delete().catch() && message.channel.send({ embeds: [not21stOption_Embed] });


        /*
        ----------------------------------------------------------------------------------------------------
        Functions                                                                   
        ----------------------------------------------------------------------------------------------------
        */
        async function pollEmbedReady(embed) {
            allOptions.forEach((element) => {
                let serialNo = alphabetsEmojis[emojiCount++];
                optionsArr.push(`${serialNo} : ${element}`);
            });

            const pollOptions = `${optionsArr.join("\n")}`;
            
            embed.setTitle(`${cmndEmoji[0]}${config.tls}${cmndName}`);
            embed.addFields({
                name: `${cmndMarker}Topic : `,
                value: `${pollTopic}`,
                inline: false
            }, {
                name: `${cmndMarker}Options :`,
                value: `${pollOptions}`,
                inline: false
            });
            embed.setColor(`${cmndColour[0]}`);
        }


        async function finalSend(channel, embed) {
            async function reactionsOnThePoll(theMsg) {
                allOptions.forEach((element) => {
                    let reaction = alphabetsEmojis[allOptions.indexOf(element)];
                    theMsg.react(`${reaction}`);
                });
            }

            if(message.guild.id === `${config.Aubdycad_ID}`) {
                channel.send({ embeds: [embed] }).then(async (aubdycad_PollMsg) => {
                    await reactionsOnThePoll(aubdycad_PollMsg);
                });
            } else {
                channel.send({ embeds: [embed] }).then(async (others_PollMsg) => {
                    await reactionsOnThePoll(others_PollMsg);
                });
            }
        }


        /*
        ----------------------------------------------------------------------------------------------------
        Execution                                                                   
        ----------------------------------------------------------------------------------------------------
        */
        if(message.guild.id === `${config.Aubdycad_ID}`) {
            const Polls_Chnl = message.guild.channels.cache.get(`${aubdycad.Polls_C_ID}`);


            const noChannel_Embed = new Discord.EmbedBuilder();
            noChannel_Embed.setTitle(`${cmndError}`);
            noChannel_Embed.setColor(`${config.err_hex}`);
            noChannel_Embed.setDescription(`I cannot find the specified channel to send the poll in. Please check the issue and try again.`);
            
            // Possible_Error_6
            if(Polls_Chnl === undefined || Polls_Chnl === null) return message.delete().catch() && message.channel.send({ embeds: [noChannel_Embed] });
            
            
            const botChnlPerms = Polls_Chnl.permissionsFor(client.user, true).toArray();
            const neededBotChnlPerms = [`ViewChannel`, `SendMessages`, `UseExternalEmojis`, `AddReactions`];


            const notHavingPerms_Embed = new Discord.EmbedBuilder();
            notHavingPerms_Embed.setTitle(`${cmndError}`);
            notHavingPerms_Embed.setColor(`${config.err_hex}`);
            notHavingPerms_Embed.setDescription(`I cannot proceed further as I'm lacking necessary permissions. I need **${neededBotChnlPerms.join(", ")}** permissions for ${Polls_Chnl} channel to proceed to the next step.`);

            // Possible_Error_7
            if(!(
                botChnlPerms.includes(`${neededBotChnlPerms[0]}`)
                && botChnlPerms.includes(`${neededBotChnlPerms[1]}`)
                && botChnlPerms.includes(`${neededBotChnlPerms[2]}`)
                && botChnlPerms.includes(`${neededBotChnlPerms[3]}`)
            )) return message.delete().catch() && message.channel.send({ embeds: [notHavingPerms_Embed] });



            // Embeds ================================================== >>>>>
            const confirmation_Embed = new Discord.EmbedBuilder();
            confirmation_Embed.setTitle(`${conf}`);
            confirmation_Embed.setColor(`${cmndColour[0]}`);
            confirmation_Embed.setDescription(`Check your created poll and assure to proceed further, to send it to ${Polls_Chnl} channel. This confirmation will automatically expire after 2 minutes of no response.`);
            confirmation_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
            confirmation_Embed.setTimestamp(message.createdTimestamp);

            const confirmationSent_Embed = new Discord.EmbedBuilder();
            confirmationSent_Embed.setTitle(`${conf_done}`);
            confirmationSent_Embed.setColor(`${cmndColour[1]}`);
            confirmationSent_Embed.setDescription(`This poll has been sent to ${Polls_Chnl} channel. Was approved by ${message.author} (${message.author.tag}).`);
            confirmationSent_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
            confirmationSent_Embed.setTimestamp(message.createdTimestamp);

            const confirmationCancelled_Embed = new Discord.EmbedBuilder();
            confirmationCancelled_Embed.setTitle(`${conf_cancelled}`);
            confirmationCancelled_Embed.setColor(`${cmndColour[2]}`);
            confirmationCancelled_Embed.setDescription(`This poll's confirmation has been cancelled by ${message.author} (${message.author.tag}).`);
            confirmationCancelled_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
            confirmationCancelled_Embed.setTimestamp(message.createdTimestamp);

            const confirmationExpired_Embed = new Discord.EmbedBuilder();
            confirmationExpired_Embed.setTitle(`${conf_expired}`);
            confirmationExpired_Embed.setColor(`${cmndColour[2]}`);
            confirmationExpired_Embed.setDescription(`This poll's confirmation message has expired after 2 minutes of no response from ${message.author} (${message.author.tag}).`);
            confirmationExpired_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
            confirmationExpired_Embed.setTimestamp(message.createdTimestamp);

            const confirmation_Buttons = new Discord.ActionRowBuilder().addComponents(
                new Discord.ButtonBuilder()
                .setCustomId(`pollConfirm_check`)
                .setLabel(`Check`)
                .setStyle(Discord.ButtonStyle.Primary),

                new Discord.ButtonBuilder()
                .setCustomId(`pollConfirm_send`)
                .setLabel(`Send`)
                .setStyle(Discord.ButtonStyle.Success),

                new Discord.ButtonBuilder()
                .setCustomId(`pollConfirm_cancel`)
                .setLabel(`Cancel`)
                .setStyle(Discord.ButtonStyle.Danger),
            );

            const executing_Embed = new Discord.EmbedBuilder();
            executing_Embed.setTitle(`${cmndEmoji[3]} Sending the poll...`);
            executing_Embed.setColor(`ffffff`);



            // Main Execution ================================================== >>>>>
            const finalPoll_Embed = new Discord.EmbedBuilder();
            await pollEmbedReady(finalPoll_Embed);

            message.delete().catch();
            message.channel.send({ embeds: [confirmation_Embed], components: [confirmation_Buttons] }).then((confirmationMsg) => {
                const confirmation_Collector = message.channel.createMessageComponentCollector({ time: 1000 * 120 });
                const checkInteraction = [];


                confirmation_Collector.on('collect', async (interaction) => {
                    const notYouCanDo_Embed = new Discord.EmbedBuilder();
                    notYouCanDo_Embed.setTitle(`${cmndError}`);
                    notYouCanDo_Embed.setColor(`${config.err_hex}`);
                    notYouCanDo_Embed.setDescription(`Oh oh!! Sorry ${interaction.user.tag}, but you cannot do that. Currently, you lack permissions for it and only ${message.author} (${message.author.tag}) can use these buttons.`);

                    // Possible_Error_8
                    if(interaction.user.id !== message.author.id) return interaction.reply({ embeds: [notYouCanDo_Embed], ephemeral: true });
                    if(interaction.message.id === confirmationMsg) return true;
    

                    if(interaction.customId === `pollConfirm_check`) {
                        return interaction.reply({ embeds: [finalPoll_Embed], ephemeral: true });
                    }
    
                    if(interaction.customId === `pollConfirm_send`) {
                        checkInteraction.push(`Send Button clicked`);
    
                        interaction.deferUpdate();
                        interaction.message.channel.send({ embeds: [executing_Embed] }).then(async (executingMsg) => {
                            await finalSend(Polls_Chnl, finalPoll_Embed).then(() => {
                                confirmation_Buttons.components[0].setDisabled(true);
                                confirmation_Buttons.components[1].setDisabled(true);
                                confirmation_Buttons.components[2].setDisabled(true);
        
                                executingMsg.delete();
                                confirmationMsg.edit({ embeds: [confirmationSent_Embed], components: [confirmation_Buttons] });
                                return confirmation_Collector.stop();
                            });
                        });
                    }
    
                    if(interaction.customId === `pollConfirm_cancel`) {
                        interaction.deferUpdate();
                        checkInteraction.push(`Cancel Button clicked`);
    
                        confirmation_Buttons.components[0].setDisabled(true);
                        confirmation_Buttons.components[1].setDisabled(true);
                        confirmation_Buttons.components[2].setDisabled(true);
    
                        confirmationMsg.edit({ embeds: [confirmationCancelled_Embed], components: [confirmation_Buttons] });
                        return confirmation_Collector.stop();
                    }
                });


                confirmation_Collector.on('end', () => {
                    confirmation_Buttons.components[0].setDisabled(true);
                    confirmation_Buttons.components[1].setDisabled(true);
                    confirmation_Buttons.components[2].setDisabled(true);
    
                    if(checkInteraction.length !== 0) return;
                    return confirmationMsg.edit({ embeds: [confirmationExpired_Embed], components: [confirmation_Buttons] });
                });
            });
        } else {
            // Embeds ================================================== >>>>>
            const confirmation_Embed = new Discord.EmbedBuilder();
            confirmation_Embed.setTitle(`${conf}`);
            confirmation_Embed.setColor(`${cmndColour[0]}`);
            confirmation_Embed.setDescription(`Check your created poll and assure to proceed further, to send it to ${message.channel} channel. This confirmation will automatically expire after 2 minutes of no response.`);
            confirmation_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
            confirmation_Embed.setTimestamp(message.createdTimestamp);

            const confirmationSent_Embed = new Discord.EmbedBuilder();
            confirmationSent_Embed.setTitle(`${conf_done}`);
            confirmationSent_Embed.setColor(`${cmndColour[1]}`);
            confirmationSent_Embed.setDescription(`This poll has been sent to ${message.channel} channel. Was approved by ${message.author} (${message.author.tag}).`);
            confirmationSent_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
            confirmationSent_Embed.setTimestamp(message.createdTimestamp);

            const confirmationCancelled_Embed = new Discord.EmbedBuilder();
            confirmationCancelled_Embed.setTitle(`${conf_cancelled}`);
            confirmationCancelled_Embed.setColor(`${cmndColour[2]}`);
            confirmationCancelled_Embed.setDescription(`This poll's confirmation has been cancelled by ${message.author} (${message.author.tag}).`);
            confirmationCancelled_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
            confirmationCancelled_Embed.setTimestamp(message.createdTimestamp);

            const confirmationExpired_Embed = new Discord.EmbedBuilder();
            confirmationExpired_Embed.setTitle(`${conf_expired}`);
            confirmationExpired_Embed.setColor(`${cmndColour[2]}`);
            confirmationExpired_Embed.setDescription(`This poll's confirmation message has expired after 2 minutes of no response from ${message.author} (${message.author.tag}).`);
            confirmationExpired_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
            confirmationExpired_Embed.setTimestamp(message.createdTimestamp);

            const confirmation_Buttons = new Discord.ActionRowBuilder().addComponents(
                new Discord.ButtonBuilder()
                .setCustomId(`pollConfirm_check`)
                .setLabel(`Check`)
                .setStyle(Discord.ButtonStyle.Primary),

                new Discord.ButtonBuilder()
                .setCustomId(`pollConfirm_send`)
                .setLabel(`Send`)
                .setStyle(Discord.ButtonStyle.Success),

                new Discord.ButtonBuilder()
                .setCustomId(`pollConfirm_cancel`)
                .setLabel(`Cancel`)
                .setStyle(Discord.ButtonStyle.Danger),
            );

            const executing_Embed = new Discord.EmbedBuilder();
            executing_Embed.setTitle(`${cmndEmoji[3]} Sending the poll...`);
            executing_Embed.setColor(`ffffff`);



            // Main Execution ================================================== >>>>>
            const finalPoll_Embed = new Discord.EmbedBuilder();
            await pollEmbedReady(finalPoll_Embed);

            message.delete().catch();
            message.channel.send({ embeds: [confirmation_Embed], components: [confirmation_Buttons] }).then((confirmationMsg) => {
                const confirmation_Collector = message.channel.createMessageComponentCollector({ time: 1000 * 120 });
                const checkInteraction = [];


                confirmation_Collector.on('collect', async (interaction) => {
                    const notYouCanDo_Embed = new Discord.EmbedBuilder();
                    notYouCanDo_Embed.setTitle(`${cmndError}`);
                    notYouCanDo_Embed.setColor(`${config.err_hex}`);
                    notYouCanDo_Embed.setDescription(`Oh oh!! Sorry ${interaction.user.tag}, but you cannot do that. Currently, you lack permissions for it and only ${message.author} (${message.author.tag}) can use these buttons.`);

                    // Possible_Error_8
                    if(interaction.user.id !== message.author.id) return interaction.reply({ embeds: [notYouCanDo_Embed], ephemeral: true });
    

                    if(interaction.customId === `pollConfirm_check`) {
                        return interaction.reply({ embeds: [finalPoll_Embed], ephemeral: true });
                    }
    
                    if(interaction.customId === `pollConfirm_send`) {
                        checkInteraction.push(`Send Button clicked`);
    
                        interaction.deferUpdate();
                        interaction.message.channel.send({ embeds: [executing_Embed] }).then(async (executingMsg) => {
                            await finalSend(message.channel, finalPoll_Embed).then(() => {
                                confirmation_Buttons.components[0].setDisabled(true);
                                confirmation_Buttons.components[1].setDisabled(true);
                                confirmation_Buttons.components[2].setDisabled(true);
        
                                executingMsg.delete();
                                confirmationMsg.edit({ embeds: [confirmationSent_Embed], components: [confirmation_Buttons] });
                                return confirmation_Collector.stop();
                            });
                        });
                    }
    
                    if(interaction.customId === `pollConfirm_cancel`) {
                        interaction.deferUpdate();
                        checkInteraction.push(`Cancel Button clicked`);
    
                        confirmation_Buttons.components[0].setDisabled(true);
                        confirmation_Buttons.components[1].setDisabled(true);
                        confirmation_Buttons.components[2].setDisabled(true);
    
                        confirmationMsg.edit({ embeds: [confirmationCancelled_Embed], components: [confirmation_Buttons] });
                        return confirmation_Collector.stop();
                    }
                });


                confirmation_Collector.on('end', () => {
                    confirmation_Buttons.components[0].setDisabled(true);
                    confirmation_Buttons.components[1].setDisabled(true);
                    confirmation_Buttons.components[2].setDisabled(true);
    
                    if(checkInteraction.length !== 0) return;
                    return confirmationMsg.edit({ embeds: [confirmationExpired_Embed], components: [confirmation_Buttons] });
                });
            });
        }
    } 
});