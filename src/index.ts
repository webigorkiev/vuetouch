import type {Plugin, Directive} from "vue";
import {assignOptions, addClass, removeClass, clean, emit, createTouchElement} from "./helpers/utils";
import type {VueTouch} from "@/types";

const allowsEvents: VueTouch.events[] = ["hover","tap","dbltap","longtap","swipe","hold","drug","rollover"];

const defaultListenerOptions: AddEventListenerOptions = {
    once: false,
    passive: false,
    capture: false
};

export default {
    install(app, options?: VueTouch.Options) {
        const opts = assignOptions(options);

        const touchstart = (event: Event) => {
            const el = event.target as VueTouch.Element;
            const vt = el._vueTouch;
            vt.touchStarted = true;
            vt.touchMoved = false;
            vt.swipeOutBounded = false;
            vt.touchStartTime = event.timeStamp;
            emit(event, "tap");
            addClass(el, "tap", true);
            vt.touchHoldTimer = vt.touchHoldTimer || setTimeout(() => {
                emit(event, "longtap");
                addClass(el, "longtap");
            }, vt.opts.tolerance.longtap);
        };
        const touchmove = (event: Event) => {
            const el = event.target as VueTouch.Element;
            // console.log("touchmove");
        };
        const touchcancel = (event: Event) => {
            const el = event.target as VueTouch.Element;
            clean(el);
        };
        const touchend = (event: Event) => {
            const el = event.target as VueTouch.Element;
            const vt = el._vueTouch;
            clearTimeout(vt.touchHoldTimer);
            delete vt.touchHoldTimer;
            removeClass(el, "longtap");
            console.log("touchend");
        };
        const mouseenter = (event: Event) => {
            const el = event.target as VueTouch.Element;
            addClass(el, "hover");
            emit(event, "hover");
        };
        const mouseleave = (event: Event) => {
            const el = event.target as VueTouch.Element;
            removeClass(el, "hover");
        };
        const dblclick = (event: Event) => {
            const el = event.target as VueTouch.Element;
            emit(event, "dbltap");
            addClass(el, "dbltap", true);
        };

        app.directive('touch', {
            beforeMount(el, binding) {
                const touchEl = createTouchElement(el, opts);
                const listenerOpts = Object.assign({}, defaultListenerOptions);
                const type = binding.arg = binding.arg || "tap";
                const modifiers = binding.modifiers;
                listenerOpts.capture = modifiers.capture || false;
                listenerOpts.once = modifiers.once || false;
                listenerOpts.passive = modifiers.passive || false;
                !allowsEvents.includes(<VueTouch.events>type) && console.error(`Allows only ${allowsEvents.join(", ")} modifiers for v-touch`);
                touchEl._vueTouch.callbacks.push(binding);

                touchEl.addEventListener('touchstart', touchstart, listenerOpts);
                touchEl.addEventListener('touchmove', touchmove, listenerOpts);
                touchEl.addEventListener('touchcancel', touchcancel, listenerOpts);
                touchEl.addEventListener('touchend', touchend, listenerOpts);

                if(touchEl._vueTouch.opts.click) {
                    touchEl.addEventListener('mousedown', touchstart, listenerOpts);
                    touchEl.addEventListener('mousemove', touchmove, listenerOpts);
                    touchEl.addEventListener('mouseup', touchend, listenerOpts);
                    touchEl.addEventListener('mouseenter', mouseenter, listenerOpts);
                    touchEl.addEventListener('mouseleave', mouseleave, listenerOpts);
                    touchEl.addEventListener('dblclick', dblclick, listenerOpts);
                }
            },
            unmounted(touchEl) {
                touchEl.removeEventListener('touchstart', touchstart);
                touchEl.removeEventListener('touchmove', touchmove);
                touchEl.removeEventListener('touchcancel', touchcancel);
                touchEl.removeEventListener('touchend', touchend);

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