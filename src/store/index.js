import Vue from 'vue'
import Vuex from 'vuex'

// 导入封装好的关于本地存储的方法
import { setItem, getItem } from '@/utils/storage.js'

Vue.use(Vuex)

// 定义一个token 的常量
const TOKEN_KEY = 'TOUTIAO_USER'

export default new Vuex.Store({
  state: {
    // user是一个对象   存储当前登录用户的信息  如 token 等
    // user: null
    // 存的时候存的是字符串，取出来的话要转成对象
    // user: JSON.parse(window.localStorage.getItem(TOKEN_KEY))
    user: getItem(TOKEN_KEY)
  },
  mutations: {
    setUser (state, data) {
      state.user = data

      // 另外  为了防止刷新导致的数据丢失  还应该把数据备份到本地存储
      // 而且，存储的应该是一个字符串  此时传过来的是一个对象  所以还应该转化一下
      // window.localStorage.setItem(TOKEN_KEY, JSON.stringify(state.user))
      setItem(TOKEN_KEY, state.user)
    }
  },
  actions: {},
  modules: {}
})
