<template>
<div class="comment-post">
  <van-field class="post-field" v-model.trim="message" rows="2" autosize type="textarea" maxlength="50" placeholder="请输入留言" show-word-limit />
  <van-button class="post-btn" @click="onPost" :disabled="!message.length">发布</van-button>
</div>
</template>

<script>
import {
  addComment
} from '@/api/comment'

export default {
  name: 'CommentPost',
  components: {},
  inject: {
    articleId: {
      type: [Number, String, Object],
      default: null,
    },
  },
  props: {
    target: {
      type: [Number, String, Object],
      required: true,
    },
  },
  data() {
    return {
      message: '',
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    async onPost() {
      this.$toast.loading({
        message: '发布中...',
        forbidClick: true,
        duration: 0,
      })
      try {
        const {
          data: res
        } = await addComment({
          target: this.target.toString(), // 评论的目标id（评论文章即为文章id，对评论进行回复则为评论id）
          content: this.message, // 发布的内容
          art_id: this.articleId ? this.articleId.toString() : this.articleId, // 文章id，对评论内容发表回复时，需要传递此参数，表明所属文章id。对文章进行评论，不要传此参数。
        })

        // 清空输入框的内容
        this.message = ''
        // 发射自定义事件 并把输入的内容发送出去，让父组件添加到页面中
        this.$emit('post-success', res.data)

        this.$toast.success('发布成功！')
      } catch (err) {
        this.$toast.fail('发布失败，请重试！')
      }
    },
  },
}
</script>

<style lang="less" scoped>
.comment-post {
  display: flex;
  align-items: center;
  padding: 32px 0 32px 32px;

  .post-field {
    background-color: #f5f7f9;
  }

  .post-btn {
    width: 150px;
    border: none;
    padding: 0;
    color: #6ba3d8;

    &::before {
      display: none;
    }
  }
}
</style>
