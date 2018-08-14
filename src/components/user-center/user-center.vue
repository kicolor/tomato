<template>
  <transition name="slide">
    <div class="user-center">
      <div class="page-header">
        <i class="icon-back" @click="back"></i>
        <x-icon class="person" type="contact" @click="user"></x-icon>
        <p class="state">请先登录 / 注册</p>
        <!-- <i class="icon-mine"></i> -->
      </div>
      <div class="page-content">
        <group class="vux-group" ref="group">
          <cell title="整理箱" :value="cartLen" :link="{name: 'stateCart'}">
            <x-icon slot="icon" type="cart" class="title-icon"></x-icon>
          </cell>
          <cell title="任务" :value="taskLen" :link="{name: 'stateTask'}">
            <x-icon slot="icon" type="list-box" class="title-icon"></x-icon>
          </cell>
          <cell title="干扰事项" value="4" is-link>
            <x-icon slot="icon" type="close-circle" class="title-icon"></x-icon>
          </cell>
        </group>
        <!-- <scroll class="scroll"> -->
        <div class="project-wrapper vux-group" ref="wrapper">
          <tab :line-width="1" ref="tab" class="tab" active-color="#ffcd32">
            <tab-item :selected="tabItem === item" v-for="(item, index) in tabs" :key="index" @click.native="chooseTab(index)" >{{item}}</tab-item>
          </tab>
          <scroll class="scroll">
            <cell-item :hasTitle="false" :list="proList" :hasNew="!proType" @add-pro="addPro" @select="selectProject"></cell-item>
          </scroll>
        </div>
      </div>
      <transition name="fade">
        <user-dialog v-if="showDialog" :type="dialogType" @dialogClose="close"></user-dialog>
      </transition>
      <router-view></router-view>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">

  import Scroll from 'base/scroll/scroll'
  import CellItem from 'base/cell-item/cell-item'
  import UserDialog from 'base/user-dialog/user-dialog'
  import { Sticky, Group, Cell, Tab, TabItem, ViewBox, XInput, XDialog } from 'vux'
  import { getAllPro, addPro } from 'api/project'
  import { ERR_OK } from 'api/config'
  import {mapGetters, mapMutations, mapActions} from 'vuex'

  export default {
    // beforeRouteEnter(to, from, next) {
    //   next(vm => {
    //     vm._getAllPro()
    //   })
    // },
    created() {
      this.probeType = 3
      this.listenScroll = true
    },
    data () {
      return {
        dialogType: '',
        showDialog: false,
        // projectList: [],
        proType: 0,
        // cartList: [],
        tabs: ['项目', '归档项目'],
        tabItem: '项目',
        proIndex: 0
      }
    },
    computed: {
      scrollY(newVal) {
        // let translateY = Math.max(this.minTransalteY, newVal)
        // let scale = 1
        // let zIndex = 0
        // let blur = 0
        // const percent = Math.abs(newVal / this.imageHeight)
        // if (newVal > 0) {
        //   scale = 1 + percent
        //   zIndex = 10
        // } else {
        //   blur = Math.min(20, percent * 20)
        // }

        // if (newVal < this.minTransalteY) {
        //   zIndex = 10
        //   this.$refs.bgImage.style.paddingTop = 0
        //   this.$refs.bgImage.style.height = `${RESERVED_HEIGHT}px`
        //   this.$refs.playBtn.style.display = 'none'
        // } else {
        //   this.$refs.bgImage.style.paddingTop = '70%'
        //   this.$refs.bgImage.style.height = 0
        //   this.$refs.playBtn.style.display = ''
        // }
        if (newVal < 0) {
          // console.log('maxTop', this.maxTop)
          // console.log('newVal', newVal)
          // this.maxTop += newVal
          // // let top = Math.max(this.maxTop, this.minTop)
          // this.$refs.wrapper.style.top = `42px`
          if (newVal + this.maxTop > 100) {
            this.$refs.wrapper.style.transform = `translateY(${newVal}px)`
          } else {
            this.$refs.tab.$el.style.top = '0px'
            console.log('newVal', newVal)
          }
        } else {

        }
      },
      proList() {
        return this._getProListOfType(this.proType)
      },
      cartLen() {
        return this._getMatterListLengthOfType(this.projectList, 0)
      },
      taskLen() {
        return this._getMatterListLengthOfType(this.projectList, 1)
      },
      cartList() {
        return this._getMatterListOfType(this.projectList, 0)
      },
      ...mapGetters([
        'projectList'
      ])
    },
    methods: {
      back () {
        this.$router.back()
      },
      scroll(pos) {
        this.scrollY = pos.y
      },
      user () {
        this.dialogType = 'login'
        // *** v-if 可以，v-show 不生效，原因？
        this.showDialog = !this.showDialog
      },
      selectProject(item, index) {
        this.setCurrentIndex(this.proIndex + index)
        this.$router.push({
          name: 'projectDetail'
        })
      },
      close () {
        this.showDialog = false
      },
      addPro(desc) {
        let pro = {
          name: desc,
          bgImg: '0.jpg',
          archive: false
        }
        addPro(pro).then(res => {
          if (res.code === ERR_OK) {
            let project = res.data
            project.matter = []
            // this.projectList.push(pro)
            this.insertProject(project)
          }
        })
      },
      chooseTab(index) {
        this.proIndex = index * this.proList.length
        this.proType = index
      },
      _getMatterListLengthOfType(list, type) {
        let len = 0
        list.map(item => {
          item.matter.map(target => {
            if (!target.archive) {
              if (target.state == type) {
                len++
              }
            }
          })
        })
        return len
      },
      _getMatterListOfType(data, type) {
        let list = []
        data.map(item => {
          item.matter.map(target => {
            if (!target.archive) {
              if (target.state == type) {
                list.push(target)
              }
            }
          })
        })
        return list
      },
      _getProListOfType(type) {
        return this.projectList.filter(item => {
          return item.archive == type
        })
      },
      _getAllPro() {
        getAllPro({include: 'matter'}).then(res => {
          if (res.code === ERR_OK) {
            console.log('res.data', res.data)
            this.projectList = res.data
            this.cartList = this._getMatterListOfType(res.data, 0)
          }
        })
      },
      ...mapMutations({
        setCurrentIndex: 'SET_CURRENT_INDEX'
      }),
      ...mapActions([
        'insertProject'
      ])
    },
    components: {
      Scroll,
      CellItem,
      UserDialog,
      Sticky,
      Group,
      Cell,
      Tab,
      TabItem,
      ViewBox,
      XInput,
      XDialog
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .slide-enter-active, .slide-leave-active
    transition: all 0.5s
  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)

  .fade-enter-active, .fade-leave-active
    transition: opacity 0.8s
  .fade-enter, .fade-leave-to
    opacity: 0

  .user-center
    position: fixed
    top: 0
    left: 0
    bottom: 0
    right: 0
    background: $color-background
    z-index: 100
    display: flex
    flex-direction: column
    justify-content: center
    align-item: stretch
    .page-header
      flex: none
      height: 84px
      .icon-back
        position: absolute
        left: 0
        top: 0
        padding: 20px
        font-size: $font-size-large-x
        color: $color-theme
      .person
        position: absolute
        top: 12px
        right: 12px
        width: 72px
        fill: $color-dialog-background
      .state
        text-align: center
        height: 84px
        line-height: 84px
        color: $color-theme-dd

    .page-content
      flex: 1
      margin-top: 20px
      display: flex
      flex-direction: column
      .vux-group
        .title-icon
          width: 40px
          fill: $color-dialog-background
          padding-right: 10px
      .project-wrapper
        margin-top: 40px
        height: 100%
        .tab
          margin-bottom: 10px
        .scroll
          height: 100%
          overflow: hidden
          .add-circle
            width: 40px
            padding-right: 20px
            fill: $color-theme-d
    .dialog-content
      p
        margin: 30px
      .main
        font-size: $font-size-large
        color: $color-text-ll
      .account
        font-size: $font-size-medium-x
        color: $color-text-l
      .tip
        font-size: $font-size-medium
        color: $color-text-d
      .dialog-btn
        display: block
        margin: 30px auto
        width: 50%
        border: none
        background: $color-theme-l
        color: $color-text-l
        border-radius: 16px
        padding: 8px 0

</style>
