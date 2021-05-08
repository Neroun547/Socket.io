const { Schema, model } = require('mongoose');

const message = new Schema({
    message:{
        type:String
    }
})

module.exports = model('message', message, 'message');