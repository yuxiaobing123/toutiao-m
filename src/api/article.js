//  文章相关的请求模块

import request from '@/utils/request'

export const getArticles = params => {
  return request({
    url: '/app/v1_1/articles',
    method: 'GET',
    params
  })
}
