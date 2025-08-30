const Command = require("../../Structures/Command.js");
const Discord = require("discord.js");
const config = require("../../Data/config.json");
const { Connect4 } = require("leaf-utils");
const aubdycad = require("../../Data/aubdycad.json");

module.exports = new Command({
    name: "connect4",
    description: "Play a game of Connect 4.",
    aliases: ["conn4", "conn", "connf"],
    permission: "SEND_MESSAGES",
    allowedChannels: [],
    cooldown: "",

    async run(message, args, client) {
        const opponent = message.mentions.members.first();
        const noOpponent = new Discord.MessageEmbed();
            noOpponent.setTitle(`${config.err_emoji}${config.tls}Connect-4 Error!!`);
            noOpponent.setDescription("Please mention the user, whom you want to play with.");
            noOpponent.setColor(`${config.err_hex}`);
            noOpponent.setFooter(message.author.username, message.author.avatarURL({ dynamic: true}));
            noOpponent.setTimestamp(message.createdTimestamp);
        if (!opponent) return message.reply({ embeds: [noOpponent] });

        const notYourself = new Discord.MessageEmbed();
            notYourself.setTitle(`${config.err_emoji}${config.tls}Connect-4 Error!!`);
            notYourself.setDescription("You cannot play with your own. Please mention someone else, not yourself.");
            notYourself.setColor(`${config.err_hex}`);
            notYourself.setFooter(message.author.username, message.author.avatarURL({ dynamic: true}));
            notYourself.setTimestamp(message.createdTimestamp);
        if(opponent.id === message.author.id) return message.reply({ embeds: [notYourself] });

        new Connect4({
            message: message,
            opponent: message.mentions.users.first(),
            embed: {
              title: `🥨${config.tls}Connect-4`,
              color: '#f4900c',
            },
            emojis: {
              player1: '💚',
              player2: '❤'
            },
            waitMessage: 'Waiting for the opponent..',
            turnMessage: '{emoji} | **{player}**, your turn...',
            winMessage: '{emoji} | Nice **{winner}**, you won the game!! 🎉',
            gameEndMessage: 'The game went unfinished.',
            drawMessage: 'You both were so tough, it\'s a draw!!',
            othersMessage: 'Nope, you can\'t do that!!',
            askMessage: 'Hey {opponent}, {challenger} challenged you in a Connect-4 game. Would you like to accept the challenge?',
            cancelMessage: 'Oh, it\'s sad that {opponent} refused to play a game with you. Still, you can try again with someone else!!',
            timeEndMessage: '{opponent} didn\'t responded in time. The game is cancelled now.',
        }).startGame()

        //message.reply({ embeds: [X] });
        //message.delete().catch();
        //message.channel.send({ embeds: [X] });
    }
});