<template>
    <div class="external">
        <div class="internal">
            <div class="goal" v-touch="onTap" v-touch-classes="{hover: 'touch-hover-class'}" v-touch-tolerance="{tap: 12}"></div>
            <a v-touch="onTap"></a>
            <p v-touch></p>
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
        margin: 0 auto;
        width: 256px;
        height: 128px;
        background-color: darkred;
    }
</style>