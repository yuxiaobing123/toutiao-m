<template>
<div class="update-gender">
  <van-picker title="标题" show-toolbar :columns="columns" @confirm="onConfirm" @cancel="onCancel" @change="onChange" :default-index="value" />
</div>
</template>

<script>
import {
  updateUserProfile
} from '@/api/user'

export default {
  name: 'UpdateGender',
  props: {
    value: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      columns: ['男', '女'],
      localGender: this.value,
    }
  },
  methods: {
    async onConfirm() {
      this.$toast.loading({
        message: '保存中...',
        forbidClick: true,
        duration: 0,
      })
      try {
        const localGender = this.localGender

        await updateUserProfile({
          gender: this.localGender,
        })

        // 更新视图
        this.$emit('input', localGender)

        // 关闭弹出层
        this.$emit('close')

        // 提示更新成功
        this.$toast.success('更新昵称成功！')
      } catch (err) {
        this.$toast.fail('更新失败！')
      }
    },

    onCancel() {
      this.$emit('close')
    },

    onChange(picken, value, index) {
      this.localGender = 0
    },
  },
}
</script>

<style lang="less" scoped>
</style>
