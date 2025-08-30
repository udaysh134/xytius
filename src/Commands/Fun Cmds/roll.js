const Command = require("../../Structures/Command.js");
const Discord = require("discord.js");
const config = require("../../Data/config.json");
const aubdycad = require("../../Data/aubdycad.json");
const emojis = require("../../Data/emojis.json");
const pictures = require("../../Data/pictures.json");
const keys = require("../../Data/keys.json");


module.exports = new Command({
    name: "roll",
    description: "Roll a die (by default) or dice, with this command.",
    aliases: [],
    permission: "SendMessages",
    allowedChannels: [`${aubdycad.BotCommands1_C_ID}`, `${aubdycad.BotCommands2_C_ID}`],
    allowedServers: [`${config.TestServer_ID}`, `${config.Aubdycad_ID}`, `${config.XytiusServer_ID}`],
    cooldown: "",
    usage: `${config.prefix}roll [1 / die / 2 / dice]`,
    usageDesc: `Wanna play ludo but don't have a die or maybe wanna try your luck with the die. You can do that with this command. What it does is, rolls a die for you meaning you'll get 1, 2, 3, 4, 5 or 6 as random face of a die.\n\nYou can also roll 2 dice at a time by giving an optional query ("dice" or "2") to the command. This will give you two different faces of two different dice.`,
    usageExample: [`${config.prefix}roll`, `${config.prefix}roll dice`],
    forTesting: false,
    HUCat: [`gen`, `fun`],

    async run(message, args, client) {
        const cmndName = `Roll`;
        const cmndEmoji = [`🎲`];
        const cmndColour = [`2f3136`, `ea596e`];
        const cmndError = `${config.err_emoji}${config.tls}Roll : Command Error!!`;
        const cmndMarker = `${config.marker}`;

        /*
        ----------------------------------------------------------------------------------------------------
        Start
        ----------------------------------------------------------------------------------------------------
        */
        const randDieNum = Math.round(Math.random() * (6 - 1) + 1);
        const randDieNum_2 = Math.round(Math.random() * (6 - 1) + 1);


        /*
        ----------------------------------------------------------------------------------------------------
        Functions
        ----------------------------------------------------------------------------------------------------
        */
        const face_1 = (dot, space) => {
            return `${space}${space}${space}${space}${space}\n${space}${space}${dot}${space}${space}\n${space}${space}${space}${space}${space}`;
        }
        
        const face_2 = (dot, space) => {
            return `${dot}${space}${space}${space}${space}\n${space}${space}${space}${space}${space}\n${space}${space}${space}${space}${dot}`;
        }

        const face_3 = (dot, space) => {
            return `${dot}${space}${space}${space}${space}\n${space}${space}${dot}${space}${space}\n${space}${space}${space}${space}${dot}`;
        }

        const face_4 = (dot, space) => {
            return `${dot}${space}${space}${space}${dot}\n${space}${space}${space}${space}${space}\n${dot}${space}${space}${space}${dot}`;
        }

        const face_5 = (dot, space) => {
            return `${dot}${space}${space}${space}${dot}\n${space}${space}${dot}${space}${space}\n${dot}${space}${space}${space}${dot}`;
        }

        const face_6 = (dot, space) => {
            return `${dot}${space}${dot}${space}${dot}\n${space}${space}${space}${space}${space}\n${dot}${space}${dot}${space}${dot}`;
        }


        function dieEmbedFunc(dotsDesc) {
            const rollResult_Embed = new Discord.EmbedBuilder();
            rollResult_Embed.setDescription(`${dotsDesc}`);
            rollResult_Embed.setColor(`${cmndColour[0]}`);

            return message.reply({ embeds: [rollResult_Embed] });
        }

        async function dieResultFunc() {
            const dotSymb = `🔘`;
            const indent = `${config.invChar}`;

            switch (randDieNum) {
                case 1:
                    dieEmbedFunc(`${face_1(dotSymb, indent)}`);
                    break;
                case 2:
                    dieEmbedFunc(`${face_2(dotSymb, indent)}`);
                    break;
                case 3:
                    dieEmbedFunc(`${face_3(dotSymb, indent)}`);
                    break;
                case 4:
                    dieEmbedFunc(`${face_4(dotSymb, indent)}`);
                    break;
                case 5:
                    dieEmbedFunc(`${face_5(dotSymb, indent)}`);
                    break;
                case 6:
                    dieEmbedFunc(`${face_6(dotSymb, indent)}`);
                    break;
            }
        }



        function diceEmbedFunc(dotsDesc, embed) {
            embed.setDescription(`${dotsDesc}`);
            embed.setColor(`${cmndColour[0]}`);
        }

        async function diceResultFunc() {
            const dotSymb = `💿`;
            const dotSymb_2 = `📀`;
            const indent = `${config.invChar}`;

            const diceRoll1_Embed = new Discord.EmbedBuilder();
            const diceRoll2_Embed = new Discord.EmbedBuilder();


            if(randDieNum === 1) {
                diceEmbedFunc(`${face_1(dotSymb, indent)}`, diceRoll1_Embed);
            } else if(randDieNum === 2) {
                diceEmbedFunc(`${face_2(dotSymb, indent)}`, diceRoll1_Embed);
            } else if(randDieNum === 3) {
                diceEmbedFunc(`${face_3(dotSymb, indent)}`, diceRoll1_Embed);
            } else if(randDieNum === 4) {
                diceEmbedFunc(`${face_4(dotSymb, indent)}`, diceRoll1_Embed);
            } else if(randDieNum === 5) {
                diceEmbedFunc(`${face_5(dotSymb, indent)}`, diceRoll1_Embed);
            } else if(randDieNum === 6) {
                diceEmbedFunc(`${face_6(dotSymb, indent)}`, diceRoll1_Embed);
            }

            if(randDieNum_2 === 1) {
                diceEmbedFunc(`${face_1(dotSymb_2, indent)}`, diceRoll2_Embed);
            } else if(randDieNum_2 === 2) {
                diceEmbedFunc(`${face_2(dotSymb_2, indent)}`, diceRoll2_Embed);
            } else if(randDieNum_2 === 3) {
                diceEmbedFunc(`${face_3(dotSymb_2, indent)}`, diceRoll2_Embed);
            } else if(randDieNum_2 === 4) {
                diceEmbedFunc(`${face_4(dotSymb_2, indent)}`, diceRoll2_Embed);
            } else if(randDieNum_2 === 5) {
                diceEmbedFunc(`${face_5(dotSymb_2, indent)}`, diceRoll2_Embed);
            } else if(randDieNum_2 === 6) {
                diceEmbedFunc(`${face_6(dotSymb_2, indent)}`, diceRoll2_Embed);
            }

            return message.reply({ embeds: [diceRoll1_Embed, diceRoll2_Embed] });
        }


        /*
        ----------------------------------------------------------------------------------------------------
        Execution
        ----------------------------------------------------------------------------------------------------
        */
        if(!args[1] || args[1].toLowerCase() === `die` || args[1].toLowerCase() === `1`) {
            await dieResultFunc();
        } else if(args[1].toLowerCase() === `dice` || args[1].toLowerCase() === `2`) {
            await diceResultFunc();
        } else {
            const unknownArgErr_Embed = new Discord.EmbedBuilder();
            unknownArgErr_Embed.setTitle(`${cmndError}`);
            unknownArgErr_Embed.setColor(`${config.err_hex}`);
            unknownArgErr_Embed.setDescription(`The query you provided is invalid. Please specify correct query for desired result. Use "\`${config.prefix}usage\`" command for this command to get more info about it.`);
            unknownArgErr_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
            unknownArgErr_Embed.setTimestamp(message.createdTimestamp);
            
            // Possible_Error_1
            return message.reply({ embeds: [unknownArgErr_Embed] });
        }
    }
});