const botconfig = require("discord.js");
exports.run = (bot , msg ,args , Data) => {
    const embed = new botconfig.MessageEmbed()
    .setColor("#29A9DF")
    .setTitle("Data Privacy")   
    .setDescription("This bot is NOT storing any personal information about your binusmaya account (Username/password, etc) except list of class , This bot is open source and feel free to contributing with pull request in the link below. You can access the source code of this bot in this link https://github.com/leonardmns12/MyclassBinus")
    .setTimestamp()
    .setFooter('https://github.com/leonardmns12/MyclassBinus' , 'https://sdtimes.com/wp-content/uploads/2018/06/GitHub-Mark.png');
    msg.reply(embed)
}