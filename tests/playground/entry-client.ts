import { createApp } from 'vue';
import App from "./App.vue";
import vuetouch from "../../src/index";
import type {VueTouchOptions} from "../../src/index";

const app = createApp(App);
app.use(vuetouch, {
    tolerance: {
        swipe: 50
    }
} as VueTouchOptions);
app.mount("#app");