const context = require.context('./modules', false, /\.js$/);
const path=require("path")
let Api = {}
context.keys().map((m, k) => {
  var strFileName = m.replace(/(.*\/)*([^.]+).*/ig,"$2");
  var filePath=path.resolve("modules",m)
  var data=require("."+filePath);
  data=data.default?data.default:data;
  Api[strFileName]=data
}, {})

export default Api;
