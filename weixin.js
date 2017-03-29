/**
 * Created by 75339 on 2017/3/29.
 */
exports.reply=function*(next){
   var message=this.weixin;
    if(message.MsgType==='event'){
        if(message.Event==='subscribe'){
            if(message.EventKey){
                console.log('扫二维码进来'+message.EventKey+''+message.ticket)
            }
            this.body='哈哈，您订阅了这个号'
        }
        else if(message.Event==='unsubscribe'){
            console.log('取消了关注');
            this.body=''
        }
    }else{

    }
    yield next
};