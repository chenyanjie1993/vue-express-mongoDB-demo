// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import utils from "./utils"
import 'babel-polyfill'
import Vuex from 'vuex'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import Api from "./api";
import {currency} from './util/currency'

import infiniteScroll from 'vue-infinite-scroll'
Vue.use(infiniteScroll)
Vue.use(Vuex);
import VueLazyload from 'vue-lazyload'
Vue.use(VueLazyload, {
  loading: 'static/loading-svg/loading-bars.svg',
  try: 3 // default 1
})

import './assets/css/base.css'
import './assets/css/checkout.css'
import './assets/css/product.css'



// Vue.use(ElementUI)
Vue.filter("currency", currency);
Vue.config.productionTip = false
Vue.prototype.api = Api;
const store = new Vuex.Store({
  state: {
    nickName:'',
    cartCount:0
  },
  mutations: {
    //更新用户信息
    updateUserInfo(state, nickName) {
      debugger
      state.nickName = nickName;
    },
    updateCartCount(state,cartCount){
      state.cartCount += cartCount;
    }
  }
});
debugger
/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  // render: function (h) {
  //   return h(App)
  // },
  // render:h=>h(App)
  components: {
    App
  },
  template: '<App/>'
})
// .$mount('#app')
