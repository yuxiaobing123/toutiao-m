<template>
<div class="search-result">
  <van-list v-model="loading" :finished="finished" finished-text="没有更多了" :error.sync="error" error-text="加载失败，请点击重试！" @load="onLoad">
    <van-cell v-for="(item, index) in list" :key="index" :title="item.title" />
  </van-list>
</div>
</template>

<script>
import {
  getSearchResults
} from '@/api/search'

export default {
  name: 'SearchResult',
  props: {
    searchText: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      list: [],
      loading: false,
      finished: false,
      page: 1, // 页码
      perPage: 20, // 每页显示多少条数据
      error: false,
    }
  },
  methods: {
    async onLoad() {
      // 1、请求获取数据
      try {
        const {
          data: res
        } = await getSearchResults({
          page: this.page, // 页码
          per_page: this.perPage, // 每页数量的多少
          q: this.searchText, // 查询关键词
        })
        // console.log(res)
        // 2、将数据添加到数据列表中
        const {
          results
        } = res.data
        this.list.push(...results)

        // 3、将本次加载中的 loading 关闭
        this.loading = false

        // 4、判断是否还有数据
        if (results.length) {
          //  如果有的话就更新获取下一页数据的页码
          this.page++
        } else {
          //  如果没有的话 就将加载状态 finished  设置为结束
          this.finished = true
        }
      } catch (err) {
        // 展示加载失败的提示状态
        this.error = true

        // 加载失败  关闭 loading 效果
        this.loading = false
      }
    },
  },
}
</script>

<style lang="less" scoped>
</style>
