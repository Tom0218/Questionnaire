import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/main.scss'
import 'bootstrap'//////////////////////!!!!!!bootstrap

const app = createApp(App)
const pinia = createPinia() ///////////////系統內建不會家這行

app.use(pinia)
app.use(router)

app.mount('#app')
