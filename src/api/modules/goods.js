import http from "../axios";
export default {
    getGoods(params={}){
        // return new Promise((resolve,reject)=>{
        //     http.get("/getGoods").then(res=>{
        //         resolve(res)
        //     }).catch(err=>{
        //         reject(err)
        //     })
        // })
        return http.get("/goods/getGoods",params)  
    }
}