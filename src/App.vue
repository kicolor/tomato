<template>
  <div id="app" @touchmove.prevent class="app">
    <m-header></m-header>
    <tab></tab>
    <keep-alive>
      <router-view :class="miniPlayCls"></router-view>
    </keep-alive>
    <play></play>
  </div>
</template>

<script type="text/ecmascript-6">
  import MHeader from 'components/m-header/m-header'
  import Tab from 'components/tab/tab'
  import Play from 'components/play/play'
  import {mapGetters, mapMutations} from 'vuex'
  import {getAllMatter} from 'api/matter'
  import {getAllPro} from 'api/project'
  import {ERR_OK} from 'api/config'

  export default {
    created() {
      this._getTaskList()
      this._getProjectList()
    },
    computed: {
      miniPlayCls() {
        return this.mode && !this.fullScreen ? 'mini-play' : 'normal-play'
      },
      ...mapGetters([
        'mode',
        'fullScreen'
      ])
    },
    methods: {
      _getTaskList() {
        getAllMatter({include: 'plan', where: {state: true, archive: false}}).then((res) => {
          if (res.code === ERR_OK) {
            this.setTaskList(res.data)
            this.setLoadMatter(true)
          }
        })
      },
      _getProjectList() {
        getAllPro({include: 'matter', order: ['archive ASC', 'createdAt DESC']}).then(res => {
          if (res.code === ERR_OK) {
            this.setProjectList(res.data)
          }
        })
      },
      ...mapMutations({
        setTaskList: 'SET_TASK_LIST',
        setLoadMatter: 'SET_LOAD_MATTER',
        setProjectList: 'SET_PROJECT_LIST'
      })
    },
    components: {
      MHeader,
      Tab,
      Play
    }
  }
</script>

<style lang="stylus">
  @import "~common/stylus/index"

  .mini-play
    bottom: 120px

  .normal-play
    bottom: 0
</style>
