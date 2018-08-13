<template>
  <transition name="slide">
    <div class="project-wrapper">
      <div class="project-header">
        <i class="icon-back" @click="back"></i>
        <x-icon class="add-circle" type="add-circle-outline" @click.native="addMatter"></x-icon>
        <p class="project-name">{{type}}</p>
      </div>
      <scroll class="project-detail">
        <div>
          <ul>
            <li v-for="group in list" :key="group.id">
              <cell-item :list="group.items" :title="group.title" :has-new="false" :type="1"></cell-item>
            </li>
          </ul>
        </div>
      </scroll>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">

  import { matterType } from 'common/js/config'
  import Scroll from 'base/scroll/scroll'
  import CellItem from 'base/cell-item/cell-item'
  import { Group, Cell, XInput, XButton } from 'vux'
  import {mapGetters} from 'vuex'

  export default {
    props: ['state'],
    computed: {
      type() {
        if (this.state) {
          return matterType.task
        } else {
          return matterType.cart
        }
      },
      list() {
        return this._getMatterListOfType(this.projectList, this.state)
      },
      ...mapGetters([
        'projectList'
      ])
    },
    methods: {
      back () {
        this.$router.back()
      },
      addMatter() {
        console.log('addMatter')
      },
      _getMatterListOfType(data, type) {
        let list = {}
        let id = 0
        data.map(item => {
          const name = item.name
          item.matter.map(target => {
            if (!target.archive) {
              if (target.state == type) {
                if (!list[name]) {
                  list[name] = {
                    id: id++,
                    title: name,
                    items: []
                  }
                }
                list[name].items.push(target)
              }
            }
          })
        })
        return list
      }
    },
    components: {
      Scroll,
      CellItem,
      Group,
      Cell,
      XInput,
      XButton
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
      .icon-back
        position: absolute
        left: 0
        top: 0
        padding: 20px
        font-size: $font-size-large-x
        color: $color-theme
      .add-circle
        position: absolute
        right: 0
        top: 0
        padding: 20px
        width: 50px
        fill: $color-theme-dd
      .project-name
        text-align: center
        height: 84px
        line-height: 84px
        color: $color-theme-dd
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
