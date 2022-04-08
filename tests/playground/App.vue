<template>
    <div class="external">
        <div class="internal">
            <div
                class="goal"
                v-touch="onTap"
                v-touch:swipe.passive.once="onTap"
                v-touch:swpipe.passive.once="onTap"
                v-touch-tolerance="{tap: 12}"
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
                console.log(event);
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
    }
    .internal {
        display: flex;
        align-items: center;
        margin: 0 auto;
        width: 512px;
        height: 256px;
        background-color: bisque;
    }
    .goal {
        transition: transform .2s ease-in-out;
        margin: 0 auto;
        width: 256px;
        height: 128px;
        background-color: darkred;
        cursor: pointer;
    }
    .v-touch-dbltap {
        transform: scale(0.97);
    }
</style>