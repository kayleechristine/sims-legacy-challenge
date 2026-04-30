import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createVuetify } from 'vuetify';
import { aliases, mdi } from 'vuetify/iconsets/mdi';
import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/styles';
import App from './App.vue';
import router from './router';
import './assets/style.css';

const vuetify = createVuetify({
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: { mdi },
  },
  theme: {
    defaultTheme: 'simsTheme',
    themes: {
      simsTheme: {
        dark: false,
        colors: {
          primary:    '#24b978',
          secondary:  '#116971',
          success:    '#2e8b58',
          accent:     '#a7ff83',
          background: '#f5f5f5',
          surface:    '#ffffff',
        },
      },
    },
  },
});

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(vuetify);

app.mount('#app');
