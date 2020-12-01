const request = require('request-promise').defaults({ jar:true });
const {authUrl , viconUrl , url } = require('../config.json');

exports.run = (bot , msg , args , Data) => {
    if(msg.channel.type == "dm"){
        const username = args[0].split("@binus.ac.id");
        const password = args[1];
        getData(username , password , msg);
    } else {
        msg.reply("For security reason , you can only !login in DM")
    }

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
                    console.log("masuk")
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
}