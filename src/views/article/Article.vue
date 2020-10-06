<template>
<div class="article-container">
  <!-- 导航栏 -->
  <van-nav-bar class="page-nav-bar" left-arrow title="黑马头条" @click-left="$router.back()"></van-nav-bar>
  <!-- /导航栏 -->

  <div class="main-wrap">
    <!-- 加载中 -->
    <div v-if="loading" class="loading-wrap">
      <van-loading color="#3296fa" vertical>加载中</van-loading>
    </div>
    <!-- /加载中 -->

    <!-- 加载完成-文章详情 -->
    <div v-else-if="article.title" class="article-detail">
      <!-- 文章标题 -->
      <h1 class="article-title">{{ article.title }}</h1>
      <!-- /文章标题 -->

      <!-- 用户信息 -->
      <van-cell class="user-info" center :border="false">
        <van-image class="avatar" slot="icon" round fit="cover" :src="article.aut_photo" />
        <div slot="title" class="user-name">{{ article.aut_name }}</div>
        <div slot="label" class="publish-date">
          {{ article.pubdate | relativeTime }}
        </div>
        <!-- 模板中的 $event 就是事件参数 -->
        <!-- 
          当我们这个传递给子组件的数据 既要使用 又要修改的时候，可以使用 v-model   如这里的article.is_followed

          传递：props 
                :isFollowed="article.is_followed"
          修改：自定义事件
                @update-is-followed="article.is_followed = $event"

          简写方式：在组件上使用 v-model
                value="article.is_followed"
                @input="article.is_followed = $event"
          如果需要修改 v-model 的属性的名称，可以使用 子组件的 model 属性

          如果有多个数据 需要修改的话 可以使用 .sync 修饰符 查文档
         -->
        <follow-user class="follow-btn" :userId="article.aut_id" v-model="article.is_followed" />
        <!--  <van-button v-if="article.is_followed" class="follow-btn" round size="small" :loading="followLoding" @click="onFollow">已关注</van-button>
        <van-button v-else class="follow-btn" type="info" color="#3296fa" round size="small" icon="plus" :loading="followLoding" @click="onFollow">关注</van-button> -->
      </van-cell>
      <!-- /用户信息 -->

      <!-- 文章内容 -->
      <div class="article-content markdown-body" v-html="article.content" ref="article-content"></div>
      <van-divider>正文结束</van-divider>
      <!-- 文章的 相关评论区域 -->
      <comment-list :list="commentList" :source="article.art_id" @onload-success="totalCommentCount = $event.total_count" @replay-click="replayClick" />
      <!-- 底部区域 -->
      <div class="article-bottom">
        <van-button class="comment-btn" type="default" round size="small" @click="writeComment">写评论</van-button>
        <van-icon name="comment-o" :info="totalCommentCount" color="#777" />
        <!-- 点击收藏文章 -->
        <collect-article class="btn-item" v-model="article.is_collected" :articleId="article.art_id" />
        <!-- 点赞文章 -->
        <like-article class="btn-item" v-model="article.attitude" :articleId="article.art_id" />
        <van-icon name="share" color="#777777"></van-icon>
      </div>
      <!-- /底部区域 -->
    </div>

    <!-- /加载完成-文章详情 -->

    <!-- 加载失败：404 -->
    <div v-else-if="errStatus === 404" class="error-wrap">
      <van-icon name="failure" />
      <p class="text">该资源不存在或已删除！</p>
    </div>
    <!-- /加载失败：404 -->

    <!-- 加载失败：其它未知错误（例如网络原因或服务端异常） -->
    <div v-else class="error-wrap">
      <van-icon name="failure" />
      <p class="text">内容加载失败！</p>
      <van-button class="retry-btn" @click="loadArticle">点击重试</van-button>
    </div>
    <!-- /加载失败：其它未知错误（例如网络原因或服务端异常） -->
  </div>

  <!-- 发布评论的弹出层 -->
  <van-popup v-model="isPostCommentShow" closeable position="bottom">
    <comment-post :target="article.art_id" @post-success="onPostSuccess" />
  </van-popup>

  <!-- 回复评论的弹出层 -->
  <!-- 弹出层是懒渲染的：只有在第一次显示的时候会渲染里面的内容，之后就是一直在切换显示和隐藏 -->
  <van-popup v-model="isReplayShow" position="bottom" style="height: 100%">
    <comment-replay v-if="isReplayShow" :comment="currentComment" @close-popshow="isReplayShow = false" />
  </van-popup>
</div>
</template>

<script>
import {
  getArticleById
} from '@/api/article'

import {
  ImagePreview
} from 'vant'

import FollowUSer from '@/components/follow-user/FollowUser'

import CollectArticle from '@/components/collect-article/CollectArticle'

import LikeArticle from '@/components/like-article/LikeArticle'

import CommentList from './components/CommentList'

import CommentPost from './components/CommentPost'

import CommentReplay from './components/CommentReplay'

