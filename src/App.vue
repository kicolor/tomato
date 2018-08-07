<template>
  <div id="app" @touchmove.prevent class="app">
    <m-header></m-header>
    <tab></tab>
    <keep-alive>
      <router-view :class="miniPlayCls"></router-view>
    </keep-alive>
    <play></play>
  </div>
</template>

<script type="text/ecmascript-6">
  import MHeader from 'components/m-header/m-header'
  import Tab from 'components/tab/tab'
  import Play from 'components/play/play'
  import {mapGetters} from 'vuex'

  export default {
    computed: {
      miniPlayCls() {
        return this.mode && !this.fullScreen ? 'mini-play' : 'normal-play'
      },
      ...mapGetters([
        'mode',
        'fullScreen'
      ])
    },
    components: {
      MHeader,
      Tab,
      Play
    }
  }
</script>

<style lang="stylus">
  @import "~common/stylus/index"

  .mini-play
    bottom: 120px

  .normal-play
    bottom: 0
</style>
