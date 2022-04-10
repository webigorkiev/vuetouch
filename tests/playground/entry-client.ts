import { createApp } from 'vue';
import App from "./App.vue";
import vuetouch from "../../src/index";
import type {VueTouch} from "../../src";

const app = createApp(App);
app.use(vuetouch, {
} as VueTouch.Options);
app.mount("#app");