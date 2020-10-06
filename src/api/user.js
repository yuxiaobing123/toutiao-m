// 用户相关的请求模块

import request from '@/utils/request'
// import store from '@/store'
// 用户登录
export const login = data => {
  return request({
    url: '/app/v1_0/authorizations',
    method: 'POST',
    data
  })
}

// 发送验证码
// 每个手机号每分钟只能发一次  频繁触发的话返回错误代码 429
export const sendSms = mobile => {
  return request({
    url: `/app/v1_0/sms/codes/${mobile}`,
    method: 'GET'
    // data
  })
}

// 获取用户的个人信息
export const getUserInfo = () => {
  return request({
    url: '/app/v1_0/user',
    method: 'GET'
    // headers: {
    //   // 注意： 该接口是需要访问权限的  所以在访问的时候必须要加上请求头
    //   Authorization: `Bearer ${store.state.user.token}`
    // }
  })
}

// 获取用户频道列表数据
export const getUserChannels = () => {
  return request({
    url: '/app/v1_0/user/channels',
    method: 'GET'
  })
}

// 关注用户   参数是被关注用户的 id
export const addFollow = target => {
  return request({
    url: '/app/v1_0/user/followings',
    method: 'POST',
    data: {
      target
    }
  })
}

// 取消关注用户
export const deleteFollow = userId => {
  return request({
    url: `/app/v1_0/user/followings/${userId}`,
    method: 'DELETE'
  })
}
