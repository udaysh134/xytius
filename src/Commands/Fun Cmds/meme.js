const Command = require("../../Structures/Command.js");
const Discord = require("discord.js");
const config = require("../../Data/config.json");
const aubdycad = require("../../Data/aubdycad.json");
const emojis = require("../../Data/emojis.json");
const pictures = require("../../Data/pictures.json");
const keys = require("../../Data/keys.json");

const FUNC_fetchReddit = require("../../Systems/External Functions/FUNC_fetchReddit.js");


module.exports = new Command({
    name: "meme",
    description: "Gives you trendy and funny memes.",
    aliases: ["memes"],
    permission: "SendMessages",
    allowedChannels: [`${aubdycad.Memes_TC_ID}`],
    allowedServers: [`${config.TestServer_ID}`, `${config.Aubdycad_ID}`, `${config.XytiusServer_ID}`],
    cooldown: "",
    usage: `${config.prefix}meme [category]`,
    usageDesc: `A simple command from you can get memes without surfing anywhere, right within Discord. The command can also provide you memes of different types (specifically). You don't need to specify any other query, if you just want normal memes from the internet. But, if you don't, you need to specify the type, as the second query in the command.\n\nYou may ask what are the "types"? There are currently few fixed types, which you can get detail of, by using "\`${config.prefix}meme categories\`" command. These specific types gives you only memes of that type.`,
    usageExample: [`${config.prefix}meme indian`, `${config.prefix}meme mc`, `${config.prefix}memes pew`],
    forTesting: false,
    HUCat: [`gen`, `fun`],

    async run(message, args, client) {
        const cmndName = `Meme`;
        const cmndEmoji = [`💩`];
        const cmndColour = [`ffffff`];
        const cmndError = `${config.err_emoji}${config.tls}Meme : Command Error!!`;
        const cmndMarker = `${config.marker}`;

        /*
        ----------------------------------------------------------------------------------------------------
        Function
        ----------------------------------------------------------------------------------------------------
        */
        async function getMeme(arr, ctgry) {
            const memePages = arr;
            const thePage = memePages[Math.floor(Math.random() * memePages.length)];
            const result = await FUNC_fetchReddit(thePage, true, `hot`);


            // Execution ================================================== >>>>>
            const meme_Embed = new Discord.EmbedBuilder();
            meme_Embed.setTitle(`${cmndEmoji[0]}${config.tls}${ctgry}`);
            meme_Embed.setDescription(`${cmndMarker}**${result.Title}**`);
            meme_Embed.setImage(result.Image);
            meme_Embed.setColor(`${cmndColour[0]}`);
            meme_Embed.setFooter({ text: `👍${result.Upvotes}  •  👎${result.Downvotes}` });

            return message.reply({ embeds: [meme_Embed] });
        }


        /*
        ----------------------------------------------------------------------------------------------------
        Execution
        ----------------------------------------------------------------------------------------------------
        */
        if(!args[1]) {
            const memePages = ["memes", "meme", "MemeEconomy", "Memes_Of_The_Dank", "funny", "meirl"];
            return await getMeme(memePages, `Meme`);
        } else {
            switch (args[1].toLowerCase()) {
                case 'categories':
                    const m_ = cmndMarker;
                    const categories = [`${m_}Indian (i / india)`, `${m_}Minecraft (m / mc)`, `${m_}Duolingo (duo)`, `${m_}History (his)`, `${m_}Pewdiepie (pew)`, `${m_}SaimanSays (ss)`];

                    const categories_Embed = new Discord.EmbedBuilder();
                    categories_Embed.setTitle(`${cmndEmoji[0]}${config.tls}${cmndName} Categories`);
                    categories_Embed.setDescription(`Given below are the categories you can put as a query in the command, to get memes of a specified category only.\n\`\`\`${categories.join("\n")}\`\`\``);
                    categories_Embed.setColor(`${cmndColour[0]}`);
                    categories_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
                    categories_Embed.setTimestamp(message.createdTimestamp);

                    message.reply({ embeds: [categories_Embed] });
                    break;
                case 'i':
                case 'india':
                case 'indian':
                    const indianArr = ["IndianMeyMeys", "IndianMemology", "IndianMemeTemplates", "indianmemer", "HeraPheriMemes", "CarryMinati"];
                    await getMeme(indianArr, `Indian Meme`);
                    break;
                case 'm':
                case 'mc':
                case 'minecraft':
                    const minecraftArr = ["MinecraftMemes"];
                    await getMeme(minecraftArr, `Minecraft Meme`);
                    break;
                case 'duo':
                case 'duolingo':
                    const duolingoArr = ["duolingomemes", "shitduolingosays"];
                    await getMeme(duolingoArr, `Duolingo Meme`);
                    break;
                case 'his':
                case 'history':
                    const historyArr = ["historymemes"];
                    await getMeme(historyArr, `History Meme`);
                    break;
                case 'pew':
                case 'pewdiepie':
                    const pewdiepieArr = ["PewdiepieSubmissions"];
                    await getMeme(pewdiepieArr, `Pewdiepie Meme`);
                    break;
                case 'ss':
                case 'saimansays':
                    const saimansaysArr = ["SaimanSays"];
                    await getMeme(saimansaysArr, `SaimanSays Meme`);
                    break;
                default:
                    const invalidCategory_Embed = new Discord.EmbedBuilder();
                    invalidCategory_Embed.setTitle(`${cmndError}`);
                    invalidCategory_Embed.setColor(`${config.err_hex}`);
                    invalidCategory_Embed.setDescription(`The query you gave as a category is invalid. Please use a valid query as a category to get memes of that type only. Use "\`${config.prefix}meme categories\`" command to get info of all the categories you can use as a query.`);
                    invalidCategory_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
                    invalidCategory_Embed.setTimestamp(message.createdTimestamp);
                    
                    // Possible_Error_1
                    message.reply({ embeds: [invalidCategory_Embed] });
            }
        }
    }
});