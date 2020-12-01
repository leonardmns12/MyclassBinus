const botconfig = require("discord.js");
exports.run = (bot , msg ,args , Data) => {
    async function ping() {
        const ping = require('ping');
        let res = await ping.promise.probe("185.223.31.163");
        const embed = new botconfig.MessageEmbed()
        .setColor("#29A9DF")
        .setTitle("Bot information")
        .setDescription("Current version 2.0.1")
        .addField("Server Region" , "vServer #117550 (Germany/Europe)")
        .addField("Database Cluster" , "AWS Singapore (ap-southeast-1)")
        .addField("Database version" , "4.2.10")
        .addField("Server ping" , res.time + " ms")
        .setTimestamp()
        .setFooter('https://github.com/leonardmns12/MyclassBinus' , 'https://sdtimes.com/wp-content/uploads/2018/06/GitHub-Mark.png');
        msg.reply(embed)
    }
    ping();
}