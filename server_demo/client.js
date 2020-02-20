var http=require("http");
http.get('http://www.cqzk.com.cn/',(res)=>{
    let data='';
    res.on('data',(chunk)=>{
        data+=chunk
    })
    res.on("end",()=>{
        console.log(data)
    })
})