<template>
<div class="article-list">
  <!-- 频道列表 -->
  <van-pull-refresh v-model="isRefreshLoading" @refresh="onRefresh" :success-text="refreshSuccessText" :success-duration="1500">
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" :error.sync="error" error-text="请求失败，点击重新加载">
      <!-- <van-cell v-for="(item, index) in list" :key="index" :title="item.title" /> -->
      <article-item v-for="(item, index) in list" :key="index" :article="item"></article-item>
    </van-list>
  </van-pull-refresh>
</div>
</template>

<script>
import {
  getArticles
} from '@/api/article'

import ArticleItem from '@/components/article-item/ArticleItem'

export default {
  name: 'ArticleList',
  props: {
    channel: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      list: [], //  存储列表数据的数组
      loading: false, // 控制加载中 loading 的状态
      finished: false, //  控制数据加载结束的状态
      timestamp: null, // 请求获取下一页数据的时间戳
      error: false, // 控制列表请求失败的状态
      isRefreshLoading: false, //  控制下拉刷新的 loading 状态
      refreshSuccessText: '刷新成功', // 刷新成功后的提示文本
    }
  },
  methods: {
    // 初始化或滚动到底部的时候会触发 调用 onLoad
    async onLoad() {
      // 1、请求获取数据
      try {
        const {
          data: res
        } = await getArticles({
          channel_id: this.channel.id, //  频道 id
          // timestamp 可以理解为页码
          // 如果请求第一页的数据，就是当前最新的时间戳
          // 如果请求之后的数据， 使用本次接口返回回来的数据中的 pre_timestamp
          timestamp: this.timestamp || Date.now(),
          with_top: 1, // 是否包含置顶，进入页面第一次请求时要包含置顶文章，1-包含置顶，0-不包含
        })

        // 模拟随机失败 的情况
        // if (Math.random() > 0.2) {
        //   JSON.parse('dsnajndjsa')
        // }

        // console.log(res)
        // 2、把请求结果的数据放到 list  数组中
        const {
          results
        } = res.data
        this.list.push(...results)

        // 加载状态结束
        // 3、本次加载结束之后要把加载状态设置为结束
        //    loading 关闭以后才能触发下一次的加载更多
        this.loading = false

        // 数据全部加载完成
        // 4、判断数据是否全部加载完毕
        if (results.length) {
          this.timestamp = res.data.pre_timestamp
        } else {
          // 如果没有数据了  就把 finished 设置为 true， 之后不再触发加载更多
          this.finished = true
        }
      } catch (err) {
        // this.$toast('请求数据失败！')
        // 展示错误提示状态
        this.error = true
        // 请求失败的话，loading效果也要关闭
        this.loading = false
      }
    },

    // 当下拉刷新的时候会触发该函数
    async onRefresh() {
      // console.log('onRefresh')
      // 请求获取数据
      try {
        const {
          data: res
        } = await getArticles({
          channel_id: this.channel.id, //  频道 id
          // timestamp 可以理解为页码
          // 如果请求第一页的数据，就是当前最新的时间戳
          // 如果请求之后的数据， 使用本次接口返回回来的数据中的 pre_timestamp
          timestamp: Date.now(), // 下拉刷新每次请求的都是最新数据，所以只需要写 当前时间戳即可
          with_top: 1, // 是否包含置顶，进入页面第一次请求时要包含置顶文章，1-包含置顶，0-不包含
        })
        // 将数据追加到列表的顶部
        const {
          results
        } = res.data
        this.list.unshift(...results)

        // 关闭下拉刷新的 loading 状态
        this.isRefreshLoading = false

        // 更新下拉刷新成功的文本
        this.refreshSuccessText = `刷新成功，更新了${results.length}条数据`
      } catch (err) {
        this.isRefreshLoading = false
        this.refreshSuccessText = '刷新失败'
      }
    },
  },
  components: {
    'article-item': ArticleItem,
  },
}
</script>

<style lang="less" scoped>
.article-list {
  height: 79vh;
  overflow-y: auto;
}
</style>
