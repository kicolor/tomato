<template>
  <div class="task" ref="task">
    <task-list v-show="hasTask" ref="list" :task-list.sync="taskList" :has-task.sync="hasTask" />
    <tips v-show="!hasTask" :typs="type"></tips>
    <div v-show="loading" class="loading-container">
      <loading></loading>
    </div>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import Loading from 'base/loading/loading'
  import Tips from 'base/tips/tips'
  import {ERR_OK} from 'api/config'
  import TaskList from 'base/task-list/task-list'
  import { getAllMatter } from 'api/matter'

  export default {
    beforeRouteEnter (to, from, next) {
      next(vm => {
        vm._getTaskList()
      })
    },
    beforeRouteUpdate (to, from, next) {
      this._getTaskList()
      next()
    },
    data() {
      return {
        taskList: [],
        loading: true,
        hasTask: true,
        type: 0
      }
    },
    methods: {
      newTask() {
        this.$router.push({
          path: '/add'
        })
      },
      openCart() {

      },
      openProject() {
        this.$router.push({
          path: '/project'
        })
      },
      handlePlaylist(tasklist) {
        const bottom = tasklist.length > 0 ? '60px' : ''
        this.$refs.task.style.bottom = bottom
        this.$refs.list.refresh()
      },
      _getTaskList() {
        getAllMatter({where: {state: true, archive: false}}).then((res) => {
          if (res.code === ERR_OK) {
            if (res.data.length > 0) {
              console.log('getAllMatter', res.data)
              this.hasTask = true
              this.taskList = this._normalizeTask(res.data)
            } else {
              this.hasTask = false
            }
            this.loading = false
          }
        })
      },
      _normalizeTask(list) {
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
        console.log('_normalizePlan', orderList)
        return orderList
      }
    },
    components: {
      Loading,
      Tips,
      TaskList
    }
  }

</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .task
    position: fixed
    top: 176px
    width: 100%
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
