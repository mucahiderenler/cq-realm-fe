import App from './App.vue';
import router from './router/index'
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import {createBootstrap} from 'bootstrap-vue-next'

// Add the necessary CSS
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css'
const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(createBootstrap())

app.mount("#app")
