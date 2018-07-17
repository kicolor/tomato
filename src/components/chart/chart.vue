<template>
  <transition name="slide">
    <div class="chart">
      <div class="back" @click="back">
        <i class="icon-back"></i>
      </div>
      <div class="date-show">
        <div v-show="choose" class="date-range">
          <group class="vux-group">
            <popup-picker title="日期范围" :data="dateRange" v-model="range">
            </popup-picker>
            <div v-show="choose && custom">
              <datetime
                v-model="dateStart"
                @on-change="change"
                title="开始"
                @on-cancel="log('cancel')"
                @on-confirm="onConfirm"
                @on-hide="log('hide', $event)">
              </datetime>
              <datetime
                v-model="dateStart"
                @on-change="change"
                title="结束"
                @on-cancel="log('cancel')"
                @on-confirm="onConfirm"
                @on-hide="log('hide', $event)">
              </datetime>
            </div>
          </group>
        </div>
        <div class="date-chart">
          <div v-show="choose && custom" ref="line" :style="{width: '380px', height: '450px'}"></div>
          <div v-show="!choose" ref="tree" :style="{width: '380px', height: '450px'}"></div>
          <div v-show="choose && !custom" ref="square" :style="{width: '380px', height: '450px'}"></div>
        </div>
      </div>
      <tab class="chart-type vux-group" :line-width="2" active-color="#ffcd32">
        <tab-item selected @on-item-click="onItemClick">Line</tab-item>
        <tab-item @on-item-click="onItemClick">Tree</tab-item>
        <tab-item @on-item-click="onItemClick">Square</tab-item>
      </tab>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import { Group, Cell, PopupPicker, Datetime, Tab, TabItem } from 'vux'

  export default {
    name: 'chart',
    data () {
      return {
        choose: true,
        custom: true,
        range: ['前 30 天'],
        dateRange: [[
          '上一周',
          '上一月',
          '前 7 天',
          '前 30 天',
          '自定义'
        ]],
        dateStart: '2018-5-19'
      }
    },
    mounted () {
      this.drawLine()
      this.drawTree()
      this.drawSquare()
    },
    methods: {
      onItemClick (index) {
        if (!index) {
          this.choose = true
          this.custom = true
        } else if (index === 1) {
          this.choose = false
        } else if (index === 2) {
          this.choose = true
          this.custom = false
        }
      },
      back () {
        this.$router.push({
          path: `/test`
        })
      },
      log (str1, str2 = '') {
        console.log(str1, str2)
      },
      change (value) {
        console.log('change', value)
      },
      onConfirm (val) {
        console.log('on-confirm arg', val)
        console.log('current value', this.value1)
      },
      drawLine () {
        const line = this.$refs.line
        let dateLine = this.$echarts.init(line)
        let option = {
          grid: {
            width: '100%',
            top: '10%'
          },
          tooltip: {
            trigger: 'item'
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['', '5月 1', '5月 2', '5月 3', '5月 4', '5月 5', '5月 6', '5月 7', '5月 8', '5月 9', '5月 10', '5月 11', '5月 12', '5月 13', '5月 14', '5月 15', '', ''],
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              interval: 0
            },
            splitArea: {
              interval: 0
            }
          },
          yAxis: {
            type: 'value',
            splitNumber: 4,
            splitLine: {
              show: false
            }
          },
          dataZoom: [
            {
              type: 'inside',
              start: 0,
              end: 40,
              filterMode: 'none'
            },
            {
              type: 'slider',
              show: true,
              bottom: 30,
              realtime: true,
              backgroundColor: 'rgba(255,205,50,0.7)',
              borderColor: 'transparent',
              fillerColor: 'transparent',
              showDataShadow: false,
              handleSize: '0',
              handelStyle: {
                opcity: 0
              },
              showDetail: false,
              zoomLock: true,
              z: 0
            }
          ],
          series: [
            {
              name: '番茄',
              data: [0, 0, 0, 50, 73, 45, 53, 0, 41, 95, 0, 86, 45, 0, 105, 64, 0, 0],
              type: 'line',
              smooth: true,
              areaStyle: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0, color: 'red' // 0% 处的颜色
                    },
                    {
                      offset: 1, color: '#ffcd32' // 100% 处的颜色
                    }
                  ],
                  globalCoord: false // 缺省为 false
                }
              },
              itemStyle: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0, color: 'red' // 0% 处的颜色
                    },
                    {
                      offset: 1, color: '#ffcd32' // 100% 处的颜色
                    }
                  ],
                  globalCoord: false // 缺省为 false
                }
              }
            }
          ]
        }
        dateLine.setOption(option)
      },
      drawTree () {
        const tree = this.$refs.tree
        let dateTree = this.$echarts.init(tree)
        let option = {
          title: {
            text: '树图',
            subtext: '虚构数据'
          },
          toolbox: {
            show: true,
            feature: {
              mark: {show: true},
              dataView: {show: true, readOnly: false},
              restore: {show: true},
              saveAsImage: {show: true}
            }
          },
          calculable: false,

          series: [
            {
              name: '树图',
              type: 'tree',
              orient: 'vertical',  // vertical horizontal
              rootLocation: {x: 'center', y: 50}, // 根节点位置  {x: 100, y: 'center'}
              nodePadding: 1,
              itemStyle: {
                normal: {
                  label: {
                    show: false,
                    formatter: '{ b }'
                  },
                  lineStyle: {
                    color: '#48b',
                    shadowColor: '#000',
                    shadowBlur: 3,
                    shadowOffsetX: 3,
                    shadowOffsetY: 5,
                    type: 'curve'
                  }
                },
                emphasis: {
                  label: {
                    show: true
                  }
                }
              },
              data: [
                {
                  name: '根节点',
                  value: 6,
                  children: [
                    {
                      name: '节点1',
                      value: 4,
                      children: [
                        {
                          name: '叶子节点1',
                          value: 4
                        },
                        {
                          name: '叶子节点2',
                          value: 4
                        },
                        {
                          name: '叶子节点3',
                          value: 2
                        },
                        {
                          name: '叶子节点4',
                          value: 2
                        },
                        {
                          name: '叶子节点5',
                          value: 2
                        },
                        {
                          name: '叶子节点6',
                          value: 4
                        }
                      ]
                    },
                    {
                      name: '节点2',
                      value: 4,
                      children: [{
                        name: '叶子节点7',
                        value: 4
                      },
                      {
                        name: '叶子节点8',
                        value: 4
                      }]
                    },
                    {
                      name: '节点3',
                      value: 1,
                      children: [
                        {
                          name: '叶子节点9',
                          value: 4
                        },
                        {
                          name: '叶子节点10',
                          value: 4
                        },
                        {
                          name: '叶子节点11',
                          value: 2
                        },
                        {
                          name: '叶子节点12',
                          value: 2
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
        dateTree.setOption(option)
      },
      drawSquare () {
        const square = this.$refs.square
        let dateSquare = this.$echarts.init(square)
        let hours = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23']
        let days = ['03.01', '03.02', '03.03', '03.04', '03.05', '03.06', '03.07', '03.08', '03.09', '03.10', '03.11', '03.12', '03.13', '03.14', '03.15', '03.16', '03.17', '03.18', '03.19', '03.20', '03.21', '03.22', '03.23', '03.24', '03.25', '03.26', '03.27', '03.28', '03.29', '03.30', '03.31']

        var data = []
        for (let i = 0; i < 31; i++) {
          for (let j = 0; j < 24; j++) {
            let dd = []
            dd.push(i)
            dd.push(j)
            let num = Math.ceil(Math.random() * 10 - 5)
            dd.push(num)
            data.push(dd)
          }
        }

        data = data.map(function (item) {
          return [item[0], item[1], item[2]]
        })
        let option = {
          xAxis: {
            type: 'category',
            data: days,
            splitArea: {
              show: true
            },
            splitLine: {
              lineStyle: {
                color: '#fff'
              }
            }
          },
          yAxis: {
            type: 'category',
            data: hours,
            splitArea: {
              show: true
            },
            splitLine: {
              lineStyle: {
                color: '#fff'
              }
            }
          },
          visualMap: {
            type: 'piecewise',
            min: -5,
            max: 10,
            orient: 'horizontal',
            laft: 'center',
            bottom: '0'
          },
          series: [
            {
              name: 'date square',
              type: 'heatmap',
              data: data,
              label: {
                normal: {
                  show: false
                }
              }
            }
          ]
        }
        dateSquare.setOption(option)
      }
    },
    components: {
      Group,
      Cell,
      PopupPicker,
      Datetime,
      Tab,
      TabItem
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .slide-enter-active, .slide-leave-active
    transition: all .5s
  .slide-enter, .slide-leave-to
    transform: translate3d(-100%, 0, 0)

  .chart
    position: fixed
    z-index: 100
    top: 0
    left: 0
    bottom: 0
    right: 0
    background: $color-background
    display: flex
    flex-direction: column
    justify-content: space-between
    align-item: stretch
    .back
      flex: none
      height: 42px
      .icon-back
        transform: rotate(180deg)
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme

    .date-show
      flex: 1

    .chart-type
      flex: none
</style>
