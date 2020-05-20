import 'normalize.css/normalize.css';
import 'font-awesome/css/font-awesome.min.css';
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
