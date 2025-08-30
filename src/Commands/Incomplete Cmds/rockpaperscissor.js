const Command = require("../../Structures/Command.js");
const Discord = require("discord.js");
const config = require("../../Data/config.json");
const aubdycad = require("../../Data/aubdycad.json");

module.exports = new Command({
    name: "rockpaperscissor",
    description: "Play Rock, Paper, Scissor!!",
    aliases: ["rps"],
    permission: "SEND_MESSAGES",
    allowedChannels: [],
    cooldown: "",

    async run(message, args, client) {
        const target = message.mentions.users.first();

        const noArgs = new Discord.MessageEmbed();
            noArgs.setTitle(`${config.err_emoji}${config.tls}RPS Error!!`);
            noArgs.setDescription(`You didn't told me, with whom you wanna play Rock, Paper & Scissor. Please mention a player with whom you wanna play.`);
            noArgs.setColor(`${config.err_hex}`);
            noArgs.setFooter(message.author.username, message.author.avatarURL({ dynamic: true }));
            noArgs.setTimestamp(message.createdTimestamp);

        if(!args[1]) return message.reply({ embeds: [noArgs] });


        const noTarget = new Discord.MessageEmbed();
            noTarget.setTitle(`${config.err_emoji}${config.tls}RPS Error!!`);
            noTarget.setDescription(`The player you're putting in your query is invalid. Please mention a valid member of this server, whom you wanna play with.`);
            noTarget.setColor(`${config.err_hex}`);
            noTarget.setFooter(message.author.username, message.author.avatarURL({ dynamic: true }));
            noTarget.setTimestamp(message.createdTimestamp);

        if(!target) return message.reply({ embeds: [noTarget] });


        const notSelf = new Discord.MessageEmbed();
            notSelf.setTitle(`${config.err_emoji}${config.tls}RPS Error!!`);
            notSelf.setDescription(`Nope!! You cannot play with yourself, mention some other member to play with.`);
            notSelf.setColor(`${config.err_hex}`);
            notSelf.setFooter(message.author.username, message.author.avatarURL({ dynamic: true }));
            notSelf.setTimestamp(message.createdTimestamp);

        if(target.id === message.author.id) return message.reply({ embeds: [notSelf] });


        const inviteEmbed = new Discord.MessageEmbed();
            inviteEmbed.setTitle(`✊${config.tls}RPS Invitation`);
            inviteEmbed.setDescription(`\`\`\`Hey ${target.username}, ${message.author.username} wanna play with you a game of Rock, Paper & Scissor. Would you like to play with them?? You've one minute to decide.\`\`\``);
            inviteEmbed.setColor(`YELLOW`);
            inviteEmbed.setFooter(message.author.username, message.author.avatarURL({ dynamic: true }));
            inviteEmbed.setTimestamp(message.createdTimestamp);

        
        const inviteButtons = new Discord.MessageActionRow().addComponents(
            new Discord.MessageButton()
                .setCustomId(`accept`)
                .setLabel(`Accept`)
                .setDisabled(false)
                .setStyle(`SUCCESS`),

            new Discord.MessageButton()
                .setCustomId(`reject`)
                .setLabel(`Reject`)
                .setDisabled(false)
                .setStyle(`DANGER`)
        );
        
        message.reply({ content: `${target}`, embeds: [inviteEmbed], components: [inviteButtons] }).then((invitemsg) => {
            const rpsEmbed = new Discord.MessageEmbed();
                rpsEmbed.setTitle(`✊${config.tls}Rock Paper & Scissor`);
                rpsEmbed.setColor(`BLUE`);
                rpsEmbed.setDescription(`${message.author.username} - **VS** - ${target.username}\n\`\`\`Both of you have 10 seconds to choose. Be quick!!\`\`\``);
                rpsEmbed.setFooter(client.user.username, client.user.avatarURL({ dynamic: true }));
                rpsEmbed.setTimestamp(message.createdTimestamp);

            const playButtons = new Discord.MessageActionRow().addComponents(
                new Discord.MessageButton()
                    .setCustomId(`rock`)
                    .setEmoji(`✊`)
                    .setLabel(`Rock`)
                    .setStyle(`SECONDARY`),

                new Discord.MessageButton()
                    .setCustomId(`paper`)
                    .setEmoji(`✋`)
                    .setLabel(`Paper`)
                    .setStyle(`SECONDARY`),

                new Discord.MessageButton()
                    .setCustomId(`scissor`)
                    .setEmoji(`✌`)
                    .setLabel(`Scissor`)
                    .setStyle(`SECONDARY`)
            );


            const rejectedEmbed = new Discord.MessageEmbed();
                rejectedEmbed.setTitle(`✊${config.tls}RPS Invitation Rejected`);
                rejectedEmbed.setColor(`RED`);
                rejectedEmbed.setDescription(`\`\`\`Oh oh... ${message.author.username}, unfortunately ${target.username} has rejected to play a RPS game with you. You can try with others if you want.\`\`\``);
                rejectedEmbed.setFooter(message.author.username, message.author.avatarURL({ dynamic: true }));
                rejectedEmbed.setTimestamp(message.createdTimestamp);



            const invitationFilter = (interaction) => {
                if(interaction.user.id === `${target.id}`) return true;
            }
            const invitationCollector = message.channel.createMessageComponentCollector({ filter: invitationFilter, time: 1000 * 60, max: 1 });
            invitationCollector.on('collect', (ButtonInteraction) => {
                const id = ButtonInteraction.customId;
                ButtonInteraction.deferUpdate();
                if(id === "accept") {
                    invitemsg.edit({ embeds: [rpsEmbed], components: [playButtons] }).then((mainMSG) => {
                        const alreadyPressed = [];
                        const selection = [];

                        const mainFilter = (interaction) => {
                            if(interaction.user.id === `${target.id}` || interaction.user.id === `${message.author.id}` ) return true;
                        }
                        const mainCollector = message.channel.createMessageComponentCollector({ filter: mainFilter, time: 1000 * 10 });
                        mainCollector.on('collect', (ButtonInteraction) => {
                            const id = ButtonInteraction.customId;

                            if(!!alreadyPressed.find(id => { return id.ID === ButtonInteraction.user.id + ButtonInteraction.message.id})) {
                                const alreadyExists = new Discord.MessageEmbed();
                                    alreadyExists.setTitle(`${config.err_emoji}${config.tls}RPS Error!!`);
                                    alreadyExists.setDescription(`You've already choosed once. You can't do that again`);
                                    alreadyExists.setColor(`${config.err_hex}`);

                                return ButtonInteraction.reply({ embeds: [alreadyExists], ephemeral: true });
                            } else {
                                if(id === "rock") {
                                    const youChose = new Discord.MessageEmbed();
                                        youChose.setTitle(`You chose Rock, ✊`);
                                        youChose.setColor(`WHITE`);

                                    ButtonInteraction.reply({ embeds: [youChose], ephemeral: true });
                                    selection.push({
                                        _NAME: ButtonInteraction.user.username,
                                        _OPTION: `✊`
                                    });
                                    return alreadyPressed.push({ID: ButtonInteraction.user.id+ButtonInteraction.message.id});
                                } else if (id === "paper") {
                                    const youChose = new Discord.MessageEmbed();
                                        youChose.setTitle(`You chose Paper, ✋`);
                                        youChose.setColor(`WHITE`);

                                    ButtonInteraction.reply({ embeds: [youChose], ephemeral: true });
                                    selection.push({
                                        _NAME: ButtonInteraction.user.username,
                                        _OPTION: `✋`
                                    });
                                    return alreadyPressed.push({ID: ButtonInteraction.user.id+ButtonInteraction.message.id});
                                } else if (id === "scissor") {
                                    const youChose = new Discord.MessageEmbed();
                                        youChose.setTitle(`You chose Scissor, ✌`);
                                        youChose.setColor(`WHITE`);

                                    ButtonInteraction.reply({ embeds: [youChose], ephemeral: true });
                                    selection.push({
                                        _NAME: ButtonInteraction.user.username,
                                        _OPTION: `✌`
                                    });
                                    return alreadyPressed.push({ID: ButtonInteraction.user.id+ButtonInteraction.message.id});
                                }
                            }
                        });


                        mainCollector.on('end', (collected) => {
                            let result;
                            let res;
                            const rock = `✊`;
                            const paper = `✋`;
                            const scissor = `✌`;
                            const none = `⚖`;
                            const congrats = `Congrats 🎉🎉\n`;

                            let Name = selection.map(x => x._NAME);
                            let Option = selection.map(x => x._OPTION);

                            let N = Name.toString().split(",");
                            let O = Option.toString().split(",");
                            let draw = `It's a draw!! No one has won the game.\n${N[0]} and ${N[1]} chose ${O[1]}.`;


                            if(!N[0] || N[0] === undefined || !N[1] || N[1] === undefined) {
                                const finalEmb = new Discord.MessageEmbed();
                                    finalEmb.setColor(`#2f3136`);
                                    finalEmb.setDescription(`🚫`);
                                    finalEmb.addFields({
                                        name: `>> ------- <<`,
                                        value: `${message.author.username} **VS** ${target.username}\n\`\`\`The game between you guys is now over. Either both or one of you failed to choose an element within 10 seconds.\`\`\``,
                                        inline: false
                                    });

                                playButtons.components[0].setDisabled(true);
                                playButtons.components[1].setDisabled(true);
                                playButtons.components[2].setDisabled(true);

                                return mainMSG.edit({ embeds: [finalEmb], components: [playButtons] });
                            }


                            if(O[0] === rock && O[1] === rock) result = `${draw}`, res = none;
                            if(O[0] === rock && O[1] === paper) result = `${congrats}${N[1]} has won with ${paper} over ${rock} by ${N[0]}.`, res = paper;
                            if(O[0] === rock && O[1] === scissor) result = `${congrats}${N[0]} has won with ${rock} over ${scissor} by ${N[1]}.`, res = rock;

                            if(O[0] === paper && O[1] === rock) result = `${congrats}${N[0]} has won with ${paper} over ${rock} by ${N[1]}.`, res = paper;
                            if(O[0] === paper && O[1] === paper) result = `${draw}`, res = none;
                            if(O[0] === paper && O[1] === scissor) result = `${congrats}${N[1]} has won with ${scissor} over ${paper} by ${N[0]}.`, res = scissor;

                            if(O[0] === scissor && O[1] === rock) result = `${congrats}${N[1]} has won with ${rock} over ${scissor} by ${N[0]}.`, res = rock;
                            if(O[0] === scissor && O[1] === paper) result = `${congrats}${N[0]} has won with ${scissor} over ${paper} by ${N[1]}.`, res = scissor;
                            if(O[0] === scissor && O[1] === scissor) result = `${draw}`, res = none;



                            const marker = `》`;
                            const finalEmb = new Discord.MessageEmbed();
                                finalEmb.setColor(`#2f3136`);
                                finalEmb.setDescription(res);
                                finalEmb.addFields({
                                    name: `>> ------- <<`,
                                    value: `${result}`,
                                    inline: false
                                });

                            playButtons.components[0].setDisabled(true);
                            playButtons.components[1].setDisabled(true);
                            playButtons.components[2].setDisabled(true);

                            return mainMSG.edit({ embeds: [finalEmb], components: [playButtons] });
                        });
                    });
                }
                if(id === "reject") {
                    inviteButtons.components[0].setDisabled(true);
                    inviteButtons.components[1].setDisabled(true);

                    invitemsg.edit({ embeds: [rejectedEmbed], components: [inviteButtons] });
                }
            });

            invitationCollector.on('end', (collected) => {                
                if(collected.size === 0 || collected.size === null) {
                    const timedOut = new Discord.MessageEmbed();
                        timedOut.setTitle(`✊${config.tls}RPS Invitation Timed Out`);
                        timedOut.setColor(`RED`);
                        timedOut.setDescription(`\`\`\`${target.username} didn't responded in time. Time's up, it's already 1 minute and I didn't got any response from ${target.username}. If you wanna play, send an invitation again or to someone else.\`\`\``);
                        timedOut.setFooter(message.author.username, message.author.avatarURL({ dynamic: true }));
                        timedOut.setTimestamp(message.createdTimestamp);

                    inviteButtons.components[0].setDisabled(true);
                    inviteButtons.components[1].setDisabled(true);
            
                    invitemsg.edit({ embeds: [timedOut], components: [inviteButtons] });
                }
            });
        });

        //message.delete().catch();
        //message.channel.send({ embeds: [X] });
    }
});