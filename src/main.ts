import 'gridstack/dist/gridstack.min.css';
import "@/assets/styles/main.css";
import App from "./App.vue";
import { createApp } from "vue";
import { autoAnimatePlugin } from '@formkit/auto-animate/vue'
import router from './plugins/router';
import storageService from './plugins/commonServices';

const app = createApp(App);
app.use(router);
await storageService.install!(app);
app.use(autoAnimatePlugin);
app.mount('#app');
