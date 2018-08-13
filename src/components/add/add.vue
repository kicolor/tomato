<template>
  <transition name="slide">
    <div class="add">
      <div class="back">
        <p class="new-task">新建任务</p>
        <i class="icon-back" @click="back"></i>
      </div>
      <div class="add-task">
        <group class="vux-group" label-margin-right="2em" label-align="left">
          <x-input class="task-name" title="任务名称" v-model="task" placeholder="请填写任务名称"></x-input>
          <popup-radio title="项目" :options="allProName" v-model="proName">
            </popup-radio>
          <popup-radio title="状态" :options="rangeType" v-model="type">
          </popup-radio>
          <cell title="预计消耗番茄" value="0">
            <inline-x-number style="display:block; background:#222;" :min="0" button-style="round" v-model="predict"></inline-x-number>
          </cell>
          <popup-radio title="符号字母" :options="rangeLetter" v-model="letter">
          </popup-radio>
        </group>
      </div>
      <x-button class="submit" @click.native="add">完成</x-button>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">

  import { Group, Cell, XInput, PopupRadio, InlineXNumber, XButton } from 'vux'
  import { ERR_OK } from 'api/config'
  import { matterType } from 'common/js/config'
  import { addMatterToPro, getAllPro } from 'api/project'
  import { addPlanToMatter } from 'api/matter'
  import { getFirstChar, popupTips } from 'common/js/util.js'
  import {mapGetters, mapActions} from 'vuex'

  export default {
    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.flag = true
        vm.task = ''
        vm.proName = '默认项目'
        vm.type = matterType.plan
        vm.rangeType = [matterType.plan, matterType.task, matterType.cart]
        vm.predict = 0
        vm.letter = '首字母'
        // vm._getProList()
      })
    },
    data () {
      return {
        flag: true,
        show: false,
        task: '',
        // proList: [],
        proName: '',
        // allProName: [],
        type: '',
        rangeType: [],
        predict: 0,
        letter: ''
        // rangeLetter: []
      }
    },
    computed: {
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
    created() {
    },
    mounted () {
    },
    methods: {
      back () {
        this.$router.back()
      },
      add () {
        if (!this.task) {
          popupTips(this, 'warn', '请填写任务名称')
        } else {
          let char = ''
          if (this.letter === '首字母') {
            char = getFirstChar(this.task).toUpperCase()
            if (!/[A-Z]/.test(char)) {
              char = '#'
            }
          }
          let state = true
          if (this.type === matterType.cart) {
            state = false
          }
          let _proId = this._getProId(this.projectList, this.proName)
          let currentMatter = {
            desc: this.task,
            project: _proId,
            proName: this.proName,
            state,
            complete: false,
            archive: false,
            predict: this.predict,
            fulfill: 0,
            key: char || this.letter[0]
          }
          if (this.flag) {
            this.flag = false
            addMatterToPro(_proId, currentMatter).then(res => {
              if (res.code === ERR_OK) {
                let matter = res.data[0]
                let project = res.data[1]
                this.insertMatter({
                  project,
                  matter
                })
                if (this.type !== matterType.cart) {
                  this.insertTask(matter)
                  if (this.type === matterType.plan) {
                    let _matterId = res.data[0].id
                    let plan = {
                      predict: this.predict,
                      complete: false,
                      matter: _matterId
                    }
                    addPlanToMatter(_matterId, plan).then(res => {
                      if (res.code === ERR_OK) {
                        this.$router.back()
                        let target = {
                          desc: this.task,
                          proName: this.proName
                        }
                        target = Object.assign({}, res.data, target)
                        this.insertPlan(target)
                      }
                    })
                  }
                }
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
        'insertMatter',
        'insertTask',
        'insertPlan'
      ])
    },
    watch: {

    },
    components: {
      Group,
      Cell,
      XInput,
      PopupRadio,
      InlineXNumber,
      XButton
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .slide-enter-active, .slide-leave-active
    transition: all .5s
  .slide-enter, .slide-leave-to
    transform: translate3d(-100%, 0, 0)

  .add
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
    .back
      flex: none
      height: 84px
      .new-task
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

    .tab
      flex: none
    .add-task
      flex: 1
      .task-name
        color: $color-text-ll
      .vux-group
        .weui-cell__bd
          .weui-input
            color: $color-icon
    .submit
      border-radius: 0
      font-size: $font-size-medium
      background: $color-highlight-background
      color: $color-theme-dd
</style>
