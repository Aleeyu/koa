/**
 * Created by 75339 on 2017/3/24.
 */
var koa = require('koa');
var wechat=require('./wechat/g.js');
var util=require('./libs/util.js');
var path=require('path');
var wechat_file=path.join(__dirname,'./config/wechat.txt');
var config={
    "wechat":{
        "appID":"wx9caca6dc906d827f",
        "appsecret":"9cc66be119ba9a9bde98b4ba58eb0b97",
        "Token":"carp",
        getAccessToken:function(){
            return util.readFileAsync(wechat_file)
        },
        saveAccessToken:function(data){
            data=JSON.stringify(data);
            return util.writeFileAsync(wechat_file,data)
        }
    }
};
var app = new koa();
app.use(wechat(config.wechat));
app.listen(3000);