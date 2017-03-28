/**
 * Created by 75339 on 2017/3/24.
 */
var sha1=require('sha1');
var Wechat=require('./wechat.js');
var util=require('./util.js');
var getRawBody=require('raw-body');
module.exports=function(opts){
    //var wechat=new Wechat(opts);
    return function *(next){
        var token=opts.Token;
        var signature=this.query.signature;
        var nonce=this.query.nonce;
        var timestamp=this.query.timestamp;
        var echostr=this.query.echostr;
        var that=this;
        var str=[token,timestamp,nonce].sort().join("");
        var sha=sha1(str);
        if(this.method==='GET'){
            if(sha===signature){
                this.body=echostr+"";
            }else{
                this.body="error"
            }
        }else if(this.method==='POST'){
            if(sha!==signature){
                this.body="error"
            return false;
            }
            var data=yield getRawBody(this.req,{
                length:this.length,
                limit:'1mb',
                encoding:this.charset
            });
            var content=yield util.parseXMLAsync(data);

            var message=util.formatMessage(content.xml);
           console.log(message)
             if(message.MsgType=='event'){
                if(message.Event=='subscribe'){
                    var now=new Date().getTime();
                    that.status=200;
                    that.type='application/xml';
                    var reply='<xml>'+
                        '<ToUserName><![CDATA['+message.FromUserName+']]></ToUserName>'+
                        '<FromUserName><![CDATA['+message.ToUserName+']]></FromUserName>'+
                        '<CreateTime>'+now+'</CreateTime>'+
                        '<MsgType><![CDATA[text]]></MsgType>'+
                        '<Content><![CDATA[我是你的偶像，李钰]]></Content>'+
                        '</xml>';
                    console.log(reply)
                    that.body=reply;
                    return
                }
            }else if(message.MsgType=='text'){

                     var now=new Date().getTime();
                     that.status=200;
                     that.type='application/xml';
                     var reply='<xml>'+
                         '<ToUserName><![CDATA['+message.FromUserName+']]></ToUserName>'+
                         '<FromUserName><![CDATA['+message.ToUserName+']]></FromUserName>'+
                         '<CreateTime>'+now+'</CreateTime>'+
                         '<MsgType><![CDATA[text]]></MsgType>'+
                         '<Content><![CDATA[我给你说个锤子]]></Content>'+
                         '</xml>';
                     console.log(reply)
                     that.body=reply;
                     return

             }
        }

    };
};