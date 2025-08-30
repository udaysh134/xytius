const Command = require("../../Structures/Command.js");
const Discord = require("discord.js");
const config = require("../../Data/config.json");
const aubdycad = require("../../Data/aubdycad.json");
const emojis = require("../../Data/emojis.json");
const pictures = require("../../Data/pictures.json");
const keys = require("../../Data/keys.json");


module.exports = new Command({
    name: "shuffle",
    description: "Re-arranges any given ordered items into randomly arranged order.",
    aliases: [],
    permission: "SendMessages",
    allowedChannels: [`${aubdycad.BotCommands1_C_ID}`, `${aubdycad.BotCommands2_C_ID}`],
    allowedServers: [`${config.TestServer_ID}`, `${config.Aubdycad_ID}`, `${config.XytiusServer_ID}`],
    cooldown: "",
    usage: `${config.prefix}shuffle <item_1, item_2, [item_3, ...item_100]>`,
    usageDesc: `As name suggests, the command is used to shuffle any given items in a random order. You atleast have to give two items to shuffle and the maximum limit is 100 items or less. Meaning, you cannot give more than 100 items as an input to this command. There should be no limit here, but it is because of Discord's text's size limit.`,
    usageExample: [`${config.prefix}shuffle one, two, three, four, five`, `${config.prefix}shuffle bacteria, ant, bee, cat, dog, lion, giraffe, elephant, whale`],
    forTesting: false,
    HUCat: [`gen`, `functional`],

    async run(message, args, client) {
        const cmndName = `Shuffle`;
        const cmndEmoji = [`🃏`];
        const cmndColour = [`9266cc`];
        const cmndError = `${config.err_emoji}${config.tls}Shuffle : Command Error!!`;
        const cmndMarker = `${config.marker}`;

        /*
        ----------------------------------------------------------------------------------------------------
        Start
        ----------------------------------------------------------------------------------------------------
        */
        const content = `${message.content}`;
        const seperator = ',';
        const items = content.slice(10).split(`${seperator}`);
        const itemsLimit = 100;


        /*
        ----------------------------------------------------------------------------------------------------
        Error Handling
        ----------------------------------------------------------------------------------------------------
        */
        const noOption1_Embed = new Discord.EmbedBuilder();
        noOption1_Embed.setTitle(`${cmndError}`);
        noOption1_Embed.setColor(`${config.err_hex}`);
        noOption1_Embed.setDescription(`You just forgot to provide me your items. Please mention all of your items seperated by a "\`${seperator}\`" so that I can re-arrange them, to give you a shuffled result.`);
        noOption1_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
        noOption1_Embed.setTimestamp(message.createdTimestamp);
        
        // Possible_Error_1
        if(!args[1]) return message.reply({ embeds: [noOption1_Embed] });


        const noItem2_Embed = new Discord.EmbedBuilder();
        noItem2_Embed.setTitle(`${cmndError}`);
        noItem2_Embed.setColor(`${config.err_hex}`);
        noItem2_Embed.setDescription(`I cannot accept only one item, as single shuffled item will give the result as that item only. Please provide me atleast 2 items to procceed further.`);
        noItem2_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
        noItem2_Embed.setTimestamp(message.createdTimestamp);
        
        // Possible_Error_2
        if(!items[1]) return message.reply({ embeds: [noItem2_Embed] });


        const noItemLimit_Embed = new Discord.EmbedBuilder();
        noItemLimit_Embed.setTitle(`${cmndError}`);
        noItemLimit_Embed.setColor(`${config.err_hex}`);
        noItemLimit_Embed.setDescription(`I cannot procceed further, as you've crossed the limit of providing maximum possible items (i.e., ${itemsLimit} items) for this command. Your items should be ${itemsLimit} or less.`);
        noItemLimit_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
        noItemLimit_Embed.setTimestamp(message.createdTimestamp);
        
        // Possible_Error_3
        if(items[itemsLimit]) return message.reply({ embeds: [noItemLimit_Embed] });


        /*
        ----------------------------------------------------------------------------------------------------
        Functions
        ----------------------------------------------------------------------------------------------------
        */
        async function itemsDisplay(limit) {
            let text = ``;

            if(items.length > limit) {
                for (let i = 0; i < (limit - 1); i++) {
                    text += `${items[i]}  >  `;
                }

                return text += `...**(+${(items.length) - limit} more)**...  > ${items[items.length - 1]}`;
            } else {
                items.forEach((elem) => {
                    text += `${elem}  > `;
                });

                let res = text.split("");
                res.splice(-2);
                return res.join("");
            }
        }


        async function shuffledRes(arr) {
            let currentIndex = arr.length;
            let randomIndex;
            let text = ``;
        
            while (currentIndex != 0) {
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex--;
        
                [arr[currentIndex], arr[randomIndex]] = [arr[randomIndex], arr[currentIndex]];
            }
        
            arr.forEach((elem) => {
                text += `${elem} > `;
            });

            let res = text.split("");
            res.splice(-2);
            return res.join("");
        }


        /*
        ----------------------------------------------------------------------------------------------------
        Execution
        ----------------------------------------------------------------------------------------------------
        */
        const displayLimit = 5
        const representation = await itemsDisplay(displayLimit);
        const shuffledResult = await shuffledRes(items);


        const fieldValueError_Embed = new Discord.EmbedBuilder();
        fieldValueError_Embed.setTitle(`${cmndError}`);
        fieldValueError_Embed.setColor(`${config.err_hex}`);
        fieldValueError_Embed.setDescription(`I cannot send the shuffled result as, the items you gave were so lenghty. The final result cannot be adjusted within Discord's limit. Please try to make your item's length shorter.`);
        fieldValueError_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
        fieldValueError_Embed.setTimestamp(message.createdTimestamp);
        
        // Possible_Error_4
        if(shuffledResult.length > 1015) return message.reply({ embeds: [fieldValueError_Embed] });



        // Main Execution ================================================== >>>>>
        const result_Embed = new Discord.EmbedBuilder();
        result_Embed.setTitle(`${cmndEmoji[0]}${config.tls}${cmndName}`);
        result_Embed.setDescription(`${representation}`);
        result_Embed.addFields({
            name: `${cmndMarker}Result :`,
            value: `\`\`\`${shuffledResult}\`\`\``,
            inline: false
        });
        result_Embed.setColor(`${cmndColour[0]}`);
        result_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
        result_Embed.setTimestamp(message.createdTimestamp);

        return message.reply({ embeds: [result_Embed] });
    }
});