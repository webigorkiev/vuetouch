<template>
    <div>
        <div class="external">
            <div class="scroll" v-tt:scroll="onScroll">
            <p>scroll</p>
            <p>scroll</p>
            <p>scroll</p>
            <p>scroll</p>
            <p>scroll</p>
            <p>scroll</p>
            <p>scroll</p>
            <p>scroll</p>
            <p>scroll</p>
            <p>scroll</p>
            <p>scroll</p>
        </div>
            <div class="internal">
                <div
                    class="goal"
                    v-touch:*="onAll"
                    v-touch:press="onPress"
                    v-touch:dbltap:100="onDblTap"
                    v-touch:hold="onHold"
                    v-touch:swipe="onSwipe"
                    v-touch:swipe.left="onSwipeLeft"
                    v-touch:drag.multi="onDragMulti"
                ></div>
            </div>
        </div>
        <ul>
            <li v-for="event in events.slice().reverse()">{{event}}</li>
        </ul>
    </div>
</template>

<script lang="ts">
    import {defineComponent} from "vue";
    import type {VueTouchEvent} from "../../src";
    import {defineTouch} from "../../src";

    export default defineComponent({
        name: "App",
        directives: {
          tt: defineTouch()
        },
        data() {
          return {
              events: []
          }
        },
        methods: {
            onAll(event: VueTouchEvent) {
                console.log(event);
                this.events.push(event.type);
            },
            onPress(event) {
                //console.log("press", event);
            },
            onDblTap(event) {
                //console.log("dbltap", event);
            },
            onHold(event) {
                //console.log("hold", event);
            },
            onSwipe(event) {
                console.log("swipe", event.direction);
            },
            onSwipeLeft() {
                console.log("swipe", "left filter");
            },
            onScroll(event:VueTouchEvent) {
                // console.log(event.scroll);
            },
            onDragMulti() {
                console.log("drag", "multi");
            }
        }
    });
</script>

<style>
    .scroll {
        height: 256px;
        width: 200px;
        margin: 0 auto;
        text-align: center;
        overflow-y: scroll;
        box-sizing: border-box;
    }
    ul {
        max-height: 200px;
        overflow: hidden;
        width: 200px;
        padding: 0;
        margin: 0 auto;
        text-align: center;
    }
    li {
        padding: 0;
        margin: 0;
        list-style: none;
    }
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
    .v-touch-tap {
        background-color: #cc0000;
    }
    .v-touch-longtap {
        background-color: #67cdcc;
    }
    .v-touch-hold {
        background-color: #4d0000;
    }
    .v-touch-dbltap {
        transform: scale(0.97);
        border-radius: 0 30% 0 30%;
    }
    .v-touch-rollover {
        border: 5px solid black;
    }
</style>