## [0.0.14](https://github.com/webigorkiev/vuetouch/tree/v0.0.14) (2022-04-11)

### Improvement

* add drag tolerance
* add ability to pass a value in the drag event

## [0.0.13](https://github.com/webigorkiev/vuetouch/tree/v0.0.13) (2022-04-11)

### Bug Fixes

* debounce bug

### Improvement

* Added the ability to pass a value in the modifier

```vue
    <div v-touch:press.debounce:500="onPress">Debounce 500 ms</div>
```

It wil work for events:

* **tap**
* **dbltap** - only for touch devices
* **longtap**
* **hold**
* **swipe**

And for modifiers **debounce** and **multi**

## [0.0.12](https://github.com/webigorkiev/vuetouch/tree/v0.0.12) (2022-04-11)

### Bug Fixes

* dbltap event for touch devices
