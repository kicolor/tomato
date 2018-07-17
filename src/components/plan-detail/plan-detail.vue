<template>
  <transition name="slide">
    <div class="project-wrapper">
      <div class="project-header vux-group">
        <p class="project-name">编辑计划</p>
        <i class="icon-back" @click="back"></i>
      </div>
      <scroll class="plan-detail">
        <div>
          <group class="vux-group" label-margin-right="2em" label-align="left">
            <popup-picker title="任务" :columns="2" :data="taskArr" v-model="task" :display-format="taskName" @on-change="changeTask" ref="task">
            </popup-picker>
            <cell title="番茄" :value="plan.fulfill"></cell>
            <cell title="耗时" :value="plan.spendTime"></cell>
            <cell title="预计消耗番茄">
              <inline-x-number style="display:block; background:#222;" :min="0" button-style="round" v-model="plan.predict"></inline-x-number>
            </cell>
            <cell title="添加日期" :value="date"></cell>
          </group>
          <x-button class="btn" @click.native="submit">存储</x-button>
          <x-button class="btn" @click.native="del">删除</x-button>
        </div>
      </scroll>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">

  import Scroll from 'base/scroll/scroll'
  import { Group, Cell, XButton, PopupRadio, PopupPicker, InlineXNumber } from 'vux'
  import { ERR_OK } from 'api/config'
  import { popupTips } from 'common/js/util'
  // import { getAllMatter } from 'api/matter'
  import { updatePlan, deletePlan } from 'api/plan'

  export default {
    beforeRouteEnter (to, from, next) {
      next(vm => {
        if (vm.plan) {
          console.log('vm.plan', vm.plan)
          vm.task.push(vm.plan.desc)
          vm.tips = ''
          vm._getTaskList(vm.allMatter)
        } else {
          vm.$router.push({
            path: '/today'
          })
        }
      })
    },
    beforeRouteLeave (to, from, next) {
      if (this.tips) {
        popupTips(this, 'success', this.tips, 1000)
        setTimeout(function() {
          next()
        }, 1000)
      } else {
        next()
      }
    },
    created () {
      // this._getTaskList()
    },
    props: ['plan', 'allMatter'],
    data () {
      return {
        tips: '',
        taskArr: [],
        task: [],
        taskName: function(val, name) {
          return name.split(' ')[1]
        }
      }
    },
    mounted() {
      // console.log('route', this.$route)
    },
    computed: {
      date() {
        return this.plan.createdAt && this.plan.createdAt.substring(0, 10)
      }
    },
    methods: {
      changeTask() {
        // console.log('task', this.task)
      },
      back () {
        this.$router.back()
      },
      submit () {
        const _id = this.plan.id
        let updateData = {
          predict: this.plan.predict,
          matter: this.task[1],
          'matter(uz*R*id)': this.task[1]
        }
        updatePlan(_id, updateData).then(res => {
          if (res.code === ERR_OK) {
            this.tips = '修改成功'
            this.$router.back()
          }
        })
      },
      del () {
        const _id = this.plan.id
        deletePlan(_id).then(res => {
          if (res.code === ERR_OK) {
            this.tips = '删除成功'
            this.$router.back()
          }
        })
      },
      _getTaskList(data) {
        // getAllMatter({where: {state: true, archive: false}}).then((res) => {
        //   if (res.code === ERR_OK) {
        //     let proArr = []
        //     let list = res.data.map(item => {
        //       let temp = proArr.includes(item.project)
        //       if (!temp) {
        //         proArr.push(item.project)
        //         this.taskArr.push({
        //           name: item.proName,
        //           value: item.project,
        //           parent: 0
        //         })
        //       }
        //       return {
        //         name: item.desc,
        //         value: item.id,
        //         parent: item.project
        //       }
        //     })
        //     this.taskArr = this.taskArr.concat(list)
        //     let _proId = this._getProId(this.taskArr, this.plan.matter)
        //     this.task.splice(0, 1, _proId, this.plan.matter)
        //   }
        // })
        let proArr = []
        let list = data.map(item => {
          let temp = proArr.includes(item.project)
          if (!temp) {
            proArr.push(item.project)
            this.taskArr.push({
              name: item.proName,
              value: item.project,
              parent: 0
            })
          }
          return {
            name: item.desc,
            value: item.id,
            parent: item.project
          }
        })
        this.taskArr = this.taskArr.concat(list)
        let _proId = this._getProId(this.taskArr, this.plan.matter)
        this.task.splice(0, 1, _proId, this.plan.matter)
      },
      _getProId(list, matterId) {
        let target = list.find(item => item.value === matterId)
        return target && target.parent
      }
    },
    components: {
      Scroll,
      Group,
      Cell,
      XButton,
      PopupRadio,
      PopupPicker,
      InlineXNumber
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .slide-enter-active, .slide-leave-active
    transition: all 0.5s
  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)

  .project-wrapper
    position: fixed
    z-index: 100
    top: 0
    left: 0
    bottom: 0
    right: 0
    background: $color-background
    display: flex
    flex-direction: column
    justify-content: center
    align-item: stretch
    .project-header
      flex: none
      height: 84px
      .project-name
        height: 84px
        line-height: 84px
        color: $color-theme-dd
        text-align: center
        font-size: $font-size-large
      .icon-back
        position: absolute
        right: 0
        top: 0
        padding: 20px
        font-size: $font-size-large-x
        color: $color-theme
        transform: rotate(180deg)
    .plan-detail
      flex: 1
      height: 100%
      overflow: hidden
      .vux-group
        .title
          border-top: 1px solid $color-highlight-background
          color: $base-orange-dd
          font-size: $font-size-medium-x
        .add-circle
          width: 40px
          padding-right: 20px
          fill: $color-theme-d
      .btn
        border-radius: 0
        font-size: $font-size-medium
        background: $color-highlight-background
        color: $color-theme-dd
        margin-top: 60px
      .btn:first-of-type
        margin-top: 120px

</style>
