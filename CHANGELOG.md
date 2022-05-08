## [0.0.20](https://github.com/webigorkiev/vuetouch/tree/v0.0.20) (2022-05-08)

### Improvement

* Add **touch-resize** directive
* Add **touch-finger** directive

## [0.0.19](https://github.com/webigorkiev/vuetouch/tree/v0.0.19) (2022-04-13)

### Improvement

* add dragstart event

### Bug Fixes

* Fix * for all events not works

## [0.0.18](https://github.com/webigorkiev/vuetouch/tree/v0.0.18) (2022-04-12)

### Improvement

* add interface for v-touch-scroll event payload
* Added documentation

## [0.0.17](https://github.com/webigorkiev/vuetouch/tree/v0.0.17) (2022-04-12)

### Bug Fixes

* fix scroll issue

## [0.0.16](https://github.com/webigorkiev/vuetouch/tree/v0.0.16) (2022-04-12)

### Bug Fixes

* fix modifier check

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
