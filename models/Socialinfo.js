const mongoose = require('mongoose');

const SocialinfoSchema = new mongoose.Schema({
    user_id:{
        type:String,
        required:true
    },
    longLivedToken:{
        type:String,
        required:true
    },
    page_id:{
        type:String,
        required:true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const Socialinfo = mongoose.model('Socialinfo', SocialinfoSchema);

module.exports = Socialinfo;
