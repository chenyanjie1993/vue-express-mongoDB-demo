var express = require('express');
var router = express.Router();
var User = require("../models/users");
require("../util/util.js")
/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});
router.post('/login', function (req, res, next) {
  let params = {
    userName: req.body.userName,
    userPwd: req.body.userPwd
  }
  User.findOne(params, (err, doc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      })
    } else {
      if (doc) {
        res.cookie("userId", doc.userId, {
          path: '/',
          maxAge: 1000 * 60 * 60
        });
        res.cookie("userName", doc.userName, {
          path: '/',
          maxAge: 1000 * 60 * 60
        });
        // req.session.user=doc;
        res.json({
          status: '0',
          msg: '',
          result: {
            userName: doc.userName
          }
        })
      } else {
        res.json({
          status: '0',
          msg: "账户或密码错误"
        })
      }
    }
  })
});
router.post('/logout', function (req, res, next) {
  res.cookie("userId", "", {
    path: '/',
    maxAge: -1
  });
  res.json({
    status: '0',
    msg: "",
    result: '登出成功'
  })
});
router.get('/checkLogin', function (req, res, next) {
  if (req.cookies.userId) {
    res.json({
      status: '0',
      msg: "",
      result: {
        userName: req.cookies.userName
      }
    })
  } else {
    res.json({
      status: '1',
      msg: "未登录",
      result: ''
    })
  }
});
router.get('/cartList', function (req, res, next) {
  let params = {
    userId: req.cookies.userId
  };
  User.findOne(params, (err, doc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      })
    } else {
      res.json({
        status: '0',
        msg: '',
        result: doc.cartList
      })
    }
  })
});
router.post('/cartDel', function (req, res, next) {
  let params = {
    userId: req.cookies.userId
  };
  let productId = req.body.productId;
  User.update(params, {
    $pull: {
      "cartList": {
        "productId": productId
      }
    }
  }, (err, doc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      })
    } else {
      res.json({
        status: '0',
        msg: '',
        result: ''
      })
    }
  })
});

router.post('/cartEdit', function (req, res, next) {
  let productId = req.body.productId;
  let params = {
    userId: req.cookies.userId,
    "cartList.productId": productId
  };

  let productNum = req.body.productNum;
  let checked = req.body.checked;
  User.update(params, {
    "cartList.$.productNum": productNum,
    "cartList.$.checked": checked,
  }, (err, doc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      })
    } else {
      res.json({
        status: '0',
        msg: '',
        result: ''
      })
    }
  })
});

router.post('/editCheckAll', function (req, res, next) {
  let params = {
    userId: req.cookies.userId,
  };

  let checkAll = req.body.checkAll ? '1' : '0';
  User.findOne(params, (err, doc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      })
    } else {
      if (doc) {
        doc.cartList.forEach((item) => {
          item.checked = checkAll
        })
        doc.save((err1, doc1) => {
          if (err1) {
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
});

router.get("/addressList", function (req, res, next) {
  let params = {
    userId: req.cookies.userId,
  };
  User.findOne(params, (err, doc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      })
    } else {
      res.json({
        status: '0',
        msg: '',
        result: doc.addressList
      })
    }
  })
})

router.post('/delAddress', function (req, res, next) {
  let params = {
    userId: req.cookies.userId
  };
  let addressId = req.body.addressId;
  User.update(params, {
    $pull: {
      "addressList": {
        "addressId": addressId
      }
    }
  }, (err, doc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      })
    } else {
      res.json({
        status: '0',
        msg: '',
        result: ''
      })
    }
  })
});

router.post('/setDefault', function (req, res, next) {
  let addressId = req.body.addressId;
  let params = {
    userId: req.cookies.userId,
  };

  User.findOne(params, (err, doc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      })
    } else {
      if (doc) {
        doc.addressList.forEach((item) => {
          if (item.addressId == addressId) {
            item.isDefault = true
          } else {
            item.isDefault = false
          }
        })
        doc.save((err1, doc1) => {
          if (err1) {
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
});

router.post("/addAddress", (req, res, next) => {
  var userId = req.cookies.userId;
  var addressId = String(Math.round(Math.random() * 100000 + 100000))
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
        userDoc.addressList.push({
          "addressId": addressId,
          "userName": req.body.userName,
          "streetName":req.body.streetName,
          "postCode": req.body.postCode,
          "tel": req.body.tel,
          "isDefault": false
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
})

router.post("/payMent", (req, res, next) => {
  var userId = req.cookies.userId;
  var orderTotal=req.body.orderTotal;
  var addressId = req.body.addressId
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
        var addressInfo={},goodsList=[];
        userDoc.addressList.forEach((item)=>{
          if(item.addressId==addressId){
            addressInfo=item
          }
        })

        userDoc.cartList.filter((item)=>{
          if(item.checked=='1'){
            goodsList.push(item)
          }
        });
        var platform='622';
        var r1=Math.floor(Math.random()*10);
        var r2=Math.floor(Math.random()*10);
        var syxDate=new Date().Format('yyyyMMddhhmmss');
        var createDate=new Date().Format('yyyy-MM-dd hh:mm:ss');
        var orderId=platform+r1+syxDate+r2;
        userDoc.orderList.push({
          'orderId': orderId,
          'orderTotal': orderTotal,
          'addressInfo': addressInfo,
          'goodsList': goodsList,
          'orderStatus': '1',
          'createDate': createDate
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
              result: {
                orderId:orderId,
                orderTotal:orderTotal
              }
            })
          }
        })
      }
    }
  })
})

router.get("/orderDetail", function (req, res, next) {
  let params = {
    userId: req.cookies.userId,
  };
  let orderId=req.param("orderId");
  User.findOne(params, (err, doc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      })
    } else {
      doc.orderList.forEach((item) => {
        if (item.orderId == orderId) {
          res.json({
            status: '0',
            msg: '',
            result: item
          })
        } 
      })
      
    }
  })
})

router.get("/getCartCount", function (req, res, next) {
  let params = {
    userId: req.cookies.userId
  };
  User.findOne(params, (err, doc) => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      })
    } else {
      res.json({
        status: '0',
        msg: '',
        result: doc.cartList.length
      })
    }
  })
})

module.exports = router;
