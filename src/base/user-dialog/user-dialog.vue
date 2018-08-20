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
        <!-- <group class="dialog-group"> -->
          <x-input v-show="isAccount" type="text" :title="accountText" class="vux-dialog-input" v-model="account" required ref="account"></x-input>
          <x-input v-show="isEmail" is-type="email" :title="emailText" class="vux-dialog-input" v-model="email" required :show-clear="false" ref="email"></x-input>
          <x-input v-show="isPassword" type="password" :title="passwordText" class="vux-dialog-input" v-model="password" required ref="password"></x-input>
          <x-input v-show="isCheckPassword" type="password" :title="checkPasswordText" class="vux-dialog-input" v-model="checkPassword" required ref="checkPassword"></x-input>
        <!-- </group> -->
        <span @click="link" ref="left">{{linkLeft}}</span>
        <span @click="link">{{linkRight}}</span>
        <button class="dialog-btn" @click="submit">{{submitText}}</button>
      </div>
      <x-icon class="dialog-close" type="close" @click="close"></x-icon>
    </x-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
  import { XDialog, Group, XInput } from 'vux'
  import {ERR_OK} from 'api/config'
  import { addUser, login } from 'api/user'
  import { popupTips } from 'common/js/util'

  export default {
    name: 'user-dialog',
    props: ['type'],
    data () {
      return {
        accountDialog: false,
        loginDialog: false,
        flag: 0,   // 0 登录、1 注册、2 重置密码
        isEmail: false,
        isAccount: true,
        isPassword: true,
        isCheckPassword: false,
        header: '登录',
        linkLeft: '忘记密码',
        linkRight: '注册',
        accountText: '账号',
        emailText: '关联邮箱',
        passwordText: '密码',
        checkPasswordText: '确认密码',
        submitText: '确认',
        email: '',
        account: '',
        password: '',
        checkPassword: ''
      }
    },
    computed: {
      emailValid() {
        return this.$refs.email.valid
      },
      accountValid() {
        return this.$refs.account.valid
      },
      passwordValid() {
        return this.$refs.password.valid
      },
      checkPasswordValid() {
        return this.$refs.checkPassword.valid
      }
    },
    methods: {
      close (tips = '') {
        this.accountDialog = false
        this.$emit('dialogClose', tips)
      },
      link (e) {
        if (e.target.innerText === '登录') {
          this.isEmail = false
          this.isAccount = true
          this.isPassword = true
          this.isCheckPassword = false
          this.header = '登录'
          this.linkLeft = '忘记密码'
          this.linkRight = '注册'
          this.submitText = '确认'
          this.flag = 0
        } else if (e.target.innerText === '注册') {
          this.isEmail = true
          this.isAccount = true
          this.isPassword = true
          this.isCheckPassword = true
          this.header = '注册'
          this.linkLeft = '忘记密码'
          this.linkRight = '登录'
          this.submitText = '确认'
          this.flag = 1
        } else if (e.target.innerText === '忘记密码') {
          this.isEmail = true
          this.isAccount = true
          this.isPassword = false
          this.isCheckPassword = false
          this.header = '重置密码'
          this.linkLeft = '登录'
          this.linkRight = '注册'
          this.submitText = '发送邮件'
          this.flag = 2
        }
      },
      submit() {
        if (this.flag === 0) {
          this._login()
        } else if (this.flag === 1) {
          this._register()
        } else if (this.flag === 2) {
          this._reset()
        }
      },
      _login() {
        if (this.accountValid && this.passwordValid) {
          let user = {
            username: this.account,
            password: this.password
          }
          login(user).then(res => {
            if (res.code === ERR_OK) {
              let tips = `${this.account}登录成功`
              this.close(tips)
            } else {
              let error = res.data.error
              if (error.message === 'The mailbox is not verified') {
                popupTips(this, 'warn', '邮箱未验证', 1000)
              } else if (error.message === 'login failed') {
                popupTips(this, 'warn', '登录失败', 1000)
              } else {
                console.log('error', error)
              }
            }
          })
        } else {

        }
      },
      _register() {
        if (this.emailValid && this.accountValid && this.passwordValid && this.checkPasswordValid) {
          if (this.password === this.checkPassword) {
            let user = {
              email: this.email,
              username: this.account,
              password: this.password
            }
            addUser(user).then(res => {
              if (res.code === ERR_OK) {
                let tips = `激活邮件已发送，请前往激活`
                this.close(tips)
              } else {
                let error = res.data.error
                console.log('res', error)
                if (error.message === 'username:already exists') {
                  popupTips(this, 'warn', `用户名已存在`, 1000)
                } else {
                  console.log('error', error)
                }
              }
            })
          } else {
            popupTips(this, 'warn', `密码不一致`, 1000)
          }
        } else {
          popupTips(this, 'warn', `请完善信息`, 1000)
        }
      },
      _reset() {
        if (this.accountValid && this.passwordValid) {

        }
      },
      _isValid() {
        return this.$refs.email.valid && this.$refs.account.valid && this.$refs.password.valid
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
      Group,
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
