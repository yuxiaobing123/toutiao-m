import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 导入 vant 组件
import Vant from 'vant'
// 引入 vant 的样式文件
import 'vant/lib/index.css'

// 注册 vant
Vue.use(Vant)

// 加载全局样式
import './styles/global.css'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
