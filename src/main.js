import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/styles/app.css'

import axios from 'axios'
import VueAxios from 'vue-axios'
Vue.use(VueAxios, axios)
// Agregamos la URL base de nuestra API
axios.defaults.baseURL = 'https://app-mevn-vue3udemy.herokuapp.com/api';
//axios.defaults.baseURL = "http://localhost:3001/api"

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
