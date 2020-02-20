let url = "mongodb://127.0.0.1:27017/demo";
let options = {
    db: { native_parser: true },
    server: { poolSize: 5 },
    replset: { rs_name: 'myReplicaSetName' },
    user: 'admin',
    pass: 'admin'

}
module.export={
    url,
    options
}
// 键名	描述
// db	数据库设置
// server	服务器设置
// replset	副本集设置
// user	用户名
// pass	密码
// auth	鉴权选项
// mongos	连接多个数据库
