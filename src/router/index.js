import Vue from 'vue'
import Router from 'vue-router'
import OrderSuccess from '@/views/orderSuccess'
import GoodsLists from '@/views/GoodsLists'
import OrderConfirm from "@/views/OrderConfirm"
import Address from "@/views/Address"
import Cart from "@/views/Cart"

Vue.use(Router)

export default new Router({
  mode: "hash",
  routes: [{
    path: '/',
    name: 'GoodsLists',
    component:GoodsLists ,
    // children: [{
    //   path: 'title',
    //   name: 'Title',
    //   component: Title,
    // },
    // {
    //   path: 'image',
    //   name: 'Image',
    //   component: Image,
    // }]
  },
  {
    path: '/cart',
    name: 'Cart',
    component: Cart,
  },
  {
    path: '/address',
    name: 'Address',
    component: Address,
  },
  {
    path: '/goods',
    name: 'GoodsLists',
    component: GoodsLists
  },
  {
    path: '/orderConfirm',
    name: 'OrderConfirm',
    component: OrderConfirm,
  },
  {
    path: '/orderSuccess',
    name: 'OrderSuccess',
    component: OrderSuccess,
  }
]
})
