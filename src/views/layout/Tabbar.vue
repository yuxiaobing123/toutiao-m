<template>
<div class="layout-container">
  <!-- 子路由出口 -->
  <router-view></router-view>

  <!-- 底部 tabbar 导航栏 -->
  <!-- router  开启路由模式 -->
  <van-tabbar class="layout-tabbar" route>
    <!-- 首页 -->
    <van-tabbar-item to="/">
      <i slot="icon" class="toutiao toutiao-shouye"></i>
      <span class="text">首页</span>
    </van-tabbar-item>
    <!-- 问答 -->
    <van-tabbar-item to="/question">
      <i slot="icon" class="toutiao toutiao-wenda"></i>
      <span class="text">问答</span>
    </van-tabbar-item>
    <!-- 视频 -->
    <van-tabbar-item to="/video">
      <i slot="icon" class="toutiao toutiao-shipin"></i>
      <span class="text">视频</span>
    </van-tabbar-item>
    <!-- 我的 -->
    <van-tabbar-item to="/profile">
      <i slot="icon" class="toutiao toutiao-wode"></i>
      <span class="text">{{ $store.state.user ? '我的' : '未登录' }}</span>
    </van-tabbar-item>
  </van-tabbar>
</div>
</template>

<script>
export default {
  name: 'TabBar',
  data() {
    return {
      // tabbar 导航栏 被选中项 开启路由模式之后就不再起作用
      // active: 0,
    }
  },
}
</script>

<style lang="less" scoped>
.layout-container {
  .layout-tabbar {
    i.toutiao {
      font-size: 40px;
    }

    span.text {
      font-size: 20px;
    }
  }
}
</style>
