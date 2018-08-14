<template>
  <group class="vux-group">
    <cell v-if="title" class="title" :title="title"></cell>
    <cell class="cell-item"
      v-for="(item, index) in list"
      :key="item.id"
      :title="item.name || item.desc"
      :value="_getCount(item)"
      @click.native="showItem(item, index)"
      ></cell>
    <x-input v-if="hasNew" title="添加" placeholder="新建项目" v-model="val" @on-enter="addToList">
      <x-icon slot="label" class="add-circle" type="add-circle-outline"></x-icon>
    </x-input>
  </group>
</template>

<script type="text/ecmascript-6">
  import { Group, Cell, XInput } from 'vux'

  export default {
    props: ['title', 'list', 'hasNew'],
    data() {
      return {
        val: ''
      }
    },
    methods: {
      showItem(item, index) {
        this.$emit('select', item, index)
      },
      addToList() {
        this.$emit('add-pro', this.val)
        this.val = ''
      },
      _getCount(item) {
        let count = 0
        let matter = item.matter || Array.of(item)
        matter.map(i => {
          count += i.fulfill
        })
        return count
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
