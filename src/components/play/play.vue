<template>
  <transition name="slide">
    <div class="play">
      <div class="back" @click="back">
        <i class="icon-back"></i>
      </div>
      <scroll class="scroll">
        <div class="scroll-content" ref="content">
          <!-- <div class="pomodoro-display"> -->
            <Tomato :total-pomodoro = "totalPomodoro"
                      :work-duration = "workDuration"
                      :rest-duration = "restDuration"
                      :diameter = "diameter"
                      :start-color = "startColor"
                      :stop-color = "stopColor"
                      :inner-text-color = "innerTextColor"
                      :stroke-width = "strokeWidth"
                      :inner-stroke-color = "innerStrokeColor"
                      class="tomato">
            </Tomato>
          <!-- </div> -->
            <div class="play-disc">
              <p>
                <span class="desc-title">轻触：</span>
                <span class="desc-detail">开始一个新任务或跳到下一个时段</span>
              </p>
              <p>
                <span class="desc-title">长按：</span>
                <span class="desc-detail">开始计时前设置一个临时时长或停止所有任务</span>
              </p>
              <p>
                <span class="desc-title">双击：</span>
                <span class="desc-detail">停止当前任务并记录干扰事项</span>
              </p>
            </div>
        </div>
      </scroll>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  // import MusicList from 'components/music-list/music-list'
  import Scroll from 'base/scroll/scroll'
  import Tomato from 'components/tomato/tomato'
  import {createSong} from 'common/js/song'
  import {mapGetters} from 'vuex'

  export default {
    computed: {
      title() {
        return this.singer.name
      },
      bgImage() {
        return this.singer.avatar
      },
      ...mapGetters([
        'singer'
      ])
    },
    data() {
      return {
        totalPomodoro: 4,
        workDuration: 25,
        restDuration: 5,
        startColor: '#CCFFFF',
        stopColor: '#99CCCC',
        strokeWidth: 10,
        innerStrokeColor: '#C09C7C',
        innerTextColor: '#FF6666',
        diameter: 300
      }
    },
    created() {
      console.log('play.state', this.$root.$data)
      this._getDetail()
    },
    mounted() {
      this.diameter = this.$refs.content.clientWidth * 0.8
    },
    methods: {
      _getDetail() {
      },
      _normalizeSongs(list) {
        let ret = []
        list.forEach((item) => {
          let {musicData} = item
          if (musicData.songid && musicData.albummid) {
            ret.push(createSong(musicData))
          }
        })
        return ret
      },
      back() {
        this.$router.back()
      }
    },
    components: {
      Scroll,
      Tomato
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .slide-enter-active, .slide-leave-active
    transition: all .5s
  .slide-enter, .slide-leave-to
    transform: translate3d(-100%, 0, 0)

  .play
    position: fixed
    z-index: 100
    top: 0
    left: 0
    bottom: 0
    right: 0
    background: $color-background
    display: flex
    flex-direction: column
    .back
      position relative
      top: 0
      right: 6px
      z-index: 50
      .icon-back
        transform: rotate(180deg)
        display: block
        padding: 20px
        font-size: $font-size-large-x
        color: $color-theme
    .scroll
      flex: 1
      overflow: hidden
      .scroll-content
        display: flex
        flex-direction: column
        align-items: center
        .tomato
          margin-top: 100px
          width: 80%
        .play-disc
          margin-top: 60px
          color: $color-text-l
          font-size: $font-size-medium-x
          p
            margin: 40px
          span
            display: block
            margin: 5px 0

</style>
