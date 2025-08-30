const Command = require("../../Structures/Command.js");
const Discord = require("discord.js");
const Canvas = require("canvas");
const config = require("../../Data/config.json");
const aubdycad = require("../../Data/aubdycad.json");

module.exports = new Command({
    name: "ship",
    description: "Check your shipping with others.",
    aliases: [],
    permission: "SEND_MESSAGES",
    allowedChannels: [],
    cooldown: "",

    async run(message, args, client) {
        const canvas = Canvas.createCanvas(800, 500);
        const ctx = canvas.getContext("2d");

        const target = message.mentions.users.first();
        if (!target) return message.reply("Please mention someone to ship.");
        if (target.id == message.author.id) return message.reply("Please mention someone else not yourself.");

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
            const x = 50;
            const y = 140;
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

        await Canvas.loadImage(target.displayAvatarURL({ format: "png" })).then((targetAvatar) => {
            const x = 540;
            const y = 140;
            const radius = 100;
            const width = 200;
            const height = 200;

            ctx.beginPath();
            ctx.arc(x + width/2, y + height/2, radius, 0, Math.PI * 2, true);
            ctx.closePath();

            ctx.clip();
            ctx.drawImage(targetAvatar, x, y, width, height);
        });

        ctx.restore();
        


        const random = Math.floor(Math.random() * 99) + 1;

        if(random <= 10) {
            ctx.font = "bold 100px arial";
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.fillText(`${random}%`, canvas.width/2, 260);

            ctx.font = "50px sans-serif";
            ctx.fillStyle = "white";
            ctx.textAlign = "center"
            ctx.fillText("Aww...So poor!!", canvas.width/2, 310);
    
            const image1 = new Discord.MessageAttachment(canvas.toBuffer(), `${random}%.jpeg`);
            message.reply({ files: [image1] });
        } else if (random >= 11 && random <= 20) {
            ctx.font = "bold 100px arial";
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.fillText(`${random}%`, canvas.width/2, 260);

            ctx.font = "50px sans-serif";
            ctx.fillStyle = "white";
            ctx.textAlign = "center"
            ctx.fillText("Nope!! BAD!!", canvas.width/2, 310);
            
            const image2 = new Discord.MessageAttachment(canvas.toBuffer(), `${random}%.jpeg`);
            message.reply({ files: [image2] });
        } else if (random >= 21 && random <= 30) {
            ctx.font = "bold 100px arial";
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.fillText(`${random}%`, canvas.width/2, 260);

            ctx.font = "50px sans-serif";
            ctx.fillStyle = "white";
            ctx.textAlign = "center"
            ctx.fillText("Just that? Poor", canvas.width/2, 310);
            
            const image3 = new Discord.MessageAttachment(canvas.toBuffer(), `${random}%.jpeg`);
            message.reply({ files: [image3] });
        } else if (random >= 31 && random <= 40) {
            ctx.font = "bold 100px arial";
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.fillText(`${random}%`, canvas.width/2, 260);

            ctx.font = "50px sans-serif";
            ctx.fillStyle = "white";
            ctx.textAlign = "center"
            ctx.fillText("Not good!!", canvas.width/2, 310);
            
            const image4 = new Discord.MessageAttachment(canvas.toBuffer(), `${random}%.jpeg`);
            message.reply({ files: [image4] });
        } else if (random >= 41 && random <= 50) {
            ctx.font = "bold 100px arial";
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.fillText(`${random}%`, canvas.width/2, 260);

            ctx.font = "50px sans-serif";
            ctx.fillStyle = "white";
            ctx.textAlign = "center"
            ctx.fillText("Just improved!!", canvas.width/2, 310);
            
            const image5 = new Discord.MessageAttachment(canvas.toBuffer(), `${random}%.jpeg`);
            message.reply({ files: [image5] });
        } else if (random >= 51 && random <= 60) {
            ctx.font = "bold 100px arial";
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.fillText(`${random}%`, canvas.width/2, 260);

            ctx.font = "50px sans-serif";
            ctx.fillStyle = "white";
            ctx.textAlign = "center"
            ctx.fillText("Kinda okay!!", canvas.width/2, 310);
            
            const image6 = new Discord.MessageAttachment(canvas.toBuffer(), `${random}%.jpeg`);
            message.reply({ files: [image6] });
        } else if (random >= 61 && random <= 70) {
            ctx.font = "bold 100px arial";
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.fillText(`${random}%`, canvas.width/2, 260);

            ctx.font = "50px sans-serif";
            ctx.fillStyle = "white";
            ctx.textAlign = "center"
            ctx.fillText("Hmm...Fine!!", canvas.width/2, 310);
            
            const image7 = new Discord.MessageAttachment(canvas.toBuffer(), `${random}%.jpeg`);
            message.reply({ files: [image7] });
        } else if (random >= 71 && random <= 80) {
            ctx.font = "bold 100px arial";
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.fillText(`${random}%`, canvas.width/2, 260);

            ctx.font = "50px sans-serif";
            ctx.fillStyle = "white";
            ctx.textAlign = "center"
            ctx.fillText("That's so Good!!", canvas.width/2, 310);
            
            const image8 = new Discord.MessageAttachment(canvas.toBuffer(), `${random}%.jpeg`);
            message.reply({ files: [image8] });
        } else if (random >= 81 && random <= 90) {
            ctx.font = "bold 100px arial";
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.fillText(`${random}%`, canvas.width/2, 260);

            ctx.font = "50px sans-serif";
            ctx.fillStyle = "white";
            ctx.textAlign = "center"
            ctx.fillText("Vaaoow...Nice!!", canvas.width/2, 310);
            
            const image9 = new Discord.MessageAttachment(canvas.toBuffer(), `${random}%.jpeg`);
            message.reply({ files: [image9] });
        } else if (random >= 91 && random <= 95) {
            ctx.font = "bold 100px arial";
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.fillText(`${random}%`, canvas.width/2, 260);

            ctx.font = "50px sans-serif";
            ctx.fillStyle = "white";
            ctx.textAlign = "center"
            ctx.fillText("That's so Impresssive!!", canvas.width/2, 310);
            
            const image10 = new Discord.MessageAttachment(canvas.toBuffer(), `${random}%.jpeg`);
            message.reply({ files: [image10] });
        } else if (random >= 96 && random <= 98) {
            ctx.font = "bold 100px arial";
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.fillText(`${random}%`, canvas.width/2, 260);

            ctx.font = "50px sans-serif";
            ctx.fillStyle = "white";
            ctx.textAlign = "center"
            ctx.fillText("Amazingly OP guys!!", canvas.width/2, 310);
            
            const image11 = new Discord.MessageAttachment(canvas.toBuffer(), `${random}%.jpeg`);
            message.reply({ files: [image11] });
        } else if (random >= 98 && random <= 100) {
            ctx.font = "bold 100px arial";
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.fillText(`${random}%`, canvas.width/2, 245);

            ctx.font = "50px sans-serif";
            ctx.fillStyle = "white";
            ctx.textAlign = "center"
            ctx.fillText(`That's INSANE!!`, canvas.width/2, 290);

            ctx.font = "20px sans-serif";
            ctx.fillStyle = "white";
            ctx.textAlign = "center"
            ctx.fillText(`You guys are made for each other!!`, canvas.width/2, 310);
            
            const image12 = new Discord.MessageAttachment(canvas.toBuffer(), `${random}%.jpeg`);
            message.reply({ files: [image12] });
        }

        //message.reply({ embeds: [X] });
        //message.delete().catch();
        //message.channel.send({ embeds: [X] });
    }
});