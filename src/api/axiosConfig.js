//引入axios
import axios from 'axios'
// 使用element-ui Message做消息提醒
import { Message } from 'element-ui';
// 设置baseURL
//axios.defaults.baseURL = '/api'
//设置默认请求头
axios.defaults.headers = {
	'X-Requested-With': 'XMLHttpRequest'
}
// 设置请求过期时间
axios.defaults.timeout = 10000
 
//请求拦截器
axios.interceptors.request.use(config => {
 
	config.headers = {
		'Content-Type': 'application/json'
	}
	// 配置token
	// if(token){
	//   config.token = {'token':token}
	// }
	return config
}, error => {
	return Promise.reject(error)
})
 
//响应拦截器即异常处理
axios.interceptors.response.use(response => {
    // 根据后端接口code执行操作
	switch(response.data.code) {
		//处理共有的操作
	}
 
	//Message.error(err.message)
 
	return response
}, error => {
	if(error && err.response) {
		switch(err.response.status) {
			case 400:
				err.message = '错误请求'
				break;
			case 401:
				err.message = '未授权，请重新登录'
				break;
			case 403:
				err.message = '拒绝访问'
				break;
			case 404:
				err.message = '请求错误,未找到该资源'
				break;
			case 405:
				err.message = '请求方法未允许'
				break;
			case 408:
				err.message = '请求超时'
				break;
			case 500:
				err.message = '服务器端出错'
				break;
			case 501:
				err.message = '网络未实现'
				break;
			case 502:
				err.message = '网络错误'
				break;
			case 503:
				err.message = '服务不可用'
				break;
			case 504:
				err.message = '网络超时'
				break;
			case 505:
				err.message = 'http版本不支持该请求'
				break;
			default:
				err.message = `连接错误${err.response.status}`
		}
	} else {
		err.message = "连接到服务器失败"
	}
	Message.error(err.message)
	return Promise.resolve(error.response)
})
 
export default {
	// get请求
  get (url, param = {}) {
    return new Promise((resolve, reject) => {
      axios.get(url,{params:param})
      	.then(res => {
         resolve(res)
      }, err => {
          reject(err)
      })
    })
  },
  // post请求
  post (url, param = {}) {
    return new Promise((resolve, reject) => {
      axios.post(
        url,
        param
      ).then(res => {
        resolve(res)
      }, err => {
          reject(err)
      })
    })
  },
  // put请求
  put (url, param = {}) {
    return new Promise((resolve, reject) => {
      axios.put(url, param)
        .then(response => {
          resolve(response)
        }, err => {
          reject(err)
        })
    })
  },
  // delete
  delete (url,param = {}){
  	return new Promise((resolve, reject) => {
      axios.delete(url, param)
        .then(response => {
          resolve(response)
        }, err => {
          reject(err)
        })
    })
  }
}
// 以上代码的使用需要支持es6