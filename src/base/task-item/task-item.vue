<template>
    <ul>
        <li :class="{'choose': taskIndex === task.id }">
          <section class="section-item" @click.stop="selectTask">
            <p class="desc">
              <span class="task-desc">{{task.desc}}</span>
              <span class="task-project">{{task.proName}}</span>
            </p>
            <span class="task-count">{{taskCount}}</span>
          </section>
          <menu class="menu-item" v-show="taskIndex === task.id">
            <x-icon class="icon" type="today" @click.stop="createPlan"></x-icon>
            <x-icon class="icon" type="create" @click.stop="writeTask"></x-icon>
            <x-icon class="icon" type="checkbox-outline" @click.stop="archiveTask"></x-icon>
            <x-icon class="icon" type="play" @click.stop="startPlan"></x-icon>
            <x-icon class="icon" type="trash" @click.stop="deleteTask"></x-icon>
          </menu>
        </li>
      </ul>
</template>

<script type="text/ecmascript-6">

  export default {
    props: ['task', 'taskIndex'],
    computed: {
      taskCount() {
        return `${this.task.fulfill} / ${this.task.predict}`
      }
    },
    methods: {
      selectTask() {
        this.$emit('choose', this.task)
      },
      createPlan() {
        this.$emit('create')
      },
      writeTask() {
        this.$emit('write', this.task)
      },
      archiveTask() {
        this.$emit('archive', this.task)
      },
      startPlan() {
        this.$emit('start', this.task)
      },
      deleteTask() {
        this.$emit('del', this.task)
      }
    }
  }

</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .choose
    background: $color-background-d
  .section-item
    display: flex
    align-items: center
    padding: 30px 0 30px 30px
    .desc
      flex: auto
      .task-desc
        display: block
        font-size: $font-size-medium-x
        color: $color-text-ll
      .task-project
        margin-top: 20px
        display: block
        font-size: $font-size-small-s
        color: $color-text-l
    .task-count
      flex: none
      margin: 0 60px 0 30px
      font-size: $font-size-medium
      color: $color-text-ll
  .menu-item
    display: flex
    justify-content: center
    height: 80px
    .icon
      flex: 1
      text-align: center
      margin: 15px 30px
      fill: $color-theme-d
</style>
