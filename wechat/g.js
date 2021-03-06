/**
 * Created by 75339 on 2017/3/24.
 */
var sha1=require('sha1');
var getRawBody=require('raw-body');
var Wechat=require('./wechat.js');
var util=require('./util.js');

module.exports=function(opts,handler){
    var wechat=new Wechat(opts);

    return function*(next){
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
            this.weixin=message;

            yield handler.call(this,next);
            wechat.reply.call(this);
        }

    };
};