// 请求模块

import axios from 'axios'
import store from '@/store/index.js'
import JSONBig from 'json-bigint'

const request = axios.create({
  // 接口的基准路径
  baseURL: 'http://ttapi.research.itcast.cn/',

  // 自定义后端返回的数据
  // data  是后端返回的原始数据， 其实也就是 JSON 格式的字符串
  transformResponse: [
    function (data) {
      try {
        return JSONBig.parse(data)
      } catch (err) {
        return data
      }
    }
  ]
})

// 请求拦截器
request.interceptors.request.use(
  config => {
    const { user } = store.state
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`
    }
    // config 本次请求的配置对象
    return config
  },
  err => {
    // 如果请求出错了  就是请求还没有发出去  会进入这里
    return Promise.reject(err)
  }
)

// 响应拦截器

export default request
