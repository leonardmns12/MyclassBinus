const botconfig = require("discord.js");
exports.run = (bot , msg , args , Data) => {
    const data = Data.findOne({
        userId : msg.author.id
    }, (err,data) => {
        if(!data) {
            msg.reply("You don't have any class yet, please login!")
        } else {
            const classes = data.data;
            const embed = new botconfig.MessageEmbed()
            .setColor('#29A9DF')
            .setTitle('Class')
            .setDescription("This is list of all your classes!")
            .setTimestamp()
            .setFooter('https://github.com/leonardmns12/MyclassBinus' , 'https://sdtimes.com/wp-content/uploads/2018/06/GitHub-Mark.png');
            for(let i = 0; i < classes.length; i++) {
                var meetingUrl = classes[i].MeetingUrl;
                if(meetingUrl == "-") {
                    meetingUrl = "GSLC"
                }
                embed.addFields(
                    {
                        name : (i+1) + ". " + classes[i].CourseTitleEn + " (" + classes[i].DisplayStartDate +")",
                        value : meetingUrl + " (" + classes[i].StartTime + " - " + classes[i].EndTime + ")",
                        inline : true,
                    }
                )
            }
            msg.reply(embed);
        }
    })
}