const botconfig = require("discord.js");
const bot = new botconfig.Client();
const {prefix , token , mongoPass , authUrl , viconUrl , url } = require('./config.json');
const mongoose = require('mongoose');
//Connect to mongo
mongoose.connect(mongoPass , {
    useNewUrlParser : true,
    useUnifiedTopology : true
})
const Data = require("./models/data.js");
bot.on("ready", () => {

    async function execute() {
        while (true) {
          await new Promise(resolve => setTimeout(resolve, 10000));
          var now = new Date().getTime();
          const data = await Data.find({} , async function(err , datas){
              for(let i = 0; i < datas.length; i++) {
                  for(let j = 0; j < datas[i].data.length; j++) {
                      const time = Date.parse(datas[i].data[j].DisplayStartDate + " " +datas[i].data[j].StartTime);
                      if(now >= time) {
                          const embed = new botconfig.MessageEmbed()
                          .setColor('#29A9DF')
                          .setTitle('Hello, ' + datas[i].data[j].FullName)
                          .setDescription("You have class  " + datas[i].data[j].CourseTitleEn + " at " + datas[i].data[j].StartTime)
                          .addField("Link " , datas[i].data[j].MeetingUrl)
                          .addField("Class Code" , datas[i].data[j].ClassCode )
                          .setTimestamp()
                          .setFooter('https://github.com/leonardmns12/MyclassBinus' , 'https://sdtimes.com/wp-content/uploads/2018/06/GitHub-Mark.png');
                          const arr = datas[i].data;
                          const temp = arr.splice(j,1);
                          await saveData(datas[i].userId , arr , embed); 
                      }
                  }
              }
          }) 
        }
      }
      execute();
});

saveData = async (userid , newArray , embed) => {
     return new Promise((resolve,reject) => {
        Data.findOne({userId : userid}, async (err,data) => {
            if(data) {
                data.data = null;
                data.data = newArray;
                bot.users.fetch(userid).then(async (user) => {
                    user.send(embed)
                })  
                data.save().then(()=>resolve(true)).catch(err => {console.log(err),reject(false)});
            }
        })
    })
}

bot.on("message" , msg => {
    if(msg.content.startsWith(prefix)) {
        let args = msg.content.substring(prefix.length).split(" ");
        let cmd = args.shift().toLowerCase();
        try{
             delete require.cache[require.resolve(`./commands/${cmd}.js`)];
             let commandFile = require(`./commands/${cmd}.js`);
             commandFile.run(bot, msg, args ,Data);
          }catch (e) {
              console.log(e.stack);
              msg.reply("Command not found, type !help to view all command.");
          }
    } else {
        if(msg.channel.type == "dm" && msg.author.id != "783285037663518750"){
            msg.reply("Hey , type !help to view all available command!");
        }
    }
})

bot.login(token);