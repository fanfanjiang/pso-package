import 'normalize.css/normalize.css';
import 'font-awesome/css/font-awesome.min.css';
import '../theme/2D8CF0/index.css';
import '../theme/006E4B/index.css';
import '../theme/6076E3/index.css';
import '../theme/E56281/index.css';
import '../theme/fd8647/index.css';

import Vue from 'vue'
import App from './App.vue'
import router from './router';
import store from './store'

import PsoPackege from '@/index.js'
Vue.use(PsoPackege, { apiUrl: process.env.VUE_APP_APIURL, apiPrefix: process.env.VUE_APP_APIURL });

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app') 
