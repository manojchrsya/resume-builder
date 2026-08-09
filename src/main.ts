// import './assets/main.css'

// import { createApp } from 'vue'
// import { createPinia } from 'pinia'

// import App from './App.vue'
// import router from './router'

// const app = createApp(App)

// app.use(createPinia())
// app.use(router)

// app.mount('#app')

import { ViteSSG } from 'vite-ssg';
import type { RouteRecordRaw } from 'vue-router';
import App from './App.vue';
import router from '@/router/index.ts';

// ViteSSG replaces createApp
export const createApp = ViteSSG(
  App,
  { routes: router.options.routes as readonly RouteRecordRaw[], base: '/' },
  ({ app, router, initialState }) => {
    // app.use(pinia) etc.
  }
);
