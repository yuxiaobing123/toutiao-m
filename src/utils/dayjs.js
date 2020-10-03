import Vue from 'vue'

import dayjs from 'dayjs'

// 加载中文文件包
import 'dayjs/locale/zh-cn'

import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

// dayjs 默认的是英文  所以这里使用的时候需要手动配置成中文
dayjs.locale('zh-cn') // 全局使用

// dayjs().from(dayjs('1990')) // 2 年以前
// dayjs().from(dayjs(), true) // 2 年

// dayjs().fromNow()

// dayjs().to(dayjs())

// dayjs().toNow()

// 定义一个全局过滤器，然后就可以在任何组件的模板中使用了
// 参数1是过滤器名称
// 参数2是过滤器函数
// 管道符前边的表达式的结果会作为参数传递给过滤器函数中
// 过滤器的返回值会渲染到使用过滤器的模板的位置
Vue.filter('relativeTime', value => {
  return dayjs().to(dayjs(value))
})
