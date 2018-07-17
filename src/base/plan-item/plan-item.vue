<template>
    <ul>
        <li class="list-group-item">
          <span @click.stop="switchPlan" class="comp-btn">
            <i v-show="plan.complete" class="el-icon-success"></i>
          </span>
          <p class="desc">
            <span class="desc-plan">{{plan.desc}}</span>
            <span class="desc-project">{{plan.proName}}</span>
          </p>
          <span class="plan-detail">
            <span v-show="planIndex !== plan.id" class="plan-count">{{plan.fulfill}} &#8260; {{plan.predict}}</span>
            <span v-show="planIndex === plan.id">
              <i class="el-icon-caret-right" @click.stop="play"></i>
              <i class="el-icon-more" @click.stop="showPlan"></i>
            </span>
          </span>
        </li>
      </ul>
</template>

<script type="text/ecmascript-6">

  export default {
    props: ['plan', 'planIndex'],
    methods: {
      switchPlan() {
        this.$emit('complete', this.plan)
      },
      play() {
        this.$emit('start', this.plan)
      },
      showPlan() {
        this.$emit('select', this.plan)
      }
    }
  }

</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .list-group-item
    display: flex
    align-items: center
    padding: 30px 0 30px 30px
    &.complete
      opacity: 0.5
      transition: 0.4s
    .comp-btn
      flex: none
      width: 36px
      height: 36px
      margin-right: 30px
      border: 1px $color-dialog-background solid
      border-radius: 50%
      .el-icon-success
        font-size: $font-size-large
        color: $color-icon-success
    .desc
      flex: auto
      .desc-plan
        display: block
        font-size: $font-size-medium-x
        color: $color-text-ll
      .desc-project
        margin-top: 20px
        display: block
        font-size: $font-size-small-s
        color: $color-text-l
    .plan-detail
      flex: none
      width: 120px
      margin-right: 20px
      font-size: $font-size-medium
      color: $color-text-ll
      .plan-count
        padding-left: 20px
      i
        font-size: $icon-size-small
        color: $color-icon
        margin-left: 10px
  .loading-container
    position: absolute
    width: 100%
    top: 50%
    transform: translateY(-50%)
</style>
