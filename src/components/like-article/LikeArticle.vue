<template>
<van-button :icon="value ? 'good-job' : 'good-job-o'" :class="{ liked: value === 1 }" @click="onLiked" :loading="loading"></van-button>
</template>

<script>
import {
  addLike,
  deleteLike
} from '@/api/article'
export default {
  name: 'LikeArticle',
  props: {
    value: {
      type: Number,
      required: true,
    },
    articleId: {
      type: [Number, String, Object],
      required: true,
    },
  },
  data() {
    return {
      loading: false,
    }
  },
  methods: {
    async onLiked() {
      this.loading = true
      try {
        let status = -1
        if (this.value === 1) {
          // 已收藏 点击取消收藏
          await deleteLike(this.articleId)
        } else {
          // 添加点赞
          await addLike(this.articleId)
          status = 1
        }
        this.$emit('input', status)
        this.$toast.success(status === 1 ? '点赞成功' : '取消点赞')
      } catch (err) {
        this.$toast.fail('操作失败，请稍后重试！')
      }
      this.loading = false
    },
  },
}
</script>

<style lang="less" scoped>
.liked {
  .van-icon {
    color: #e5645f;
  }
}
</style>
