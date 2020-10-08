<template>
<div class="update-birthday">
  <!-- currentDate  双向绑定了日期选择器  
        设置日期选择器的默认值
        同步日期选择器选择的日期      
 -->
  <van-datetime-picker v-model="currentDate" type="date" title="选择年月日" :min-date="minDate" :max-date="maxDate" @cancel="$emit('close')" @confirm="onConfirm" />
</div>
</template>

<script>
import {
  updateUserProfile
} from '@/api/user'

import dayjs from 'dayjs'

export default {
  name: 'UpdateBirthday',
  props: {
    value: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      minDate: new Date(1970, 0, 1),
      maxDate: new Date(),
      currentDate: new Date(this.value),
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
        const currentDate = dayjs(this.currentDate).format('YYYY-MM-DD')

        await updateUserProfile({
          birthday: currentDate,
        })

        // 更新视图
        this.$emit('input', currentDate)

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
</style>
