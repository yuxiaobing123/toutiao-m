<template>
<van-button v-if="isFollowed" class="follow-btn" round size="small" :loading="loading" @click="onFollow">已关注</van-button>
<van-button v-else class="follow-btn" type="info" color="#3296fa" round size="small" icon="plus" :loading="loading" @click="onFollow">关注</van-button>
</template>

<script>
import {
  addFollow,
  deleteFollow
} from '@/api/user'
export default {
  name: 'FollowUser',
  model: {
    prop: 'isFollowed',
    event: 'update-is-followed',
  },
  props: {
    isFollowed: {
      type: Boolean,
      required: true,
    },
    userId: {
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
    // 关注用户
    async onFollow() {
      this.loading = true // 展示关注按钮的loading 效果
      try {
        if (this.isFollowed) {
          // 说明已关注  点击按钮取消关注
          await deleteFollow(this.userId)
        } else {
          // 没有关注  点击按钮  关注该用户
          await addFollow(this.userId)
        }
        // 更新视图状态
        this.$emit('update-is-followed', !this.isFollowed)
        // this.isFollowed = !this.isFollowed
      } catch (err) {
        let message = '操作失败，请稍后重试！'
        if (err.response && err.response.status === 400) {
          message = '你不能关注你自己'
        }
        this.$toast(message)
      }
      this.loading = false //  关闭 loading 效果
    },
  },
}
</script>

<style lang="less" scoped>
</style>
