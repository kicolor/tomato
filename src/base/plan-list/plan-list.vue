<template>
  <scroll :probe-type="probeType"
          :click="click"
          :data="planList"
          class="listview"
          ref="listview">
    <ul>
      <li v-for="group in planList" class="list-group" ref="listGroup" :key="group.title" v-show="hasPlan(group)">
        <h2 class="list-group-title">{{group.title}}</h2>
        <plan-item v-show="showItem(group.title, plan)" v-for="plan in group.items" :plan="plan" :key="plan.id" :plan-index="planIndex"  @click.native="selectItem(plan)" @complete="isComplete" @select="select" @start="startPlan"/>
      </li>
    </ul>
  </scroll>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import PlanItem from 'base/plan-item/plan-item'
  import { ERR_OK } from 'api/config'
  import { updatePlan } from 'api/plan'
  import {mapActions} from 'vuex'

  export default {
    created() {
      this.probeType = 3
      this.click = false
      this.touch = {}
      this.listHeight = []
    },
    props: ['planList'],
    data() {
      return {
        planIndex: 0
      }
    },
    methods: {
      selectItem(item) {
        if (this.planIndex === item.id) {
          this.planIndex = 0
        } else {
          this.planIndex = item.id
        }
      },
      isComplete(plan) {
        let _id = plan.id
        let updateData = {
          complete: !plan.complete
        }
        updatePlan(_id, updateData).then(res => {
          if (res.code === ERR_OK) {
            this.modifyPlan({
              plan: res.data,
              matterId: res.data.matter
            })
            // let list = this._updatePlan(res.data)
            // this.$emit('update:planList', list)
          }
        })
      },
      startPlan(plan) {
        // if (plan.id) {
        //   this.selectPlan(plan)
        //   this.$router.push({
        //     name: 'play'
        //     // params: {
        //     //   id: plan.id
        //     // }
        //   })
        // } else {
        //   this.$router.push({
        //     path: '/today'
        //   })
        // }
        this.selectPlan(plan)
      },
      select(plan) {
        if (plan.id) {
          this.$router.push({
            name: 'planDetail',
            params: {
              plan: plan
            }
          })
        } else {
          this.$router.push({
            path: '/today'
          })
        }
      },
      hasPlan(group) {
        if (group.items.length > 0) {
          if (group.title === '已完成') {
            return true
          }
          let flag = false
          group.items.forEach(plan => {
            if (!plan.complete) {
              flag = true
            }
          })
          return flag
        } else {
          return false
        }
      },
      showItem(title, plan) {
        if (title === '已完成') {
          return true
        } else {
          return !plan.complete
        }
      },
      _updatePlan(plan) {
        let temp1 = {}
        let temp2 = {}
        let list = this.planList.filter((group, index) => {
          group.items.map((item, i) => {
            if (item.id === plan.id) {
              item.complete = plan.complete
              if (item.complete) {
                temp2 = item
              } else {
                if (index === 0) {
                  group.items.splice(i, 1)
                  temp1 = item
                }
              }
              if (index === 2) {
                group.items.splice(i, 1)
              }
            }
          })
          return true
        })
        if (Object.keys(temp1).length !== 0) {
          list[1].items.push(temp1)
        }
        if (Object.keys(temp2).length !== 0) {
          list[2].items.push(temp2)
        }
        return list
      },
      _calculateHeight() {
        this.listHeight = []
        const list = this.$refs.listGroup
        let height = 0
        this.listHeight.push(height)
        for (let i = 0; i < list.length; i++) {
          let item = list[i]
          height += item.clientHeight
          this.listHeight.push(height)
        }
      },
      ...mapActions([
        'selectPlan',
        'modifyPlan'
      ])
    },
    watch: {
      planList() {
        setTimeout(() => {
          this._calculateHeight()
        }, 20)
      },
      '$route' (to, from) {
        this.planIndex = 0
      }
    },
    components: {
      Scroll,
      Loading,
      PlanItem
    }
  }

</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      .list-group-title
        height: 50px
        line-height: 50px
        padding-left: 30px
        font-size: $font-size-medium
        color: $base-orange
        background: $color-highlight-background
</style>
