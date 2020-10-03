<template>
<div class="channel-edit">
  <!-- 头部 区域 -->
  <van-cell :border="false">
    <div slot="title" class="title-text">我的频道</div>
    <van-button class="edit-btn" type="danger" plain round size="mini" @click="isEdit = !isEdit">{{ isEdit ? '完成' : '编辑' }}</van-button>
  </van-cell>

  <!-- 已有频道的宫格区域 -->
  <van-grid class="my-grid" :gutter="10">
    <van-grid-item class="grid-item" v-for="(channel, index) in myChannels" :key="index" @click="onMychannelClick(channel, index)">
      <van-icon v-show="isEdit && !fixdChannels.includes(channel.id)" slot="icon" name="close"></van-icon>
      <span class="text" slot="text" :class="{ active: index === active }">{{
          channel.name
        }}</span>
    </van-grid-item>
  </van-grid>

  <!-- 下边的频道推荐模块 -->
  <van-cell :border="false">
    <div slot="title">频道推荐</div>
  </van-cell>

  <!-- 添加频道的宫格区域 -->
  <van-grid class="recommend-grid" :gutter="10">
    <van-grid-item class="grid-item" v-for="(channel, index) in recommendChannels" :key="index" :text="channel.name" icon="plus" @click="onAddChannels(channel)" />
  </van-grid>
</div>
</template>

<script>
import {
  getAllChannels,
  addUserChannel,
  deleteUserChannels,
} from '@/api/channel.js'

import {
  mapState
} from 'vuex'

import {
  setItem
} from '@/utils/storage'

export default {
  name: 'ChannelEdit',
  props: {
    myChannels: {
      type: Array,
      required: true,
    },
    active: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      // 所有频道的数据
      allChannels: [],
      // 控制编辑状态的显示
      isEdit: false,
      // 固定的频道 不允许被删除的  是一个数组，存的是id，推荐频道不允许删除，把id 0  加进去
      fixdChannels: [0],
    }
  },
  created() {
    this.loadAllChannels()
  },
  methods: {
    async loadAllChannels() {
      try {
        const {
          data: res
        } = await getAllChannels()
        console.log(res)
        this.allChannels = res.data.channels
      } catch (err) {
        this.$toast('获取频道数据失败！')
      }
    },

    // 点击推荐频道的内容，添加到我的频道
    async onAddChannels(channel) {
      // console.log(channel)
      this.myChannels.push(channel)

      // 数据的持久化处理
      // 可以根据 vuex 映射过来的 user 的信息判断用户是否登录了
      if (this.user) {
        // 已登录  把数据请求接口放到线上
        try {
          await addUserChannel({
            id: channel.id, //  频道id
            // 这个序号就是当前我的频道中的所有内容，也就相当于是我的频道这个数组的长度
            seq: this.myChannels.length, // 序号
          })
        } catch (err) {
          this.$toast('添加失败，请稍后重试！')
        }
      } else {
        // 未登录  把数据存储到本地
        setItem('TOUTIAO_CHANNELS', this.myChannels)
      }
    },

    // 点击我的频道按钮，实现删除或者切换频道的功能
    onMychannelClick(channel, index) {
      // 如果是固定频道，就不删除
      if (this.fixdChannels.includes(channel.id)) {
        return
      }
      if (this.isEdit) {
        // 如果是编辑状态的话就执行删除操作
        if (index <= this.active) {
          // 如果删除的是 当前激活项 的前边的，就让激活项 的索引 active -1
          this.$emit('update-active', this.active - 1, true)
        }
        this.myChannels.splice(index, 1)

        // 持久化的删除  单独封装一个函数  在这里调用即可
        this.deleteChannel(channel)
      } else {
        // 如果是非编辑状态的话就执行 切换功能
        // 切换不能在这里直接修改 active 的值  要通过父子组件之间的传值
        this.$emit('update-active', index, false)
      }
    },
    // 实现永久性的删除频道项
    async deleteChannel(channel) {
      try {
        if (this.user) {
          // 已登录  把数据从后台数据库给删除
          await deleteUserChannels(channel.id)
        } else {
          // 未登录   把数据从本地存储中给删除 只需要重新存储即可
          setItem('TOUTIAO_CHANNELS', this.myChannels)
        }
      } catch (err) {
        this.$toast('删除失败，请稍后重试！')
      }
    },
  },
  computed: {
    ...mapState(['user']),
    recommendChannels() {
      // 数组的filter方法遍历数组，把符合条件的元素存储到新的数组中
      return this.allChannels.filter((channel) => {
        // 数组的find 方法，遍历数组，把符合条件的第一个元素返回
        return !this.myChannels.find((mychannel) => {
          return mychannel.id === channel.id
        })
      })
    },
  },
}
</script>

<style lang="less" scoped>
.channel-edit {
  padding: 85px 0;

  .edit-btn {
    width: 104px;
    height: 48px;
    font-size: 26px;
    color: #f85959;
    border: 1px solid #f85959;
  }

  .grid-item {
    width: 160px;
    height: 86px;

    /deep/ .van-grid-item__content {
      white-space: nowrap;
      background-color: #f5f5f6;

      .van-grid-item__text,
      .text {
        color: #222;
        font-size: 28px;
        margin-top: 0;
      }

      .active {
        color: red;
      }

      .van-grid-item__icon-wrapper {
        position: unset;
      }
    }
  }

  // 右上角关闭图标
  /deep/ .van-icon-close {
    position: absolute;
    right: -10px;
    top: -10px;
    font-size: 36px;
    color: #ccc;
    z-index: 2;
  }

  // 加号的处理
  /deep/ .recommend-grid {
    .van-grid-item__content {
      flex-direction: row;
      color: #222;

      .van-icon-plus {
        font-size: 28px;
        margin-right: 6px;
      }

      .van-grid-item__text {
        font-size: 28px;
      }
    }
  }
}
</style>
