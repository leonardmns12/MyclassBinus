const mongoose = require('mongoose');


const dataSchema = mongoose.Schema({
    userId : String,
    data : Object
})

module.exports = mongoose.model("Data" , dataSchema);