import { createApp } from 'vue'
import { devtools } from '@vue/devtools'
import App from './App.vue'

devtools.connect('http://localhost', 8098)

createApp(App).mount('#app')
