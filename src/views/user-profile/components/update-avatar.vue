<template>
<div class="update-avatar">
  <img :src="img" alt="" class="img" ref="img" />

  <div class="toolbar">
    <div class="cancel" @click="$emit('close')">取消</div>
    <div class="confirm" @click="onConfirm">完成</div>
  </div>
</div>
</template>

<script>
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'

import {
  updateUserPhoto
} from '@/api/user.js'

export default {
  name: 'UpdateAvatar',
  props: {
    img: {
      type: [String, Object],
      required: true,
    },
  },
  data() {
    return {
      cropper: null,
    }
  },
  mounted() {
    // const image = document.getElementById('image');
    const image = this.$refs.img
    this.cropper = new Cropper(image, {
      viewMode: 1, // 只能在裁剪的图片范围内移动
      dragMode: 'move', // 画布和图片都可以移动
      aspectRatio: 1, // 裁剪区默认正方形
      // autoCropArea: 1, // 自动调整裁剪图片
      cropBoxMovable: false, // 禁止裁剪区移动
      cropBoxResizable: false, // 禁止裁剪区缩放
      background: false, // 关闭默认背景
    })
  },
  methods: {
    onConfirm() {
      // 基于服务端的裁切使用 getData() 方法
      // console.log(this.cropper.getData())

      // 纯客户端的裁切使用 getCroppedCanvas 获取裁切的文件对象
      this.cropper.getCroppedCanvas().toBlob((blob) => {
        // console.log(blob)
        this.updateUserAvatar(blob)
      })
    },

    async updateUserAvatar(blob) {
      this.$toast.loading({
        message: '保存中...',
        forbidClick: true,
        duration: 0,
      })
      try {
        // 如果接口要求 Content-Type 是 application/json
        // 则传递普通的 JavaScript 对象
        // updateAvatar({photo: blob})

        // 如果接口要求 Content-Type 是 multipart/form-data
        // 则必须传递 FormData 对象
        // 这里需要传递的 参数就是 FormData 对象形式的
        const formData = new FormData()
        formData.append('photo', blob)
        const {
          data
        } = await updateUserPhoto(formData)

        // 关闭弹出层
        this.$emit('close')

        // 更新视图
        this.$emit('update-photo', data.data.photo)

        this.$toast.success('更新成功！')
      } catch (err) {
        console.log(err)
        this.$toast.fail('更新失败！')
      }
    },
  },
}
</script>

<style lang="less" scoped>
.update-avatar {
  background-color: #000;
  height: 100%;

  .img {
    display: block;
    max-width: 100%;
  }

  .toolbar {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-between;

    .cancel,
    .confirm {
      width: 90px;
      height: 90px;
      font-size: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;
    }
  }
}
</style>
