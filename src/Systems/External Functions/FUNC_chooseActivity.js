const Discord = require("discord.js");


module.exports = (client) => {
    /*
    ----------------------------------------------------------------------------------------------------
    Start
    ----------------------------------------------------------------------------------------------------
    */
    const totalServers = client.guilds.cache.size;
    const totalMembers = client.guilds.cache.reduce((a, b) => a + b.memberCount, 0);
    const activityType = Discord.ActivityType;

    const competing = [
        `PUBG with my AI friend`,
        `an arena with virtual Hercules`,
        `Sri Chinmoy Self-Transcendence 3100 mile race`,
        `The World of human being with 8 billion others`,
        `"The Top 10 Most Ridiculous Bots" rank with 9 others`,
        `the hollow structured mindset of the Society`,
        `IGT for the Finals`,
        `an unfair match of getting abs. I'm a bot!!`,
        `over land in Metaverse`
    ];

    const listening = [
        `Lil Nas X - MONTERO`,
        `the most boring podcast in the world`,
        `the Lofi Girl's music`,
        `the noises you make while having shower`,
        `every single gossip you did 2.7 days ago`,
        `Rick Astley's "Never Gonna Give You Up"`,
        `old Santa-Banta jokes from Google Assistant`,
        `what you're listening`
    ];

    const playing = [
        `Jenga from Lego`,
        `with the feelings of myself`,
        `with fire. Blinks know this!!`,
        `an uncensored game, made for only bots in Bots Universe`,
        `one last classic match in PUBG`,
        `with baby Mike Tyson. Got a dark circle around my eyes`,
        `not with my health`,
        `Chinese version of Minecraft`
    ];

    const watching = [
        `my total users : ${totalMembers}`,
        `all of my total servers : ${totalServers}`,
        `you and your activities`,
        `my own avatar, looks pretty. Isn't it?`,
        `squid games with my bot friends`,
        `running codes in front of my eyes`,
        `joined and left members`,
        `you, yes YOU. Yeah!! Exactly you`,
        `Peaky Blinders while having "codes" as popcorn`,
        `struggles of people in their lives`,
        `Zuckerberg having lunch in his Metaverse`,
        `cute tadpoles having swimming class`,
        `transformers fighting in my street`,
        `Thanos snapping once again`,
        `All of us are Dead, Season-2`,
        `people consuming more cringier content`,
        `Will Smith slapping me in my dream`
    ];


    /*
    ----------------------------------------------------------------------------------------------------
    Functions
    ----------------------------------------------------------------------------------------------------
    */
    function giveRandomItem(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }


    /*
    ----------------------------------------------------------------------------------------------------
    Execution
    ----------------------------------------------------------------------------------------------------
    */
    const allActivities = [`competing`, `listening`, `playing`, `watching`];
    const randomActivity = giveRandomItem(allActivities);

    let randomActivityName;
    let randomActivityType;

    
    switch (randomActivity) {
        case `competing`:
            randomActivityName = giveRandomItem(competing);
            randomActivityType = activityType.Competing;
            break;
        case `listening`:
            randomActivityName = giveRandomItem(listening);
            randomActivityType = activityType.Listening;
            break;
        case `playing`:
            randomActivityName = giveRandomItem(playing);
            randomActivityType = activityType.Playing;
            break;
        case `watching`:
            randomActivityName = giveRandomItem(watching);
            randomActivityType = activityType.Watching;
            break;
    }


    return {
        "name": randomActivityName,
        "type": randomActivityType
    };
}