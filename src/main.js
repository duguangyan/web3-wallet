import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')
if(typeof window.ethereum != 'undefined'){
    console.log("MataMask is installed!")
}