import 'gridstack/dist/gridstack.min.css';
import "@/assets/styles/main.css";
import { createApp } from "vue";
import { autoAnimatePlugin } from '@formkit/auto-animate/vue'
import router from './plugins/router';
import App from "./App.vue";

const app = createApp(App);
app.use(router);
app.use(autoAnimatePlugin);
app.mount('#app');
