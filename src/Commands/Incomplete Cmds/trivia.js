const Command = require("../../Structures/Command.js");
const Discord = require("discord.js");
const config = require("../../Data/config.json");
const { Trivia } = require("leaf-utils")
const aubdycad = require("../../Data/aubdycad.json");

module.exports = new Command({
    name: "trivia",
    description: "Play Trivia game.",
    aliases: ["gk", "quiz"],
    permission: "SEND_MESSAGES",
    allowedChannels: [],
    cooldown: "",

    async run(message, args, client) {              
        await Trivia({
            message: message,
            embed: {
                title: `🙋‍♂️${config.tls}Trivia`,
                description: 'You have **{{time}}** to guess the answer.',
                color: '#FFC300',
                footer: `${message.author.tag}`,
                timestamp: true
            },
            difficulty: 'easy',
            thinkMessage: 'Thinking of it',
            winMessage:
                'Hmm, the answer was **{{answer}}**. You took **{{time}}** to answer it.',
            loseMessage: 'You got it wrong. The answer was, **{{answer}}**.',
            emojis: {
                one: '1️⃣',
                two: '2️⃣',
                three: '3️⃣',
                four: '4️⃣',
            },
            othersMessage: 'Only <@{{author}}> can use the buttons!',
            returnWinner: false
        });

        //message.reply({ embeds: [X] });
        //message.delete().catch();
        //message.channel.send({ embeds: [X] });
    }
});