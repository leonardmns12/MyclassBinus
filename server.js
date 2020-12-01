const botconfig = require("discord.js");
const bot = new botconfig.Client();
const {prefix , token , mongoPass , authUrl , viconUrl , url } = require('./config.json');
const request = require('request-promise').defaults({ jar:true });
const mongoose = require('mongoose');

//Connect to mongo
mongoose.connect(mongoPass , {
    useNewUrlParser : true,
    useUnifiedTopology : true
})

const Data = require("./models/data.js");

bot.on("ready", () => {
    setInterval(() => {
        var now = new Date().getTime();
        const data = Data.find({} , function(err , datas){
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
                        bot.users.fetch(datas[i].userId).then((user) => {
                            user.send(embed)
                        })
                        saveData(datas[i].userId , arr);
                    }
                }
            }
        }) 
    }, 5000);
});

saveData = (userid , newArray) => {
    Data.findOne({userId : userid}, (err,data) => {
        if(data) {
            data.data = null;
            data.data = newArray;
            data.save().catch(err => console.log(err));
        }
    })
}

bot.on("message" , msg => {
    if(msg.content.startsWith(prefix)) {
        let args = msg.content.substring(prefix.length).split(" ");
        let cmd = args.shift().toLowerCase();
        const date = args.slice(2).join(" ");
        if (cmd === "clearmsg") {
                async function clear() {
                msg.delete();
                const fetched = await msg.channel.messages.fetch({limit:99});
                msg.channel.bulkDelete(fetched);    
            }
            clear();
        } else if (cmd === "myclass"){
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
        } else if (cmd === "remove") {
            const data = Data.findOne({
                userId : msg.author.id
            }, (err, data) => {
                if (data) {
                    var arr = data.data;
                    const index = parseInt(args[0]);
                    if(index == '' + parseInt(args[0])){
                       if(index > arr.length || index == 0 || args[0].startsWith("-")){
                           msg.reply("Data not found!");
                       }else{
                           msg.reply("Success remove class " + arr[index-1].CourseTitleEn);
                           const temp = arr.splice(index-1, 1);
                           console.log(arr[0])
                           data.data = null;
                           data.data = arr;
                           data.save().catch(err => console.log(err));
                       }
                    } else {
                        msg.reply("Arguments must be number!");
                    }
                }
            })
        } else if(cmd === "login") {
            if(msg.channel.type == "dm"){
                const username = args[0].split("@binus.ac.id");
                const password = args[1];
                getData(username , password , msg);
            } else {
                msg.reply("For security reason , you can only !login in DM")
            }
           
        } else if (cmd === "ping") {
            async function ping() {
                const ping = require('ping');
                let res = await ping.promise.probe("185.223.31.163");
                console.log(res);
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
        } else if (cmd === "help") {
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
        } else if (cmd === "invitelink") {
            const embed = new botconfig.MessageEmbed()
            .setColor("#29A9DF")
            .setTitle("Invite Link")
            .setDescription("to invite this bot to your server please use this link https://discord.com/oauth2/authorize?client_id=780629640443985942&scope=bot&permissions=0 thank you.")
            .setTimestamp()
            msg.reply(embed)
        } else if (cmd === "privacy"){
            const embed = new botconfig.MessageEmbed()
            .setColor("#29A9DF")
            .setTitle("Data Privacy")   
            .setDescription("This bot is NOT storing any personal information about your binusmaya account (Username/password, etc) except list of class , This bot is open source and feel free to contributing with pull request in the link below. You can access the source code of this bot in this link https://github.com/leonardmns12/MyclassBinus")
            .setTimestamp()
            .setFooter('https://github.com/leonardmns12/MyclassBinus' , 'https://sdtimes.com/wp-content/uploads/2018/06/GitHub-Mark.png');
            msg.reply(embed)
        }
        else {
            msg.reply("Command not found!");
        }
    } else {
        if(msg.channel.type == "dm" && msg.author.id != "780629640443985942"){
            msg.reply("Hey , type !help to view all available command!");
        }
    }
})
async function getData(username , password , msg) {
    msg.reply("Authentication to server please wait...")
    const result = await request.get(url);
    const loginResult = await request.post(authUrl, {
        form : {
            username : username[0],
            password : password
        }
    });
    const logres = JSON.parse(loginResult);
    if(!logres.Status) {
        msg.reply("Username or password invalid!")
    } else {
        msg.reply("Login success!");
        const classes = await request.get(viconUrl);
        const data1 = JSON.parse(classes);
        Data.findOne({
            userId : msg.author.id
        }, (err, data) => {
            if(!data) {
                const newData = new Data({
                    userId : msg.author.id,
                    data : data1
                })
                newData.save().catch(err => console.log(err));
            }else {
                data.data = data1;
                data.save().catch(err => console.log(err));
            }
        })
    }
}

bot.login(token);