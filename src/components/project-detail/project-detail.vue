<template>
  <transition name="slide">
    <div class="project-wrapper">
      <div class="project-header">
        <p class="project-name">{{currentProject && currentProject.name}}</p>
        <i class="icon-back" @click="back"></i>
      </div>
      <scroll class="project-detail">
        <div>
          <detail-item :type="cart" :list="cartList" @add-matter="addToCart">
          </detail-item>
          <detail-item :type="task" :list="taskList" @add-matter="addToTask">
          </detail-item>
          <detail-item :type="archive" :list="archiveList">
          </detail-item>
          <x-button v-if="!isDefaultPro" class="btn" @click.native="archivePro">归档</x-button>
          <x-button v-if="!isDefaultPro" class="btn" @click.native="delPro">删除</x-button>
        </div>
      </scroll>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">

  import Scroll from 'base/scroll/scroll'
  import DetailItem from 'base/project-detail-item/project-detail-item'
  import { Group, Cell, XInput, XButton } from 'vux'
  import { ERR_OK } from 'api/config'
  import {matterType} from 'common/js/config'
  import { addMatterToPro, batchDelPro, batchArchivePro } from 'api/project'
  import { getFirstChar, popupTips } from 'common/js/util'
  import {mapGetters, mapActions} from 'vuex'

  export default {
    // beforeRouteEnter (to, from, next) {
    //   next(vm => {
    //     if (vm.project) {
    //       let matter = vm.project.matter
    //       vm.list = vm._normalizeMatter(matter)
    //       vm.tips = ''
    //       if (vm.project.name === '默认项目') {
    //         vm.isDefaultPro = true
    //       }
    //     } else {
    //       vm.$router.push({
    //         path: '/project'
    //       })
    //     }
    //   })
    // },
    beforeRouteLeave (to, from, next) {
      if (this.tips) {
        popupTips(this, 'success', this.tips, 1000)
        setTimeout(() => {
          next()
        }, 1000)
      } else {
        next()
      }
      this.tips = ''
    },
    // props: ['project'],
    data() {
      return {
        tips: '',
        desc: '',
        cart: matterType.cart,
        task: matterType.task,
        archive: matterType.archive,
        types: [matterType.cart, matterType.task, matterType.archive]
        // list: [],
        // isDefaultPro: false
      }
    },
    computed: {
      cartList() {
        return this.list[0] && this.list[0].items
      },
      taskList() {
        return this.list[1] && this.list[1].items
      },
      archiveList() {
        return this.list[2] && this.list[2].items
      },
      _matterIds() {
        let list = []
        this.list.map(group => {
          group.items.map(item => list.push(item.id))
        })
        return list
      },
      isDefaultPro() {
        return this.currentProject.name === '默认项目'
      },
      list() {
        return this._normalizeMatter(this.currentProject.matter || [])
      },
      ...mapGetters([
        'currentProject'
      ])
    },
    methods: {
      back () {
        this.$router.back()
      },
      addToCart(desc) {
        this._addToList(0, desc)
      },
      addToTask(desc) {
        this._addToList(1, desc)
      },
      archivePro() {
        const _id = this.currentProject.id
        let updateData = {
          archive: true
        }
        batchArchivePro(_id, this._matterIds, updateData).then(res => {
          if (res.code === ERR_OK) {
            let archiveArr = this.list[0].items.concat(this.list[1].items)
            this.archiveProject(archiveArr)
            this.deleteTaskArr(this.list[1].items)
            this.tips = '归档成功'
            this.$router.back()
          }
        })
      },
      delPro() {
        const _id = this.currentProject.id
        batchDelPro(_id).then(res => {
          if (res.code === ERR_OK) {
            this.deleteProject()
            this.deleteTaskArr(this.list[1].items)
            this.tips = '删除成功'
            this.$router.back()
          }
        })
      },
      _addToList(index, desc) {
        let _id = this.currentProject.id
        let currentMatter = {
          project: _id,
          desc: desc,
          state: index,
          archive: false,
          proName: this.currentProject.name,
          key: getFirstChar(desc).toUpperCase()
        }
        addMatterToPro(_id, currentMatter).then(res => {
          if (res.code === ERR_OK) {
            let matter = res.data[0]
            let project = res.data[1]
            this.list[index].items.push(matter)
            this.insertMatter({
              project,
              matter
            })
            if (index === 1) {
              this.insertTask(matter)
            }
          }
        })
      },
      _normalizeMatter(list) {
        let cart = {
          title: 'cart',
          items: []
        }
        let task = {
          title: 'task',
          items: []
        }
        let archive = {
          title: 'archive',
          items: []
        }
        list.filter(item => {
          if (item.archive) {
            archive.items.push(item)
          } else {
            if (item.state) {
              task.items.push(item)
            } else {
              cart.items.push(item)
            }
          }
          return true
        })
        return Array.of(cart, task, archive)
      },
      ...mapActions([
        'insertMatter',
        'insertTask',
        'deleteProject',
        'archiveProject',
        'deleteTaskArr'
      ])
    },
    components: {
      Scroll,
      Group,
      Cell,
      XInput,
      XButton,
      DetailItem
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
        text-align: center
        height: 84px
        line-height: 84px
        color: $color-theme-dd
      .icon-back
        position: absolute
        right: 0
        top: 0
        padding: 20px
        font-size: $font-size-large-x
        color: $color-theme
        transform: rotate(180deg)
    .project-detail
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
