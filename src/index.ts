import type {Plugin, Directive, DirectiveBinding} from "vue";

export interface VueTouchOptions {
    click?: boolean; // is used click mode
    classes?: VueTouchOptionsClasses; // classes for all state of component
    tolerance?: VueTouchOptionsTolerance; // in ms
}
type events = "tap"|"dubletap"|"longtap"|"swipe"|"hold"|"drug"|"hover"|"rollover";
interface VueTouchOptionsClasses {
    tap?: string,
    dubletap?:string,
    longtap?: string,
    swipe?: string,
    hold?: string,
    drug?: string,
    hover?: string,
    rollover?: string
}
interface VueTouchOptionsTolerance { // in ms
    tap?: number,
    dubletap?: number,
    longtap?: number,
    swipe?: number,
    hold?: number,
    drug?: number,
    hover?: number,
    rollover?: number
}
interface TouchElement extends HTMLElement {
    _vueTouch: {
        callbacks: Array<DirectiveBinding<CallableFunction|string>>,
        opts: Required<VueTouchOptions>,
        touchStarted: boolean,
        touchMoved: boolean,
        touchDragTime?: number,
        swipeOutBounded: boolean,
        touchStartTime?: number,
        currentX?: number,
        currentY?: number,
        lastX?: number,
        lastY?: number,
    }
}
const allowsEvents: events[] = ["tap","dubletap","longtap","swipe","hold","drug","hover","rollover"];
const defaultOptions = {
    click: true,
    classes: {},
    tolerance: {
        tap: 10,
        dubletap: 100,
        longtap: 400,
        swipe: 30,
        hold: 400,
        drug: 100,
        rollover: 100
    }
};
const defaultFlags = {
    currentX: undefined,
    currentY: undefined,
    lastX: undefined,
    lastY: undefined,
    touchStarted: false,
    touchMoved: false,
    touchDragTime: undefined,
    swipeOutBounded: false,
    touchStartTime: undefined,
};
const defaultListenerOptions: AddEventListenerOptions = {
    once: false,
    passive: false,
    capture: false
};
const getCoords = (
    event: MouseEvent|TouchEvent
): {x: number, y: number} => event.type.indexOf('mouse') !== -1
    ? {x: (event as MouseEvent).clientX, y: (event as MouseEvent).clientY}
    : {x: (event as TouchEvent).touches[0].clientX, y: (event as TouchEvent).touches[0].clientY};
const assignOptions = (
    options?: VueTouchOptions, defaults: VueTouchOptions = defaultOptions
) => Object.assign(
    {},
    defaults || {},
    options || {},
    {tolerance: Object.assign({}, defaults?.tolerance || {}, options?.tolerance || {})},
) as  Required<VueTouchOptions>;

export default {
    install(app, options?: VueTouchOptions) {
        const opts = assignOptions(options);
        const createTouchElement = (el: HTMLElement|TouchElement, options?:VueTouchOptions): TouchElement => {
            return Object.assign(el, {
                _vueTouch: {
                    ...defaultFlags,
                    callbacks: [],
                    ...("_vueTouch" in el ? el._vueTouch : {}),
                    opts: assignOptions(options, "_vueTouch" in el ? el._vueTouch.opts : opts)
                }
            }) as TouchElement;
        };
        const addClass = (el: TouchElement, name: keyof VueTouchOptionsClasses) => {
            const className = el._vueTouch.opts.classes[name];
            className && el.classList.add(className);
        };
        const removeClass = (el: TouchElement, name: keyof VueTouchOptionsClasses) => {
            const className = el._vueTouch.opts.classes[name];
            className && el.classList.remove(className);
        };
        const clean = (el: TouchElement) => {
            const classes = el._vueTouch.opts.classes || {};
            Object.keys(classes).map((cl) => removeClass(el, cl as keyof VueTouchOptionsClasses));
            Object.assign(el._vueTouch, defaultFlags);
        };
        const emit = (event: Event, name: events) => {
            const el = event.target as TouchElement;
            const callbacks = el._vueTouch.callbacks.filter(
                (cl) => cl.arg === name
            );
            // TODO;
        };
        const touchstart = (event: Event) => {
            const el = event.target as TouchElement;
            console.log("touchstart");
            console.log(el._vueTouch);
        };
        const touchmove = (event: Event) => {
            const el = event.target as TouchElement;
            // console.log("touchmove");
        };
        const touchcancel = (event: Event) => {
            const el = event.target as TouchElement;
            clean(el);
        };
        const touchend = (event: Event) => {
            const el = event.target as TouchElement;
            console.log("touchend");
        };
        const mouseenter = (event: Event) => {
            const el = event.target as TouchElement;
            addClass(el, "hover");
        };
        const mouseleave = (event: Event) => {
            const el = event.target as TouchElement;
            removeClass(el, "hover");
        };
        const dblclick = (event: Event) => {
            const el = event.target as TouchElement;
            console.log("dblclick");
            console.log(el._vueTouch.callbacks);
        };

        app.directive('touch', {
            beforeMount(el, binding) {
                const touchEl = createTouchElement(el);
                const listenerOpts = Object.assign({}, defaultListenerOptions);
                const type = binding.arg = binding.arg || "tap";
                const modifiers = binding.modifiers;
                listenerOpts.capture = modifiers.capture || false;
                listenerOpts.once = modifiers.once || false;
                listenerOpts.passive = modifiers.passive || false;
                !allowsEvents.includes(<events>type) && console.error(`Allows only ${allowsEvents.join(", ")} modifiers for v-touch`);
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
        } as Directive<HTMLElement|TouchElement, CallableFunction|string>);
        app.directive('touch-classes', {
            beforeMount(el: HTMLElement, binding) {
                createTouchElement(el, {classes: binding.value});
            }
        } as Directive<HTMLElement, VueTouchOptionsClasses>);
        app.directive('touch-tolerance', {
            beforeMount(el: HTMLElement, binding) {
                createTouchElement(el, {tolerance: binding.value});
            }
        } as Directive<HTMLElement, VueTouchOptionsTolerance>);
    }
} as Plugin;

// modifiers
// .stop
// .prevent
// .self
// .capture
// .once
// .passive