<template>
  <div class="tips">
      <p>{{header}}列表为空</p>
      <p>选择一种方式开始创建{{header}}列表吧！</p>
      <table class="section">
        <tr>
          <td>{{ways[0]}}</td>
          <td v-if="type"><x-icon class="section-icon" type="today" @click="newPlan"></x-icon></td>
          <td v-if="!type"><x-icon class="section-icon" type="clipboard" @click="newTask"></x-icon></td>
        </tr>
        <tr>
          <td>{{ways[1]}}</td>
          <td v-if="type"><x-icon class="section-icon" type="clipboard" @click="openTask"></x-icon></td>
          <td v-if="!type"><x-icon class="section-icon" type="cart" @click="openCart"></x-icon></td>
        </tr>
        <tr>
          <td>{{ways[2]}}</td>
          <td v-if="type"><x-icon class="section-icon" type="cart" @click="openCart"></x-icon></td>
          <td v-if="!type"><x-icon class="section-icon" type="folder" @click="openProject"></x-icon></td>
        </tr>
      </table>
    </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: ['type'],
    computed: {
      header() {
        if (this.type) {
          return '计划'
        } else {
          return '任务'
        }
      },
      ways() {
        if (this.type) {
          return [
            '1、直接新建计划',
            '2、去任务列表中添加',
            '3、去整理箱中添加'
          ]
        } else {
          return [
            '1、直接新建任务',
            '2、去整理箱中添加',
            '3、去项目中添加'
          ]
        }
      }
    },
    methods: {
      newPlan() {
        this.$router.push({
          path: '/add'
        })
      },
      newTask() {
        this.$router.push({
          path: '/add'
        })
      },
      openTask() {
        this.$router.push({
          path: '/task'
        })
      },
      openCart() {

      },
      openProject() {
        this.$router.push({
          path: '/project'
        })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .tips
      position: absolute
      top: 30%
      width: 100%
      p
        text-align: center
        margin: 20px auto
        color: $base-orange
      .section
        margin: 40px auto
        color: $color-theme-dd
        tr
          td
            height: 50px
            vertical-align: middle
          .section-icon
            fill: $color-theme-dd
            height: 100%
            margin: 10px 40px
</style>
