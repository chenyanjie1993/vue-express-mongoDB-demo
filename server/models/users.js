var mongoose = require('mongoose');
var productSchema = new mongoose.Schema({
  "userId": String,
  "userName": String,
  "userPwd": String,
  "productUrl": String,
  "orderList": [{
    'orderId': String,
    'orderTotal': Number,
    'addressInfo': Array,
    'goodsList': Array,
    'orderStatus': String,
    'createDate': String
  }],
  "cartList": [{
    "productId": String,
    "productName": String,
    "salePrice": Number,
    "productImage": String,
    "checked": String,
    "productNum": String
  }],
  "addressList": [{
    "addressId": String,
    "userName": String,
    "streetName": String,
    "postCode": String,
    "tel": String,
    "isDefault": Boolean
  }]
});

module.exports = mongoose.model("User", productSchema)
