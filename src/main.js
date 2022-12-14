import Vue from 'vue'
import App from './App'
import dayjs from 'dayjs'

Vue.config.productionTip = false

App.mpType = 'app'
Vue.prototype.$dayjs = dayjs

const app = new Vue({
  ...App
})
app.$mount()
