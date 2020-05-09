import Vue from 'vue'
import Vuex from 'vuex'
import { store } from '@/index.js'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {},
    mutations: {},
    actions: {},
    modules: { ...store }
})
