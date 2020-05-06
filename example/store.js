import Vue from 'vue'
import Vuex from 'vuex'
import PsoPackege from '@/index.js'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {},
    mutations: {},
    actions: {},
    modules: { ...PsoPackege.store }
})
