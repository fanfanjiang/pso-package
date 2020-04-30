import Vue from 'vue'
import App from './App.vue'
import PsoPackege from '@/index.js'

Vue.use(PsoPackege, { apiUrl: process.env.VUE_APP_APIURL });

new Vue({
  render: h => h(App)
}).$mount('#app') 
