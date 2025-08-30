const Discord = require("discord.js");
const Command = require("./Command.js");
const Event = require("./Event.js");
const config = require("../Data/config.json");
const fs = require("fs");

const Intents = Discord.GatewayIntentBits;
const Partials = Discord.Partials;


class Client extends Discord.Client {
    constructor() {
        super({
            intents: [
                // Intents.AutoModerationConfiguration,
                // Intents.AutoModerationExecution,
                // Intents.DirectMessageReactions,
                // Intents.DirectMessageTyping,
                Intents.DirectMessages,
                Intents.GuildBans,
                Intents.GuildEmojisAndStickers,
                Intents.GuildIntegrations,
                Intents.GuildInvites,
                Intents.GuildMembers,
                Intents.GuildMessageReactions,
                // Intents.GuildMessageTyping,
                Intents.GuildMessages,
                Intents.GuildPresences,
                // Intents.GuildScheduledEvents,
                Intents.GuildVoiceStates,
                // Intents.GuildWebhooks,
                Intents.Guilds,
                Intents.MessageContent,
            ],
            partials: [
                Partials.Channel,
                Partials.GuildMember,
                // Partials.GuildScheduledEvent,
                Partials.Message,
                Partials.Reaction,
                Partials.ThreadMember,
                Partials.User,
            ],
            allowedMentions: {
                parse : ['users', 'roles'],
                repliedUser: false
            }
        });


        /**
         * @type {Discord.Collection<string, Command>}
         */
        this.commands = new Discord.Collection();
        this.aliases = new Discord.Collection();
        this.prefix = config.prefix;
    }


    start(token) {
        /*
        ----------------------------------------------------------------------------------------------------
        Start                                                                   
        ----------------------------------------------------------------------------------------------------
        */
        const legacy_cmdDir = fs.readdirSync(`./src/Commands`);
        const slash_cmdDir = fs.readdirSync(`./src/Slash Commands`);
        const events_filesDir = fs.readdirSync(`./src/Events`);

        const legacyCmd_Arr = [];
        const slashCmd_Arr = [];
        const events_Arr = [];

        const l_cmdEmojiMarker = `🔸 | `;
        const s_cmdEmojiMarker = `🔹 | `;
        const events_emojiMarker = `🔅 | `;
        const status_emojiMarker = `📂 | `;
        const lineSeparator = `${createLine(40)} >>`;


        /*
        ----------------------------------------------------------------------------------------------------
        Functions                                                                   
        ----------------------------------------------------------------------------------------------------
        */
        function createLine(length) {
            let result = ``;

            for (let i = 0; i < length; i++) {
                result += `-`;
            }

            return result;
        }


        /*
        ----------------------------------------------------------------------------------------------------
        Execution                                                                   
        ----------------------------------------------------------------------------------------------------
        */
        // For_Legacy_Commands ================================================== >>>>>
        legacy_cmdDir.forEach((directory) => {
            const cmdFiles = fs.readdirSync(`./src/Commands/${directory}`).filter(file => file.endsWith('.js'));

            /**
            * @type {Command[]}
            */
            const commands = cmdFiles.map((file) => require(`../Commands/${directory}/${file}`));

            commands.forEach((cmd) => {
                legacyCmd_Arr.push(cmd.name);
                console.log(`${l_cmdEmojiMarker}Command Loaded : ${cmd.name}`);

                this.commands.set(cmd.name, cmd);

                if(cmd.aliases) {
                    cmd.aliases.forEach((aliases) => {
                        this.aliases.set(aliases, cmd);
                    });
                }
            });
        });

        console.log(`${lineSeparator}`);




        // For_Slash_Commands ================================================== >>>>>
        let name_Availablity = `🟢`;
        let desc_Availability = `🟢`;
        
        const allSlashCmd_Arr = [];


        slash_cmdDir.forEach((directory) => {
            const slashCommandFiles = fs.readdirSync(`./src/Slash Commands/${directory}`).filter((file) => file.endsWith('.js'));
            const slashCommands = slashCommandFiles.map((file) => require(`../Slash Commands/${directory}/${file}`));

            
            slashCommands.map(async (slashCommand) => {
                slashCmd_Arr.push(slashCommand.name);

                if(!slashCommand.name) name_Availablity = `🔴`;
                if(!slashCommand.context && !slashCommand.description) desc_Availability = `🔴`;

                console.log(`${s_cmdEmojiMarker}Slash Loaded : ${name_Availablity} - ${desc_Availability} : ${slashCommand.name}`);
                
                this.commands.set(slashCommand.name, slashCommand);
                allSlashCmd_Arr.push(slashCommand);
            });
        });

        console.log(`${lineSeparator}`);

        this.on("ready", async () => {
            const Aubdycad_Server = this.guilds.cache.get(`${config.Aubdycad_ID}`);
            const Test_Server = this.guilds.cache.get(`${config.TestServer_ID}`);
            const Xytius_Server = this.guilds.cache.get(`${config.XytiusServer_ID}`);

            await Aubdycad_Server.commands.set(allSlashCmd_Arr).then().catch(() => { return });
            await Test_Server.commands.set(allSlashCmd_Arr).then().catch(() => { return });
            await Xytius_Server.commands.set(allSlashCmd_Arr).then().catch(() => { return });
        });




        // For_Events ================================================== >>>>>
        events_filesDir.forEach((directory) => {
            const eventsFiles = fs.readdirSync(`./src/Events/${directory}`).filter((file) => file.endsWith(".js"));

            /**
             * @type {Event}
             */
            const events = eventsFiles.map((file) => require(`../Events/${directory}/${file}`));

            events.forEach((theEvent) => {
                events_Arr.push(theEvent.name);
                console.log(`${events_emojiMarker}Event Loaded : ${theEvent.event}`);
                this.on(theEvent.event, theEvent.run.bind(null, this));
            });
        });




        // Final_Status ================================================== >>>>>
        console.log(`${lineSeparator}`);
        console.log(`${status_emojiMarker}Updated total : ${legacyCmd_Arr.length} legacy commands`);
        console.log(`${status_emojiMarker}Updated total : ${slashCmd_Arr.length} slash commands`);
        console.log(`${status_emojiMarker}Updated total : ${events_Arr.length} events`);
        console.log(`${lineSeparator}`);
        
        this.login(token);
    }
}

module.exports = Client;