<template>
  <div class="search-box">
    <!-- <span>计划</span> -->
    <i class="icon-search"></i>
    <input ref="query" v-model="query" class="box" :placeholder="placeholder" @keyup.enter="addPro"/>
    <i @click="clear" v-show="query" class="icon-dismiss"></i>
  </div>
</template>

<script type="text/ecmascript-6">
  import {debounce} from 'common/js/util'

  export default {
    props: {
      placeholder: {
        type: String,
        default: '搜索计划'
      }
    },
    data() {
      return {
        query: ''
      }
    },
    methods: {
      clear() {
        this.query = ''
      },
      setQuery(query) {
        this.query = query
      },
      blur() {
        this.$refs.query.blur()
      },
      addPro() {
        console.log('addPro')
        this.$emit('add')
      }
    },
    created() {
      this.$watch('query', debounce((newQuery) => {
        this.$emit('query', newQuery)
      }, 200))
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .search-box
    display: flex
    align-items: center
    box-sizing: border-box
    width: 100%
    padding: 0 12px
    height: 80px
    background: $color-highlight-background
    border-radius: 12px
    .icon-search
      font-size: 48px
      color: $color-background
    .box
      flex: 1
      margin: 0 10px
      line-height: 36px
      background: $color-highlight-background
      color: $color-text
      font-size: $font-size-medium
      &::placeholder
        color: $color-text-d
    .icon-dismiss
      font-size: 32px
      color: $color-background
</style>
