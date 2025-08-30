const Command = require("../../Structures/Command.js");
const Discord = require("discord.js");
const config = require("../../Data/config.json");
const aubdycad = require("../../Data/aubdycad.json");
const emojis = require("../../Data/emojis.json");
const pictures = require("../../Data/pictures.json");
const keys = require("../../Data/keys.json");

const fetch = require("node-fetch");
const moment = require("moment");


module.exports = new Command({
    name: "weather",
    description: "Get upto 5 days of detailed weather forecast including previous, current and following days.",
    aliases: ["forcast", "climate"],
    permission: "SendMessages",
    allowedChannels: [`${aubdycad.BotCommands1_C_ID}`, `${aubdycad.BotCommands2_C_ID}`],
    allowedServers: [`${config.TestServer_ID}`, `${config.Aubdycad_ID}`, `${config.XytiusServer_ID}`],
    cooldown: "",
    usage: `${config.prefix}weather <location / zipcode>`,
    usageDesc: `A command, pretty easy for anyone to try out. This command gives you weather details of a particular location, you searched for. Just give the query (the location), while using the command and it will catch up with the location, if it was right.\n\nThe command provides you with the result from past 2 days, for the current time and for 2 following days, summing up to 5 days of total weather details. To navigate through pages, use buttons given below the result.\n\n**NOTE :** The "❔" button gives you detailed information on so many things, you may need to know to interpret all weather details.`,
    usageExample: [`${config.prefix}weather amsterdam`, `${config.prefix}weather veneto`, `${config.prefix}weather moscow`],
    forTesting: false,
    HUCat: [`gen`, `search`],

    async run(message, args, client) {
        const cmndName = `Weather`;
        const cmndEmoji = [`🌥`, `⚠`, `❔`, `${emojis.ANIMATED_LOADING}`];
        const cmndColour = [`e1e8ed`];
        const cmndError = `${config.err_emoji}${config.tls}Weather : Command Error!!`;
        const cmndMarker = `${config.marker}`;

        /*
        ----------------------------------------------------------------------------------------------------
        Start
        ----------------------------------------------------------------------------------------------------
        */
        const query = args.slice(1).join(" ");

        const apiKey = keys.weather.key;
        const forecastKey = keys.weather.link.forecast;
        const historyKey = keys.weather.link.history;
        const days = `3`;
        const aqi = `yes`;
        const alerts = `yes`;

        const forecastLink = `${forecastKey}${apiKey}&q=${query}&days=${days}&aqi=${aqi}&alerts=${alerts}`;
        const partialHistoryLink = `${historyKey}${apiKey}&q=${query}&dt=`;

        const pageCheck = {};
        const allEmbedsArr = [];


        /*
        ----------------------------------------------------------------------------------------------------
        Embeds
        ----------------------------------------------------------------------------------------------------
        */
        const gettingData_Embed = new Discord.MessageEmbed();
        gettingData_Embed.setTitle(`${cmndEmoji[0]}${config.tls}${cmndName}`);
        gettingData_Embed.setDescription(`Getting weather data, please wait... ${cmndEmoji[3]}`);
        gettingData_Embed.setColor(`${cmndColour[0]}`);


        /*
        ----------------------------------------------------------------------------------------------------
        Error Handling
        ----------------------------------------------------------------------------------------------------
        */
        const noQueryProvided_Embed = new Discord.MessageEmbed();
        noQueryProvided_Embed.setTitle(`${cmndError}`);
        noQueryProvided_Embed.setColor(`${config.err_hex}`);
        noQueryProvided_Embed.setDescription(`You just forgot to provide me a query. Please provide me either the location name you wanna know details for, or the zipcode of that location.`);
        noQueryProvided_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
        noQueryProvided_Embed.setTimestamp(message.createdTimestamp);
        
        // Possible_Error_1
        if(!query) return message.reply({ embeds: [noQueryProvided_Embed] });


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

            // result += ` >>`;
            return result;
        }


        function getPreviousDates() {
            let currentDate = new Date();

            const msSaveArr = [];
            const dateSaveArr = [];

            for (let i = 1; i < 3; i++) {
                const dateString = `${currentDate.setDate(currentDate.getDate() - i)}`;
                msSaveArr.push(dateString);

                currentDate = new Date();
            }

            msSaveArr.forEach((elem) => {
                const msAsInteger = parseInt(elem);
                const formattedDate = `${moment(msAsInteger).format('YYYY-MM-DD')}`;

                dateSaveArr.push(formattedDate);
            });
            
            return dateSaveArr;
        }


        async function getRawData(option) {
            if(option === `forecast`) {
                const fetchedData = await fetch(forecastLink);
                const res = await fetchedData.json();

                return res;
            } else if(option === `history`) {
                const previousDates = getPreviousDates();
                const finalDataArr = [];

                for (let i = 0; i < previousDates.length; i++) {
                    const element = previousDates[i];
                    const date = element;
                    const fullHistoryLink = `${partialHistoryLink}${date}`;

                    const fetchedData = await fetch(fullHistoryLink);
                    const res = await fetchedData.json();

                    finalDataArr.push(res.forecast.forecastday[0]);
                }

                return finalDataArr.reverse();
            }
        }


        function getRow(id) {
            const paginator_Buttons = new Discord.MessageActionRow();
    
            if (id === `forcedDisabled`) {
                paginator_Buttons.addComponents(
                    new Discord.MessageButton()
                    .setCustomId(`weather_previous`)
                    .setEmoji(`⬅`)
                    .setStyle(`SECONDARY`)
                    .setDisabled(true),
                    
                    new Discord.MessageButton()
                    .setCustomId(`weather_current`)
                    .setLabel(`Current`)
                    .setStyle(`SUCCESS`)
                    .setDisabled(true),
    
                    new Discord.MessageButton()
                    .setCustomId(`weather_following`)
                    .setEmoji(`➡`)
                    .setStyle(`SECONDARY`)
                    .setDisabled(true),

                    new Discord.MessageButton()
                    .setCustomId(`weather_info`)
                    .setEmoji(`❔`)
                    .setStyle(`PRIMARY`)
                    .setDisabled(true)
                );
            } else {
                paginator_Buttons.addComponents(
                    new Discord.MessageButton()
                    .setCustomId(`weather_previous`)
                    .setEmoji(`⬅`)
                    .setStyle(`SECONDARY`)
                    .setDisabled(pageCheck[id] === 0),

                    new Discord.MessageButton()
                    .setCustomId(`weather_current`)
                    .setLabel(`Current`)
                    .setStyle(`SUCCESS`)
                    .setDisabled(pageCheck[id] === 2),

                    new Discord.MessageButton()
                    .setCustomId(`weather_following`)
                    .setEmoji(`➡`)
                    .setStyle(`SECONDARY`)
                    .setDisabled(pageCheck[id] === allEmbedsArr.length - 1),

                    new Discord.MessageButton()
                    .setCustomId(`weather_info`)
                    .setEmoji(`❔`)
                    .setStyle(`PRIMARY`)
                );
            }
    
            return paginator_Buttons;
        }


        function notYouCanDoError(int) {
            const notYouCanDo_Embed = new Discord.MessageEmbed();
            notYouCanDo_Embed.setTitle(`${cmndError}`);
            notYouCanDo_Embed.setColor(`${config.err_hex}`);
            notYouCanDo_Embed.setDescription(`Oh oh!! Sorry ${int.user.tag}, but you cannot do that. Only ${message.author.tag} can use the button.`);

            return int.reply({ embeds: [notYouCanDo_Embed], ephemeral: true });
        }


        /*
        ----------------------------------------------------------------------------------------------------
        Execution
        ----------------------------------------------------------------------------------------------------
        */
        const fetchedData = await fetch(forecastLink);
        const res = await fetchedData.json();


        const notValidQuery_Embed = new Discord.MessageEmbed();
        notValidQuery_Embed.setTitle(`${cmndError}`);
        notValidQuery_Embed.setColor(`${config.err_hex}`);
        notValidQuery_Embed.setDescription(`The query you just gave is not valid as I cannot find any place like that. Please search for a valid location name which exists, or specify the name with more details.`);
        notValidQuery_Embed.setFooter({ text: message.author.username, iconURL: message.author.avatarURL({ dynamic: true }) });
        notValidQuery_Embed.setTimestamp(message.createdTimestamp);

        // Possible_Error_2
        if (res.error) return message.reply({ embeds: [notValidQuery_Embed] });



        // First_Execution ================================================== >>>>>
        message.reply({ embeds: [gettingData_Embed] }).then(async (gettingdataMsg) => {
            const rawForecast = await getRawData(`forecast`);
            const rawHistory = await getRawData(`history`);

            let m_ = cmndMarker;
            let pageNum = 3;


            // For_Previous ================================================== >>>>>
            rawHistory.forEach((resP) => {
                pageNum--;

                const p_date = `${moment(resP.date_epoch * 1000).format('ddd, Do MMM YYYY, h:mm a')}`;
                const p_status = `${resP.day.condition.text}`;
                const p_minTemperature = `${resP.day.mintemp_c} °C | ${resP.day.mintemp_f} °F`;
                const p_maxTemperature = `${resP.day.maxtemp_c} °C | ${resP.day.maxtemp_f} °F`;
                const p_avgTemperature = `${resP.day.avgtemp_c} °C | ${resP.day.avgtemp_f} °F`;
                const p_uvIndex = `${resP.day.uv}`;
                const p_avgHumidity = `${resP.day.avghumidity} %`;
                const p_avgVisibility = `${resP.day.avgvis_km} km | ${resP.day.avgvis_miles} mi`;
                const p_maxWindSpeed = `${resP.day.maxwind_kph} kmph | ${resP.day.maxwind_mph} mph`;
                const p_totalPrecipitation = `${resP.day.totalprecip_in} in | ${resP.day.totalprecip_mm} mm`;

                const p_sunrise = `${resP.astro.sunrise}`;
                const p_sunset = `${resP.astro.sunset}`;
                const p_moonrise = `${resP.astro.moonrise}`;
                const p_moonset = `${resP.astro.moonset}`;
                const p_moonPhase = `${resP.astro.moon_phase}`;
                const p_moonIllumination = `${resP.astro.moon_illumination} %`;
                const p_statusImage = `https:${resP.day.condition.icon}`;


                const previousDaysData_Embed = new Discord.MessageEmbed();
                previousDaysData_Embed.setTitle(`${cmndEmoji[0]}${config.tls}Past Weather Data of :\n${p_date}`);
                previousDaysData_Embed.setDescription(`${m_}**Status :** ${p_status}\n${m_}**Min temperature :** ${p_minTemperature}\n${m_}**Max temperature :** ${p_maxTemperature}\n${m_}**Average temperature :** ${p_avgTemperature}\n${createLine(40)}\n${m_}**UV index :** ${p_uvIndex}\n${m_}**Average humidity :** ${p_avgHumidity}\n${m_}**Average visibility :** ${p_avgVisibility}\n${m_}**Max wind speed :** ${p_maxWindSpeed}\n${m_}**Total precipitation :** ${p_totalPrecipitation}\n${createLine(40)}\n${m_}**Sunrise :** ${p_sunrise}\n${m_}**Sunset :** ${p_sunset}\n${m_}**Moonrise :** ${p_moonrise}\n${m_}**Moonset :** ${p_moonset}\n${m_}**Moon phase :** ${p_moonPhase}\n${m_}**Moon illumination :** ${p_moonIllumination}`);
                previousDaysData_Embed.setColor(`${cmndColour[0]}`);
                previousDaysData_Embed.setThumbnail(p_statusImage);
                previousDaysData_Embed.setFooter({ text: `${message.author.username} | Page : -${pageNum} / 2`, iconURL: message.author.avatarURL({ dynamic: true }) });

                allEmbedsArr.push(previousDaysData_Embed);
            });



            // For_Current ================================================== >>>>>
            const resC = rawForecast;

            const c_temperature = `${resC.current.temp_c} °C | ${resC.current.temp_f} °F`;
            const c_status = `${resC.current.condition.text}`;
            const c_place = `${resC.location.name}, ${resC.location.region}, ${resC.location.country}`;
            const c_latAndLong = `${resC.location.lat} | ${resC.location.lon}`;
            const c_timeZone = `${resC.location.tz_id}`;
            const c_localTime = `${moment((resC.location.localtime_epoch) * 1000).format('ddd, Do MMM YYYY, h:mm a')}`;
            const c_isDayOrNight = resC.current.is_day === 1 ? `Day` : `Night`;

            const c_uvIndex = `${resC.current.uv}`;
            const c_aqi = `${resC.current.air_quality['us-epa-index']}`;
            const c_humidity = `${resC.current.humidity} %`;
            const c_cloudsCover = `${resC.current.cloud} %`;
            const c_visibility = `${resC.current.vis_km} km | ${resC.current.vis_miles} mi`;
            const c_pressure = `${resC.current.pressure_in} in | ${resC.current.pressure_mb} mb`;
            const c_windSpeed = `${resC.current.wind_kph} kmph | ${resC.current.wind_mph} mph`;
            const c_windDirection = `${resC.current.wind_dir}`;
            const c_precipitation = `${resC.current.precip_in} in | ${resC.current.precip_mm} mm`;

            const alertsArr = [];
            resC.alerts.alert.forEach((elem) => {
                if (!elem || !elem.headline) {
                    // Do nothing
                } else {
                    const alert_headline = `${elem.headline}`;
                    const alert_severity = `${elem.severity}`;
                    const alert_areas = `${elem.areas}`;

                    let finalText = `${cmndEmoji[1]} : ${alert_headline}. `;
                    if(elem.areas !== '') finalText += `The alert is for ${alert_areas}. `;
                    if(elem.severity !== '') finalText += `The severity is ${alert_severity}.`;

                    alertsArr.push(finalText);
                }
            });

            const c_alerts = alertsArr.length === 0 ? `*None*` : `${alertsArr.join(`\n`)}`;
            const c_statusImage = `https:${resC.current.condition.icon}`;


            const currentDayData_Embed = new Discord.MessageEmbed();
            currentDayData_Embed.setTitle(`${cmndEmoji[0]}${config.tls}Current Weather`);
            currentDayData_Embed.setDescription(`${m_}**Temperature :** ${c_temperature}\n${m_}**Status :** ${c_status}\n${createLine(40)}\n${m_}**Location :** ${c_place}\n${m_}**Latitude & Longitude :** ${c_latAndLong}\n${m_}**Time zone :** ${c_timeZone}\n${m_}**Local D & T :** ${c_localTime}\n${m_}**Hour cycle :** ${c_isDayOrNight}\n${createLine(40)}\n${m_}**UV Index :** ${c_uvIndex}\n${m_}**Air Quality Index :** ${c_aqi}\n${m_}**Humidity :** ${c_humidity}\n${m_}**Cloud cover :** ${c_cloudsCover}\n${m_}**Visibility :** ${c_visibility}\n${m_}**Pressure :** ${c_pressure}\n${m_}**Wind speed :** ${c_windSpeed}\n${m_}**Wind direction :** ${c_windDirection}\n${m_}**Precipitation :** ${c_precipitation}`);
            currentDayData_Embed.addFields({
                name: `ALERTS  ${createLine(40)} >>`,
                value: `${c_alerts}`,
                inline: false
            });
            currentDayData_Embed.setColor(`${cmndColour[0]}`);
            currentDayData_Embed.setThumbnail(c_statusImage);
            currentDayData_Embed.setFooter({ text: `${message.author.username} | Page : 0 / 2`, iconURL: message.author.avatarURL({ dynamic: true }) });

            allEmbedsArr.push(currentDayData_Embed);



            // For_Following ================================================== >>>>>
            const forecastArr = (rawForecast.forecast.forecastday).slice(1);
            pageNum = 0;

            forecastArr.forEach((resF) => {
                pageNum++;

                const f_date = `${moment(resF.date_epoch * 1000).format('ddd, Do MMM YYYY, h:mm a')}`;
                const f_status = `${resF.day.condition.text}`;
                const f_minTemperature = `${resF.day.mintemp_c} °C | ${resF.day.mintemp_f} °F`;
                const f_maxTemperature = `${resF.day.maxtemp_c} °C | ${resF.day.maxtemp_f} °F`;
                const f_avgTemperature = `${resF.day.avgtemp_c} °C | ${resF.day.avgtemp_f} °F`;
                const f_uvIndex = `${resF.day.uv}`;
                const f_avgHumidity = `${resF.day.avghumidity} %`;
                const f_avgVisibility = `${resF.day.avgvis_km} km | ${resF.day.avgvis_miles} mi`;
                const f_maxWindSpeed = `${resF.day.maxwind_kph} kmph | ${resF.day.maxwind_mph} mph`;
                const f_totalPrecipitation = `${resF.day.totalprecip_in} in | ${resF.day.totalprecip_mm} mm`;

                const f_sunrise = `${resF.astro.sunrise}`;
                const f_sunset = `${resF.astro.sunset}`;
                const f_moonrise = `${resF.astro.moonrise}`;
                const f_moonset = `${resF.astro.moonset}`;
                const f_moonPhase = `${resF.astro.moon_phase}`;
                const f_moonIllumination = `${resF.astro.moon_illumination} %`;
                const f_statusImage = `https:${resF.day.condition.icon}`;


                const followingDaysData_Embed = new Discord.MessageEmbed();
                followingDaysData_Embed.setTitle(`${cmndEmoji[0]}${config.tls}Future Weather Data for :\n${f_date}`);
                followingDaysData_Embed.setDescription(`${m_}**Status :** ${f_status}\n${m_}**Min temperature :** ${f_minTemperature}\n${m_}**Max temperature :** ${f_maxTemperature}\n${m_}**Average temperature :** ${f_avgTemperature}\n${createLine(40)}\n${m_}**UV index :** ${f_uvIndex}\n${m_}**Average humidity :** ${f_avgHumidity}\n${m_}**Average visibility :** ${f_avgVisibility}\n${m_}**Max wind speed :** ${f_maxWindSpeed}\n${m_}**Total precipitation :** ${f_totalPrecipitation}\n${createLine(40)}\n${m_}**Sunrise :** ${f_sunrise}\n${m_}**Sunset :** ${f_sunset}\n${m_}**Moonrise :** ${f_moonrise}\n${m_}**Moonset :** ${f_moonset}\n${m_}**Moon phase :** ${f_moonPhase}\n${m_}**Moon illumination :** ${f_moonIllumination}`);
                followingDaysData_Embed.setColor(`${cmndColour[0]}`);
                followingDaysData_Embed.setThumbnail(f_statusImage);
                followingDaysData_Embed.setFooter({ text: `${message.author.username} | Page : ${pageNum} / 2`, iconURL: message.author.avatarURL({ dynamic: true }) });

                allEmbedsArr.push(followingDaysData_Embed);
            });



            // Final_Execution ================================================== >>>>>
            const id = `Page number`;
            pageCheck[id] = pageCheck[id] || 2;


            gettingdataMsg.edit({ embeds: [allEmbedsArr[pageCheck[id]]], components: [getRow(id)] }).then(() => {
                const paginator_Collector = message.channel.createMessageComponentCollector({ time: 1000 * 60 });

                paginator_Collector.on(`collect`, async (interaction) => {
                    if (interaction.customId === `weather_previous`) {
                        // Possible_Error_3
                        if (interaction.user.id !== message.author.id) return notYouCanDoError(interaction);

                        interaction.deferUpdate();

                        --pageCheck[id];
                        gettingdataMsg.edit({ embeds: [allEmbedsArr[pageCheck[id]]], components: [getRow(id)] });
                    }

                    if (interaction.customId === `weather_current`) {
                        // Possible_Error_3
                        if (interaction.user.id !== message.author.id) return notYouCanDoError(interaction);

                        interaction.deferUpdate();

                        pageCheck[id] = 2;
                        gettingdataMsg.edit({ embeds: [allEmbedsArr[2]], components: [getRow(id)] });
                    }

                    if (interaction.customId === `weather_following`) {
                        // Possible_Error_3
                        if (interaction.user.id !== message.author.id) return notYouCanDoError(interaction);
                        
                        interaction.deferUpdate();

                        ++pageCheck[id];
                        gettingdataMsg.edit({ embeds: [allEmbedsArr[pageCheck[id]]], components: [getRow(id)] });
                    }

                    if (interaction.customId === `weather_info`) {
                        const marker = `👉 `;
                        const blankSpace = `${config.invChar}`;

                        const info_Embed = new Discord.MessageEmbed();
                        info_Embed.setTitle(`${cmndEmoji[2]}${config.tls}Miscellaneous Info`);
                        info_Embed.setDescription(`${marker} The "\`|\`" sign, anywhere in between values is a notable seperation between values of two different units, except in values of Latitude & Longitude.\n${marker} The "**Local D & T**" parameter refers to the local date and time of the location you searched for.\n${marker} The UV Index, or Ultra-Violet Index, is a measurement of the strength of sunburn, producing UV radiation at a particular place and time. Given below is the risk according to the values of UV Index.\n${blankSpace}0 - 2 is **LOW**\n${blankSpace}3 - 5 is **MODERATE**\n${blankSpace}6 - 7 is **HIGH**\n${blankSpace}8 - 10 is **VERY HIGH**\n${blankSpace}11+ is **EXTREME**\n${marker} AQI, or Air Quality Index is way of measuring how polluted a city or a given location is. Different countries use their own method for calculating AQI. To display a specific data in short which already contain variations, it's a good idea to go with one single unit and that's why values of AQI here are displayed according to USA's EPA (Environmental Protection Agency). Given below is the level for health concern, according to the values of AQI.\n${blankSpace}1 is **GOOD**\n${blankSpace}2 is **MODERATE**\n${blankSpace}3 is **UNHEALTHY FOR SENSITIVE GROUPS**\n${blankSpace}4 is **UNHEALTHY**\n${blankSpace}5 is **VERY UNHEALTHY**\n${blankSpace}6 is **HAZARDOUS**\n${marker} The "**Cloud cover**" parameter refers to the amount of clouds over that region in percent.\n${marker} The "**Wind direction**" parameter shows the direction of Wind. The values of this parameter shows directions according to the 16-Point Compass. Get more details [here](https://en.m.wikipedia.org/wiki/Points_of_the_compass).\n${marker} To get more details on Moon Phases, visit [here](https://en.m.wikipedia.org/wiki/Lunar_phase).`);
                        info_Embed.setColor(`${cmndColour[0]}`);

                        interaction.reply({ embeds: [info_Embed], ephemeral: true });
                    }
                });

                paginator_Collector.on(`end`, async () => {
                    return gettingdataMsg.edit({ embeds: [allEmbedsArr[pageCheck[id]]], components: [getRow(`forcedDisabled`)] });
                });
            });
        });
    }
});