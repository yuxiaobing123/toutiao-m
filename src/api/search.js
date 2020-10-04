import request from '@/utils/request'

//  用户相关的请求模块

// 联想建议的请求封装
export const getSearchSuggestion = q => {
  return request({
    url: '/app/v1_0/suggestion',
    method: 'GET',
    params: {
      q
    }
  })
}

// 获取搜索结果的方法
export const getSearchResults = params => {
  return request({
    url: '/app/v1_0/search',
    method: 'GET',
    params
  })
}
