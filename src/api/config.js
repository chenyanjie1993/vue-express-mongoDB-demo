import axios from "axios";
import qs from "qs";
import { Message } from "element-ui";
import router from "../router";

const Axios = axios.create({
  baseURL: "/", // 因为我本地做了反向代理
  timeout: 10000,
  responseType: "json",
  withCredentials: true, // 是否允许带cookie这些
  headers: {
    "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
  }
});

//POST传参序列化(添加请求拦截器)
Axios.interceptors.request.use(
  config => {
    // 在发送请求之前做某件事
    if (
      config.method === "post"
    ) {
      // 序列化
      config.data = qs.stringify(config.data);
      // 温馨提示,若是贵公司的提交能直接接受json 格式,可以不用 qs 来序列化的
    }

    // 若是有做鉴权token , 就给头部带上token
    // 若是需要跨站点,存放到 cookie 会好一点,限制也没那么多,有些浏览环境限制了 localstorage 的使用
    // 这里localStorage一般是请求成功后我们自行写入到本地的,因为你放在vuex刷新就没了
    // 一些必要的数据写入本地,优先从本地读取
    if (localStorage.token) {
      config.headers.Authorization = localStorage.token;
    }
    return config;
  },
  error => {
    // error 的回调信息,看贵公司的定义
    Message({
      //  饿了么的消息弹窗组件,类似toast
      showClose: true,
      message: error && error.data.error.message,
      type: 'error'
    });
    return Promise.reject(error.data.error.message);
  }
);

//返回状态判断(添加响应拦截器)
Axios.interceptors.response.use(
  res => {
    //对响应数据做些事
    if (res.data && !res.data.success) {
      Message({
        //  饿了么的消息弹窗组件,类似toast
        showClose: true,
        message: res.data.error.message.message
          ? res.data.error.message.message
          : res.data.error.message,
        type: "error"
      });
      return Promise.reject(res.data.error.message);
    }
    return res;
  },
  error => {
    // 用户登录的时候会拿到一个基础信息,比如用户名,token,过期时间戳
    // 直接丢localStorage或者sessionStorage
    if (!window.localStorage.getItem("loginUserBaseInfo")) {
      // 若是接口访问的时候没有发现有鉴权的基础信息,直接返回登录页
      router.push({
        path: "/login"
      });
    } else {
      // 若是有基础信息的情况下,判断时间戳和当前的时间,若是当前的时间大于服务器过期的时间
      // 乖乖的返回去登录页重新登录
      let lifeTime =
        JSON.parse(window.localStorage.getItem("loginUserBaseInfo")).lifeTime *
        1000;
      let nowTime = new Date().getTime(); // 当前时间的时间戳
      console.log(nowTime, lifeTime);
      console.log(nowTime > lifeTime);
      if (nowTime > lifeTime) {
        Message({
          showClose: true,
          message: "登录状态信息过期,请重新登录",
          type: "error"
        });
        router.push({
          path: "/login"
        });
      } else {
        // 下面是接口回调的satus ,因为我做了一些错误页面,所以都会指向对应的报错页面
        if (error.response.status === 403) {
          router.push({
            path: "/error/403"
          });
        }
        if (error.response.status === 500) {
          router.push({
            path: "/error/500"
          });
        }
        if (error.response.status === 502) {
          router.push({
            path: "/error/502"
          });
        }
        if (error.response.status === 404) {
          router.push({
            path: "/error/404"
          });
        }
      }
    }
    // 返回 response 里的错误信息
    let errorInfo =  error.data.error ? error.data.error.message : error.data;
    return Promise.reject(errorInfo);
  }
);

// 对axios的实例重新封装成一个plugin ,方便 Vue.use(xxxx)
export default {
  install: function(Vue, Option) {
    Object.defineProperty(Vue.prototype, "$http", { value: Axios });
  }
};



// /**
//  * axios封装
//  * 请求拦截、响应拦截、错误统一处理
//  */
// import axios from 'axios'
// import router from '../router'
// import store from '../store/index'
// import { Toast } from 'vant'

// /**
//  * 提示函数
//  * 禁止点击蒙层、显示一秒后关闭
//  */
// const tip = msg => {
//   Toast({
//     message: msg,
//     duration: 1000,
//     forbidClick: true
//   })
// }

// /**
//  * 跳转登录页
//  * 携带当前页面路由，以期在登录页面完成登录后返回当前页面
//  */
// const toLogin = () => {
//   router.replace({
//     path: '/login',
//     query: {
//       redirect: router.currentRoute.fullPath
//     }
//   })
// }

// /**
//  * 请求失败后的错误统一处理
//  * @param {Number} status 请求失败的状态码
//  */
// const errorHandle = (status, other) => {
//   // 状态码判断
//   switch (status) {
//     // 401: 未登录状态，跳转登录页
//     case 401:
//       toLogin();
//       break;
//     // 403 token过期
//     // 清除token并跳转登录页
//     case 403:
//       tip('登录过期，请重新登录')
//       localStorage.removeItem('token')
//       store.commit('loginSuccess', null)
//       setTimeout(() => {
//         toLogin()
//       }, 1000)
//       break
//     // 404请求不存在
//     case 404:
//       tip('请求的资源不存在')
//       break
//     default:
//       console.log(other)
//   }}

// // 创建axios实例
// var instance = axios.create({timeout:1000 * 12});
// // 设置post请求头
// instance.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
// /**
//  * 请求拦截器
//  * 每次请求前，如果存在token则在请求头中携带token
//  */
// instance.interceptors.request.use(
//   config => {
//     // 登录流程控制中，根据本地是否存在token判断用户的登录情况
//     // 但是即使token存在，也有可能token是过期的，所以在每次的请求头中携带token
//     // 后台根据携带的token判断用户的登录情况，并返回给我们对应的状态码
//     // 而后我们可以在响应拦截器中，根据状态码进行一些统一的操作。
//     const token = store.state.token;
//     token && (config.headers.Authorization = token);
//     return config;
//   },
//   error => Promise.error(error))

// // 响应拦截器
// instance.interceptors.response.use(
//   // 请求成功
//   res => res.status === 200 ? Promise.resolve(res) : Promise.reject(res),
//   // 请求失败
//   error => {
//     const { response } = error;
//     if (response) {
//       // 请求已发出，但是不在2xx的范围
//       errorHandle(response.status, response.data.message);
//       return Promise.reject(response);
//     } else {
//       // 处理断网的情况
//       // eg:请求超时或断网时，更新state的network状态
//       // network状态在app.vue中控制着一个全局的断网提示组件的显示隐藏
//       // 关于断网组件中的刷新重新获取数据，会在断网组件中说明
//       store.commit('changeNetwork', false);
//     }
//   });

// export default instance;
在这里插入代码片
