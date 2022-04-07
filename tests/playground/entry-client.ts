import { createApp } from 'vue'
import App from "./App.vue";
import vuetouch from "../../src/index"
const app = createApp(App);
app.use(vuetouch);
app.mount("#app");