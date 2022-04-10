import type {Plugin, Directive} from "vue";
import {assignOptions, addClass, removeClass, clean, emit, createTouchElement, setXYLD} from "./utils";
import type {VueTouch} from "@/types";

export interface VueTouchEvent {
    originalEvent: Event & {target: VueTouch.Element},
    type: VueTouch.events,
    direction: "left"|"right"|"top"|"bottom",
    currentXY: number[],
    multi: number,
    shiftXY: number[],
    scale: 0|1|-1,
    scroll: number[]
}
const allowsEvents: VueTouch.events[] = [
    "hover","press","hold","leave","dbltap","tap","longtap","release","rollover","swipe","drag","scroll"
];
const defaultListenerOptions: AddEventListenerOptions = {
    once: false,
    passive: false,
    capture: false
};

export default {
    install(app, options?: VueTouch.Options) {
        const opts = assignOptions(options);

        const touchstart = (event: Event) => {
            const el = event.currentTarget as VueTouch.Element;
            const vt = el._vueTouch;
            vt.touchStarted = true;
            vt.touchMoved = false;
            vt.touchStartTime = event.timeStamp;
            emit(event, el, "press");
            addClass(el, "press", true);
            vt.multi > 1 && addClass(el, "multi", true);
            vt.touchHoldTimer = vt.touchHoldTimer || setTimeout(() => {
                emit(event, el, "hold");
                addClass(el, "hold");
            }, vt.opts.tolerance.hold);
        };
        const touchmove = (event: Event) => {
            const el = event.currentTarget as VueTouch.Element;
            const vt = el._vueTouch;

            if(!vt.touchStarted) {
                return;
            }
            vt.requestAnimationFrameId && cancelAnimationFrame(vt.requestAnimationFrameId);
            vt.requestAnimationFrameId = requestAnimationFrame(() => {
                setXYLD(event, el);
                const move = Math.abs(vt.currentXY[0] - vt.lastXY[0]) >= vt.opts.tolerance.tap ||
                    Math.abs(vt.currentXY[1] - vt.lastXY[1]) >= vt.opts.tolerance.tap;

                if(!vt.touchMoved && move) {
                    vt.startXY = vt.currentXY;
                }
                vt.touchMoved = vt.touchMoved || move;

                if(vt.touchMoved) {
                    vt.touchHoldTimer && clearTimeout(vt.touchHoldTimer);
                    delete vt.touchHoldTimer;
                    removeClass(el, "hold");
                }

                if(move) {
                    emit(event, el, "rollover");
                    addClass(el, "rollover");
                    vt.multi > 1 && addClass(el, "multi");
                    vt.touchRolloverTimer && clearTimeout(vt.touchRolloverTimer);
                    vt.touchRolloverTimer = setTimeout(
                        () => (removeClass(el, "rollover"), removeClass(el, "multi")),
                        vt.opts.tolerance.timeout
                    );
                }

                emit(event, el, "drag");
                addClass(el, "drag");
                vt.multi > 1 && addClass(el, "multi");
                vt.touchDragTimer && clearTimeout(vt.touchDragTimer);
                vt.touchDragTimer = setTimeout(
                    () => (removeClass(el, "drag"), removeClass(el, "multi")),
                    vt.opts.tolerance.timeout
                );
            });
        };
        const touchcancel = (event: Event) => {
            const el = event.currentTarget as VueTouch.Element;
            clean(el);
        };
        const touchend = (event: Event) => {
            const el = event.currentTarget as VueTouch.Element;
            const vt = el._vueTouch;

            vt.touchHoldTimer && clearTimeout(vt.touchHoldTimer);
            delete vt.touchHoldTimer;
            removeClass(el, "hold");

            if(!vt.touchMoved) {
                const time = event.timeStamp - (vt.touchStartTime as number);

                if(time < vt.opts.tolerance.hold) {
                    if(time >= vt.opts.tolerance.longtap) {
                        emit(event, el, "longtap");
                        addClass(el, "longtap", true);
                        vt.multi > 1 && addClass(el, "multi", true);
                    } else {
                        emit(event, el, "tap");
                        addClass(el, "tap", true);
                        vt.multi > 1 && addClass(el, "multi", true);
                    }
                }
            } else {
                emit(event, el, "swipe");
                addClass(el, "swipe", true);
                vt.multi > 1 && addClass(el, "multi", true);
            }

            vt.touchStarted = false;
            vt.touchMoved = false;

            emit(event, el, "release");
            addClass(el, "release", true);
        };
        const mouseenter = (event: Event) => {
            const el = event.currentTarget as VueTouch.Element;
            addClass(el, "hover");
            emit(event, el, "hover");
        };
        const mouseleave = (event: Event) => {
            const el = event.currentTarget as VueTouch.Element;
            const vt = el._vueTouch;

            removeClass(el, "hover");
            vt.touchHoldTimer && clearTimeout(vt.touchHoldTimer);
            delete vt.touchHoldTimer;
            removeClass(el, "hold");

            if(vt.touchMoved) {
                emit(event, el, "swipe");
                addClass(el, "swipe", true);
                vt.multi > 1 && addClass(el, "multi", true);
            }

            vt.touchStarted = false;
            vt.touchMoved = false;

            emit(event, el, "leave");
            addClass(el, "leave", true);
        };
        const dblclick = (event: Event) => {
            const el = event.currentTarget as VueTouch.Element;
            emit(event, el, "dbltap");
            addClass(el, "dbltap", true);
        };
        const scroll = (event: Event) => {
            const el = event.currentTarget as VueTouch.Element;
            emit(event, el, "scroll");
        };

        app.directive('touch', {
            beforeMount(el, binding) {
                const isFirstDirective = !("_vueTouch" in el);
                const touchEl = createTouchElement(el, opts);
                const listenerOpts = Object.assign({}, defaultListenerOptions);
                const type = binding.arg = binding.arg || "tap";
                const modifiers = binding.modifiers;
                listenerOpts.capture = modifiers.capture || false;
                listenerOpts.once = modifiers.once || false;
                listenerOpts.passive = modifiers.passive || false;
                (!allowsEvents.includes(<VueTouch.events>type) && binding.arg !== "*")
                    && console.error(`Allows only ${allowsEvents.join(", ")} modifiers for v-touch`);

                if(binding.arg === "*") {
                    allowsEvents.map(
                        (type) => touchEl._vueTouch.callbacks.push(
                            Object.assign({}, binding, {arg: type})
                        )
                    );
                } else {
                    touchEl._vueTouch.callbacks.push(binding);
                }

                if(isFirstDirective) {
                    touchEl.addEventListener('touchstart', touchstart, listenerOpts);
                    touchEl.addEventListener('touchmove', touchmove, listenerOpts);
                    touchEl.addEventListener('touchcancel', touchcancel, listenerOpts);
                    touchEl.addEventListener('touchend', touchend, listenerOpts);
                    touchEl.addEventListener("scroll", scroll, listenerOpts);

                    if(touchEl._vueTouch.opts.click) {
                        touchEl.addEventListener('mousedown', touchstart, listenerOpts);
                        touchEl.addEventListener('mousemove', touchmove, listenerOpts);
                        touchEl.addEventListener('mouseup', touchend, listenerOpts);
                        touchEl.addEventListener('mouseenter', mouseenter, listenerOpts);
                        touchEl.addEventListener('mouseleave', mouseleave, listenerOpts);
                        touchEl.addEventListener('dblclick', dblclick, listenerOpts);
                    }
                }
            },
            unmounted(touchEl) {
                touchEl.removeEventListener('touchstart', touchstart);
                touchEl.removeEventListener('touchmove', touchmove);
                touchEl.removeEventListener('touchcancel', touchcancel);
                touchEl.removeEventListener('touchend', touchend);
                touchEl.removeEventListener("scroll", scroll);

                if("_vueTouch" in touchEl && touchEl._vueTouch && touchEl._vueTouch.opts.click) {
                    touchEl.removeEventListener('mousedown', touchstart);
                    touchEl.removeEventListener('mousemove', touchmove);
                    touchEl.removeEventListener('mouseup', touchend);
                    touchEl.removeEventListener('mouseenter', mouseenter);
                    touchEl.removeEventListener('mouseleave', mouseleave);
                    touchEl.removeEventListener('dblclick ', dblclick);
                }
            }
        } as Directive<HTMLElement|VueTouch.Element, CallableFunction|string>);
        app.directive('touch-classes', {
            beforeMount(el: HTMLElement, binding) {
                createTouchElement(el, {classes: binding.value});
            }
        } as Directive<HTMLElement, VueTouch.OptionsClasses>);
        app.directive('touch-tolerance', {
            beforeMount(el: HTMLElement, binding) {
                createTouchElement(el, {tolerance: binding.value});
            }
        } as Directive<HTMLElement, VueTouch.OptionsTolerance>);
    }
} as Plugin;