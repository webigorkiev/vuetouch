<template>
    <div>
        <div class="example">
            <h2>Swipe</h2>
            <div class="slider" v-touch:swipe="onSwipe">
                <div class="active-item" :style="{'background-color': examples.carousel.data[examples.carousel.current]}">
                    {{ examples.carousel.current }}
                </div>
                <div class="gallery">
                    <div
                        v-for="(item, idx) in examples.carousel.data"
                        :key="item"
                        :style="{'background-color': item}"
                        :class="idx === examples.carousel.current ? 'active' : ''"
                    >
                        {{ idx }}
                    </div>
                </div>
            </div>
        </div>
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
            <li v-for="(event, idx) in events.slice().reverse()" :key="idx">{{ event }}</li>
        </ul>
    </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import type {VueTouchEvent} from '../../src';
import {defineTouch} from '../../src';
const colors = ['#ff2d55', '#5856d6', '#ff9500', '#ffcc00', '#ff3b30', '#5ac8fa', '#007aff', '#4cd964', '#000000'];

export default defineComponent({
    name: 'App',
    directives: {
        tt: defineTouch()
    },
    data() {
        return {
            events: [],
            examples: {
                carousel: {
                    data: [...colors],
                    current: 0
                }
            }
        };
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
        onSwipe(event: VueTouchEvent) {
            switch (event.direction) {
                case 'top':
                    this.examples.carousel.current + 3 >= this.examples.carousel.data.length
                        ? (this.examples.carousel.current = this.examples.carousel.current % 3)
                        : (this.examples.carousel.current += 3);
                    break;
                case 'right':
                    (this.examples.carousel.current % 3) - 1 < 0 ? (this.examples.carousel.current += 2) : this.examples.carousel.current--;
                    break;
                case 'bottom':
                    this.examples.carousel.current - 3 < 0
                        ? (this.examples.carousel.current = this.examples.carousel.data.length - (3 - (this.examples.carousel.current % 3)))
                        : (this.examples.carousel.current -= 3);
                    break;
                case 'left':
                    (this.examples.carousel.current % 3) + 1 >= 3
                        ? (this.examples.carousel.current -= 2)
                        : this.examples.carousel.current++;
                    break;
                default:
                    console.log(`${event.direction} is unknown direction for swipe event`);
            }
        },
        onSwipeLeft() {
            console.log('swipe', 'left filter');
        },
        onScroll(event: VueTouchEvent) {
            // console.log(event.scroll);
        },
        onDragMulti() {
            console.log('drag', 'multi');
        }
    }
});
</script>

<style>
body {
    margin: 0;
    font-family: 'Roboto', sans-serif;
}
h2 {
    font-weight: 400;
    font-size: 2rem;
}
.example {
    width: fit-content;
    margin: 0 auto;
    text-align: center;
}
.slider {
    display: flex;
    flex-direction: column;
    align-items: center;
    border: 1px solid #d3d3d3;
    padding: 24px;
    touch-action: none;
}
.active-item {
    width: 120px;
    height: 120px;
    border-radius: 120px;
    cursor: pointer;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    user-select: none;
}
.gallery {
    display: flex;
    flex-wrap: wrap;
    width: calc(48 * 3px);
    margin-top: 48px;
}
.gallery div {
    flex-shrink: 0;
    width: 40px;
    height: 40px;
    border-radius: 40px;
    margin: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    transition: transform 0.25s ease-in-out;
}
.gallery .active {
    transform: scale(1.15);
}
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
    transition: all 0.2s ease-in-out;
    margin: 0 auto;
    width: 256px;
    height: 128px;
    background-color: darkred;
    cursor: pointer;
    box-sizing: border-box;
}
.v-touch-hover {
    /* border: 5px dashed black; */
}
.v-touch-press {
    /* border-radius: 30% 0 30% 0; */
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
    /* border: 5px solid black; */
}
</style>

