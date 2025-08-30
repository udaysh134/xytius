const keys = require("../../Data/keys.json");
const config = require("../../Data/config.json");

const fetch = require("node-fetch");


/**
 * 
 * @param {String} subReddit
 * @param {Boolean} anyFlagOrNot
 * @param {String} flag
 */
module.exports  = async (subReddit, anyFlagOrNot, flag) => {
    /*
    ----------------------------------------------------------------------------------------------------
    Start
    ----------------------------------------------------------------------------------------------------
    */
    const starterLink = keys.reddit.link;


    /*
    ----------------------------------------------------------------------------------------------------
    Functions
    ----------------------------------------------------------------------------------------------------
    */
    async function fetchLink(link) {
        const result = await fetch(`${link}`).then((res) => res.json());
        const resultArray = result.data.children;
        const randomPostObj = resultArray[Math.floor(Math.random() * resultArray.length)];


        if(randomPostObj.data.url !== `` && (randomPostObj.data.url).startsWith(`https://i.redd.it`)) {
            return getFinalObject(randomPostObj.data);
        } 
        else {
            for (let i = 0; i < resultArray.length; i++) {
                const elem = resultArray[i];

                if (elem.data.url !== `` && (elem.data.url).startsWith(`https://i.redd.it`)) {
                    return getFinalObject(elem.data);
                }
            }
        }
    }

    
    function getFinalObject(dataObj) {
        const d = dataObj;

        const subreddit = d.subreddit === `` ? `Unknown` : `${d.subreddit}`;
        const title = d.title === `` ? `${config.invChar}` : `${d.title}`;
        const upvotes = d.ups;
        const downvotes = d.downs;
        const author = d.author === `` ? `Unknown` : `${d.author}`;
        const image = d.url;

        return {
            "Page": subreddit,
            "Title": title,
            "Image": image,
            "Upvotes": upvotes,
            "Downvotes": downvotes,
            "Author": author,
        }
    }


    /*
    ----------------------------------------------------------------------------------------------------
    Execution
    ----------------------------------------------------------------------------------------------------
    */
    if(anyFlagOrNot === false) {
        const link = `${starterLink}${subReddit}.json?limit=500`;
        return await fetchLink(link);
    } else {
        const link = `${starterLink}${subReddit}/${flag}.json?limit=500`;
        return await fetchLink(link);
    }
};