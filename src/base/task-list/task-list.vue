<template>
  <scroll @scroll="scroll"
          :listen-scroll="listenScroll"
          :probe-type="probeType"
          :click="click"
          :data="taskList"
          class="listview"
          ref="listview">
    <ul>
      <li v-for="group in taskList" class="list-group" ref="listGroup" :key="group.title">
        <h2 class="list-group-title">{{group.title}}</h2>
        <task-item v-for="(item, index) in group.items"
                   :plan="item"
                   :task-index="taskIndex"
                   :key="item.id"
                   @choose="selectItem"
                   @create="createPlan"
                   @write="writeTask"
                   @archive="archiveTask"
                   @start="startPlan"
                   @del="deleteTask" />
      </li>
    </ul>
    <div class="list-shortcut" @touchstart="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove">
      <ul>
        <li v-for="(item, index) in shortcutList" :data-index="index" class="item"
            :class="{'current':currentIndex===index}">{{item}}

        </li>
      </ul>
    </div>
    <div class="list-fixed" ref="fixed" v-show="fixedTitle">
      <div class="fixed-title">{{fixedTitle}} </div>
    </div>
    <tomato-dialog v-if="createPlanDialog" @dialogClose="closeDialog" @dialogComfirm="addPlan"></tomato-dialog>
  </scroll>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll'
  import TomatoDialog from 'base/tomato-dialog/tomato-dialog'
  import { XDialog, Cell, InlineXNumber, XButton } from 'vux'
  import TaskItem from 'base/task-item/task-item'
  import { getData } from 'common/js/dom'
  import { ERR_OK } from 'api/config'
  import { addPlanToMatter, batchUpdateMatter, deleteMatter } from 'api/matter'
  import { popupTips } from 'common/js/util'
  import {mapActions} from 'vuex'

  const TITLE_HEIGHT = 30
  const ANCHOR_HEIGHT = 18

  export default {
    created() {
      this.probeType = 3
      this.listenScroll = true
      this.click = false
      this.touch = {}
      this.listHeight = []
    },
    props: ['taskList'],
    data() {
      return {
        scrollY: -1,
        currentIndex: 0,
        diff: -1,
        taskIndex: 0,
        createPlanDialog: false,
        // predict: 0,
        targetTask: {}
      }
    },
    computed: {
      shortcutList() {
        // console.log('shortcutList', this.taskList)
        return this.taskList.map((group) => {
          return group.title.substr(0, 1)
        })
      },
      fixedTitle() {
        if (this.scrollY > 0) {
          return ''
        }
        return this.taskList[this.currentIndex] ? this.taskList[this.currentIndex].title : ''
      }
    },
    methods: {
      selectItem(item) {
        if (this.taskIndex === item.id) {
          this.taskIndex = 0
        } else {
          this.targetTask = item
          this.taskIndex = item.id
        }
      },
      createPlan() {
        this.createPlanDialog = true
      },
      addPlan(predict) {
        let task = this.targetTask
        let _taskId = task.id
        let plan = {
          matter: task.id,
          predict,
          complete: false
        }
        addPlanToMatter(_taskId, plan).then(res => {
          if (res.code === ERR_OK) {
            let target = {
              desc: task.desc,
              proName: task.proName
            }
            target = Object.assign({}, res.data, target)
            this.insertPlan(target)
            this.closeDialog()
          }
        })
      },
      writeTask(plan) {
        if (plan.id) {
          this.$router.push({
            name: 'matterDetail',
            params: {
              matter: plan
            }
          })
        } else {
          this.$router.push({
            path: '/task'
          })
        }
      },
      archiveTask(plan) {
        let _id = plan.id
        let updateData = {
          archive: true
        }
        batchUpdateMatter(_id, updateData).then(res => {
          if (res.code === ERR_OK) {
            console.log('batchUpdateMatter', res.data)
            this.inactivateTask(res.data[1].id)
            // let list = this._updateList(this.taskList, _id)
            popupTips(this, 'success', `${plan.desc}已归档`, 1000, 'bottom')
            // this.$emit('update:taskList', list)
          } else {
          }
        })
      },
      startPlan(plan) {
        if (plan.id) {
          this.$router.push({
            name: 'play',
            params: {
              id: plan.id
            }
          })
        } else {
          this.$router.push({
            path: '/plan'
          })
        }
      },
      deleteTask(plan) {
        let _id = plan.id
        console.log('plan', plan)
        deleteMatter(_id).then(res => {
          if (res.code === ERR_OK) {
            // *** 在列表中删除该任务
            this.inactivateTask(_id)
            // let list = this._updateList(this.taskList, _id)
            popupTips(this, 'success', `${plan.desc}已删除`, 1000, 'bottom')
            // this.$emit('update:taskList', list)
          } else {
          }
        })
      },
      closeDialog() {
        console.log('closeDialog')
        this.createPlanDialog = false
      },
      onShortcutTouchStart(e) {
        let anchorIndex = getData(e.target, 'index')
        let firstTouch = e.touches[0]
        this.touch.y1 = firstTouch.pageY
        this.touch.anchorIndex = anchorIndex
        this._scrollTo(anchorIndex)
      },
      onShortcutTouchMove(e) {
        let firstTouch = e.touches[0]
        this.touch.y2 = firstTouch.pageY
        let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0
        let anchorIndex = parseInt(this.touch.anchorIndex) + delta

        this._scrollTo(anchorIndex)
      },
      refresh() {
        this.$refs.listview.refresh()
      },
      scroll(pos) {
        this.scrollY = pos.y
        this.taskIndex = 0
      },
      _updateList(list, id) {
        return list.filter(group => {
          let target = group.items.findIndex(item => item.id === id)
          if (target !== -1) {
            group.items.splice(target, 1)
            if (group.items.length === 0) {
              return false
            }
          }
          return true
        })
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
      _scrollTo(index) {
        if (!index && index !== 0) {
          return
        }
        if (index < 0) {
          index = 0
        } else if (index > this.listHeight.length - 2) {
          index = this.listHeight.length - 2
        }
        this.scrollY = -this.listHeight[index]
        this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0)
      },
      ...mapActions([
        'insertPlan',
        'inactivateTask'
      ])
    },
    watch: {
      taskList() {
        setTimeout(() => {
          this._calculateHeight()
          if (this.taskList.length === 0) {
            // this.$emit('update:hasTask', false)
          }
        }, 20)
      },
      scrollY(newY) {
        const listHeight = this.listHeight
        // 当滚动到顶部，newY>0
        if (newY > 0) {
          this.currentIndex = 0
          return
        }
        // 在中间部分滚动
        for (let i = 0; i < listHeight.length - 1; i++) {
          let height1 = listHeight[i]
          let height2 = listHeight[i + 1]
          if (-newY >= height1 && -newY < height2) {
            this.currentIndex = i
            this.diff = height2 + newY
            return
          }
        }
        // 当滚动到底部，且-newY大于最后一个元素的上限
        this.currentIndex = listHeight.length - 2
      },
      diff(newVal) {
        let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0
        if (this.fixedTop === fixedTop) {
          return
        }
        this.fixedTop = fixedTop
        // this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`
      },
      '$route' (to, from) {
        this.taskIndex = 0
      }
    },
    components: {
      Scroll,
      TomatoDialog,
      XDialog,
      Cell,
      InlineXNumber,
      XButton,
      TaskItem
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
        color: $color-text-l
        background: $color-highlight-background
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 40px
      padding: 40px 0
      border-radius: 20px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 6px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 50px
        line-height: 50px
        padding-left: 30px
        font-size: $font-size-small
        color: $color-text
        background: $color-highlight-background
    .dialog-content
      color: $color-text-ll
      .dialog-header
        font-size: $font-size-large
        margin: 30px 0
      .dialog-count
        a, input
          height: 50px
      .dialog-times
        display: block
        margin-top: 30px
      .dialog-btn
        display: block
        margin-top: 60px
        width: 100%
        border: none
        background: $color-theme-d
        color: $color-text-l
        padding: 12px 0
        font-size: $font-size-medium
    .dialog-close
      position: absolute
      top: 0
      right: 0
      width: 40px
      fill: $color-dialog-background
</style>
