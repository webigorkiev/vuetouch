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

## События

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

## Общие модификаторы:

- stop
- prevent
- capture
- self
- once
- passive
- debounce

## Настройки

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
        longtap?: number,
        hold?: number,
        timeout?: number,
        debounce?: number,
        swipe?: number
    } // in ms
}
```