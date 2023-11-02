import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';
import { ref } from 'vue';
// Name: '', Account: '', XRP_Balance: '',Email:'',Country:'',PublicKey:''
export const User_info = ref('');
export const allbank = ref([])
// Initialize exchange rate
export const exchangeRates = ref({
    US: 0.49,
    JP: 71.31,
    NT: 15.63,
    XRP: 1,
  });

const app = createApp(App)

app.use(router)
app.use(Antd)

app.mount('#app')