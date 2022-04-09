import type {VueTouch} from "@/types";

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
        tap: 10, // drug > px
        multi: 10, // drug > px
        dbltap: 100, // ms
        longtap: 400,
        swipe: 30,
        hold: 400,
        drug: 100,
        rollover: 100,
        timeout: 200 // ms class remove after event
    }
};
const defaultFlags = {
    currentXY: [],
    lastXY: [],
    shiftXY: [],
    multi: 1,
    touchStarted: false,
    touchMoved: false,
    touchDragTime: undefined,
    swipeOutBounded: false,
    touchStartTime: undefined,
    touchHoldTimer: undefined
};
export const assignOptions = (
    options?: VueTouch.Options, defaults: VueTouch.Options = defaultOptions
) => Object.assign(
    {},
    defaults || {},
    options || {},
    {classes: Object.assign({}, defaults?.classes || {}, options?.classes || {})},
    {tolerance: Object.assign({}, defaults?.tolerance || {}, options?.tolerance || {})},
) as  Required<VueTouch.Options>;
/**
 * Get coords and length for touch events
 * @param event
 */
export const getXYL = (
    event: Event
): [x: number, y: number, length: number] => event.type.indexOf('mouse') !== -1 || event.type.indexOf('click') !== -1
    ? [(event as MouseEvent).clientX, (event as MouseEvent).clientY, 1]
    : [
        (event as TouchEvent).touches[0].clientX,
        (event as TouchEvent).touches[0].clientY,
        (event as TouchEvent).touches.length
    ];
export const addClass = (el: VueTouch.Element, name: keyof VueTouch.OptionsClasses, autoRemove = false) => {
    const className = el._vueTouch.opts.classes[name];
    className && el.classList.add(className);
    autoRemove && setTimeout(() => removeClass(el, name), el._vueTouch.opts.tolerance.timeout);
};
export const removeClass = (el: VueTouch.Element, name: keyof VueTouch.OptionsClasses) => {
    const className = el._vueTouch.opts.classes[name];
    className && el.classList.remove(className);
};
export const clean = (el: VueTouch.Element) => {
    const classes = el._vueTouch.opts.classes || {};
    Object.keys(classes).map((cl) => removeClass(el, cl as keyof VueTouch.OptionsClasses));
    Object.assign(el._vueTouch, defaultFlags);
};
export const emit = (event: Event, type: VueTouch.events) => {
    setXYL(event);
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
export const createTouchElement = (el: HTMLElement|VueTouch.Element, options?:VueTouch.Options): VueTouch.Element => {
    return Object.assign(el, {
        _vueTouch: {
            ...defaultFlags,
            callbacks: [],
            ...("_vueTouch" in el ? el._vueTouch : {}),
            opts: assignOptions(options, "_vueTouch" in el ? el._vueTouch.opts : {})
        }
    }) as VueTouch.Element;
};
const getCoords = (el: HTMLElement) => {
    const box = el.getBoundingClientRect();

    return [box.left + scrollX, box.top + scrollY];
};
export const setXYL = (event: Event) => {
    const el = event.target as VueTouch.Element;
    el._vueTouch.lastXY = el._vueTouch.currentXY;
    const [x, y, l] = getXYL(event);
    el._vueTouch.currentXY = [x, y];
    el._vueTouch.multi = l;

    if(event.target) {
        const coords = getCoords(event.target as HTMLElement);
        el._vueTouch.shiftXY = [el._vueTouch.currentXY[0] - coords[0], el._vueTouch.currentXY[1] - coords[1]];
    }

};