import { createApp } from 'vue'
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router'
import './components/index.sass'
import store from './store/store'
import routes from './router'

const router = createRouter({
    history: createWebHistory(), routes,
})

const app = createApp(App)

app.use(store).use(router).mount('#app')