<template>
  <div class="plan" ref="plan">
    <plan-list ref="list" :plan-list="planList" :today="today"/>
    <div v-show="!hasTask" class="tips">
      <p>还没有创建任务</p>
      <p>马上开始第一个任务吧！</p>
      <router-link tag="p" class="add" to="/add">
      <x-icon class="add-circle" type="add-circle-outline"></x-icon>
    </router-link>
    </div>
    <div v-show="loading" class="loading-container">
      <loading></loading>
    </div>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import Loading from 'base/loading/loading'
  import {ERR_OK} from 'api/config'
  import PlanList from 'base/plan-list/plan-list'
  import {getAllPlan} from 'api/plan'

  export default {
    beforeRouteEnter (to, from, next) {
      console.log('plan beforeRouteEnter')
      setTimeout(() => {
        next(vm => {
          vm._getPlanList()
        })
      }, 20)
    },
    data() {
      return {
        planList: [],
        today: false,
        loading: true,
        hasTask: true
      }
    },
    methods: {
      add () {
        this.$router.push({
          path: '/add'
        })
      },
      handlePlaylist(playlist) {
        const bottom = playlist.length > 0 ? '60px' : ''
        this.$refs.plan.style.bottom = bottom
        this.$refs.list.refresh()
      },
      _getPlanList() {
        getAllPlan().then((res) => {
          if (res.code === ERR_OK) {
            if (res.data.length > 0) {
              this.hasTask = true
              if (this.today) {
                let temp = []
                temp.push(this._normalizePlan(res.data)[2])
                this.planList = temp
                console.log('today-planList', this.planList)
              } else {
                this.planList = this._normalizePlan(res.data)
                console.log('planList', this.planList)
              }
            } else {
              this.hasTask = false
            }
            this.loading = false
          }
        })
      },
      _normalizePlan(list) {
        let map = {}
        list.forEach((item, index) => {
          const key = item.key
          if (!map[key]) {
            map[key] = {
              title: key,
              items: []
            }
          }
          map[key].items.push(item)
        })
        // 处理 map，得到有序列表
        let orderList = []
        let order
        for (let key in map) {
          if (key === '#') {
            order = map[key]
          } else {
            let val = map[key]
            orderList.push(val)
          }
        }
        orderList.sort((a, b) => {
          return a.title.charCodeAt(0) - b.title.charCodeAt(0)
        })
        if (order) {
          orderList.push(order)
        }
        return orderList
      }
    },
    components: {
      Loading,
      PlanList
    }
  }

</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .plan
    position: fixed
    top: 176px
    bottom: 0
    width: 100%
    .tips
      position: absolute
      top: 50%
      transform: translateY(-50%)
      width: 100%
      p
        text-align: center
        margin: 20px auto
        color: $base-orange
        .add-circle
          fill: $color-theme-dd
          width: 60px
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
