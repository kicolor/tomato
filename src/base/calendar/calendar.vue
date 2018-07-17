<template>
  <div>
    <!-- <vue-event-calendar
    :events="events"
    @monthChanged=""
    @dayChanged=""
    >
    </vue-event-calendar> -->
    <cal-panel
      :events="events"
      :calendar="calendarOptions"
      :selectedDay='date'
      @pre="pre"
      @next="next"
      @chart="chart"
    >
    </cal-panel>
    <router-view></router-view>
  </div>
</template>

<script>
  import CalPanel from 'base/cal-panel/cal-panel'

  export default {
    created () {
      console.log('created', this.calendarOptions)
    },
    data () {
      return {
        date: 'all',
        events: [
          {
            date: '2018/05/15',
            title: 'eat',
            desc: 'longlonglong description'
          },
          {
            date: '2018/05/12',
            title: 'this is a title'
          }
        ]
      }
    },
    computed: {
      calendarOptions: {
        get () {
          let dateObj = new Date()
          return {
            options: {
              locale: 'en',
              color: ' #f29543',
              className: 'selected-day',
              weekStartOn: 0
            },
            params: {
              curYear: dateObj.getFullYear(),
              curMonth: dateObj.getMonth(),
              curDate: dateObj.getDate(),
              curEventsDate: 'all'
            }
          }
        },
        set (newVal) {
          console.log('set', newVal)
        }

      },
      calendarParams () {
        let dateObj = new Date()
        return {
          curYear: dateObj.getFullYear(),
          curMonth: dateObj.getMonth(),
          curDate: dateObj.getDate(),
          curEventsDate: 'all'
        }
      }
    },
    methods: {
      chart () {
        console.log('chart')
        this.$router.push({
          path: `/chart`
        })
      },
      pre () {
        if (this.calendarOptions.params.curMonth > 0) {
          this.calendarOptions.params.curMonth--
        } else {
          this.calendarOptions.params.curYear--
          this.calendarOptions.params.curMonth = 11
        }
      },
      next (month) {
        if (this.calendarOptions.params.curMonth < 11) {
          this.calendarOptions.params.curMonth++
        } else {
          this.calendarOptions.params.curYear++
          this.calendarOptions.params.curMonth = 0
        }
      }
    },
    components: {
      CalPanel
    }
  }
</script>
