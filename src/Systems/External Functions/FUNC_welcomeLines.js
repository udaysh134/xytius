module.exports = () => {
    const welcomeLines = [
        `Hope you liked our welcoming style.`,
        `Hope you liked our way of Welcoming you.`,
        `Hope you came well here.`,
        `Hope you had a nice experience.`,
        `Hope the people here, treated you well.`,
        `Hope you're having a nice day.`,
        `Hope you like this...`,
        `Hope you notice details.`,
        `Hope you're doing well today. Please proceed.`,
        `Hope you read rules.`,
        `Hope you went through the channels.`,
        `Hope we would be good friends.`,
        `Hope we didn't disappointed you.`,
        `Hope you'll love this server.`,
        `Hope you'll like this small community.`,
        `Hope you liked your picture below there...`,
        `Hope you'll coordinate with everyone.`,
        `Hope we'll be able to help you in any way.`,
        `Hope we'll provide you better than what you imagined.`,
        `Hope you'll do great with us, in this server.`,
        `Hope verification process didn't took long.`,
        `Hope you liked bot's mechanism.`
    ];

    const randWelcomeLine = welcomeLines[Math.floor(Math.random() * welcomeLines.length)];
    return randWelcomeLine;
}