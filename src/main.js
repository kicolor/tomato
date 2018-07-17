import 'babel-polyfill'
import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App'

import createRouter from './router/router'
import store from './store'

// 解决移动端点击 300ms 的问题
import fastclick from 'fastclick'
import VueLazyload from 'vue-lazyload'
import echarts from 'echarts'
import { Icon } from 'element-ui'
import { ToastPlugin, TransferDom } from 'vux'

// import 'common/stylus/index.styl'

fastclick.attach(document.body)
Vue.use(VueLazyload, {
  loading: require('common/image/default.png')
})
Vue.prototype.$echarts = echarts
Vue.use(Icon)
Vue.use(ToastPlugin)
Vue.directive('transfer-dom', TransferDom)

Vue.use(VueRouter)
const router = createRouter()

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
