/**
 * Created by 75339 on 2017/3/24.
 */
var koa = require('koa');
var path=require('path');
var wechat=require('./wechat/g.js');
var util=require('./libs/util.js');
var config=require('./config');
var weixin=require('./weixin');
console.log(weixin)
var wechat_file=path.join(__dirname,'./config/wechat.txt');




var app = new koa();
app.use(wechat(config.wechat,weixin.reply));
app.listen(3000);