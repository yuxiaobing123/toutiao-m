<template>
<div class="profile-container">
  <!-- 未登录状态 -->
  <div v-if="!user" class="header not-login">
    <div class="login-btn" @click="$router.push('/login')">
      <img class="mobile-img" src="~@/assets/mobile.png" alt="" />
      <span class="text">登录 / 注册</span>
    </div>
  </div>

  <!-- 已登录的状态 -->
  <div v-else class="header user-info">
    <div class="base-info">
      <div class="left">
        <van-image class="avatar" round fit="cover" :src="userInfo.photo" />
        <span class="name">{{ userInfo.intro }}</span>
      </div>
      <div class="right">
        <van-button size="mini" round to="/user/profile">编辑资料</van-button>
      </div>
    </div>
    <div class="data-stats">
      <!-- 头条  -->
      <div class="data-item">
        <span class="count">{{ userInfo.art_count }}</span>
        <span class="text">头条</span>
      </div>
      <!-- 关注  -->
      <div class="data-item">
        <span class="count">{{ userInfo.follow_count }}</span>
        <span class="text">关注</span>
      </div>
      <!-- 粉丝  -->
      <div class="data-item">
        <span class="count">{{ userInfo.fans_count }}</span>
        <span class="text">粉丝</span>
      </div>
      <!-- 获赞  -->
      <div class="data-item">
        <span class="count">{{ userInfo.like_count }}</span>
        <span class="text">获赞</span>
      </div>
    </div>
  </div>

  <!-- 宫格导航  -->
  <!-- clickable  开启点击反馈  就是点击的那一下会有一个动态效果 -->
  <van-grid :column-num="2" class="grid-nav mb-9" clickable>
    <van-grid-item class="grid-item">
      <i slot="icon" class="toutiao toutiao-shoucang"></i>
      <span slot="text" class="text">收藏</span>
    </van-grid-item>
    <van-grid-item class="grid-item">
      <i slot="icon" class="toutiao toutiao-lishi"></i>
      <span slot="text" class="text">历史</span>
    </van-grid-item>
  </van-grid>

  <van-cell title="消息通知" is-link />
  <van-cell class="mb-9" title="小智同学" is-link />
  <van-cell v-if="user" class="logout-cell" title="退出登录" @click="onLoginOut" clickable />
</div>
</template>

<script>
import {
  mapState
} from 'vuex'

import {
  getUserInfo
} from '@/api/user'

export default {
  name: 'profile',
  data() {
    return {
      // 用户个人信息
      userInfo: {},
    }
  },
  created() {
    // 先判断一下用户是否进行了登录
    if (this.user) {
      this.loadUserInfo()
    }
  },
  computed: {
    ...mapState(['user']),
  },
  methods: {
    // 实现点击 退出登录 按钮 的退出功能
    onLoginOut() {
      // 清除user 中的内容 和 本地存储
      // 在组件中必须使用  this.dialog 调用
      this.$dialog
        .confirm({
          title: '确认退出？',
        })
        .then(() => {
          // on confirm
          this.$store.commit('setUser', null)
        })
        .catch(() => {
          // on cancel
        })
    },

    // 获取用户的基本信息
    async loadUserInfo() {
      try {
        const {
          data: res
        } = await getUserInfo()
        console.log(res)
        this.userInfo = res.data
      } catch (err) {
        this.$toast('获取数据失败！请稍后重试')
      }
    },
  },
}
</script>

<style lang="less" scoped>
.profile-container {
  .header {
    height: 361px;
    background: url('~@/assets/banner.png');
    background-size: cover;
  }

  .not-login {
    display: flex;
    justify-content: center;
    align-items: center;

    .login-btn {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;

      .mobile-img {
        width: 132px;
        height: 132px;
        margin-bottom: 15px;
      }

      .text {
        font-size: 28px;
        color: #fff;
      }
    }
  }

  .user-info {
    .base-info {
      height: 231px;
      padding: 76px 32px 23px;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .left {
        display: flex;
        align-items: center;

        .avatar {
          width: 132px;
          height: 132px;
          margin-right: 23px;
          border: 4px solid #fff;
        }

        .name {
          font-size: 30px;
          color: #fff;
        }
      }
    }

    .data-stats {
      height: 130px;
      display: flex;

      .data-item {
        height: 100%;
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        color: #fff;

        .count {
          font-size: 36px;
        }

        .text {
          font-size: 23px;
        }
      }
    }
  }

  .grid-nav {
    .grid-item {
      height: 141px;
    }

    i.toutiao {
      font-size: 45px;
    }

    .toutiao-shoucang {
      color: #eb5253;
    }

    .toutiao-lishi {
      color: #ff9d1d;
    }

    span.text {
      font-size: 28px;
    }
  }

  .mb-9 {
    margin-bottom: 9px;
  }

  .logout-cell {
    text-align: center;
    color: #eb5253;
  }
}
</style>
