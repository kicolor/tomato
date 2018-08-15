<template>
  <div class="today" ref="today">
    <scroll ref="scroll" class="today-content" :data="discList">
      <div>
        <div v-if="recommends.length" class="slider-wrapper" ref="sliderWrapper">
          <slider>
            <div v-for="item in recommends">
              <a :href="item.linkUrl">
                <img class="needsclick" @load="loadImage" :src="item.picUrl">
              </a>
            </div>
          </slider>
        </div>
        <div v-show="planList.length" class="plan-list">
            <plan-list ref="list" :plan-list="sequencePlanList"/>
        </div>
      </div>
      <tips v-show="loadMatter && !planList.length" :type="type" class="tips"></tips>
      <div class="loading-container" v-show="!loadMatter">
        <loading></loading>
      </div>
      <router-view></router-view>
    </scroll>
  </div>
</template>

<script type="text/ecmascript-6">
  import Slider from 'base/slider/slider'
  import Loading from 'base/loading/loading'
  import Scroll from 'base/scroll/scroll'
  import Tips from 'base/tips/tips'
  import PlanList from 'base/plan-list/plan-list'
  import Calendar from 'base/calendar/calendar'
  import {getRecommend, getDiscList} from 'api/recommend'
  import { getAllMatter } from 'api/matter'
  import { getDayStr } from 'common/js/util'
  import {playlistMixin} from 'common/js/mixin'
  import {ERR_OK} from 'api/config'
  import {mapGetters, mapMutations} from 'vuex'
  // import { loadPlanList } from 'common/js/cache'

  export default {
    mixins: [playlistMixin],
    // beforeRouteEnter (to, from, next) {
    //   next(vm => {
    //     vm._getPlanList()
    //   })
    // },
    // beforeRouteUpdate (to, from, next) {
    //   this._getPlanList()
    //   next()
    // },
    data() {
      return {
        recommends: [],
        discList: [],
        // sequencePlanList: [],
        allMatter: [],
        today: true,
        // hasPlan: true,
        type: 1
      }
    },
    computed: {
      sequencePlanList() {
        // console.log('sequencePlanList')
        return this._normalizePlan(this.planList)
      },
      ...mapGetters([
        'loadMatter',
        'planList'
      ])
    },
    created() {
      this._getRecommend()
      this._getDiscList()
      // this._getPlanList()
    },
    methods: {
      handlePlaylist(playlist) {
        const bottom = playlist.length > 0 ? '60px' : ''
        this.$refs.today.style.bottom = bottom
        this.$refs.scroll.refresh()
      },
      loadImage() {
        if (!this.checkloaded) {
          this.checkloaded = true
          this.$refs.scroll.refresh()
        }
      },
      _getRecommend() {
        getRecommend().then((res) => {
          if (res.code === ERR_OK) {
            this.recommends = res.data.slider
          }
        })
      },
      _getDiscList() {
        getDiscList().then((res) => {
          if (res.code === ERR_OK) {
            this.discList = res.data.list
          }
        })
      },
      _getPlanList() {
        getAllMatter({include: 'plan', where: {state: true, archive: false}, order: ['createdAt ASC']}).then((res) => {
          if (res.code === ERR_OK) {
            if (res.data.length > 0) {
              // this.hasPlan = true
              this.allMatter = res.data
              let list = this._sortPlanList(res.data)
              this.setPlanList(list)
              // this.sequencePlanList = this._normalizePlan(list)
            } else {
              // this.hasPlan = false
            }
            this.loading = false
          }
        })
      },
      _normalizePlan(list) {
        let today = {
          title: '今日计划',
          items: []
        }
        let over = {
          title: '逾期计划',
          items: []
        }
        let complete = {
          title: '已完成',
          items: []
        }
        if (list.length > 0) {
          // this.hasPlan = true
          list.forEach((item) => {
            if (this._isOver(item.updatedAt)) {
              over.items.push(item)
            } else {
              today.items.push(item)
            }
            if (item.complete) {
              complete.items.push(item)
            }
          })
        }
        let arr = [over, today, complete]
        return arr
      },
      _sortPlanList(list) {
        let temp = []
        list.map(group => {
          group.plan.map(item => {
            let target = {
              desc: group.desc,
              proName: group.proName
            }
            item = Object.assign({}, item, target)
            let index = this._getIndexOfSortArr(temp, item)
            temp.splice(index, 0, item)
          })
        })
        return temp
      },
      _getIndexOfSortArr(arr, i) {
        let index = arr.findIndex(item => item.updatedAt > i.updatedAt)
        if (index === -1) {
          return arr.length
        } else {
          return index
        }
      },
      _isOver(str) {
        let day = getDayStr()
        if (new Date(str).getTime() > new Date(day).getTime()) {
          return false
        } else {
          return true
        }
      },
      ...mapMutations({
        setDisc: 'SET_DISC',
        setPlanList: 'SET_PLAN_LIST'
      })
    },
    components: {
      Slider,
      Loading,
      Scroll,
      Tips,
      PlanList,
      Calendar
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .today
    position: fixed
    width: 100%
    top: 176px
    .calendar
      display: flex
      justify-content: center
      margin-top: 40px
    .today-content
      height: 100%
      overflow: hidden
      .slider-wrapper
        position: relative
        width: 100%
        overflow: hidden
      .plan-list
        .list-title
          height: 100px
          line-height: 100px
          text-align: center
          font-size: $font-size-large
          color: $color-theme
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
