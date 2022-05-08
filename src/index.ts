import type {Plugin, Directive} from "vue";
import {assignOptions, createTouchElement, isTouchScreenDevice} from "./utils";
import {touchstart, touchmove, touchcancel, touchend, scroll, mouseleave, mouseenter, dblclick} from "./handlers";
import type {VueTouch} from "@/types";
import {debounce} from "./debounce";

export {VueTouch};
export interface VueTouchEvent {
    originalEvent: Event & {target: VueTouch.Element},
    type: VueTouch.events,
    direction: "left"|"right"|"top"|"bottom",
    currentXY: [number, number],
    multi: number,
    shiftXY: [number, number],
    scale: 0|1|-1,
    scroll: [number, number]
}
export interface VueTouchScrollEvent {
    originalEvent: Event & {target: VueTouch.Element},
    scroll: [number, number]
}
export interface VueTouchResizeEvent extends VueTouchScrollEvent {
    resize: [number, number]
}
export interface VueTouchFingerEvent {
    available: boolean
}
const allowsEvents: VueTouch.events[] = [
    "hover","press","hold","leave","dbltap","tap","longtap","release","rollover","swipe","drag","dragstart","scroll"
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
            // console.log(opts);
            const touchEl = createTouchElement(el, opts);
            const listenerOpts = Object.assign({}, defaultListenerOptions);
            binding.arg = binding.arg || "tap";
            const modifiers = binding.modifiers;
            listenerOpts.capture = modifiers.capture || false;
            listenerOpts.once = modifiers.once || false;
            listenerOpts.passive = modifiers.passive || false;
            Object.keys(modifiers).map((v) => {
                const [arg, param] = v.split(":");
                modifiers[arg] = modifiers[v];
                if(touchEl._vueTouch.opts.tolerance.hasOwnProperty(arg) && param) {
                    // @ts-ignore
                    touchEl._vueTouch.opts.tolerance[arg] = parseInt(param);
                }
            });
            if(modifiers.debounce && typeof binding.value === "function") {
                binding.value = debounce(binding.value, touchEl._vueTouch.opts.tolerance.debounce);
            }
            if(binding.arg === "*") {
                allowsEvents.map(
                    (type) => touchEl._vueTouch.callbacks.push(
                        Object.assign({}, binding, {arg: type})
                    )
                );
            } else {
                const [arg, param] = binding.arg.split(":");
                binding.arg = arg;
                if(touchEl._vueTouch.opts.tolerance.hasOwnProperty(arg) && param) {
                    // @ts-ignore
                    touchEl._vueTouch.opts.tolerance[arg] = parseInt(param);
                }
                touchEl._vueTouch.callbacks.push(binding);
            }
            (!allowsEvents.includes(<VueTouch.events>binding.arg) && binding.arg !== "*")
            && console.error(`Allows only ${allowsEvents.join(", ")} modifiers for v-touch`);
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
    } as Directive<HTMLElement|VueTouch.Element, (...args: any[]) => any|string>;
};

// directive
export const touch:Directive = defineTouch();

// scroll window directive
const defineScroll = (): Directive  => {
    let fn: (evt: Event) => any;

    return {
        mounted(el, binding) {
            fn = (event: Event) => {
                typeof binding.value === "function" && binding.value({
                    originalEvent: event,
                    scroll: [
                        scrollX,
                        scrollY
                    ]
                } as VueTouchScrollEvent);

            };
            window.addEventListener("scroll", fn, { passive: true });
        },
        unmounted() {
            fn && window.removeEventListener('scroll', fn);
        }
    };
};
const vscroll: Directive = defineScroll();
export {vscroll as scroll};

// resize
const defineResize = (): Directive  => {
    let fn: (evt: Event) => any;

    return {
        mounted(el, binding) {
            fn = (event: Event) => {
                typeof binding.value === "function" && binding.value({
                    originalEvent: event,
                    resize: [
                        innerWidth,
                        innerHeight
                    ],
                    scroll: [
                        scrollX,
                        scrollY
                    ]
                } as VueTouchResizeEvent);
            };

            window.addEventListener("resize", fn, {passive: true});
        },
        unmounted() {
            fn && window.removeEventListener('resize', fn);
        }
    };
};
const vresize: Directive = defineResize();
export {vresize as resize};

const defineFinger = ():Directive => {
    return {
      async mounted(el, binding) {
          let isFingerprintAvailable = false;
          if("PublicKeyCredential" in window) {
              isFingerprintAvailable = await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
          }
          typeof binding.value === "function" && binding.value({available: isFingerprintAvailable} as VueTouchFingerEvent);
      }
    };
};
const vfinger: Directive = defineFinger();
export {vfinger as finger};

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
        app.directive("touch-scroll", defineScroll());
        app.directive("touch-resize", defineResize());
        app.directive("touch-finger", defineFinger());
    }
} as Plugin;