import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';

import './assets/bootstrap-lumen.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './assets/style.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount('#app');
