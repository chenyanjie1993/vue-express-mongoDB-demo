var express = require('express');
var router = express.Router();
var mongoose = require("mongoose");
var Goods = require("../models/goods.js")

mongoose.connect("mongodb://admin:admin@127.0.0.1:27017/demo?authSource=admin")

mongoose.connection.on("connected", () => {
  console.log("success")
})
mongoose.connection.on("error", () => {
  console.log("error")
})
mongoose.connection.on("disconnected", () => {
  console.log("disconnected")
})
router.get("/getGoods", (req, res, next) => {
  let page = parseInt(req.param("page"));
  let pageSize = parseInt(req.param("pageSize"));
  let sort = parseInt(req.param("sort"));
  let skip = (page - 1) * pageSize;
  let priceLevel = req.param("priceLevel");
  let params = {};
  if (priceLevel !== "false") {
    params = {
      salePrice: {
        $gt: parseInt(JSON.parse(priceLevel).startPrice),
        $lte: parseInt(JSON.parse(priceLevel).endPrice)
      }
    }
  }
  let goodsModel = Goods.find(params).skip(skip).limit(pageSize);
  goodsModel.sort({
    "salePrice": sort
  })
  goodsModel.exec((err, doc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      })
    } else {
      res.json({
        status: '0',
        msg: '',
        result: {
          count: doc.length,
          list: doc
        }
      })
    }
  })
  // Goods.find({},(err,doc)=>{
  //     if(err){
  //         res.json({status:'1',msg:err.message})
  //     }else{
  //         res.json({status:'0',msg:'',result:{
  //             count:doc.length,
  //             list:doc
  //         }})
  //     }
  // })
})
router.post("/addCart", (req, res, next) => {
  var userId = req.cookies.userId,
    productId = req.body.productId;
  var User = require("../models/users.js");
  User.findOne({
    userId
  }, (err, userDoc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      })
    } else {
      console.log("userDoc" + userDoc)
      if (userDoc) {
        let flag = false;
        userDoc.cartList.forEach((item) => {
          if (item.productId == productId) {
            flag = true;
            item.productNum=String(parseInt(item.productNum)+1)
          }
        })
        if (flag) {
          userDoc.save((err2, cartDoc) => {
            if (err2) {
              res.json({
                status: '1',
                msg: err1.message
              })
            } else {
              res.json({
                status: '0',
                msg: '',
                result: '已有数据'
              })
            }
          })
        } else {
          Goods.findOne({
            productId
          }, (err1, goodDoc) => {
            if (err1) {
              res.json({
                status: '1',
                msg: err1.message
              })
            } else {
              if (goodDoc) {
                goodDoc.productNum = '1';
                goodDoc.checked = '1';
                userDoc.cartList.push({
                  "productId": goodDoc.productId,
                  "productName": goodDoc.productName,
                  "salePrice": goodDoc.salePrice,
                  "productImage": goodDoc.productImage,
                  "checked": '1',
                  "productNum": '1'
                });
                userDoc.save((err2, cartDoc) => {
                  if (err2) {
                    res.json({
                      status: '1',
                      msg: err1.message
                    })
                  } else {
                    res.json({
                      status: '0',
                      msg: '',
                      result: 'suc'
                    })
                  }
                })
              }
            }
          })
        }

      }
    }
  })
})
module.exports = router;
