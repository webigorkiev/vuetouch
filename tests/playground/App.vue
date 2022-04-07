<template>
    <div class="external">
        <div class="internal">
            <div class="goal"></div>
        </div>
    </div>
</template>

<script lang="ts">
    import {defineComponent} from "vue";

    export default defineComponent({
        name: "App"
    });
</script>

<style>
    .external {
        display: flex;
        align-items: center;
        margin: 0 auto;
        width: 1024px;
        height: 256px;
        background-color: aliceblue;
    }
    .internal {
        display: flex;
        align-items: center;
        margin: 0 auto;
        width: 512px;
        height: 128px;
        background-color: bisque;
    }
    .goal {
        margin: 0 auto;
        width: 256px;
        height: 64px;
        background-color: darkred;
    }
</style>