export default {
  name: 'Article',
  components: {},
  props: {
    articleId: {
      type: [Number, String, Object],
      required: true,
    },
  },
  // 给所有的子组件传值
  // 虽然好用   但是不能滥用
  provide: function () {
    return {
      articleId: this.articleId,
    }
  },
  data() {
    return {
      // 文章的详情
      article: {},
      // 控制加载状态
      loading: true,
      // 请求失败的 状态码  404（资源不存在）  或者其他（网络原因）
      errStatus: 0,
      // 加关注按钮的loading 效果
      followLoding: false,
      // 文章的评论总数
      totalCommentCount: 0,
      // 控制发布评论弹出层的显示和隐藏
      isPostCommentShow: false,
      // 评论列表
      commentList: [],
      // 回复弹出层的显示和隐藏、
      isReplayShow: false,
      // 点击的当前评论、
      currentComment: {},
    }
  },
  components: {
    'follow-user': FollowUSer,
    'collect-article': CollectArticle,
    'like-article': LikeArticle,
    'comment-list': CommentList,
    'comment-post': CommentPost,
    'comment-replay': CommentReplay,
  },
  created() {
    this.loadArticle()
  },
  mounted() {},
  methods: {
    async loadArticle() {
      // 请求失败  用户重新请求数据的时候 需要打开 loading 效果
      // 所以  一开始的时候 就需要 先打开 loading 效果
      this.loading = true
      try {
        const {
          data: res
        } = await getArticleById(this.articleId)
        console.log(res)
        // 数据驱动视图这件事不是立即发生的
        this.article = res.data

        // 初始化图片点击预览
        // console.log(this.$refs(['article-content']))
        setTimeout(() => {
          this.previerImage()
        })
      } catch (err) {
        if (err.response && err.response.status === 404) {
          this.errStatus = 404
        }
        // this.$toast('获取数据失败，请稍后重试！')
        // console.log(err)
      }

      // 无论是请求成功还是请求失败都要关闭 loading 状态
      this.loading = false
    },

    // 获取所有的图片节点
    previerImage() {
      // 得到所有的 img 节点
      const articleContent = this.$refs['article-content']
      const imgs = articleContent.querySelectorAll('img')
      // console.log(images)

      // 获取所有图片的地址
      const images = []
      imgs.forEach((img, index) => {
        images.push(img.src)
        img.onclick = () => {
          ImagePreview({
            images,
            // 起始位置 从0开始
            startPosition: index,
            // onClose() {
            //   // Toast('关闭')
            // },
          })
        }
      })
    },

    // 点击开始写评论
    writeComment() {
      this.isPostCommentShow = true
    },
    onPostSuccess(data) {
      this.commentList.unshift(data.new_obj)
      // 关闭写评论的弹出层
      this.isPostCommentShow = false
    },
    // 点击回复按钮展示回复弹出层
    replayClick(comment) {
      this.currentComment = comment
      console.log(comment)
      this.isReplayShow = true
    },
  },
}
</script>

<style lang="less" scoped>
@import './github-markdown.css';

.article-container {
  .main-wrap {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: #fff;
  }

  .article-detail {
    position: fixed;
    left: 0;
    right: 0;
    top: 92px;
    bottom: 88px;
    overflow-y: scroll;
    background-color: #fff;

    .article-title {
      font-size: 40px;
      padding: 50px 32px;
      margin: 0;
      color: #3a3a3a;
    }

    .user-info {
      padding: 0 32px;

      .avatar {
        width: 70px;
        height: 70px;
        margin-right: 17px;
      }

      .van-cell__label {
        margin-top: 0;
      }

      .user-name {
        font-size: 24px;
        color: #3a3a3a;
      }

      .publish-date {
        font-size: 23px;
        color: #b7b7b7;
      }

      .follow-btn {
        width: 170px;
        height: 58px;
      }
    }

    .article-content {
      padding: 55px 32px;

      /deep/ p {
        text-align: justify;
      }
    }
  }

  .loading-wrap {
    padding: 200px 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
  }

  .error-wrap {
    padding: 200px 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #fff;

    .van-icon {
      font-size: 122px;
      color: #b4b4b4;
    }

    .text {
      font-size: 30px;
      color: #666666;
      margin: 33px 0 46px;
    }

    .retry-btn {
      width: 280px;
      height: 70px;
      line-height: 70px;
      border: 1px solid #c3c3c3;
      font-size: 30px;
      color: #666666;
    }
  }

  .article-bottom {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-sizing: border-box;
    height: 88px;
    border-top: 1px solid #d8d8d8;
    background-color: #fff;

    .comment-btn {
      width: 282px;
      height: 46px;
      border: 2px solid #eeeeee;
      font-size: 30px;
      line-height: 46px;
      color: #a7a7a7;
    }

    /deep/ .van-icon {
      font-size: 40px;
    }

    .comment-icon {
      top: 2px;
      color: #777;

      .van-info {
        font-size: 16px;
        background-color: #e22829;
      }
    }

    .btn-item {
      border: none;
      padding: 0;
      height: 40px;
      line-height: 40px;
      color: #777777;
    }

    .collect-btn--collected {
      color: #ffa500;
    }

    .like-btn--liked {
      color: #e5645f;
    }
  }
}
</style>
