# @vuemod/vue-touch

Enable tap, swipe, drag, touch, hold, mouse down, mouse up events on DOM Element in vue 3

## Documentation

[vuetouch docs RU](https://webigorkiev.github.io/vuetouch-docs/)

## Installation

```bash
yarn add @vuemod/vue-touch
```
### Ресурсы

- **default** - plugin: all directives are set globally (touch, scroll, touch-classes, touch-tolerance)
- {**defineTouch**} - v-touch directive creator function - allows you to specify settings
- {**touch**} - ready-made directive with default settings
- {**scroll**} - ready directive scroll (window scrolling)


### Installation globally

```typescript
import touch from "@vuemod/vue-touch";
import type {VueTouch} from "@vuemod/vue-touch";

const app = createApp(App); // App - common component
app.use(touch, {} as VueTouch.Options); // options is optional
```

When installed globally, directives will be added:

- **v-touch** - connecting event handlers
- **v-touch-scroll** - window scroll handler
- **v-touch-classes** - changing event classes
- **v-touch-tolerance** - change settings tolerance

### Connect locally as directives

```typescript
import {defineTouch} from "@vuemod/vue-touch";
import type {VueTouch} from "@vuemod/vue-touch";
import {defineComponent} from "vue";

const app = createApp(defineComponent({
    directives: {
        touch: defineComponent({} as VueTouch.Options)
    }
})); // App - common component
```

### Example

```vue
<template>
    <div v-touch:tap:10="onTap">Test Event</div>
</template>

<script lang="ts">
    import {defineComponent} from "vue";
    import type {VueTouchEvent} from "@vuemod/vue-touch";

    export default defineComponent({
        name: "App",
        methods: {
            onAll(event: VueTouchEvent) {
                console.log(event);
            }
        }
    });

</script>
```

## Events and modifiers

### Events

- \* - all events
- **hover** - mouse pointer over the element
- **press** - fires when the user clicks on an element
- **tap** - mouse click or tap on the screen (works when released)
- **dbltap** - double click or tap (triggered on release)
- **longtap** - fires when holding tolerance.longtap and releasing it
- **hold** - fires when holding tolerance.hold
- **leave** - the pointer has left the element
- **rollover** - fires when moving over an element (taking into account tap tolerance)
- **swipe** - Fires when you swipe over an element (additional modifiers **left, right, top, bottom, multi**)
- **drag** - Fires when an element is dragged (additional modifiers **left, right, top, bottom, multi**)
- **release** - Fires when an element is released
- **scroll** - Fires when an element is scrolled

### General modifiers:

- stop
- prevent
- capture
- self
- once
- passive
- debounce

### Special modifiers

- left
- right
- top
- bottom
- multi

## Payload events

### v-touch

```typescript
interface VueTouchEvent {
    originalEvent: event,
    type: VueTouch.events,
    direction: "left" | "right" | "up" | "down",
    currentXY: number[],
    multi: number,
    shiftXY: number[],
    scale: 0|1|-1,
    scroll: number[]
}
```

* **originalEvent** - original event
* **type** - event type
* **direction** - movement direction left, right, up, down
* **multi** - number of touch points for touch screens
* **currentXY** - array of popular touch or pointer position coordinates
* **shiftXY** - coordinates of the upper left corner of the block (for dragging)
* **scale** - scaling pointer -1 decrease, 0 - no change, 1 - increase
* **scroll** - scroll options [x, y]

### v-touch-scroll

```typescript
interface VueTouchScrollEvent {
    originalEvent: event,
    scroll: [number, number]
}
```

* **originalEvent** - original event
* **scroll** - scroll parameters [x, y]

## Settings

```typescript
interface Options {
    classes?: {
        hover?: string,
        leave?: string,
        press?: string,
        tap?: string,
        dbltap?:string,
        multi?:string,
        longtap?: string,
        hold?: string,
        rollover?: string,
        swipe?: string,
        drag?: string,
        release?: string,
    } // classes for all state of component
    tolerance?: { // in ms
        tap?: number, // in px
        multi?: number, // in px
        dbltap?: number, // on pc it auto
        longtap?: number, // in ms
        hold?: number, // in ms
        timeout?: number, // in ms
        debounce?: number, // in ms
        drag?: number, // min distance in px
        swipe?: number // min distance in px
    }
}
```

### Default classes

```

    hold: "v-touch-hold",
    press: "v-touch-press",
    multi: "v-touch-multi",
    dbltap: "v-touch-dbltap",
    tap: "v-touch-tap",
    longtap: "v-touch-longtap",
    hover: "v-touch-hover",
    leave: "v-touch-leave",
    rollover: "v-touch-rollover",
    swipe: "v-touch-swipe",
    drag: "v-touch-drag",
    release: "v-touch-release",
    
```