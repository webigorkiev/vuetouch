import type {Plugin, Directive, DirectiveBinding} from "vue";
import type {VueTouch} from "@/types";

const allowsEvents: VueTouch.events[] = ["tap","dbltap","longtap","swipe","hold","drug","hover","rollover"];
const defaultOptions = {
    click: true,
    classes: {
        tap: "v-touch-tap",
        multi: "v-touch-multi",
        dbltap: "v-touch-dbltap",
        longtap: "v-touch-longtap",
        swipe: "v-touch-swipe",
        hold: "v-touch-hold",
        drug: "v-touch-drug",
        hover: "v-touch-hover",
        rollover: "v-touch-rollover",
    },
    tolerance: {
        tap: 10,
        multi: 10,
        dbltap: 100,
        longtap: 400,
        swipe: 30,
        hold: 400,
        drug: 100,
        rollover: 100
    }
};
const defaultFlags = {
    currentXY: [],
    lastXY: [],
    elXY: [],
    multi: false,
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
const getXY = (
    event: MouseEvent|TouchEvent
): [x: number, y: number] => event.type.indexOf('mouse') !== -1
    ? [(event as MouseEvent).clientX, (event as MouseEvent).clientY]
    : [(event as TouchEvent).touches[0].clientX, (event as TouchEvent).touches[0].clientY];
const assignOptions = (
    options?: VueTouch.Options, defaults: VueTouch.Options = defaultOptions
) => Object.assign(
    {},
    defaults || {},
    options || {},
    {classes: Object.assign({}, defaults?.classes || {}, options?.classes || {})},
    {tolerance: Object.assign({}, defaults?.tolerance || {}, options?.tolerance || {})},
) as  Required<VueTouch.Options>;

export default {
    install(app, options?: VueTouch.Options) {
        const opts = assignOptions(options);
        const createTouchElement = (el: HTMLElement|VueTouch.Element, options?:VueTouch.Options): VueTouch.Element => {
            return Object.assign(el, {
                _vueTouch: {
                    ...defaultFlags,
                    callbacks: [],
                    ...("_vueTouch" in el ? el._vueTouch : {}),
                    opts: assignOptions(options, "_vueTouch" in el ? el._vueTouch.opts : opts)
                }
            }) as VueTouch.Element;
        };
        const addClass = (el: VueTouch.Element, name: keyof VueTouch.OptionsClasses) => {
            const className = el._vueTouch.opts.classes[name];
            className && el.classList.add(className);
        };
        const removeClass = (el: VueTouch.Element, name: keyof VueTouch.OptionsClasses) => {
            const className = el._vueTouch.opts.classes[name];
            className && el.classList.remove(className);
        };
        const clean = (el: VueTouch.Element) => {
            const classes = el._vueTouch.opts.classes || {};
            Object.keys(classes).map((cl) => removeClass(el, cl as keyof VueTouch.OptionsClasses));
            Object.assign(el._vueTouch, defaultFlags);
        };
        const emit = (event: Event, type: VueTouch.events) => {
            const el = event.target as VueTouch.Element;
            const callbacks = el._vueTouch.callbacks.filter(
                (cl) => cl.arg === type
            );

            for(const binding of callbacks) {
                binding.modifiers.stop && event.stopPropagation();
                binding.modifiers.prevent && event.preventDefault();

                if(binding.modifiers.self && event.target !== event.currentTarget) {
                    continue;
                }

                if(typeof binding.value === "function") {
                    binding.value({
                        originalEvent: event,
                        type,
                        ...el._vueTouch
                    });
                }
            }
        };
        const touchstart = (event: Event) => {
            const el = event.target as VueTouch.Element;
            console.log("touchstart");
            console.log(el._vueTouch);
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
            console.log("touchend");
        };
        const mouseenter = (event: Event) => {
            const el = event.target as VueTouch.Element;
            addClass(el, "hover");
        };
        const mouseleave = (event: Event) => {
            const el = event.target as VueTouch.Element;
            removeClass(el, "hover");
        };
        const dblclick = (event: Event) => {
            const el = event.target as VueTouch.Element;
            emit(event, "dbltap");
            addClass(el, "dbltap");
            setTimeout(() => removeClass(el, "dbltap"), el._vueTouch.opts.tolerance.dbltap * 2);
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