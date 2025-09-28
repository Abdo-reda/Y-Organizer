import 'gridstack/dist/gridstack.min.css';
import "@/assets/styles/main.css";
import App from "./App.vue";
import { createApp } from "vue";
import { autoAnimatePlugin } from '@formkit/auto-animate/vue'
import router from './plugins/router';
import storageService from './plugins/commonServices';

async function initApp() {
    const app = createApp(App);
    app.use(router);
    await storageService.install!(app); //TODO: maybe put the init in a loading route/component
    app.use(autoAnimatePlugin);
    app.mount('#app');
}

initApp();