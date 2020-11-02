// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import * as echarts from 'echarts';
import CollapseTransition from 'element-ui/lib/transitions/collapse-transition'
axios.defaults.withCredentials=true


Vue.prototype.$axios = axios
Vue.use(echarts)
Vue.use(ElementUI)
Vue.component(CollapseTransition.name, CollapseTransition)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
