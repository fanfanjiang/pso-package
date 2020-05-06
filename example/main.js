import Vue from 'vue'
import App from './App.vue'
import router from './router';
import store from './store'

import PsoPackege from '@/index.js'
Vue.use(PsoPackege, { apiUrl: process.env.VUE_APP_APIURL, apiPrefix: process.env.VUE_APP_APIURL });

import axios from 'axios';
//返回拦截器
axios.interceptors.response.use((response) => {
  if (response.status === 200) {
    return Promise.resolve(response.data);
  } else {
    return Promise.reject(response);
  }
}, (error) => {
  if (error.response && error.response.status === 401) {
    router.replace({
      name: 'login',
      query: { redirect: router.currentRoute.fullPath }
    })
  }
  return Promise.reject(error);
});

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app') 
