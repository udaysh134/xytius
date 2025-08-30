const Command = require("../../Structures/Command.js");
const Discord = require("discord.js");
const words = require("../../Data/Others/words.js");
const config = require("../../Data/config.json");
const Canvas = require("canvas");
const aubdycad = require("../../Data/aubdycad.json");

module.exports = new Command({
    name: "findwords",
    description: "Find hidden words in a Sentences.",
    aliases: ["fw"],
    permission: "SEND_MESSAGES",
    allowedChannels: [],
    cooldown: "",

    async run(message, args, client) {
        function randomString (length) {
            let result = '';
            let characters = 'abcdefghijklmnopqrstuvwxyz';
            for ( let i = 0; i < length; i++ ) {
              result += characters.charAt(Math.floor(Math.random() * characters.length));
            }

            let randomIndex = Math.floor(Math.random() * length);
            const chars = result.split("");
            chars[randomIndex] = ".";
            return chars.join("");
        }

        const marker = `》`;
        const randomVal = `10`;
        const random1 = (words[Math.floor(Math.random() * words.length)]);
        const random2 = (words[Math.floor(Math.random() * words.length)]);
        const random3 = (words[Math.floor(Math.random() * words.length)]);
        const random4 = (words[Math.floor(Math.random() * words.length)]);
        const random5 = (words[Math.floor(Math.random() * words.length)]);
        const random6 = (words[Math.floor(Math.random() * words.length)]);
        const random7 = (words[Math.floor(Math.random() * words.length)]);
        const random8 = (words[Math.floor(Math.random() * words.length)]);
        const random9 = (words[Math.floor(Math.random() * words.length)]);
        const random10 = (words[Math.floor(Math.random() * words.length)]);

        const line1 = randomString(35).split(".").join(`${random1}`);
        const line2 = randomString(35).split(".").join(`${random2}`);
        const line3 = randomString(35).split(".").join(`${random3}`);
        const line4 = randomString(35).split(".").join(`${random4}`);
        const line5 = randomString(35).split(".").join(`${random5}`);
        const line6 = randomString(35).split(".").join(`${random6}`);
        const line7 = randomString(35).split(".").join(`${random7}`);
        const line8 = randomString(35).split(".").join(`${random8}`);
        const line9 = randomString(35).split(".").join(`${random9}`);
        const line10 = randomString(35).split(".").join(`${random10}`);


        const firstEmbed = new Discord.MessageEmbed();
            firstEmbed.setTitle("Arranging things for you...");
            firstEmbed.setDescription(`The goal is to find ${randomVal} hidden words from ${randomVal} lines you'll be given.`);
            firstEmbed.setColor("#ff8b3d");

        const secondEmbed = new Discord.MessageEmbed();
            secondEmbed.setTitle("Arranging things for you...");
            secondEmbed.setDescription("Don't make mistakes. There'll be negative marking in your final result. Dare to defeat me!! 😈");
            secondEmbed.setColor("#ff8b3d");

        
        const fwEmbed = new Discord.MessageEmbed();
            fwEmbed.setTitle(`🗺${config.tls}Find Words`);
            fwEmbed.setColor("#ff8b3d");
            fwEmbed.addFields({
                name: `${marker}Lines :`,
                value: `\`\`\` • ${line1}\n • ${line2}\n • ${line3}\n • ${line4}\n • ${line5}\n • ${line6}\n • ${line7}\n • ${line8}\n • ${line9}\n • ${line10}\`\`\``,
                inline: false
            }, {
                name: `${marker}Time :`,
                value: `\`\`\`1 minute left 🕐\`\`\``,
                inline: false
            });
            fwEmbed.setFooter(message.author.username, message.author.avatarURL({ dynamic: true}));
            fwEmbed.setTimestamp(message.createdTimestamp);


        const fwEmbed2 = new Discord.MessageEmbed();
            fwEmbed2.setTitle(`🗺${config.tls}Find Words`);
            fwEmbed2.setColor("#ff8b3d");
            fwEmbed2.addFields({
                name: `${marker}Lines :`,
                value: `\`\`\` • ${line1}\n • ${line2}\n • ${line3}\n • ${line4}\n • ${line5}\n • ${line6}\n • ${line7}\n • ${line8}\n • ${line9}\n • ${line10}\`\`\``,
                inline: false
            }, {
                name: `${marker}Time :`,
                value: `\`\`\`30 Seconds left 🕐\`\`\``,
                inline: false
            });
            fwEmbed2.setFooter(message.author.username, message.author.avatarURL({ dynamic: true}));
            fwEmbed2.setTimestamp(message.createdTimestamp);

        
        const fwEmbed3 = new Discord.MessageEmbed();
            fwEmbed3.setTitle(`🗺${config.tls}Find Words`);
            fwEmbed3.setColor("#ff8b3d");
            fwEmbed3.addFields({
                name: `${marker}Lines :`,
                value: `\`\`\` • ${line1}\n • ${line2}\n • ${line3}\n • ${line4}\n • ${line5}\n • ${line6}\n • ${line7}\n • ${line8}\n • ${line9}\n • ${line10}\`\`\``,
                inline: false
            }, {
                name: `${marker}Time :`,
                value: `\`\`\`10 Seconds left 🕐\`\`\``,
                inline: false
            });
            fwEmbed3.setFooter(message.author.username, message.author.avatarURL({ dynamic: true}));
            fwEmbed3.setTimestamp(message.createdTimestamp);


        const fwTimeup = new Discord.MessageEmbed();
            fwTimeup.setTitle(`🗺${config.tls}Find Words`);
            fwTimeup.setColor("#ff8b3d");
            fwTimeup.addFields({
                name: `${marker}Lines :`,
                value: `\`\`\` • ${line1}\n • ${line2}\n • ${line3}\n • ${line4}\n • ${line5}\n • ${line6}\n • ${line7}\n • ${line8}\n • ${line9}\n • ${line10}\`\`\``,
                inline: false
            }, {
                name: `${marker}Time :`,
                value: `\`\`\`Time's Up!! 🕐\nGame Over!! 😐\`\`\``,
                inline: false
            });
            fwTimeup.setFooter(message.author.username, message.author.avatarURL({ dynamic: true}));
            fwTimeup.setTimestamp(message.createdTimestamp);


        message.reply({ embeds: [firstEmbed] }).then((FM) => {
            setTimeout(() => {
                FM.edit({ embeds: [secondEmbed] }).then((SM) => {
                    setTimeout(() => {
                        SM.edit({ embeds: [fwEmbed] }).then((thirtySec) => {
                            setTimeout(() => {
                                thirtySec.edit({ embeds: [fwEmbed2] }).then((tenSec) => {
                                    setTimeout(() => {
                                        tenSec.edit({ embeds: [fwEmbed3] }).then((timeUp) => {
                                            setTimeout(() => {
                                                timeUp.edit({ embeds: [fwTimeup] });
                                            }, 1000 * 9);
                                        });
                                    }, 1000 * 20);
                                });
                            }, 1000 * 30);
                        });
                    }, 1000 * 5);
                });
            }, 1000 * 5);
        });




        const FWfilter = m => {
            if(m.author.id === message.author.id) return true;
        }

        const FWcollector = message.channel.createMessageCollector({ filter: FWfilter, time: 1000 * 70 });
        FWcollector.on("collect", collectedMessages => {
            const content = collectedMessages.content.toLowerCase();
        });


        FWcollector.on("end", async collected => {
            const msgs = [];
            let sendMSG;
            let rightScore;
            let wrongScore;
            let compliment;

            collected.forEach((value) => {
                const collectedContent = value.content;
                const data = collectedContent.toLowerCase();
                msgs.push(data);
            });

            msgs.forEach(element => {
                if(element === `${random1}` || element === `${random2}` || element === `${random3}` || element === `${random4}` || element === `${random5}` || element === `${random6}` || element === `${random7}` || element === `${random8}` || element === `${random9}` || element === `${random10}`) {
                    sendMSG += `\n✅ | ${element}`;
                } else {
                    sendMSG += `\n❌ | ${element}`;
                }
            });


            if(sendMSG === undefined) {
                rightScore = 0;
                wrongScore = 0;

                sendMSG = `None`;
            } else {
                rightScore = sendMSG.split("✅").length -1;
                wrongScore = sendMSG.split("❌").length -1;
            }

            let finalScore = rightScore - wrongScore;

            if(finalScore === -1) compliment = `Waow, such a beautiful score... right?? RIGHT??`;
            if(finalScore === -2) compliment = `You better go find another work for you. You're not made to defeat me.`;
            if(finalScore === -3) compliment = `Bruuhh, what you doin'? Need a magnifying glass??`;
            if(finalScore === -4) compliment = `Amazing work you did there... get lost!! You can't defeat me.`;
            if(finalScore === -5) compliment = `Indians say, "Chullu bhar paani me doob maro". Why am I telling this to you?? Think of it...`;
            if(finalScore === -6) compliment = `Waow bro, watta skill!! Please teach me how to be this much wrong!!`;
            if(finalScore === -7) compliment = `I've no hopes for you bruh!!`;
            if(finalScore === -8) compliment = `This fail is memorable. Save this and frame it into your room.`;
            if(finalScore === -9) compliment = `Were you spamming blindly or what? Means literally... -9??`;
            if(finalScore === -10) compliment = `Bruh!! Are you serious. Not even a single... I've no words for you!!`;
            if(finalScore < -10) compliment = `Dude gone insanely, amazingly, furiously, bruhnijxly, #@*&$##^ly, #^W@G^HG$ly CRAZYYYYY!!`;

            if(finalScore === 0) compliment = `Hmm... nicely balanced!! Huge round of applause for you!! A real, real bad score.`;

            if(finalScore === 1) compliment = `Hahahaha... you only can do this much?? Ha ha ha ha...`;
            if(finalScore === 2) compliment = `Do me a favour... you leave doing this, you can't handle me.`;
            if(finalScore === 3) compliment = `You better go watch 3 idiots. Hahahaha!! 3..?? Watta score!! Hahahaha...`;
            if(finalScore === 4) compliment = `Ughh... just four?? Bro, where are other 6?? You need a ZOOM CLASS!!`;
            if(finalScore === 5) compliment = `You're only half way up!! Where're other fives?? Forgot home or what??`;
            if(finalScore === 6) compliment = `Ok ok... just a decent score!!`;
            if(finalScore === 7) compliment = `Hmm... atleast you reached this point. Many can't even get to achieve this.`;
            if(finalScore === 8) compliment = `Ohhkk... that's nice!! Still, need to work harder.`;
            if(finalScore === 9) compliment = `Oooo... quite impressive!! Why not try again?? This time I'll knock you out. Prove me wrong!!`;
            if(finalScore === 10) compliment = `Ohk ohk... congo, you defeated me. That was a very nice game!! Good work!! But I'll see you next. Try once more.`;



            const canvas = Canvas.createCanvas(800, 500);
            const ctx = canvas.getContext("2d");
            
            await Canvas.loadImage("https://wallpaperaccess.com/full/187161.jpg").then((background) => {
                const x = 0;
                const y = 0;
                const radius = 18;
                const width = canvas.width;
                const height = canvas.height;

                ctx.beginPath();
                ctx.moveTo(x + radius, y);
                ctx.lineTo(x + width - radius, y);
                ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
                ctx.lineTo(x + width, y + height - radius);
                ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
                ctx.lineTo(x + radius, y + height);
                ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
                ctx.lineTo(x, y + radius);
                ctx.quadraticCurveTo(x, y, x + radius, y);
                ctx.closePath();

                ctx.clip();
                ctx.drawImage(background, x, y, width, height);
            });

            ctx.save();

            await Canvas.loadImage(message.author.displayAvatarURL({ format: "png" })).then((avatar) => {
                const x = 300;
                const y = 25;
                const radius = 100;
                const width = 200;
                const height = 200;
    
                ctx.beginPath();
                ctx.arc(x + width/2, y + height/2, radius, 0, Math.PI * 2, true);
                ctx.closePath();
    
                ctx.clip();
                ctx.drawImage(avatar, x, y, width, height);
            });

            ctx.restore();
            ctx.save();


            function wrapText(context, text, x, y, maxWidth, lineHeight) {
                var words = text.split(' ');
                var line = '';
            
                for(var n = 0; n < words.length; n++) {
                    var testLine = line + words[n] + ' ';
                    var metrics = context.measureText(testLine);
                    var testWidth = metrics.width;
                    if (testWidth > maxWidth && n > 0) {
                        context.fillText(line, x, y);
                        line = words[n] + ' ';
                        y += lineHeight;
                    }
                    else {
                        line = testLine;
                    }
                }
                context.fillText(line, x, y);
            }

            ctx.font = "bold 40px arial";
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.fillText(`${message.author.tag}`, canvas.width/2, 270);

            ctx.font = "bold 80px arial";
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.fillText(`${finalScore} out of ${randomVal}`, canvas.width/2, 390);

            ctx.font = "30px arial";
            ctx.fillStyle = "white";
            ctx.textAlign = "center"
            wrapText(ctx, `${compliment}`, canvas.width/2, 420, 600, 31);


            const image = new Discord.MessageAttachment(canvas.toBuffer(), `Result.jpg`);
            const completeEmbed = new Discord.MessageEmbed();
                completeEmbed.setTitle(`🗺${config.tls}Find Words`);
                completeEmbed.setColor("#64e817");
                completeEmbed.addFields({
                    name: `${marker}Result :`,
                    value: `\`\`\`${sendMSG}\`\`\``,
                    inline: false
                }, {
                    name: `${marker}Score :`,
                    value: `\`\`\`See below there...\`\`\``,
                    inline: false
                });
                completeEmbed.setImage(`attachment://Result.jpg`);
                completeEmbed.setFooter(message.author.username, message.author.avatarURL({ dynamic: true }));
                completeEmbed.setTimestamp(message.createdTimestamp);

            message.channel.send({ embeds: [completeEmbed], files: [image] });
        });

        //message.delete().catch();
        //message.channel.send({ embeds: [X] });
    }
});