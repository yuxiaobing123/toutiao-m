<template>
<div class="update-name">
  <!-- 头部导航 -->
  <van-nav-bar title="设置昵称" left-text="取消" right-text="完成" @click-left="$emit('close')" @click-right="onUpdate"></van-nav-bar>

  <!-- 输入框 -->
  <div class="field-wrap">
    <van-field v-model.trim="localName" rows="2" autosize="" placeholder="请输入昵称" show-word-limit maxlength="7" />
  </div>
</div>
</template>

<script>
import {
  updateUserProfile
} from '@/api/user'

export default {
  name: 'UpdateName',
  props: {
    value: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      localName: this.value,
    }
  },
  methods: {
    async onUpdate() {
      this.$toast.loading({
        message: '保存中...',
        forbidClick: true,
        duration: 0,
      })
      try {
        const localName = this.localName
        if (!localName.length) {
          this,
          $toast('昵称不能为空！')
          return
        }

        await updateUserProfile({
          name: this.localName,
        })

        // 更新视图
        this.$emit('input', localName)

        // 关闭弹出层
        this.$emit('close')

        // 提示更新成功
        this.$toast.success('更新昵称成功！')
      } catch (err) {
        this.$toast.fail('更新失败！')
      }
    },
  },
}
</script>

<style lang="less" scoped>
.field-wrap {
  padding: 20px;
}
</style>
