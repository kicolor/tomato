<template>
  <div :type="type">
    <x-dialog v-model="accountDialog" hide-on-blur :dialog-style="{'max-width': '100%', width: '80%', height: 'auto', 'background-color': '#333'}">
      <div class="dialog-content">
        <p class="main">Pomodoro on Cloud</p>
        <p class="account">abc@xxx.com</p>
        <p class="tip">请在切换新设备前先备份数据</p>
        <button class="dialog-btn">同步记录</button>
        <button class="dialog-btn">退出登录</button>
      </div>
      <x-icon class="dialog-close" type="ios-close-outline" style="fill:#fff;" @click="close"></x-icon>
    </x-dialog>
    <x-dialog v-model="loginDialog" hide-on-blur :dialog-style="{'max-width': '100%', width: '80%', height: 'auto', 'background-color': '#333'}">
      <div class="dialog-content vux-group">
        <p>{{header}}</p>
        <x-input type="text" placeholder="账号" class="vux-dialog-input"></x-input>
        <x-input v-show="password" type="password" placeholder="密码" class="vux-dialog-input"></x-input>
        <span @click="link" ref="left">{{linkLeft}}</span>
        <span @click="link">{{linkRight}}</span>
        <button class="dialog-btn">确定</button>
      </div>
      <x-icon class="dialog-close" type="close" @click="close"></x-icon>
    </x-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
  import { XDialog, XInput } from 'vux'

  export default {
    name: 'user-dialog',
    props: ['type'],
    data () {
      return {
        accountDialog: false,
        loginDialog: false,
        // flag: 0,   // 0 登录、1 注册、2 重置密码
        header: '登录',
        linkLeft: '忘记密码',
        linkRight: '注册',
        password: true
      }
    },
    methods: {
      close () {
        this.accountDialog = false
        this.$emit('dialogClose')
      },
      link (e) {
        if (e.target.innerText === '登录') {
          this.header = '登录'
          this.password = true
          this.linkLeft = '忘记密码'
          this.linkRight = '注册'
        } else if (e.target.innerText === '注册') {
          this.header = '注册'
          this.password = true
          this.linkLeft = '忘记密码'
          this.linkRight = '登录'
        } else if (e.target.innerText === '忘记密码') {
          this.header = '重置密码'
          this.password = false
          this.linkLeft = '登录'
          this.linkRight = '注册'
        }
      }
    },
    mounted () {
      if (this.type === 'account') {
        this.accountDialog = true
      } else if (this.type === 'login') {
        this.loginDialog = true
      }
    },
    watch: {
      accountDialog () {
        if (!this.accountDialog) {
          this.$emit('dialogClose')
        }
      },
      loginDialog () {
        if (!this.loginDialog) {
          this.$emit('dialogClose')
        }
      }
    },
    components: {
      XDialog,
      XInput
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .dialog-content
    p
      margin: 30px
      font-size: $font-size-large-x
    .main
      font-size: $font-size-large
      color: $color-text-ll
    .account
      font-size: $font-size-medium-x
      color: $color-text-l
    .tip
      font-size: $font-size-medium
      color: $color-text-d
    span
      font-size: $font-size-small
      color: $color-text-l
      margin: 0 100px
      text-decoration: underline
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
