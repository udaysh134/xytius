const Command = require("../../Structures/Command.js");
const Discord = require("discord.js");
const config = require("../../Data/config.json");
const aubdycad = require("../../Data/aubdycad.json");
const emojis = require("../../Data/emojis.json");
const pictures = require("../../Data/pictures.json");
const keys = require("../../Data/keys.json");


module.exports = new Command({
    name: "random",
    description: "Give some choices to choose one randomly selected choice among all.",
    aliases: [],
    permission: "SendMessages",
    allowedChannels: [`${aubdycad.BotCommands1_C_ID}`, `${aubdycad.BotCommands2_C_ID}`],
    allowedServers: [`${config.TestServer_ID}`, `${config.Aubdycad_ID}`, `${config.XytiusServer_ID}`],
    cooldown: "",
    usage: `${config.prefix}random <option_1, option_2, [option_3, ...option_n]>`,
    usageDesc: `The command is used to run through every single choice that you give as an input (seperated by a comma(,)), and select a random choice from among all. You need to give atleast two choices and you can give at max infinite choices.`,
    usageExample: [`${config.prefix}random Pizza, Burger, Soft drink, Salad`, `${config.prefix}random School, Office, Studio, House, Garden, Mall, A place like heaven`],
    forTesting: false,
    HUCat: [`gen`, `functional`],

    async run(message, args, client) {
        const cmndName = `Random`;
        const cmndEmoji = [`🗃`];
        const cmndColour = [`9aaab4`];
        const cmndError = `${config.err_emoji}${config.tls}Random : Command Error!!`;
        const cmndMarker = `${config.marker}`;

        /*
        ----------------------------------------------------------------------------------------------------
        Start
        ----------------------------------------------------------------------------------------------------
        */
        const content = `${message.content}`;
        const seperator = ',';
        const options = content.slice(9).split(`${seperator}`);


        /*
        ----------------------------------------------------------------------------------------------------
        Error Handling
        ----------------------------------------------------------------------------------------------------
        */
        const noOption1_Embed = new Discord.EmbedBuilder();
        noOption1_Embed.setTitle(`${cmndError}`);
        noOption1_Embed.setColor(`${config.err_hex}`);
        noOption1_Embed.setDescription(`You just forgot to provide me your choices. Please mention your choices seperated by a "\`${seperator}\`" so that I can randomize in between those, to give you a single result.`);
        noOption1_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
        noOption1_Embed.setTimestamp(message.createdTimestamp);
        
        // Possible_Error_1
        if(!args[1]) return message.reply({ embeds: [noOption1_Embed] });


        const noOption2_Embed = new Discord.EmbedBuilder();
        noOption2_Embed.setTitle(`${cmndError}`);
        noOption2_Embed.setColor(`${config.err_hex}`);
        noOption2_Embed.setDescription(`I cannot accept only one choice, as chance of getting that is 100%. Please provide me atleast 2 options to procceed further.`);
        noOption2_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
        noOption2_Embed.setTimestamp(message.createdTimestamp);
        
        // Possible_Error_2
        if(!options[1]) return message.reply({ embeds: [noOption2_Embed] });


        /*
        ----------------------------------------------------------------------------------------------------
        Functions
        ----------------------------------------------------------------------------------------------------
        */
        async function choiceDisplay(limit) {
            let text = ``;

            if(options.length > limit) {
                for (let i = 0; i < (limit - 1); i++) {
                    text += `${options[i]}, `;
                }

                return text += `...**(+${(options.length) - limit} more)**..., ${options[options.length - 1]}`;
            } else {
                options.forEach((elem) => {
                    text += `${elem}, `;
                });

                let res = text.split("");
                res.splice(-2);
                return res.join("");
            }
        }
       
       
        /*
        ----------------------------------------------------------------------------------------------------
        Execution
        ----------------------------------------------------------------------------------------------------
        */
        const choice = options[Math.floor(Math.random() * options.length)];
        const chance = Math.round((((1 / options.length) * 100) + Number.EPSILON) * 100) / 100;

        const displayLimit = 5
        const representation = await choiceDisplay(displayLimit);
        

        const result_Embed = new Discord.EmbedBuilder();
        result_Embed.setTitle(`${cmndEmoji[0]}${config.tls}${cmndName}`);
        result_Embed.setDescription(`${representation}`);
        result_Embed.addFields({
            name: `♦ : ${choice.toUpperCase()}`,
            value: `\`\`\`Choices : ${options.length}\nChances : ${chance}% each\`\`\``,
            inline: false
        });
        result_Embed.setColor(`${cmndColour[0]}`);
        result_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
        result_Embed.setTimestamp(message.createdTimestamp);

        return message.reply({ embeds: [result_Embed] });
    }
});