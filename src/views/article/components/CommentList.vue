<template>
<van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad" :error.sync="error" error-text="加载失败，请点击重试！" :immediate-check="false">
  <comment-item v-for="(item, index) in list" :key="index" :comment="item" @replay-click="$emit('replay-click', $event)" />
</van-list>
</template>

<script>
import {
  getComments
} from '@/api/comment'

import CommrntItem from './CommentItem'

export default {
  name: 'CommentsList',
  props: {
    source: {
      type: [Number, String, Object],
      required: true,
    },
    list: {
      type: Array,
      default: () => [],
    },
    type: {
      type: String,
      // 自定义 Prop 数据验证
      validator(value) {
        return ['a', 'c'].includes(value)
      },
      default: 'a',
    },
  },
  data() {
    return {
      // list: [],
      loading: false,
      finished: false,
      offset: null, // 请求下一页数据的页码
      error: false,
      limit: 10, // 每页评论数的 条数
    }
  },
  created() {
    // 当手动初始 onLoad 的时候，它不会自动开始初始的 loading
    // 所以需要手动开启loading效果
    this.loading = true
    this.onLoad()
  },
  components: {
    'comment-item': CommrntItem,
  },
  methods: {
    async onLoad() {
      // 1、请求获取数据
      //    获取文章的评论 和 获取评论的回复是同一个接口
      //    不同之处在于接口参数是不一样的
      //     type: a 是文章的评论   c 是评论的回复
      //     source: 获取文章的评论时传递的是文章的 id
      //             获取评论的回复的时候传递的是评论的id
      // source在这里toString() 的原因就是解决 它不是一个有效的整数的报错
      // 这是因为axios在给我们拼接字符串的时候多了引号，把引号也给编译拼接到了参数后面  所以会报错
      try {
        const {
          data: res
        } = await getComments({
          type: this.type, // 评论类型，a-对文章(article)的评论，c-对评论(comment)的回复
          source: this.source.toString(), // 源id，文章id或评论id
          offset: this.offset, // 获取评论数据的偏移量，值为评论id，表示从此id的数据向后取，不传表示从第一页开始读取数据
          limit: this.limit, // 每页评论数的 条数
        })

        // console.log(res)
        // 2、将数据赋值给list 列表中
        const {
          results
        } = res.data
        this.list.push(...results)

        // 将获取到的数据传递给外面
        this.$emit('onload-success', res.data)

        // 3、将 loading 设置为 false
        this.loading = false

        // 4、判断是否还有数据
        if (results.length) {
          // 还有数据   就更新获取下一页的数据
          this.offset = res.data.last_id
        } else {
          // 没有数据了  就把 finished 设置为 结束
          this.finished = true
        }
      } catch (err) {
        // this.$toast('获取数据失败，请稍后重试！')
        this.error = true
        this.loading = false
      }
    },
  },
}
</script>

<style lang="less" scoped>
</style>
