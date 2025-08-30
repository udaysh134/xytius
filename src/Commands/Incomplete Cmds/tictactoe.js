const Command = require("../../Structures/Command.js");
const Discord = require("discord.js");
const { Leaftictactoe  } = require("leaf-utils");
const config = require("../../Data/config.json");
const aubdycad = require("../../Data/aubdycad.json");

module.exports = new Command({
    name: "tictactoe",
    description: "Play a TicTacToe game.",
    aliases: ["ttt"],
    permission: "SEND_MESSAGES",
    allowedChannels: [],
    cooldown: "",

    async run(message, args, client) {
        const opponent = message.mentions.members.first();
        const noOpponent = new Discord.MessageEmbed();
            noOpponent.setTitle(`${config.err_emoji}${config.tls}TicTacToe Error!!`);
            noOpponent.setDescription("Please mention the user, whom you want to play with.");
            noOpponent.setColor(`${config.err_hex}`);
            noOpponent.setFooter(message.author.username, message.author.avatarURL({ dynamic: true}));
            noOpponent.setTimestamp(message.createdTimestamp);
        if (!opponent) return message.reply({ embeds: [noOpponent] });

        const notYourself = new Discord.MessageEmbed();
            notYourself.setTitle(`${config.err_emoji}${config.tls}TicTacToe Error!!`);
            notYourself.setDescription("You cannot play with your own. Please mention someone else, not yourself.");
            notYourself.setColor(`${config.err_hex}`);
            notYourself.setFooter(message.author.username, message.author.avatarURL({ dynamic: true}));
            notYourself.setTimestamp(message.createdTimestamp);
        if(opponent.id === message.author.id) return message.reply({ embeds: [notYourself] });

        new Leaftictactoe({
            message: message,
            opponent: message.mentions.users.first(),
            embed: {
              title: `💢${config.tls}TicTacToe`,
              color: '#ff8b3d',
            },
            oEmoji: '🔴', 
            xEmoji: '❌',
            oColor: 'SUCCESS',
            xColor: 'DANGER',
            turnMessage: '`{emoji}` : **{player}**, your turn...',
            waitMessage: 'Please wait for the opponent\'s response...',
            askMessage: 'Hey {opponent}, {challenger} challenged you in a TicTacToe game. Would you like to accept the challenge?',
            cancelMessage: 'Oh, it\'s sad that {opponent} refused to play a game with you. Still, you can try again with someone else!!',
            timeEndMessage: '{opponent} didn\'t responded in time. The game is cancelled now.',
            drawMessage: 'Hmm...tough competition!! It\'s a **DRAW**!!',
            winMessage: '`{emoji}` | Nice **{winner}**, you won the game!! 🎉',
            gameEndMessage: 'The game went unfinished!!',
        }).startGame();

        //message.reply({ embeds: [X] });
        //message.delete().catch();
        //message.channel.send({ embeds: [X] });
    }
});