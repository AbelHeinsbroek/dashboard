// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

// load the lodash library
window._ = require('lodash')

import Vue from 'vue'
import App from './App'
import router from './router'

import ElementUI from 'element-ui';

import 'element-ui/lib/theme-chalk/index.css';
import 'element-ui/lib/theme-chalk/display.css';

import AsyncComputed from 'vue-async-computed'

Vue.use(AsyncComputed)

// load fontawesome
import 'font-awesome/css/font-awesome.css'

import PIVue from 'pi-vue'
import 'pi-vue/dist/pi-vue.css'


// fetch polyfill for IE11-
import 'whatwg-fetch'

require('./polyfill.js')

Vue.use(ElementUI)

window.afdb = 'SLIMM Productie'

Vue.config.productionTip = false

Vue.use(PIVue, {
  url: 'https//slimm.vitens.lan/piwebapi',
  //url: '/piwebapi',
  webid2: true
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App },
  data: {
    context: '',
    title: ''
  }
})
