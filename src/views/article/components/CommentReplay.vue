<template>
<div class="comment-reply">
  <van-nav-bar :title="
        comment.reply_count > 0 ? `${comment.reply_count}条回复` : '暂无回复'
      ">
    <van-icon slot="left" name="cross" @click="$emit('close-popshow')" />
  </van-nav-bar>

  <div class="scroll-wrap">
    <!-- 当前评论项 -->
    <comment-item :comment="comment" />

    <van-cell title="全部回复" />

    <!-- 评论项的回复列表 -->
    <comment-list :list="commentList" :source="comment.com_id" type="c" />
  </div>

  <!-- 底部的发布评论按钮 -->
  <div class="post-wrap">
    <van-button @click="isPostShow = true" class="post-btn" size="small" round>写评论</van-button>
  </div>

  <!-- 发布评论的弹出框 -->
  <!-- 发布评论 -->
  <van-popup v-model="isPostShow" position="bottom">
    <comment-post :target="comment.com_id" @post-success="onPostSuccess" />
  </van-popup>
  <!-- /发布评论 -->
</div>
</template>

<script>
import CommentItem from './CommentItem'

import CommentList from './CommentList'

import CommentPost from './CommentPost'

export default {
  name: 'CommentReplay',
  data() {
    return {
      isPostShow: false,
      commentList: [], // 评论的回复列表
    }
  },

  props: {
    comment: {
      type: Object,
      required: true,
    },
  },
  created() {},

  methods: {
    onPostSuccess(data) {
      // 更新回复的数量
      this.comment.reply_count++

      // 关闭弹出层
      this.isPostShow = false

      // 将最新回复的内容展示在列表的顶部
      this.commentList.unshift(data.new_obj)
    },
  },
  components: {
    'comment-item': CommentItem,
    'comment-list': CommentList,
    'comment-post': CommentPost,
  },
}
</script>

<style lang="less" scoped>
.scroll-wrap {
  position: fixed;
  top: 92px;
  left: 0;
  right: 0;
  bottom: 88px;
  overflow-y: auto;
}

.post-wrap {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 88px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  border-top: 1px solid #d8d8d8;

  .post-btn {
    width: 60%;
  }
}
</style>
