/**
 * Created by 75339 on 2017/3/28.
 */
var Promise=require('bluebird');
var request=Promise.promisify(require('request'));
var util=require('./util');
var prefix='https://api.weixin.qq.com/cgi-bin/';
var api={
    accessToken:prefix+'token?grant_type=client_credential'
};
function Wechat(opts){
    var that=this;
    this.appID=opts.appID;
    this.appSecret=opts.appsecret;
    this.getAccessToken=opts.getAccessToken;
    this.saveAccessToken=opts.saveAccessToken;
    this.getAccessToken()
        .then(function(data){
            try{
                data=JSON.parse(data);
            }
            catch(e){
                return that.updateAccessToken(data);
            }
            if(that.isValidAccessToken(data)){
                return Promise.resolve(data);
            }else{
                return that.updateAccessToken();
            }
        })
        .then(function(data){
            that.access_token=data.access_token;
            that.expires_in=data.expires_in;
            that.saveAccessToken(data);
        })

};
Wechat.prototype.isValidAccessToken=function(data){
    if(!data || !data.access_token || !data.expires_in){
        return false;
    }
    var access_token=data.access_token;
    var expires_in=data.expires_in;
    var now=(new Date().getTime());
    if(now<expires_in){
        return true
    }else{
        return false;
    }
};
Wechat.prototype.updateAccessToken=function(data){
    var appID=this.appID;
    var appsecret=this.appSecret;
    var url=api.accessToken+'&appid='+appID+'&secret='+appsecret;
    return new Promise(function(resolve,reject){
        request({url:url,json:true}).then(function(response){

            var data=response.body;
            var now=(new Date().getTime());
            var expires_in=now+(data.expires_in-20)*1000;
            data.expires_in=expires_in;
            resolve(data);
        })
    });

};
Wechat.prototype.reply=function(){

var content=this.body;
    var message=this.weixin;
    var xml=util.tpl(content,message);
    this.status=200;
    this.type='application/xml'
    this.body=xml;
};
module.exports=Wechat;