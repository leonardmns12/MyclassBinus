const botconfig = require("discord.js");
exports.run = (bot , msg, args , Data) => {
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
}