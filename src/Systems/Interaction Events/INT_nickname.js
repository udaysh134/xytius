const Discord = require("discord.js");
const config = require("../../Data/config.json");
const aubdycad = require("../../Data/aubdycad.json");

const moment = require("moment");
const nick_N_DB = require("../../Schemas/nick_N_DB.js");


module.exports = async (client, interaction) => {
    /*
    ----------------------------------------------------------------------------------------------------
    Error Handling
    ----------------------------------------------------------------------------------------------------
    */
    // Possible_Error_1
    if(!interaction.isButton()) return;


    // Possible_Error_2
    if(!["nick_accept", "nick_reject", "nickDump_Yes"].includes(interaction.customId)) return;


    const Admin_Perm = interaction.member.permissions.has(Discord.PermissionsBitField.Flags.Administrator);
    
    const notAllowed_Embed = new Discord.EmbedBuilder();
    notAllowed_Embed.setTitle(`${config.err_emoji}${config.tls}Error!!`);
    notAllowed_Embed.setColor(`${config.err_hex}`);
    notAllowed_Embed.setDescription(`Sorry, you're not allowed to use these buttons. You don't have enough permissions to take any action here.`);
    
    // Possible_Error_3
    if(!Admin_Perm) return interaction.reply({ embeds: [notAllowed_Embed], ephemeral: true });


    /*
    ----------------------------------------------------------------------------------------------------
    Start
    ----------------------------------------------------------------------------------------------------
    */
    const marker = config.marker;
    const evntEmoji = `🏷`;

    const acceptSign = `🟢`;
    const acceptColour = `78b159`;

    const rejectSign = `🔴`;
    const rejectColour = `dd2e44`;

    const dumpSign = `🟤`;
    const dumpColour = `c1694f`;

    let dumpReason;


    /*
    ----------------------------------------------------------------------------------------------------
    Functions
    ----------------------------------------------------------------------------------------------------
    */
    async function dumpARequest(int) {
        const dump_Buttons = new Discord.ActionRowBuilder().addComponents(
            new Discord.ButtonBuilder()
            .setCustomId(`nick_accept`)
            .setLabel(`Accept`)
            .setStyle(Discord.ButtonStyle.Success)
            .setDisabled(true),
        
            new Discord.ButtonBuilder()
            .setCustomId(`nick_reject`)
            .setLabel(`Reject`)
            .setStyle(Discord.ButtonStyle.Danger)
            .setDisabled(true),

            new Discord.ButtonBuilder()
            .setCustomId(`nickDump_Yes`)
            .setStyle(Discord.ButtonStyle.Secondary)
            .setEmoji("🗑️")
        );

        int.deferUpdate();
        int.message.edit({ components: [dump_Buttons] });
    } 


    /*
    ----------------------------------------------------------------------------------------------------
    Execution
    ----------------------------------------------------------------------------------------------------
    */
    await nick_N_DB.findOne({ MessageID: interaction.message.id }).then(async (foundData) => {
        if(!foundData) dumpReason = `${marker}**Reason :** *(From the System)\nCouldn't find this request's data!!\nBecause of no data, the request was dumped by ${interaction.user} (${interaction.user.tag}), as it was useless. This issue belongs to our side and we're really sorry for inconvenience. Please make a new request or ask for a name change (if you want).*`;

        if(foundData) {
            const fetchedUser = interaction.guild.members.cache.get(`${foundData.MemberID}`);
            if(fetchedUser === undefined || fetchedUser === null) dumpReason = `${marker}**Reason :** *(From the System)\nCouldn't find this request's user!!\nThis request was dumped by ${interaction.user} (${interaction.user.tag}), as the user who made this request is now no more in the server. The user probably left or maybe something else happened.*`;
        }
    });



    // ACCEPT_Button ================================================== >>>>>
    if(interaction.customId === `nick_accept`) {
        nick_N_DB.findOne({ MessageID: interaction.message.id }).then(async (foundData) => {
            if(foundData) {
                // Start ================================================== >>>>>
                const chosenName = foundData.ChosenName;
                const theUser = interaction.guild.members.cache.get(`${foundData.MemberID}`);


                // Possible_Error_4
                if(theUser === undefined || theUser === null) return await dumpARequest(interaction);


                // Embeds ================================================== >>>>>
                const accepted_Embed = new Discord.EmbedBuilder();
                accepted_Embed.setTitle(`${evntEmoji}${config.tls}Old Request`);
                accepted_Embed.setDescription(`${marker}**Requested nickname :** ${chosenName}\n${marker}**User :** ${theUser}, ${theUser.user.tag}\n${marker}**User id :** ${theUser.user.id}\n${marker}**Status :** Accepted ${acceptSign}\n${marker}**Accepted by :** ${interaction.user}, ${interaction.user.tag}\n${marker}**Accepted at :** ${moment(interaction.createdTimestamp).format('ddd, Do MMM YYYY, h:mm:ss a')}`);
                accepted_Embed.setColor(`${acceptColour}`);
                accepted_Embed.setThumbnail(theUser.user.avatarURL({ dynamic: true }));

                const prompt_Embed = new Discord.EmbedBuilder();
                prompt_Embed.setTitle(`${acceptSign}${config.tls}You sure about that?`);
                prompt_Embed.setDescription(`Are you sure, you wanna accept this request for this request's user? This will be in action right after confirmation. Please confirm!`);
                prompt_Embed.setColor(`${acceptColour}`);

                const yes_Button = new Discord.ActionRowBuilder().addComponents(
                    new Discord.ButtonBuilder()
                    .setCustomId(`nickConfirm_Yes`)
                    .setLabel(`Yes, just do it!`)
                    .setStyle(Discord.ButtonStyle.Success)
                );


                // Execution ================================================== >>>>>
                interaction.reply({ embeds: [prompt_Embed], components: [yes_Button], ephemeral: true }).then(() => {
                    const prompt_Collector = interaction.channel.createMessageComponentCollector({ max: 1 });

                    prompt_Collector.on("collect", async (int) => {
                        if(int.customId === `nickConfirm_Yes`) {
                            interaction.message.edit({ embeds: [accepted_Embed], components: [] });

                            theUser.setNickname(`${foundData.ChosenName}`);

                            return await nick_N_DB.deleteOne({
                                GuildID: interaction.guild.id,
                                MemberID: foundData.MemberID,
                                MessageID: interaction.message.id,
                                ChosenName: foundData.ChosenName,
                            });
                        }
                    });
                });
            } else {
                // Possible_Error_5
                return await dumpARequest(interaction);
            }
        });
    }



    // REJECT_Button ================================================== >>>>>
    if(interaction.customId === `nick_reject`) {
        nick_N_DB.findOne({ MessageID: interaction.message.id }).then(async (foundData) => {
            if(foundData) {
                // Start ================================================== >>>>>
                const chosenName = foundData.ChosenName;
                const theUser = interaction.guild.members.cache.get(`${foundData.MemberID}`);


                // Possible_Error_4
                if(theUser === undefined || theUser === null) return await dumpARequest(interaction);


                // Embeds ================================================== >>>>>
                const rejected_Embed = new Discord.EmbedBuilder();
                rejected_Embed.setTitle(`${evntEmoji}${config.tls}Old Request`);
                rejected_Embed.setColor(`${rejectColour}`);
                rejected_Embed.setThumbnail(theUser.user.avatarURL({ dynamic: true }));

                const prompt_Embed = new Discord.EmbedBuilder();
                prompt_Embed.setTitle(`${rejectSign}${config.tls}What's gonna be the Reason?`);
                prompt_Embed.setDescription(`Please provide a valid reason for why you're rejecting this request? This will let the user know why he can't use this nickname. For providing the reason, just type and send it here in under a minute.\n\nIt's totally okay, if your reason is long and is taking time to complete in under a minute. Just dismiss this message, write your reason, click the button again (this same message will pop up again) and then send your completed reason. It should be a valid reason!!`);
                prompt_Embed.setColor(`${rejectColour}`);


                // Execution ================================================== >>>>>
                interaction.reply({ embeds: [prompt_Embed], ephemeral: true }).then(() => {
                    const prompt_Filter = (m) => { if(m.author.id === interaction.user.id) return true; }
                    const prompt_Collector = interaction.channel.createMessageCollector({ filter: prompt_Filter, time: 1000 * 60 });
                    

                    prompt_Collector.on("collect", async (collectedMessage) => {
                        collectedMessage.delete().catch();

                        const reasonCheckArr = [];
                        const reason = collectedMessage.content;
                        reasonCheckArr.push(reason);

                        if (reasonCheckArr.length !== 0) {
                            rejected_Embed.setDescription(`${marker}**Requested nickname :** ${chosenName}\n${marker}**User :** ${theUser}, ${theUser.user.tag}\n${marker}**User id :** ${theUser.user.id}\n${marker}**Status :** Rejected ${rejectSign}\n${marker}**Rejected by :** ${interaction.user}, ${interaction.user.tag}\n${marker}**Rejected at :** ${moment(interaction.createdTimestamp).format('ddd, Do MMM YYYY, h:mm:ss a')}\n${marker}**Reason :** ${reason}`);

                            interaction.message.edit({ embeds: [rejected_Embed], components: [] });

                            return await nick_N_DB.deleteOne({
                                GuildID: interaction.guild.id,
                                MemberID: foundData.MemberID,
                                MessageID: interaction.message.id,
                                ChosenName: foundData.ChosenName,
                            });
                        }
                    });
                });
            } else {
                // Possible_Error_5
                return await dumpARequest(interaction);
            }
        });
    }



    // DUMP_Button ================================================== >>>>>
    if(interaction.customId === `nickDump_Yes`) {
        interaction.deferUpdate();

        // Start ================================================== >>>>>
        const trashRequstMsg = await interaction.channel.messages.fetch(`${interaction.message.id}`);
        const dumpDescRaw = (trashRequstMsg.embeds[0].description).replace(`Current nickname`, `Previous nickname`).replace(`Pending 🟡`, `Dumped ${dumpSign}`);
        const dumpDesc = `${dumpDescRaw}\n${dumpReason}`;
        const dumpImage = trashRequstMsg.embeds[0].thumbnail.url;


        // Execution ================================================== >>>>>
        const dumpedRequest_Embed = new Discord.EmbedBuilder();
        dumpedRequest_Embed.setTitle(`${evntEmoji}${config.tls}Old Request`);
        dumpedRequest_Embed.setDescription(`${dumpDesc}`);
        dumpedRequest_Embed.setColor(`${dumpColour}`);
        dumpedRequest_Embed.setThumbnail(`${dumpImage}`);

        return interaction.message.edit({ embeds: [dumpedRequest_Embed], components: [] });
    }
};