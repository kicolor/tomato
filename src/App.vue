<template>
  <div id="app" @touchmove.prevent class="app">
    <m-header></m-header>
    <tab></tab>
    <keep-alive>
      <router-view :class="miniPlayCls"></router-view>
    </keep-alive>
    <play ref="play"></play>
  </div>
</template>

<script type="text/ecmascript-6">
  import MHeader from 'components/m-header/m-header'
  import Tab from 'components/tab/tab'
  import Play from 'components/play/play'

  export default {
    data() {
      return {
        playing: true
      }
    },
    computed: {
      miniPlayCls() {
        return this.playing ? 'mini-play' : 'normal-play'
      }
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
