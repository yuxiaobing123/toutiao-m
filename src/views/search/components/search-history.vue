<template>
<div class="search-history">
  <!-- 头部 -->
  <van-cell title="搜索历史">
    <div v-if="isDeleteShow">
      <span @click="removeAllHistories">全部删除</span>
      &nbsp; &nbsp;
      <span @click="isDeleteShow = false">完成</span>
    </div>
    <van-icon v-else name="delete" @click="isDeleteShow = true"></van-icon>
  </van-cell>

  <!-- 内容 -->
  <van-cell :title="item" v-for="(item, index) in searchHistories" :key="index" @click="onSearchItemClick(item, index)">
    <van-icon v-show="isDeleteShow" name="close"></van-icon>
  </van-cell>
</div>
</template>

<script>
export default {
  name: 'SearchHistory',
  props: {
    // props 数据 是受父组件影响的
    // 如果是普通数据  （如 数字  字符串  布尔值） 是绝对不能通过子组件修改的
    //     即便通过子组件进行了更改   也不会传递给父组件
    //
    // 如果是引用类型的数据  （数组、对象）
    //    是可以修改的   例如数组的push 方法等   对象.*** = ***
    //    但是  不可以重新赋值
    searchHistories: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      // 控制删除按钮的显示和隐藏
      isDeleteShow: false,
    }
  },
  methods: {
    // 处理历史记录相关
    onSearchItemClick(item, index) {
      if (this.isDeleteShow) {
        // 删除状态  点击删除当前历史记录
        this.searchHistories.splice(index, 1)
      } else {
        // 非删除状态  点击实现搜索
        this.$emit('search', item)
      }
    },
    // 点击删除全部 按钮  实现删除所有的搜索历史记录
    removeAllHistories() {
      this.$emit('clear-searchHistories')
    },
  },
}
</script>

<style lang="less" scoped>
</style>
