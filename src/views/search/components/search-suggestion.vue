<template>
<div class="search-suggestion">
  <van-cell :title="text" icon="search" v-for="(text, index) in suggestions" :key="index" @click="$emit('search', text)">
    <div slot="title" v-html="highlight(text)"></div>
  </van-cell>
</div>
</template>

<script>
import {
  getSearchSuggestion
} from '@/api/search'

// 按需加载  只会把使用到的成员打包到结果中
import {
  debounce
} from 'lodash'

export default {
  name: 'SearchSuggestion',
  props: {
    searchText: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      // 搜索建议的内容
      suggestions: [],
    }
  },
  watch: {
    searchText: {
      //  当 searchText 发生变化的时候就会调用 handler 函数
      // handler(value) {
      //   // console.log(value)
      //   // 根据搜索框的内容调用搜索建议
      //   this.loadSearchSuggestion(value)
      // },
      // debounce 函数 第一个参数是一个函数   第二分参数是延迟时间
      // 返回值是防抖之后的函数   目的就是防止用户输入的过快，频繁触发搜索的函数
      handler: debounce(function (value) {
        this.loadSearchSuggestion(value)
      }, 200),
      // 由于当第一次输入的时候，他还没有被渲染出来，所以也就不会发生请求、
      // 因此 要设置 immediate  会在侦听开始之后被立即调用
      immediate: true,
    },
  },
  methods: {
    // 请求联想建议的方法
    async loadSearchSuggestion(q) {
      try {
        const {
          data: res
        } = await getSearchSuggestion(q)
        this.suggestions = res.data.options
      } catch (err) {
        this.$toast('获取数据失败, 请稍后重试！')
      }
    },

    // 让 搜索关键字 在 搜索 建议列表中高亮显示
    highlight(text) {
      const highlightStr = `<span class="active">${this.searchText}</span>`

      // 正则表达式 正常情况下 // 这里边的内容都会当作匹配字符来使用，而不能写数据变量
      // 如果需要根据数据变量来动态的创建正则表达式的话  就需要手动 new RegExp
      // RegExp 正则表达式构造函数
      //      参数1 是匹配模式的字符串，他会根据这个字符串创建正则对象
      //      参数2 是匹配模式，这是要写到字符串中
      const reg = new RegExp(this.searchText, 'gi')
      return text.replace(reg, highlightStr)
    },
  },
}
</script>

<style lang="less" scoped>
/deep/ .van-cell__title {
  span.active {
    color: #3296fa;
  }
}
</style>
