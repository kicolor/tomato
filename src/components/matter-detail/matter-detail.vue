<template>
  <transition name="slide">
    <div class="project-wrapper">
      <div class="project-header vux-group">
        <p class="type">{{type}}</p>
        <i class="icon-back" @click="back"></i>
      </div>
      <scroll class="matter-detail">
        <div>
          <group class="vux-group" label-margin-right="2em" label-align="left">
            <x-input class="title"  v-model="matter.desc" text-align="center" :show-clear="false"></x-input>
            <cell title="番茄" :value="matter.fulfill"></cell>
            <cell title="耗时" value="0m"></cell>
            <popup-radio title="项目" :options="allProName" v-model="proName">
            </popup-radio>
            <cell title="预计消耗番茄">
              <inline-x-number style="display:block; background:#222;" :min="0" button-style="round" v-model="matter.predict"></inline-x-number>
            </cell>
            <popup-radio title="符号字母" :options="rangeLetter" v-model="letter">
            </popup-radio>
            <cell title="添加日期" :value="date"></cell>
          </group>
          <x-button class="btn" @click.native="submit">存储</x-button>
          <x-button class="btn" v-if="type !== '已归档任务'" @click.native="archive">归档</x-button>
          <x-button class="btn" v-if="type !== '任务列表'" @click.native="active">激活</x-button>
          <x-button class="btn" v-if="type !== '整理箱'" @click.native="cart">整理箱</x-button>
          <x-button class="btn" @click.native="del">删除</x-button>
        </div>
      </scroll>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">

  import Scroll from 'base/scroll/scroll'
  import { Group, Cell, XInput, XButton, PopupRadio, InlineXNumber } from 'vux'
  import { ERR_OK } from 'api/config'
  import { getFirstChar, popupTips } from 'common/js/util'
  import { getAllPro } from 'api/project'
  import { updateMatter, batchUpdateMatter, deleteMatter } from 'api/matter'
  import {mapGetters, mapActions} from 'vuex'

  export default {
    beforeRouteEnter (to, from, next) {
      next(vm => {
        if (vm.matter) {
          vm.proName = vm.matter.proName
          vm.letter = vm.matter.key
          vm.tips = ''
        } else {
          vm.$router.push({
            path: '/task'
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
    // created () {
    //   this._getProList()
    // },
    props: ['matter'],
    data () {
      return {
        tips: '',
        // projectList: [],
        // allProName: [],
        proName: '',
        // rangeLetter: [],
        letter: ''
      }
    },
    mounted() {
      console.log('route', this.$route)
    },
    computed: {
      type() {
        if (this.matter) {
          if (this.matter.archive) {
            return '已归档任务'
          } else {
            if (this.matter.state) {
              return '任务列表'
            } else {
              return '整理箱'
            }
          }
        }
      },
      date() {
        return this.matter.createdAt && this.matter.createdAt.substring(0, 10)
      },
      allProName() {
        return this._getAllProName(this.projectList)
      },
      rangeLetter() {
        return this._getRangeLetter()
      },
      ...mapGetters([
        'projectList'
      ])
    },
    methods: {
      back () {
        this.$router.back()
      },
      submit () {
        this._updateMatter(1, '修改成功')
      },
      active() {
        this._updateMatter(2, '激活成功', false, true)
      },
      archive () {
        this._updateMatter(0, '归档成功', true)
      },
      cart() {
        this._updateMatter(0, '加入整理箱', false, false)
      },
      del () {
        const _id = this.matter.id
        deleteMatter(_id).then(res => {
          if (res.code === ERR_OK) {
            this.inactivateTask(_id)
            this.tips = '删除成功'
            this.$router.back()
          }
        })
      },
      _updateMatter(type, tips, archive = this.matter.archive, state = this.matter.state) {
        if (!this.matter.desc) {
          popupTips(this, 'warns', '请填写任务名称')
        } else {
          const _id = this.matter.id
          const _proId = this._getProId(this.projectList, this.proName)
          let key = this.letter
          if (key === '首字母') {
            key = getFirstChar(this.matter.desc).toUpperCase()
            if (!/[A-Z]/.test(key)) {
              key = '#'
            }
          }
          let updateData = {
            desc: this.matter.desc,
            proName: this.proName,
            project: _proId,
            'project(uz*R*id)': _proId,
            predict: this.matter.predict,
            key,
            archive,
            state
          }
          if (!type) {
            batchUpdateMatter(_id, updateData).then(res => {
              if (res.code === ERR_OK) {
                this.inactivateTask(_id)
                this.tips = tips
                this.$router.back()
              }
            })
          } else {
            updateMatter(_id, updateData).then(res => {
              if (res.code === ERR_OK) {
                let task = res.data
                if (type === 1 && !task.archive && task.state) {
                  this.modifyTask(task)
                } else if (type === 2) {
                  this.insertTask(task)
                }
                this.tips = tips
                this.$router.back()
              }
            })
          }
        }
      },
      _getProList() {
        getAllPro().then(res => {
          if (res.code === ERR_OK) {
            this.projectList = res.data
            this.allProName = this._getAllProName(this.projectList)
            this.rangeLetter = this._getRangeLetter()
          }
        })
      },
      _getAllProName(list) {
        return list.map(item => item.name)
      },
      _getProId(list, name) {
        let target = list.find(item => item.name === name)
        return target.id
      },
      _getRangeLetter() {
        let list = ['首字母']
        for (let i = 65; i < 91; i++) {
          list.push(String.fromCharCode(i))
        }
        list.push('#')
        return list
      },
      ...mapActions([
        'inactivateTask',
        'insertTask',
        'modifyTask'
      ])
    },
    components: {
      Scroll,
      Group,
      Cell,
      XInput,
      XButton,
      PopupRadio,
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
      .type
        height: 84px
        line-height: 84px
        color: $color-theme-dd
        text-align: center
      .icon-back
        position: absolute
        right: 0
        top: 0
        padding: 20px
        font-size: $font-size-large-x
        color: $color-theme
        transform: rotate(180deg)
    .matter-detail
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
