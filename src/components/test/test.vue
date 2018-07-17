<template>
  <div class="statistic-content">
    <scroll
    ref="cal"
    class="statistic"
    :probe-type="probeType"
    :click="click"
    >
      <div>
        <calendar class="calendar"></calendar>
        <calendar-map></calendar-map>
      </div>
    </scroll>
  </div>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll'
  import Calendar from 'base/calendar/calendar'
  import CalendarMap from 'components/calendar-map/calendar-map'

  export default {
    created() {
      this.probeType = 1
      this.listenScroll = true
      this.click = false
    },
    data () {
      return {
      }
    },
    methods: {

    },
    components: {
      Scroll,
      Calendar,
      CalendarMap
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

.statistic-content
    position: fixed
    width: 100%
    top: 176px
    bottom: 0
    .statistic
      height: 100%
      overflow: hidden
      .calendar
        display: flex
        justify-content: center
        margin: 10px
</style>
