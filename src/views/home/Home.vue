<template>
<div class="home-container">
  <!-- 导航栏 -->
  <van-nav-bar class="page-nav-bar" fixed>
    <van-button size="small" slot="title" type="info" round icon="search" class="search-btn">搜索</van-button>
  </van-nav-bar>

  <!-- tab 页签 -->
  <!-- 通过 animated 属性可以开启切换标签内容时的转场动画。 -->
  <!-- 通过 swipeable 属性可以开启滑动切换标签页。 -->
  <van-tabs class="channel-tabs" v-model="active" animated swipeable>
    <van-tab v-for="item in channels" :key="item.id" :title="item.name">
      <!-- 这里是文章列表组件 -->
      <article-list :channel="item" />
    </van-tab>
    <div slot="nav-right" class="placeholder"></div>
    <div slot="nav-right" class="hamburger-btn" @click="isChannelEditShow = true">
      <i class="toutiao toutiao-gengduo"></i>
    </div>
  </van-tabs>

  <!-- 频道编辑弹出层 -->
  <van-popup v-model="isChannelEditShow" closeable position="bottom" close-icon-position="top-left" :style="{ height: '100%' }">
    <channel-edit :myChannels="channels" :active="active" @update-active="onUpdateActive" />
  </van-popup>
</div>
</template>

<script>
import {
  getUserChannels
} from '@/api/user.js'

import ArticleList from './components/ArticleList'
import ChannelEdit from './components/ChannelEdit'
import {
  mapState
} from 'vuex'
import {
  getItem
} from '@/utils/storage'

export default {
  name: 'home',
  props: {},
  data() {
    return {
      active: 0,
      // 定义频道列表数据
      channels: [],
      // 控制频道编辑弹出层是否显示
      isChannelEditShow: false,
    }
  },
  created() {
    this.loadChannels()
  },
  components: {
    'article-list': ArticleList,
    'channel-edit': ChannelEdit,
  },
  computed: {
    ...mapState(['user']),
  },
  methods: {
    async loadChannels() {
      try {
        // const {
        //   data: res
        // } = await getUserChannels()
        // this.channels = res.data.channels
        // console.log(res)
        // console.log(this.channels)

        let channels = []
        if (this.user) {
          // 这是已登录的状态，请求获取用户的频道列表
          const {
            data: res
          } = await getUserChannels()
          channels = res.data.channels
        } else {
          // 未登录状态  判断是否有本地的频道列表数据
          const localChannels = getItem('TOUTIAP_CHANNELS')
          // 如果有的话  就直接拿来使用
          if (localChannels) {
            channels = localChannels
          } else {
            // 没有的话，就返回默认的列表
            const {
              data: res
            } = await getUserChannels()
            channels = res.data.channels
          }
        }
        this.channels = channels
      } catch (err) {
        this.$toast('获取频道列表数据失败！')
      }
    },

    // 根据子组件 的切换频道功能实现 active 的切换
    onUpdateActive(index, isChannelEditShow = true) {
      // 更新激活的频道项
      this.active = index
      // 关闭编辑频道的弹出层
      this.isChannelEditShow = isChannelEditShow
    },
  },
}
</script>

<style lang="less" scoped>
.home-container {
  padding-top: 174px;
  padding-bottom: 100px;

  .search-btn {
    width: 555px;
    height: 64px;
    background-color: #5babfb;
    border: none;
    font-size: 28px;

    .van-icon {
      font-size: 32px;
    }
  }

  /deep/ .channel-tabs {
    .van-tabs__content {
      // 响应式布局单位： vw  和  vh
      // vw: 1vw = 布局视口宽度的1%
      // vh: 1vh = 布局视口高度的1%
      min-height: 79vh;
    }

    .van-tabs__wrap {
      position: fixed;
      top: 92px;
      left: 0;
      right: 0;
      z-index: 1;
      height: 82px;
    }

    .van-tab {
      min-width: 200px;
      // height: 82px;
      border-right: 1px solid #edeff3;
      font-size: 30px;
      color: #777;
    }

    .van-tab--active {
      color: #333;
    }

    .van-tabs__nav {
      padding-bottom: 0;
    }

    .van-tabs__line {
      width: 31px;
      height: 6px;
      border-radius: 3px;
      bottom: 8px;
      background-color: #3296fa;
    }

    .placeholder {
      // 不让这个占位的元素参数 父节点flex 布局 宽度的平分
      flex-shrink: 0;
      width: 66px;
      height: 82px;
    }

    .hamburger-btn {
      position: fixed;
      right: 0;
      width: 66px;
      height: 82px;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #fff;
      opacity: 0.902;

      i.toutiao {
        font-size: 33px;
      }

      &:before {
        content: '';
        position: absolute;
        left: 0;
        width: 1px;
        height: 100%;
        background-image: url('~@/assets/gradient-gray-line.png');
        background-size: content;
      }
    }
  }
}
</style>
