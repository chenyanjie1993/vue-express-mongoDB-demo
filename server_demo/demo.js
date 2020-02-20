let user=require('./user.js.js');
let http=require('http');
let url=require("url");
let util=require("util");
let fs=require('fs');
console.log(`user:${user.sayHello()}`);
http.createServer((req,res,next)=>{
    // res.statusCode=200;
    let name=url.parse(req.url).pathname.replace('/','')
    console.log(name)
    fs.readFile(name,(err,data)=>{
        if(err){
            res.writeHead(404,{})
        }else{
            res.writeHead(200,{})
            res.write(data.toString())
        }
        res.end()
    })
    // res.end(util.inspect(url.parse(req.url)))
    
}).listen(3000,"127.0.0.1",()=>{
    console.log("服务器已启动，请打开浏览器，输入：http://127.0.0.1:3000")
})