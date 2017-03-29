/**
 * Created by 75339 on 2017/3/29.
 */
var path=require('path');
var util=require('./libs/util')
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
module.exports=config;