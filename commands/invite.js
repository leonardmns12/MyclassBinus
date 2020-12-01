const botconfig = require("discord.js");
exports.run = (bot , msg ,args , Data) => {
    const embed = new botconfig.MessageEmbed()
    .setColor("#29A9DF")
    .setTitle("Invite Link")
    .setDescription("to invite this bot to your server please use this link https://discord.com/oauth2/authorize?client_id=780629640443985942&scope=bot&permissions=0 thank you.")
    .setTimestamp()
    msg.reply(embed)
}