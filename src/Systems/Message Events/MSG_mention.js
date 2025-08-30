const Discord = require("discord.js");
const config = require("../../Data/config.json");


module.exports = (client, message) => {
    if (message.content === `<@${client.user.id}>` || message.content === `<@!${client.user.id}>`) {
        /*
        ----------------------------------------------------------------------------------------------------
        Embeds
        ----------------------------------------------------------------------------------------------------
        */
        const hello_Embed = new Discord.EmbedBuilder();
        hello_Embed.setAuthor({ name: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
        hello_Embed.setDescription(`Hey, hello ${message.author.username} 👋, how are you?\nI came to know you thought of me.\nIs there anything, with which I can help you?`);
        hello_Embed.setColor(`ffffff`);

        const yes_Embed = new Discord.EmbedBuilder();
        yes_Embed.setTitle(`Need help?`);
        yes_Embed.setDescription(`Glad you asked!!\nIf you're willing to use me and my features / commands, you can call me by my prefix. My Prefix is "\`${config.prefix}\`". Other than that, to know what all features / commands do I have, use \`${config.prefix}help\` command. Additionally, you can also use \`${config.prefix}usage\` command to get detailed usage of any command.\n\nThank you!!\nHave a very good day!! ☺`);
        yes_Embed.setColor(`ffffff`);
        yes_Embed.setThumbnail(client.user.avatarURL({ dynamic: true }));
        yes_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
        yes_Embed.setTimestamp(message.createdTimestamp);

        const no_Embed = new Discord.EmbedBuilder();
        no_Embed.setTitle(`Okay!!`);
        no_Embed.setDescription(`Thanks for letting me know. I guess you did it by mistake, or maybe you were checking me, maybe!! It's okay, nevermind!!\n\nHave a good day!! ☺`);
        no_Embed.setColor(`ffffff`);
        no_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
        no_Embed.setTimestamp(message.createdTimestamp);


        const hello_Buttons = new Discord.ActionRowBuilder().addComponents(
            new Discord.ButtonBuilder()
            .setCustomId(`yes`)
            .setLabel(`Yeah, sure`)
            .setStyle(Discord.ButtonStyle.Success),
        
            new Discord.ButtonBuilder()
            .setCustomId(`no`)
            .setLabel(`No, it's ok`)
            .setStyle(Discord.ButtonStyle.Secondary)
        );


        /*
        ----------------------------------------------------------------------------------------------------
        Execution
        ----------------------------------------------------------------------------------------------------
        */
        message.reply({ embeds: [hello_Embed], components: [hello_Buttons] }).then((helloMsg) => {
            const hello_Collector = message.channel.createMessageComponentCollector({ time: 1000 * 20 });

            hello_Collector.on('collect', (interaction) => {
                const notYouCanDo_Embed = new Discord.EmbedBuilder();
                notYouCanDo_Embed.setTitle(`${config.err_emoji}${config.tls}Error!!`);
                notYouCanDo_Embed.setColor(`${config.err_hex}`);
                notYouCanDo_Embed.setDescription(`Oh oh!! Sorry ${interaction.user.tag}, but you cannot do that. Only ${message.author.tag} can use the button.`);

                // Possible_Error_1
                if(interaction.user.id !== message.author.id) return interaction.reply({ embeds: [notYouCanDo_Embed], ephemeral: true });


                if (interaction.customId === "yes") {
                    hello_Buttons.components[0].setDisabled(true);
                    hello_Buttons.components[1].setDisabled(true);

                    helloMsg.edit({ embeds: [hello_Embed], components: [hello_Buttons] });
                    return interaction.reply({ embeds: [yes_Embed], ephemeral: true });
                }

                if (interaction.customId === "no") {
                    hello_Buttons.components[0].setDisabled(true);
                    hello_Buttons.components[1].setDisabled(true);

                    helloMsg.edit({ embeds: [hello_Embed], components: [hello_Buttons] });
                    return interaction.reply({ embeds: [no_Embed], ephemeral: true });
                }
            });

            hello_Collector.on('end', () => {
                hello_Buttons.components[0].setDisabled(true);
                hello_Buttons.components[1].setDisabled(true);

                return helloMsg.edit({ embeds: [hello_Embed], components: [hello_Buttons] });
            });
        });
    }
};