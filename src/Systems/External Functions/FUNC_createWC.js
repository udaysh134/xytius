const Discord = require("discord.js");
const config = require("../../Data/config.json");
const emojis = require("../../Data/emojis.json");
const pictures = require("../../Data/pictures.json");

const Canvas = require("canvas");
const qrcode = require("qrcode");
const { fillWithEmoji } = require('discord-emoji-canvas');

const FUNC_getBadges = require("../External Functions/FUNC_getBadges.js");
const FUNC_loadCanvas = require("../External Functions/FUNC_loadCanvas.js");


module.exports = async (client, method, methodUser) => {
    /*
    ----------------------------------------------------------------------------------------------------
    Start
    ----------------------------------------------------------------------------------------------------
    */
    const Aubdycad_Server = client.guilds.cache.get(`${method.guild.id}`);

    const canvas = Canvas.createCanvas(2400, 1500);
    const ctx = canvas.getContext("2d");

    const compliments = [
        `Hope you brought a grand cake for us!! Did you??`,
        `I knew you'll join our party. Let's have some dihydrogen monoxide.`,
        `Woo! you made it. Now go channels to channels and explore...`,
        `Hey, you're the one who joined using an invite link. Right?`,
        `You're coming from far away, you must be tired. Have some Oxidane!!`,
        `How did you get here? I suspect... from a Wormhole?? Hmm!!`,
        `Hey!! Finally, you're here. We were waiting for you only.`,
        `We're playing Hide n Seek. You just joined us. C'mon now find us!!`,
        `Welcome soldier, leave your weapons by the door and come in.`,
        `"A new Aubdycadian just spawned." Hey you, build up your camp.`,
        `You just hopped into the server. You ill-mannered KANGAROO!!`,
        `It's a new Aubdycadian here, praise The Earth. Praise The Sun!!`,
        `I can smell you're chewing a gum. Hmm?? Let me call The Warden.`,
        `Roses are red, violets are blue, my PC lagged joining by you!!`,
        `Hey, wanna cheers with me & others?? Go bring some jugo de naranja.`
    ];

    const marker = config.marker;

    const bgImage_online = pictures.welcomeCard.online;
    const bgImage_idle = pictures.welcomeCard.idle;
    const bgImage_dnd = pictures.welcomeCard.dnd;
    const bgImage_offline = pictures.welcomeCard.offline;


    /*
    ----------------------------------------------------------------------------------------------------
    Functions
    ----------------------------------------------------------------------------------------------------
    */
    function standardiseCase(value) {
        const splitted = value.split('');
        const firstVal = splitted[0].toUpperCase();
        const otherVal = splitted.slice(1).join('');

        let resultValue = `${firstVal}${otherVal.toLowerCase().replace(/_/g, " ")}`;
        return resultValue;
    }


    function displayUsername(username, charLimit) {
        const splitted = username.split("");

        if(splitted[charLimit]) {
            splitted.length = charLimit;
            splitted.push(`...`);

            return splitted.toString().replace(/,/g, '');
        } else {
            return username;
        }
    }


    function wrapText(context, text, x, y, maxWidth, lineHeight) {
        let words = text.split(' ');
        let line = '';
    
        for(let n = 0; n < words.length; n++) {
            let testLine = line + words[n] + ' ';
            let metrics = context.measureText(testLine);
            let testWidth = metrics.width;
            if (testWidth > maxWidth && n > 0) {
                context.fillText(line, x, y);
                line = words[n] + ' ';
                y += lineHeight;
            } else {
                line = testLine;
            }
        }

        context.fillText(line, x, y);
    }


    /*
    ----------------------------------------------------------------------------------------------------
    Execution
    ----------------------------------------------------------------------------------------------------
    */
    // Data_Values ================================================== >>>>>
    const theMember = method.guild.members.cache.get(`${methodUser.id}`);

    const isMemberBot = methodUser.bot === true ? `Yes` : `No`;
    const memberNumber = (Aubdycad_Server.memberCount).toLocaleString();
    const memberStatus = theMember.presence === null ? `OFFLINE` : `${standardiseCase(theMember.presence.status)}`;

    const fetchBadges_Name = await FUNC_getBadges(theMember.user, `name`);
    const memberBadges_Name = fetchBadges_Name.join(", ");

    console.log(client.emojis.cache.get(`1079168451790262376`));
    // const fetchBadges_Emoji = await FUNC_getBadges(theMember.user, `emoji`);
    const fetchBadges_Emoji = [
        `${emojis.VERIFIED_BOT}`,
        `${emojis.HOUSE_BRILLIANCE}`,
        `${emojis.EARLY_VERIFIED_BOT_DEVELOPER}`,
        `${emojis.HYPESQUAD_EVENTS}`,
        `${emojis.BUGHUNTER_LEVEL_1}`,
        `${emojis.EARLY_SUPPORTER}`,
        `${emojis.HTTP_INTERACTIONS}`,
        `${emojis.QUARANTINE}`,
        `${emojis.SPAMMER}`,
        `${emojis.VERIFIED_BOT}`,
        `${emojis.ACTIVE_DEVELOPER}`,
    ];
    const memberBadges_Emoji = fetchBadges_Emoji.join(" ");

    const theCompliment = compliments[Math.floor(Math.random() * compliments.length)];
    const qrText = `Designed by : Uday Shukla\n\n>> ---- User Info ---- <<\n${marker}Member : ${memberNumber}\n${marker}User : ${methodUser.tag}\n${marker}User ID : ${methodUser.id}\n${marker}Badge(s) : ${memberBadges_Name}\n${marker}Is Bot : ${isMemberBot}\n${marker}Status : ${memberStatus}\n${marker}Compliment : ${theCompliment}`;



    // Creating_QR ================================================== >>>>>
    const qrOptions = {
        type: "image/png",
        quality: 0.9,
        margin: 1,
        width: 175,
        color: {
            light: "ffffff",
            dark: "000000"
        }
    };

    const mainQRCode = await qrcode.toDataURL(qrText, qrOptions);


    // Loading_Background ================================================== >>>>>
    let theBackground;

    switch (memberStatus) {
        case "Online":
            theBackground = bgImage_online;
            break;
        case "Idle":
            theBackground = bgImage_idle;
            break;
        case "Dnd":
            theBackground = bgImage_dnd;
            break;
        case "Offline":
            theBackground = bgImage_offline;
            break;
        case "OFFLINE":
            theBackground = bgImage_offline;
            break;
    }

    await FUNC_loadCanvas(ctx, theBackground, 0, 0, 200, canvas.width, canvas.height, true);

    ctx.save();


    // Member_Indicator ================================================== >>>>>
    if(isMemberBot === `Yes`) {
        ctx.font = "126px Arial";
        ctx.fillStyle = "#bdbdbd";
        ctx.textAlign = "left";
        await fillWithEmoji(ctx, `${emojis.WIFI_SYMBOL}`, 159, 225);
    }

    ctx.font = "bold 122px Agency FB";
    ctx.fillStyle = "#bdbdbd";
    ctx.textAlign = "left"
    ctx.fillText(`${memberNumber}`, 757.5, 218.5);

    ctx.restore();
    ctx.save();


    // Left_Side_Display ================================================== >>>>>
    const userAvatar = methodUser.displayAvatarURL({ extension: "png" });

    // User's avatar
    await FUNC_loadCanvas(ctx, userAvatar, 183, 423.31, 132, 597.6, 597.6, true);

    ctx.restore();
    ctx.save();

    // QR Code
    await FUNC_loadCanvas(ctx, mainQRCode, 369.31, 1145, 0, 225, 225, false);

    ctx.restore();
    ctx.save();


    // Right_Side_Display ================================================== >>>>>
    const memberName = displayUsername(methodUser.username, 10);

    ctx.font = "bold 173px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "left";
    ctx.fillText(`${memberName}`, 993, 713);

    ctx.font = "italic 113px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "left"
    ctx.fillText(`#${methodUser.discriminator}`, 993, 846);


    // User Badges
    let userBadges;

    if(memberBadges_Emoji === `${emojis.NO_SIGN_GREY}`) {
        userBadges = `${memberBadges_Emoji} NO BADGES`;

        ctx.font = "82px Arial Rounded MT Bold";
        ctx.fillStyle = "#505050";
        ctx.textAlign = "left"
        await fillWithEmoji(ctx, `${userBadges}`, 993, 953);
    } else {
        if(fetchBadges_Emoji.length > 1) {
            let x = 0;
            let y = 110;

            for (let i = 0; i < fetchBadges_Emoji.length; i++) {
                const elem = fetchBadges_Emoji[i];

                ctx.font = "82px Arial Rounded MT Bold";
                ctx.fillStyle = "#505050";
                ctx.textAlign = "left"
                await fillWithEmoji(ctx, `${elem}`, 993 + x, 953);

                x = x + y;
            }
        } else {
            userBadges = `${fetchBadges_Emoji[0]}`;

            ctx.font = "82px Arial Rounded MT Bold";
            ctx.fillStyle = "#505050";
            ctx.textAlign = "left"
            await fillWithEmoji(ctx, `${userBadges}`, 993, 953);
        }
    }


    // Center_Compliment ================================================== >>>>>
    ctx.font = "60px Arial Rounded MT Bold";
    ctx.fillStyle = "#78c2ee";
    ctx.textAlign = "center"
    wrapText(ctx, `${theCompliment}`, canvas.width/2, 1294, 740, 64);


    /*
    ----------------------------------------------------------------------------------------------------
    Final Execution
    ----------------------------------------------------------------------------------------------------
    */
    const finalResultImage = new Discord.AttachmentBuilder(canvas.toBuffer("image/png"), { name: `WC_for_${methodUser.username}_by_Xytius.png` });
    return finalResultImage;
}