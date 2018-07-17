<template>
  <group class="vux-group">
    <cell class="title" :title="type"></cell>
    <ul>
      <li v-for="item in list">
        <cell :title="item.desc" value="" :link="{name: 'matterDetail', params: {matter: item} }"></cell>
      </li>
    </ul>
    <x-input v-show="isAdd" :title="title" :placeholder="placeholder" v-model="val" @on-enter="addToList">
      <x-icon slot="label" class="add-circle" type="add-circle-outline"></x-icon>
    </x-input>
  </group>
</template>

<script type="text/ecmascript-6">

  import { Group, Cell, XInput } from 'vux'

  export default{
    created() {
      if (this.type === '已归档任务') {
        this.isAdd = false
      }
    },
    props: ['type', 'list'],
    data() {
      return {
        title: '添加',
        placeholder: `添加一项任务至${this.type}`,
        val: '',
        isAdd: true
      }
    },
    methods: {
      addToList() {
        this.$emit('add-matter', this.val)
        this.val = ''
      }
    },
    components: {
      Group,
      Cell,
      XInput
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .vux-group
    .title
      border-top: 1px solid $color-highlight-background
      color: $base-orange-dd
      font-size: $font-size-medium-x
    .add-circle
      width: 40px
      padding-right: 20px
      fill: $color-theme-d
</style>
