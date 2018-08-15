<template>
  <div class="rank" ref="rank">
    <div class="search-box-wrapper">
      <i class="icon-search"></i>
      <input ref="desc" v-model="desc" autofocus="autofocus" class="box" :placeholder="placeholder" @keyup.enter="addProject"/>
      <i @click="clear" v-show="desc" class="icon-dismiss"></i>
    </div>
    <scroll :data="projectList" class="projectlist" ref="projectlist" :probeType="probeType" :scrollbar="scrollbar">
      <div>
        <ul>
          <li @click="selectItem(index)" class="item" v-for="(project, index) in projectList">
            <div class="icon" :style="{backgroundImage: `url(${require('common/image/'+project.bgImg)})`}">
              <p class="project">{{project.name}}</p>
              <x-icon v-show="project.archive" type="ios-checkmark-empty" class="complete"></x-icon>
            </div>
            <ul class="planlist">
              <li class="plan" v-for="(plan, index) in project.matter.slice(0, 3)">
                <span>{{index + 1}}</span>
                <span>{{plan.desc}}</span>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <div class="loading-container" v-show="!projectList.length">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import SearchBox from 'base/search-box/search-box'
  import { Icon } from 'vux'
  import { ERR_OK } from 'api/config'
  import { addPro, getAllPro } from 'api/project'
  import { popupTips } from 'common/js/util.js'
  import {mapGetters, mapMutations, mapActions} from 'vuex'

  export default {
    // beforeRouteEnter(to, from, next) {
    //   next(vm => {
    //     vm.setCurrentIndex(-1)
    //   })
    // },
    // beforeRouteEnter(to, from, next) {
    //   next(vm => {
    //     vm._getProjectList()
    //   })
    // },
    // beforeRouteUpdate(to, from, next) {
    //   this._getProjectList()
    //   next()
    // },
    // created() {
    //   this._getProjectList()
    // },
    activated() {
      this.setCurrentIndex(-1)
      this.$refs.projectlist.refresh()
    },
    data() {
      return {
        desc: '',
        probeType: 3,
        scrollbar: {
          fade: false,
          interactive: true
        },
        placeholder: '添加项目'
        // projectList: []
      }
    },
    computed: {
      ...mapGetters([
        'projectList'
      ])
    },
    methods: {
      addProject() {
        if (this.desc === '默认项目') {
          popupTips(this, 'warn', '不能新建【默认项目】')
        } else {
          let pro = {
            name: this.desc,
            bgImg: '0.jpg',
            archive: false
          }
          addPro(pro).then(res => {
            if (res.code === ERR_OK) {
              let project = res.data
              project.matter = []
              // this.projectList.unshift(pro)
              this.insertProject(project)
              this.desc = ''
            }
          })
        }
      },
      selectItem(index) {
        this.setCurrentIndex(index)
        // let {...target} = item
        this.$router.push({
          name: 'projectDetail'
          // params: {
          //   project: target
          // }
        })
      },
      clear() {
        this.desc = ''
      },
      _getProjetList() {
        getAllPro({include: 'matter', order: ['archive ASC', 'createdAt DESC']}).then(res => {
          if (res.code === ERR_OK) {
            this.projectList = res.data
          }
        })
      },
      _normalizeList(list) {
        let map = {}
        let id = 1
        list.forEach((item, index) => {
          const key = item.project
          if (!map[key]) {
            map[key] = {
              id: id++,
              title: key,
              items: []
            }
          }
          if (map[key].items.length < 3) {
            map[key].items.push(item)
          }
        })
        // 处理 map，得到项目列表
        let orderList = []
        for (let key in map) {
          let val = map[key]
          orderList.push(val)
        }
        return orderList
      },
      ...mapMutations({
        setCurrentIndex: 'SET_CURRENT_INDEX'
      }),
      ...mapActions([
        'insertProject'
      ])
    },
    watch: {
      topList() {
        setTimeout(() => {
          this.$Lazyload.lazyLoadHandler()
        }, 20)
      }
    },
    components: {
      Scroll,
      Loading,
      SearchBox,
      Icon
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .rank
    position: fixed
    width: 100%
    top: 176px
    display: flex
    flex-direction: column
    align-items: center
    .search-box-wrapper
      margin: 40px
      width: 85%
      display: flex
      align-items: center
      box-sizing: border-box
      width: 100%
      padding: 0 12px
      height: 80px
      background: $color-highlight-background
      border-radius: 12px
      .icon-search
        font-size: 48px
        color: $color-background
      .box
        flex: 1
        margin: 0 10px
        line-height: 36px
        background: $color-highlight-background
        color: $color-text
        font-size: $font-size-medium
        &::placeholder
          color: $color-text-d
      .icon-dismiss
        font-size: 32px
        color: $color-background
    .projectlist
      flex: 1
      overflow: hidden
      width: 85%
      .item
        display: flex
        margin: 40px 0
        height: 200px
        &:last-child
          padding-bottom: 40px
        .icon
          flex: 0 0 200px
          width: 200px
          height: 200px
          background-repeat: no-repeat;
          background-size: cover;
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative
          .project
            no-wrap()
            font-size: $font-size-medium-x
            text-align: center
            max-height: 50%
            max-width: 90%
          .complete
            position: absolute
            right: 0
            bottom: 0
            width: 80px
            height: 80px
            fill: $color-sub-theme
        .planlist
          flex: 1
          display: flex
          flex-direction: column
          justify-content: center
          padding: 0 40px
          height: 200px
          overflow: hidden
          background: $color-highlight-background
          color: $color-text-d
          font-size: $font-size-small
          .plan
            no-wrap()
            line-height: 52px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
