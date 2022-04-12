import type {VueTouch} from "@/types";
import type {VueTouchEvent} from "@/index";

const defaultOptions = {
    classes: {
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
    },
    tolerance: {
        tap: 2, // drag > px
        multi: 50, // min distanse in px
        dbltap: 250, // ms max delay
        longtap: 200, // longtap ms min
        hold: 500, // hold ms min
        timeout: 200, // ms class remove after event
        debounce: 25, // ms debounce time
        drag: 10, // in px min distance
        swipe: 10 // in px min distance
    }
};
const defaultFlags = {
    currentXY: [],
    startXY: [],
    lastXY: [],
    shiftXY: [],
    multi: 1,
    touchStarted: false,
    touchMoved: false,
    scale: 0,
    scroll: [0, 0],
    touchStartTime: undefined,
    requestAnimationFrameId: undefined,
    touchDbltapTimer: undefined,
    touchHoldTimer: undefined,
    touchRolloverTimer: undefined,
    touchDragTimer: undefined,
};
export const isTouchScreenDevice = () => {
    return 'ontouchstart' in window || navigator.maxTouchPoints;
};
export const assignOptions = (
    defaults?: VueTouch.Options,
    options?: VueTouch.Options
) => Object.assign(
    {},
    defaultOptions,
    defaults || {},
    options || {},
    {classes: Object.assign(
        {}, defaultOptions.classes,
            defaults?.classes || {},
            options?.classes || {}
        )},
    {tolerance: Object.assign(
        {},
            defaultOptions.tolerance,
            defaults?.tolerance || {},
            options?.tolerance || {}
        )},
) as  Required<VueTouch.Options>;
export const getTouchCoords = (
    event: Event,
    el: VueTouch.Element,
    type?: VueTouch.events
): {
    x: number,
    y: number,
    length: number,
    distance: number
}=> {
    if(event.type.indexOf('mouse') !== -1 || event.type.indexOf('click') !== -1 || event.type.indexOf('scroll') !== -1) {
        return {
            x: (event as MouseEvent).clientX,
            y: (event as MouseEvent).clientY,
            length: 1,
            distance: 0
        };
    } else {
        let distance = 0;
        const length = (event as TouchEvent).touches.length;
        const showLangth = type && ["tap", "release", "longtap"].includes(type) ?  length + 1 : length;
        if(!length) {
            return {
                x: el._vueTouch.lastXY[0],
                y: el._vueTouch.lastXY[1],
                length: showLangth,
                distance: el._vueTouch.lastDistance as number
            };
        }
        const x = (event as TouchEvent).touches[0].clientX;
        const y = (event as TouchEvent).touches[0].clientY;
        if(length > 1) {
            const last = (event as TouchEvent).touches[length -1];
            const x1 = last.clientX;
            const y1 = last.clientY;
            distance = Math.sqrt(Math.pow(x1-x, 2) + Math.pow(y1-y, 2));
        }
        return {
            x,
            y,
            length: showLangth,
            distance
        };
    }
};
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
export const emit = (event: Event, el: VueTouch.Element, type?: VueTouch.events, countCoords = true) => {
    countCoords && setXYLD(event, el, type);
    const callbacks = el._vueTouch.callbacks.filter(
        (cl) => cl.arg === type
    );
    for(const binding of callbacks) {
        binding.modifiers.stop && event.stopPropagation();
        binding.modifiers.prevent && event.preventDefault();
        if(binding.modifiers.self && event.target !== el) {
            continue;
        }
        if(typeof binding.value === "function") {
            if(binding.modifiers.multi && el._vueTouch.multi <= 1) {
                continue;
            }
            if(type && ["drag", "swipe"].includes(type)) {
                const filters = ["left", "right", "top", "bottom"].filter((v) => binding.modifiers[v]);

                if(filters.length && el._vueTouch.direction) {
                    if(!filters.includes(el._vueTouch.direction)) {
                        continue;
                    }
                }
            }
            const addition = Object.fromEntries(
                Object.entries(el._vueTouch)
                    .filter(([key]) => [
                        "direction",
                        "currentXY",
                        "multi",
                        "shiftXY",
                        "scale",
                        "scroll"
                    ].includes(key))
            );
            binding.value({
                originalEvent: event,
                type,
                ...addition
            } as VueTouchEvent);
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
const getShifts = (el: HTMLElement) => {
    const box = el.getBoundingClientRect();

    return [box.left, box.top]; //[box.left + scrollX, box.top + scrollY];
};
export const setXYLD = (event: Event, el: VueTouch.Element, type?: VueTouch.events) => {
    const vt = el._vueTouch;
    vt.lastXY = vt.currentXY;
    vt.lastDistance = vt.distance;
    const {x, y, length, distance} = getTouchCoords(event, el, type);
    vt.currentXY = [x, y];
    vt.multi = length > 1 && distance > vt.opts.tolerance.multi ? length : 1;
    vt.distance = distance;
    vt.scroll = [el.scrollLeft, el.scrollTop];
    if(vt.lastDistance && vt.distance) {
        if(vt.lastDistance > vt.distance) {
            vt.scale = -1;
        }
        if(vt.lastDistance < vt.distance) {
            vt.scale = 1;
        }
        if(vt.lastDistance === vt.distance) {
            vt.scale = 0;
        }
    } else {
        vt.scale = 0;
    }
    if(vt.startXY.length) {
        const modX = Math.abs(vt.currentXY[0] - vt.startXY[0]);
        const modY = Math.abs(vt.currentXY[1] - vt.startXY[1]);

        if(modX > modY) {
            vt.direction = vt.currentXY[0] < vt.startXY[0] ? "left" : "right";
        } else {
            vt.direction = vt.currentXY[1] < vt.startXY[1] ? "top" : "bottom";
        }
    } else {
        vt.direction = undefined;
    }
    if(el) {
        const coords = getShifts(el as HTMLElement);
        vt.shiftXY = [vt.currentXY[0] - coords[0], vt.currentXY[1] - coords[1]];
    }
};