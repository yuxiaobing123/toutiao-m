<template>
<van-button :icon="value ? 'star' : 'star-o'" :class="{ collected: value }" @click="onCollect" :loading="loading"></van-button>
</template>

<script>
import {
  addCollect,
  deleteCollect
} from '@/api/article'

export default {
  name: 'CollectArticle',
  props: {
    value: {
      type: Boolean,
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
    async onCollect() {
      this.loading = true
      try {
        if (this.value) {
          // 已收藏  点击取消收藏
          await deleteCollect(this.articleId)
        } else {
          // 未收藏  点击收藏文章
          await addCollect(this.articleId)
        }

        // 更新视图
        this.$emit('input', !this.value)
        this.$toast.success(this.value ? '取消收藏' : '收藏成功')
      } catch (err) {
        this.$toast.fail('操作失败，请稍后重试！')
      }

      // 请求结束
      this.loading = false
    },
  },
}
</script>

<style lang="less" scoped>
.collected {
  .van-icon {
    color: #ffa500;
  }
}
</style>
