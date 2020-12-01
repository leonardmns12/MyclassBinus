const botconfig = require("discord.js");
exports.run = (bot , msg ,args ,Data) => {
    const embed = new botconfig.MessageEmbed().setColor("#29A9DF")
    .setTitle("Command!")
    .setDescription("List of bot command!")
    .addField("!login <username> <password>" , "to fetch all of your classes based by myclass.binus.ac.id")
    .addField("!remove <classIndex>" , "to remove class by index")
    .addField("!myclass" , "to view all of your classes!")
    .addField("!invitelink" , "to invite this bot to other server!")
    .setTimestamp()
    .setFooter('https://github.com/leonardmns12/MyclassBinus' , 'https://sdtimes.com/wp-content/uploads/2018/06/GitHub-Mark.png');
    msg.reply(embed)
} 