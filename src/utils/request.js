// 请求模块

import axios from 'axios'
import store from '@/store/index.js'

const request = axios.create({
  // 接口的基准路径
  baseURL: 'http://ttapi.research.itcast.cn/'
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
