<template>
  <div class="play" v-if="tomatoList.length > 0">
    <transition name="slide">
      <div class="normal-play" v-show="fullScreen">
        <div class="back" @click="back">
          <i class="icon-back"></i>
        </div>
        <scroll class="scroll">
          <div class="scroll-content" ref="content">
            <Tomato :total-pomodoro = "totalPomodoro"
                    :work-duration = "workDuration"
                    :rest-duration = "restDuration"
                    :diameter = "diameter"
                    :start-color = "startColor"
                    :stop-color = "stopColor"
                    :inner-text-color = "innerTextColor"
                    :stroke-width = "strokeWidth"
                    :inner-stroke-color = "innerStrokeColor"
                    :desc="currentTomato.desc"
                    class="tomato">
            </Tomato>
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
    <transition name="mini">
      <div class="mini-play" v-show="!fullScreen" @click="open">
        <div class="icon" ref="icon">
          <Tomato :total-pomodoro = "totalPomodoro"
                  :work-duration = "workDuration"
                  :rest-duration = "restDuration"
                  :diameter = "diameter"
                  :start-color = "startColor"
                  :stop-color = "stopColor"
                  :inner-text-color = "innerTextColor"
                  :stroke-width = "miniStrokeWidth"
                  :inner-stroke-color = "innerStrokeColor"
                  class="mini-tomato">
          </Tomato>
        </div>
        <div class="text">
          <h2 class="name" v-html="currentTomato.desc"></h2>
          <p class="desc" v-html="currentTomato.proName"></p>
        </div>
        <div class="control">
          <progress-circle :radius="radius" :percent="percent">
            <i @click.stop="togglePlaying" class="icon-mini" :class="miniIcon"></i>
          </progress-circle>
        </div>
        <div class="control" @click.stop="showPlaylist">
          <!-- <i class="icon-playlist"></i> -->
          <x-icon class="icon-playlist" type="clipboard"></x-icon>
        </div>
      </div>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll'
  import Tomato from 'components/tomato/tomato'
  import ProgressBar from 'base/progress-bar/progress-bar'
  import ProgressCircle from 'base/progress-circle/progress-circle'
  import {createSong} from 'common/js/song'
  import {mapGetters, mapMutations} from 'vuex'

  export default {
    computed: {
      cdCls() {
        return this.playing ? 'play' : 'play pause'
      },
      miniIcon() {
        return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
      },
      title() {
        return this.singer.name
      },
      bgImage() {
        return this.singer.avatar
      },
      percent() {
        // return this.currentTime / this.currentSong.duration
      },
      diameter() {
        if (this.fullScreen) {
          return 300
          // return this.$refs.content.clientWidth * 0.8
        } else {
          return 60
          // return this.$refs.icon.clientHeight * 0.8
        }
      },
      ...mapGetters([
        'playing',
        'fullScreen',
        'singer',
        'tomatoList',
        'currentTomato'
      ])
    },
    data() {
      return {
        // play: true,
        // fullScreen: false,
        radius: 32,
        totalPomodoro: 4,
        workDuration: 25,
        restDuration: 5,
        startColor: '#CCFFFF',
        stopColor: '#99CCCC',
        strokeWidth: 10,
        miniStrokeWidth: 4,
        innerStrokeColor: '#C09C7C',
        innerTextColor: '#FF6666'
        // diameter: 300,
        // miniDiameter: 60
        // currentTomato: {
        //   desc: 'plan-name',
        //   proName: 'project-name'
        // }
      }
    },
    created() {
      // console.log('play.state', this.$root.$data)
      this._getDetail()
    },
    mounted() {
      // this.diameter = this.$refs.content.clientWidth * 0.8
      // this.miniDiameter = this.$refs.icon.clientHeight * 0.8
      // console.log('this.miniDiameter', this.miniDiameter)
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
        // this.$router.back()
        this.setFullScreen(false)
      },
      open() {

      },
      togglePlaying () {

      },
      showPlaylist () {
        console.log('tomatoList', this.tomatoList)
      },
      ...mapMutations({
        setFullScreen: 'SET_FULL_SCREEN'
      })
    },
    components: {
      Scroll,
      Tomato,
      ProgressBar,
      ProgressCircle
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .slide-enter-active, .slide-leave-active
    transition: all .5s
  .slide-enter, .slide-leave-to
    transform: translate3d(-100%, 0, 0)

  .mini-enter-acive, .mini-leave-active
    transition: all .4s
  .mini-enter, .mini-leave-to
    opacity: 0

  .play
    .normal-play
      position: fixed
      z-index: 150
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

    .mini-play
      display: flex
      align-items: center
      position: fixed
      left: 0
      bottom: 0
      z-index: 180
      width: 100%
      height: 120px
      background: $color-highlight-background
      &.mini-enter-active, &.mini-leave-active
        transition: all 0.4s
      &.mini-enter, &.mini-leave-to
        opacity: 0
      .icon
        flex: 0 0 80px
        width: 120px
        padding: 0 20px
        img
          border-radius: 50%
          &.play
            animation: rotate 10s linear infinite
          &.pause
            animation-play-state: paused
      .text
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        line-height: 40px
        overflow: hidden
        .name
          margin-bottom: 4px
          no-wrap()
          font-size: $font-size-large
          color: $color-text
        .desc
          no-wrap()
          font-size: $font-size-medium
          color: $color-text-d
      .control
        flex: 0 0 60px
        width: 60px
        padding: 0 20px
        .icon-play-mini, .icon-pause-mini
          font-size: 60px
          color: $color-theme-d
        .icon-playlist
          fill: $color-theme-d
          height: 100%
          width: 60px
        .icon-mini
          font-size: 64px
          position: absolute
          left: 0
          top: 0

</style>
