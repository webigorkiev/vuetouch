import type {Plugin, Directive} from "vue";
import {assignOptions, createTouchElement, isTouchScreenDevice} from "./utils";
import {touchstart, touchmove, touchcancel, touchend, scroll, mouseleave, mouseenter, dblclick} from "./handlers";
import type {VueTouch} from "@/types";

export {VueTouch};
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

// define directive
export const defineTouch = (options?: VueTouch.Options):Directive => {
    const opts = assignOptions(options);
    return {
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
                if(!isTouchScreenDevice()) {
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
            if("_vueTouch" in touchEl && touchEl._vueTouch && !isTouchScreenDevice()) {
                touchEl.removeEventListener('mousedown', touchstart);
                touchEl.removeEventListener('mousemove', touchmove);
                touchEl.removeEventListener('mouseup', touchend);
                touchEl.removeEventListener('mouseenter', mouseenter);
                touchEl.removeEventListener('mouseleave', mouseleave);
                touchEl.removeEventListener('dblclick ', dblclick);
            }
        }
    } as Directive<HTMLElement|VueTouch.Element, CallableFunction|string>;
};

// directive
export const touch:Directive = defineTouch();

// scroll window directive
const defineScroll = (): Directive  => {
    let fn: (evt: Event) => any;

    return {
        mounted(el, binding) {
            fn = (event: Event) => {
                binding.value({
                    originalEvent: event,
                    scroll: [
                        scrollX,
                        scrollY
                    ]
                });

            };
            window.addEventListener("scroll", fn, { passive: true });
        },
        unmounted() {
            if(fn) {
                window.removeEventListener('scroll', fn);
            }
        }
    };
};
const vscroll: Directive = defineScroll();
export {vscroll as scroll};

// plugin
export default {
    install(app, options?: VueTouch.Options) {
        app.directive('touch', defineTouch(options));
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
        app.directive("touch-scroll", defineTouch());
    }
} as Plugin;