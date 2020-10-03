<template>
<div class="login-container">
  <!-- 导航栏 -->
  <van-nav-bar class="page-nav-bar" title="登录">
    <van-icon slot="left" name="cross" @click="$router.back()"></van-icon>
  </van-nav-bar>

  <!-- 登录表单 -->
  <van-form @submit="onSubmit" ref="loginFormRef">
    <van-field name="mobile" placeholder="请输入手机号" v-model="user.mobile" :rules="loginFormRules.mobile" type="number" maxlength="11">
      <!-- 左侧字体图标 -->
      <i slot="left-icon" class="toutiao toutiao-shouji"></i>
    </van-field>
    <van-field name="code" placeholder="请输入验证码" v-model="user.code" :rules="loginFormRules.code" type="number" maxlength="6">
      <!-- 左侧字体图标 -->
      <i slot="left-icon" class="toutiao toutiao-yanzhengma"></i>
      <!-- 右侧的发送验证码按钮 -->
      <template #button>
        <!-- 倒计时的时间  time 属性表示倒计时总时长，单位为毫秒。ss代表格式  后边的s 是字符  表示单位 秒-->
        <van-count-down :time="1000 * 60" format="ss s" v-if="isCountDownShow" @finish="isCountDownShow = false" />
        <van-button v-else class="send-sms-btn" round size="small" type="default" native-type="button" @click="sendCode">发送验证码</van-button>
      </template>
    </van-field>
    <div class="login-btn-wrap">
      <van-button class="login-btn" block type="info" native-type="submit">
        登录
      </van-button>
    </div>
  </van-form>
</div>
</template>

<script>
// 导入登录请求模块
import {
  login,
  sendSms
} from '@/api/user.js'

export default {
  name: 'LoginContainer',
  data() {
    return {
      user: {
        mobile: '13911111111', // 手机号
        code: '246810', // 验证码
      },
      // 表单的验证规则对象
      loginFormRules: {
        mobile: [{
            required: true,
            message: '手机号不能为空',
          },
          {
            pattern: /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-7|9])|(?:5[0-3|5-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[1|8|9]))\d{8}$/,
            message: '手机号格式不正确',
          },
        ],
        code: [{
            required: true,
            message: '验证码不能为空',
          },
          {
            pattern: /^\d{6}$/,
            message: '验证码格式不正确',
          },
        ],
      },
      // 控制倒计时的时间是否显示
      isCountDownShow: false,
    }
  },
  methods: {
    async onSubmit() {
      // 1、获取表单数据
      const user = this.user
      // 2、表单验证

      // 登录加载提示
      // 在组件中 必须使用 this.$toast 来调用该组件
      // 任何一个新的 toast 被触发之后都会替代前一个在显示的 toast
      this.$toast.loading({
        message: '登录中...',
        forbidClick: true, //  禁用背景点击
        duration: 0, //  登录显示提示时间  默认是2 秒   0 的话就一直显示
      })
      // 3、提交表单 请求登录
      try {
        const {
          data: res
        } = await login(user)
        // console.log('成功', res)
        this.$store.commit('setUser', res.data)
        this.$toast.success('登录成功！')
        // 登录成功之后再跳转会原来的界面
        // back 方式不严谨  优化时具体分析
        this.$router.back()
      } catch (err) {
        if (err.response.status === 400) {
          this.$toast.fail('手机号或验证码错误')
        } else {
          this.$toast.fail('未知错误，请稍后重试！')
        }
      }
      // 4、根据请求响应结果处理后续操作
    },
    // 点击发送验证码按钮  实现发送验证码的功能
    async sendCode() {
      // console.log(11)
      // 1、校验手机号
      try {
        await this.$refs.loginFormRef.validate('mobile')
      } catch (err) {
        return console.log('验证失败！', err)
      }
      // 2、验证通过的话 显示 倒计时
      this.isCountDownShow = true
      // 3、请求发送验证码
      try {
        await sendSms(this.user.mobile)
        this.$toast('发送成功！')
      } catch (err) {
        // 发送失败，关闭倒计时
        this.isCountDownShow = false
        // console.log(err)
        if (err.response.status === 429) {
          this.$toast('验证码发送太频繁了，请稍后重试')
        } else {
          this.$toast('发送失败，请稍后重试！')
        }
      }
    },
  },
}
</script>

<style lang="less" scoped>
.login-container {
  .toutiao {
    font-size: 37px;
  }

  .send-sms-btn {
    // width: 152px;
    height: 46px;
    line-height: 46px;
    background-color: #e6e6e6;
    color: #666;
    font-size: 22px;
  }

  .login-btn-wrap {
    padding: 53px 33px;

    .login-btn {
      background-color: #6db4fb;
      border: none;
      border-radius: 10px;
    }
  }
}
</style>
