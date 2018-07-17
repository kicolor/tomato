<template>
  <div>
    <x-dialog v-model="createPlanDialog" :dialog-style="{'max-width': '100%', width: '80%', height: 'auto', 'background-color': '#333'}">
      <div class="dialog-content vux-group">
        <h1 class="dialog-header">预计消耗番茄数</h1>
        <inline-x-number class="dialog-inline-x-number" style="background:rgba(255, 205, 49, 0.5)" width="120px" :min="0" v-model="predict"></inline-x-number>
        <span class="dialog-times">1h 30m</span>
        <button class="dialog-btn" @click="comfirm(predict)">确定</button>
      </div>
      <x-icon class="dialog-close" type="close" @click="close"></x-icon>
    </x-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
  import { XDialog, InlineXNumber } from 'vux'

  export default {
    name: 'tomato-dialog',
    data () {
      return {
        createPlanDialog: true,
        predict: 0
      }
    },
    methods: {
      close () {
        this.createPlanDialog = false
        this.$emit('dialogClose')
        console.log('dialog', this.dialog)
      },
      comfirm(predict) {
        this.createPlanDialog = false
        this.$emit('dialogComfirm', predict)
        console.log('dialog', this.dialog)
      }
    },
    // computed: {
    //   createPlanDialog() {
    //     console.log('computed', this.dialog)
    //     return this.dialog
    //   }
    // },
    watch: {
      dialog() {
        console.log('watch dialog', this.dialog)
      }
    },
    components: {
      XDialog,
      InlineXNumber
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

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
