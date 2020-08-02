const express = require("express");
const router = express.Router();
const {FB, FacebookApiException} = require('fb');
FB.options({version: 'v2.4'});
var smpms = FB.extend({appId: '316784649460989', appSecret: '663b4fa02a714741773b51504dd06f20'});


router.get('/',(req,res)=>{
    FB.setAccessToken('EAAEgHSyAXP0BAEQBv3mBTs4RyZASwI1ku9kwtfRnajoZAWQX1OlWR5FbeDvrPrMYx12OIN0Tc1ruyZC8hN0P1ZC3vtH9MPz2HNLEjVuxhr2pNSU3MzpHVoXJ7LpReJtUJVc5RYz3DRkzm7DEOZC5RfQtvKKPO69tZCnPiEHYwD1vpUjRzqIbAWX4KX9yZAYJZBduA50y65jlZBi8ZAhD9X5xIl');
    var body = 'My 2nd post using facebook-node-sdk';
    FB.api('me/feed', 'post', { message: body }, function (res) {
        if(!res || res.error) {
            console.log(!res ? 'error occurred' : res.error);
            return;
        }
        console.log('Post Id: ' + res.id);
    });
})


module.exports= router;
