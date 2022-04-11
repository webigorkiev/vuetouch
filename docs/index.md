# @vuemod/vue-touch

## Установка

```bash
yarn add @vuemod/vue-touch
```
### Ресурсы

- **default** - plugin: все директивы устанавливаются глоабльно (touch, scroll, touch-classes, touch-tolerance)
- {**defineTouch**} - фукция криейтор директивы v-touch - позволяет указать настройки
- {**touch**} - готовая директива с настройками по умолчанию
- {**scroll**} - готовая директива scroll (прокрутка window)


### Подключение глобально

```typescript
import touch from "@vuemod/vue-touch";
import type {VueTouch} from "@vuemod/vue-touch";

const app = createApp(App); // App - common component
app.use(touch, {} as VueTouch.Options); // options is optional
```

При глобальной утановке будут добавлены директивы:

- **v-touch** - подключение обработчиков событий
- **v-touch-scroll** - обработчик скрола окна
- **v-touch-classes** - изменение классов событий
- **v-touch-tolerance** - изменение настроек 

### Подключение локально

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

### Пример использования

```vue
<template>
    <div v-touch:tap="onTap">Test Event</div>
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

## События и модификаторы

### События

- \* - все события
- **hover** - указатель мыши над элементом
- **press** - срабатывает, когда пользователь нажимает на элемент
- **tap** - щелчек мышкой или нажатие на экран (срабатывает при отпускании)
- **dbltap** - двойной щелчек или касание (срабатывает при отпускании)
- **longtap** - срабатывает при удержании tolerance.longtap и отпускании
- **hold** - срабатывает при удержании tolerance.hold
- **leave** - указатель покинул элемент
- **rollover** - срабатывает при движении по элементу (c учетом толерантности tap)
- **swipe** - Срабатывает при свайпе по элементу (доп. модификаторы **left, right, top, bottom, multi**)
- **drag** - Срабатывает при перетаскивании элемента (доп. модификаторы **left, right, top, bottom, multi**)
- **release** - Срабатывает при отпускании элемента
- **scroll** - Срабатывает скроле элемента

### Общие модификаторы:

- stop
- prevent
- capture
- self
- once
- passive

### Специальные модификаторы

- left
- right
- top
- bottom 
- multi
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

### Класы по умолчанию

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