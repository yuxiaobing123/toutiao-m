<template>
<div class="user-profile">
  <!-- 顶部的导航栏 -->
  <van-nav-bar title="个人信息" class="page-nav-bar" left-arrow @click-left="$router.back()"></van-nav-bar>

  <!-- 个人信息单元格 -->
  <input type="file" hidden @change="onFileChange" ref="file" />
  <van-cell title="头像" is-link @click="$refs.file.click()">
    <van-image class="avatar" fit="cover" round :src="user.photo" />
  </van-cell>
  <van-cell title="昵称" :value="user.name" is-link @click="isUpdateNameShow = true" />
  <van-cell title="性别" :value="user.gender === 0 ? '男' : '女'" is-link @click="isUpdateGenderShow = true" />
  <van-cell title="生日" :value="user.birthday" is-link @click="isUpdateBirthdayShow = true" />

  <!-- 编辑昵称的弹出层 -->
  <van-popup v-model="isUpdateNameShow" style="height: 100%" position="bottom">
    <update-name v-if="isUpdateNameShow" @close="isUpdateNameShow = false" v-model="user.name" />
  </van-popup>

  <!-- 编辑性别的弹出层 -->
  <van-popup v-model="isUpdateGenderShow" position="bottom">
    <update-gender v-if="isUpdateGenderShow" @close="isUpdateGenderShow = false" v-model="user.gender" />
  </van-popup>

  <!-- 编辑生日的弹出层 -->
  <van-popup v-model="isUpdateBirthdayShow" position="bottom">
    <update-birthday v-if="isUpdateBirthdayShow" @close="isUpdateBirthdayShow = false" v-model="user.birthday" />
  </van-popup>

  <!-- 编辑头像的弹出层 -->
  <van-popup v-model="isUpdateAvatarShow" position="bottom" style="height: 100%">
    <update-avatar v-if="isUpdateAvatarShow" :img="img" @close="isUpdateAvatarShow = false" @update-photo="user.photo = $event" />
  </van-popup>
</div>
</template>

<script>
import {
  getUserProfile
} from '@/api/user'

import UpdateName from './components/update-name'

import UpdateGender from './components/update-gender'

import UpdateBirthday from './components/update-birthday'

import UpdateAvatar from './components/update-avatar'

export default {
  name: 'UserProfile',
  data() {
    return {
      user: {}, // 个人信息
      // 编辑昵称的弹出层
      isUpdateNameShow: false,
      // 编辑性别的弹出层
      isUpdateGenderShow: false,
      // 编辑生日的弹出层
      isUpdateBirthdayShow: false,
      // 编辑头像的弹出层
      isUpdateAvatarShow: false,
      // 传递的头像的初始值  预览的图片
      img: null,
    }
  },
  created() {
    this.loadUserProfile()
  },
  methods: {
    async loadUserProfile() {
      try {
        const {
          data: res
        } = await getUserProfile()
        this.user = res.data
        console.log(this.user)
      } catch (err) {
        this.$toast('获取数据失败！')
      }
    },
    onFileChange() {
      // 获取文件对象
      const file = this.$refs.file.files[0]
      // 基于文件对象获取 blob 数据
      this.img = window.URL.createObjectURL(file)
      // console.log(data)
      // 展示预览图片的弹出层
      this.isUpdateAvatarShow = true

      // file-input  如果选择的是同一个文件的话  是不会触发change 事件的
      // 解决办法就是每次使用完毕之后，把它的value 值给清空
      this.$refs.file.value = ''
    },
  },
  components: {
    'update-name': UpdateName,
    'update-gender': UpdateGender,
    'update-birthday': UpdateBirthday,
    'update-avatar': UpdateAvatar,
  },
}
</script>

<style lang="less" scoped>
.user-profile {
  .avatar {
    width: 60px;
    height: 60px;
  }

  .van-popup {
    background-color: #f5f7f9;
  }
}
</style>
