<template>
    <div class="external">
        <div class="internal">
            <div
                class="goal"
                v-touch:tap="onTap"
                v-touch:dbltap="onDblTap"
                v-touch:longtap="onLongTap"
            ></div>
        </div>
    </div>
</template>

<script lang="ts">
    import {defineComponent} from "vue";

    export default defineComponent({
        name: "App",
        methods: {
            onTap(event) {
                console.log("tap", event);
            },
            onDblTap(event) {
                console.log("dbltap", event);
            },
            onLongTap(event) {
                console.log("longtap", event);
            }
        }
    });
</script>

<style>
    .external {
        display: flex;
        align-items: center;
        margin: 0 auto;
        width: 1024px;
        height: 512px;
        background-color: aliceblue;
        box-sizing: border-box;
    }
    .internal {
        display: flex;
        align-items: center;
        margin: 0 auto;
        width: 512px;
        height: 256px;
        background-color: bisque;
        box-sizing: border-box;
    }
    .goal {
        transition: all .2s ease-in-out;
        margin: 0 auto;
        width: 256px;
        height: 128px;
        background-color: darkred;
        cursor: pointer;
        box-sizing: border-box;
    }
    .v-touch-hover {
        border: 5px dashed black;
    }
    .v-touch-press {
        border-radius: 30% 0 30% 0;
    }
    .v-touch-hold {
        background-color: #4d0000;
    }
    .v-touch-dbltap {
        transform: scale(0.97);
        border-radius: 0 30% 0 30%;
    }
</style>