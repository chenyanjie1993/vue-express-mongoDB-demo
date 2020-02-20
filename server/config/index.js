let serverConfig=require("./config.js");
var mongoose=require("mongoose");
mongoose.connect(serverConfig.url,serverConfig.options,(err)=>{
    if(err){
        console.log('MongoDB连接失败')
        sendAsk(true)
    }else{
        console.log('MongoDB连接成功')
        sendAsk()
    }
});

function sendAsk(isErr=false,callback){
    callback(isErr)
}
module.export=sendAsk