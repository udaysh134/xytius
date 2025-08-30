const Command = require("../../Structures/Command.js");
const Discord = require("discord.js");
const config = require("../../Data/config.json");
const aubdycad = require("../../Data/aubdycad.json");
const emojis = require("../../Data/emojis.json");
const pictures = require("../../Data/pictures.json");
const keys = require("../../Data/keys.json");


module.exports = new Command({
    name: "ask",
    description: "Ask a question and get answer from the bot itself.",
    aliases: [],
    permission: "SendMessages",
    allowedChannels: [`${aubdycad.BotCommands1_C_ID}`, `${aubdycad.BotCommands2_C_ID}`],
    allowedServers: [`${config.TestServer_ID}`, `${config.Aubdycad_ID}`, `${config.XytiusServer_ID}`],
    cooldown: "",
    usage: `${config.prefix}ask <question>`,
    usageDesc: `Use this command for fun to ask anything from the bot. Ofcourse, the bot is not a human being so you can't expect humanly answers and neither it is powered by AI so, you shouldn't also always expect logical answers from it.\n\nAs already mentioned before, this is just for fun, so enjoy it by asking question from which you expect answers like YES or NO or so... You'll probably sometime get some, much astonishing answers.`,
    usageExample: [`${config.prefix}ask Am I going to get hurt anyways?`, `${config.prefix}ask Will I ever get to know who is Wumpus?`, `${config.prefix}ask Should I cook for my raged sister?`],
    forTesting: false,
    HUCat: [`gen`, `fun`],

    async run(message, args, client) {
        const cmndName = ``;
        const cmndEmoji = [];
        const cmndColour = [`2f3136`];
        const cmndError = `${config.err_emoji}${config.tls}Ask : Command Error!!`;
        const cmndMarker = `${config.marker}`;

        /*
        ----------------------------------------------------------------------------------------------------
        Start
        ----------------------------------------------------------------------------------------------------
        */
        const text = args.slice(1).join(" ");
        const replies = [
            `Umm... maybe...`,
            `Yes, for sure!!`,
            `Hell Yeah!!!`,
            `I actually don't know!!`,
            `Just stop asking me these type of questions. 🙄`,
            `Can we skip this?`,
            `Can we skip this too?`,
            `I wanna skip this. Right now!!`,
            `No!!`,
            `Nope`,
            `Yep!!`,
            `That's difficult to answer... 😕`,
            `Why not?`,
            `Yeah, I mean NO!!`,
            `God knows!`,
            `That's a BAD IDEA!`,
            `I think no, but yes. But wait, NO!!`,
            `This is serious...`,
            `Let me gather my knowledge, I tell you later in 2090.`,
            `Whatever you think..`,
            `I don't give answers of this type of STUPID questions. 😎`,
            `My dad has the answer...`,
            `I'm not any Antaryaami! 😑`,
            `Ask your heart!`,
            `Is that even a question?`,
            `My grandma knows...`,
            `This is not the right time to answer.`,
            `Meet me in your device, at 3:61 am. I'll tell you the answer...`,
            `I can't speak that up here. That's confidential!!`,
            `I charge Rs. 50 for the answer, send it and get it...`,
            `Once again, one more lame question...`,
            `Am I your teacher? Stop throwing your questions on me!`,
            `I'm tired, I can't speak...`,
            `Same to you!!`,
            `I didn't heard that, can you please repeat?`,
            `Imma go sleep. Please leave me alone, especially with your non-sense questions.`,
            `I guess, yasss!!`,
            `Hmmmm...???`,
            `What?`,
            `I don't wanna hurt you, so I'm not going to reveal the answer.`,
            `Do you even think once before asking questions like this? Please do it!!`,
            `Go, ask her!`,
            `Go, ask him!`,
            `That's impossible!!`,
            `0%`,
            `Depends on you!`,
            `Leave it on your luck!`,
            `Did you, yourself thought about it?`,
            `The answer is [here](https://www.youtube.com/watch?v=dQw4w9WgXcQ), find it out yourself...`,
            `I'll literally get Alzheimer's disease, if I answered even a single more question from you.`,
            `100%`,
            `I know, there's no any -0, but in this case there is -0% chance!!`,
            `50 - 50`,
            `Less likely to be.`,
            `More likely to be.`,
            `1,000% for sure!!`,
            `You don't have that ability to hear the answer.`,
            `You sure you want the answer, can you survive it.`,
            `Answer is [this](https://www.youtube.com/watch?v=dQw4w9WgXcQ)...`,
            `Your phone's first notification (after reading this) will give you the answer.`,
            `I'm busy, ask [Google](www.google.com).`,
            `You'll get your answer within 3 hours. A wise man will tell you. Be patient!!`,
            `That's a rubbish question. I don't like it, I avoid!!`,//63
        ];
        const reply = replies[Math.floor(Math.random() * replies.length)];


        /*
        ----------------------------------------------------------------------------------------------------
        Error Handling
        ----------------------------------------------------------------------------------------------------
        */
        const noQuesError_Embed = new Discord.EmbedBuilder();
        noQuesError_Embed.setTitle(`${cmndError}`);
        noQuesError_Embed.setColor(`${config.err_hex}`);
        noQuesError_Embed.setDescription(`You just forgot to ask me a question while telling me that you're gonna ask me a question. Dude, you sure you're okay?`);
        noQuesError_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
        noQuesError_Embed.setTimestamp(message.createdTimestamp);
        
        // Possible_Error_1
        if(!text) return message.reply({ embeds: [noQuesError_Embed] });


        /*
        ----------------------------------------------------------------------------------------------------
        Execution
        ----------------------------------------------------------------------------------------------------
        */
        const textArr = text.toString().split('');
        const ques_1 = `${textArr[0].toUpperCase()}`;
        const ques_2 = `${textArr.slice(1).join("")}`;
        const question = `${ques_1}${ques_2}`;


        const reply_Embed = new Discord.EmbedBuilder();
        reply_Embed.setAuthor({ name: `: ${question} - ${message.author.tag}`, iconURL: message.author.avatarURL({ dynamic: true }) });
        reply_Embed.setDescription(`→ ${reply}`);
        reply_Embed.setColor(`${cmndColour[0]}`);

        return message.reply({ embeds: [reply_Embed] });
    }
});