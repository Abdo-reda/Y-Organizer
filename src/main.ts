import 'gridstack/dist/gridstack.min.css';
import "@/assets/styles/main.css";
import { createApp } from "vue";
import App from "./App.vue";
import router from './plugins/router';

const app = createApp(App);
app.use(router);
app.mount('#app');
