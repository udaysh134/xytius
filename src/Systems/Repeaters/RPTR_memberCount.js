const config = require("../../Data/config.json");
const aubdycad = require("../../Data/aubdycad.json");


module.exports = async (client, freq) => {
    const Aubdycad_Server = client.guilds.cache.get(`${config.Aubdycad_ID}`);
    const MemberCounts_VChnl = Aubdycad_Server.channels.cache.get(`${aubdycad.MemberCounts_VC_ID}`);

    const totalMembers = Aubdycad_Server.memberCount;

    setInterval(() => {
        MemberCounts_VChnl.setName(`Members : ${totalMembers}`).then(() => {
            console.log(`👥 • Updated Members Count : ${totalMembers}`)
        });
    }, freq);
}