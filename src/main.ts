import "@/assets/styles/main.css";
import { createApp } from "vue";
import App from "./App.vue";
import router from './plugins/router';
// import { autoAnimatePlugin } from '@formkit/auto-animate/vue';

const app = createApp(App);
app.use(router);
// app.use(autoAnimatePlugin);
app.mount('#app');
