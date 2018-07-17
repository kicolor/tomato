<template>
  <div class="cal-wrapper">
    <div class="cal-header">
      <div @click.stop="statistic" class="total">统计</div>
      <div class="l" @click.stop="preMonth"><div class="arrow-left icon">&nbsp</div></div>
      <div class="title">{{curYearMonth}}</div>
      <div class="r" @click.stop="nextMonth"><div class="arrow-right icon">&nbsp</div></div>
    </div>
    <div class="cal-body">
      <div class="weeks">
        <span
          v-for="(dayName, dayIndex) in i18n[calendar.options.locale].dayNames"
          class="item"
          :key="dayIndex"
          >
          {{i18n[calendar.options.locale].dayNames[(dayIndex + calendar.options.weekStartOn) % 7]}}
        </span>
      </div>
      <div class="dates" >
        <div v-for="date in dayList" class="item"
          :class="[{
            today: date.status ? (today == date.date) : false,
            event: date.status ? (date.title != undefined) : false,
            [calendar.options.className] : (date.date == selectedDay)
          }, ...date.customClass]"
          :key="date.date"
          >
          <p class="date-num"
            @click="handleChangeCurday(date)"
            :style="{color: date.title != undefined ? ((date.date == selectedDay) ? '#fff' : customColor) : 'inherit'}">
            {{date.status ? date.date.split('/')[2] : '&nbsp'}}</p>
          <span v-if="date.status ? (today == date.date) : false" class="is-today" :style="{backgroundColor: customColor }" ></span>
          <span v-if="date.status ? (date.title != undefined) : false" class="is-event"
            :style="{borderColor: customColor, backgroundColor: (date.date == selectedDay) ? customColor : 'inherit'}"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import i18n from 'common/js/i18n'
  import { dateTimeFormatter, isEqualDateStr } from 'common/js/tools.js'

  export default {
    name: 'cal-panel',
    created () {

    },
    data () {
      return {
        i18n,
        curYear: this.calendar.params.curYear,
        curMonth: this.calendar.params.curMonth
      }
    },
    props: {
      events: {
        type: Array,
        required: true
      },
      calendar: {
        type: Object,
        required: true
      },
      selectedDay: {
        type: String,
        required: false
      }
    },
    computed: {
      dayList () {
        let firstDay = new Date(this.curYear, this.curMonth, 1)
        let dayOfWeek = firstDay.getDay()
        // 根据当前日期计算偏移量 // Calculate the offset based on the current date
        if (this.calendar.options.weekStartOn > dayOfWeek) {
          dayOfWeek = dayOfWeek - this.calendar.options.weekStartOn + 7
        } else {
          dayOfWeek = dayOfWeek - this.calendar.options.weekStartOn
        }

        let startDate = new Date(firstDay)
        startDate.setDate(firstDay.getDate() - dayOfWeek)

        let item, status, tempArr = [], tempItem
        for (let i = 0; i < 42; i++) {
          item = new Date(startDate)
          item.setDate(startDate.getDate() + i)

          if (this.curMonth === item.getMonth()) {
            status = 1
          } else {
            status = 0
          }
          tempItem = {
            date: `${item.getFullYear()}/${item.getMonth() + 1}/${item.getDate()}`,
            status: status,
            customClass: []
          }
          this.events.forEach((event) => {
            if (isEqualDateStr(event.date, tempItem.date)) {
              tempItem.title = event.title
              tempItem.desc = event.desc || ''
              if (event.customClass) tempItem.customClass.push(event.customClass)
            }
          })
          tempArr.push(tempItem)
        }
        return tempArr
      },
      today () {
        let dateObj = new Date()
        return `${dateObj.getFullYear()}/${dateObj.getMonth() + 1}/${dateObj.getDate()}`
      },
      curYearMonth () {
        let tempDate = Date.parse(new Date(`${this.curYear}/${this.curMonth + 1}/01`))
        return dateTimeFormatter(tempDate, this.i18n[this.calendar.options.locale].format)
      },
      customColor () {
        return this.calendar.options.color
      }
    },
    methods: {
      statistic () {
        this.$emit('chart')
      },
      nextMonth (e) {
        this.$emit('next')
        // if (this.curMonth < 11) {
        //   this.curMonth++
        // } else {
        //   this.curYear++
        //   this.curMonth = 0
        // }
        this.curYear = this.calendar.params.curYear
        this.curMonth = this.calendar.params.curMonth
      },
      preMonth (e) {
        this.$emit('pre')
        // if (this.curMonth > 0) {
        //   this.curMonth--
        // } else {
        //   this.curYear--
        //   this.curMonth = 11
        // }
        this.curYear = this.calendar.params.curYear
        this.curMonth = this.calendar.params.curMonth
      },
      handleChangeCurday (date) {
        if (date.status) {
          this.$emit('cur-day-changed', date.date)
        }
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~common/stylus/variable"

@media screen and (min-width: 768px)
  .cal-wrapper
    width: 80%
    padding: 40px 80px
    .date-num
      line-height: 80px

@media screen and (max-width: 767px)
  .cal-wrapper
    width: 100%
    padding: 20px 10px
    .date-num
      line-height: 84px

.cal-wrapper
  .cal-header
    display: flex
    width: 100%
    font-weight: 500
    overflow: hidden
    padding-bottom: 20px
    > div
      line-height: 60px
      height: 60px
    .total
      width: 20%
      color: $color-theme-d
      font-size: $font-size-medium
      background: #303030
      // border: solid $icon-border-size $color-theme-d
      border-radius: 20px
      text-align: center
      margin-left: 20px
      margin-right: 60px
    .title
      flex: 1
      text-align: center
      font-size: $font-size-medium
      color: $base-orange
    .l
      text-align: left
      width: 14%
      padding-left: 20px
      cursor: pointer
      .arrow-left
        color: $base-orange
        position: relative
      .arrow-left:before
        content: ''
        position: absolute
        left: 10px
        top: 20px
        width: 20px
        height: 20px
        border-top: solid $icon-border-size $color-theme-d
        border-right: solid $icon-border-size $color-theme-d
        transform: rotate(-135deg)
    .r
      text-align: right
      width: 14%
      padding-right: 20px
      cursor: pointer
      .arrow-right
        color: $base-orange
        position: relative
      .arrow-right:before
        content: ''
        position: absolute
        right: 10px
        top: 20px
        width: 20px
        height: 20px
        border-top: solid $icon-border-size $color-theme-d
        border-right: solid $icon-border-size $color-theme-d
        transform: rotate(45deg)

  .cal-body
    width: 100%
    .weeks
      width: 100%
      overflow: hidden
      text-align: center
      // font-size: 1rem
      font-size: $font-size-medium
      .item
        line-height: 100px
        float: left
        width: 14.285%
    .dates
      width: 100%
      overflow: hidden
      text-align: center
      // font-size: 1rem
      font-size: $font-size-medium
      .item
        position: relative
        float: left
        display: block
        width: 14.285%
        cursor: default
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0)
        .date-num
          // font-size: 1rem
          font-size: $font-size-medium
          position: relative
          z-index: 3
        &.event
          cursor: pointer
        &.selected-day
          .is-event
            background-color: $base-orange
        .is-event
          content: ''
          border: 1px solid $base-orange
          background-color: #fff
          border-radius: 50%
          width: 72px
          height: 72px
          position: absolute
          left: 50%
          top: 50%
          z-index: 1
          margin-left: -36px
          margin-top: -36px
        /*
        .is-today
          content: ''
          background-color: $base-orange
          border-radius: 50%
          opacity: .8
          width: 24px
          height: 8px
          position: absolute
          left: 50%
          top: 50%
          z-index: 2
          margin-left: -12px
          margin-top: 16px
        */

</style>
