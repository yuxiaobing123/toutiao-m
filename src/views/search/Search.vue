<template>
<div class="search-container">
  <!-- 顶部搜索栏 -->
  <form action="/" class="search-form">
    <van-search v-model="searchText" show-action placeholder="请输入搜索关键词" background="#3296fa" @search="onSearch" @cancel="onCancel" @focus="isResultShow = false" />
  </form>

  <!-- 搜索出来的内容 -->
  <search-result v-if="isResultShow" :search-text="searchText" />

  <!-- 联想建议 的搜索内容 -->
  <search-suggestion v-else-if="searchText" :search-text="searchText" @search="onSearch" />

  <!-- 搜索的历史记录 -->
  <search-history v-else :search-histories="searchHistories" @clear-searchHistories="searchHistories = []" @search="onSearch" />
</div>
</template>

<script>
// 导入三个子组件
import SearchHistory from './components/search-history'
import SearchSuggestion from './components/search-suggestion'
import SearchResult from './components/search-result'
import {
  setItem,
  getItem
} from '@/utils/storage'

export default {
  name: 'Search',
  data() {
    return {
      // 搜索关键字
      searchText: '',
      // 控制搜索结果的显示和隐藏、
      isResultShow: false,
      // 搜索记录
      searchHistories: getItem('TOUTIAO_SEARCH_HISTORIES') || [],
    }
  },
  watch: {
    searchHistories(value) {
      setItem('TOUTIAO_SEARCH_HISTORIES', value)
    },
  },
  computed: {},
  methods: {
    onSearch(val) {
      this.searchText = val
      // this.$toast(val)

      // 存储搜索记录
      // 要求： 不能有重复的搜索记录， 而且最新的搜索记录还要排在最前边
      const index = this.searchHistories.indexOf(val)
      if (index !== -1) {
        this.searchHistories.splice(index, 1)
      }
      this.searchHistories.unshift(val)

      // 渲染搜索结果
      this.isResultShow = true
    },
    onCancel() {
      this.$toast('取消')
    },
  },
  components: {
    SearchHistory,
    SearchSuggestion,
    SearchResult,
  },
}
</script>

<style lang="less" scoped>
.search-container {
  padding-top: 108px;

  .van-search__action {
    color: #fff;
  }

  .search-form {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1;
  }
}
</style>
