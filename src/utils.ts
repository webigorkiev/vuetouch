import type {VueTouch} from "@/types";
import type {VueTouchEvent} from "@/index";

const defaultOptions = {
    click: true,
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
        dbltap: 100, // ms
        longtap: 200,
        hold: 500,
        timeout: 200 // ms class remove after event
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
    //touchDragTime: undefined,
    // swipeOutBounded: false,
    touchStartTime: undefined,
    requestAnimationFrameId: undefined,
    touchHoldTimer: undefined,
    touchRolloverTimer: undefined,
    touchDragTimer: undefined,
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
export const getTouchCoords = (
    event: Event
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
        const x = (event as TouchEvent).touches[0].clientX;
        const y = (event as TouchEvent).touches[0].clientY;

        if(length > 1) {
            const x1 = (event as TouchEvent).touches[1].clientX;
            const y1 = (event as TouchEvent).touches[1].clientY;
            distance = Math.round(Math.sqrt(Math.pow(x1-x, 2) + Math.pow(y1-y, 2)));
        }

        return {
            x,
            y,
            length,
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
export const emit = (event: Event, el: VueTouch.Element, type: VueTouch.events) => {
    setXYLD(event, el);
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

            if(binding.modifiers.multi && !el._vueTouch.multi) {
                continue;
            }

            if(["drag", "swipe"].includes(type)) {
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
const getCoords = (el: HTMLElement) => {
    const box = el.getBoundingClientRect();

    return [box.left + scrollX, box.top + scrollY];
};
export const setXYLD = (event: Event, el: VueTouch.Element) => {
    const vt = el._vueTouch;
    vt.lastXY = el._vueTouch.currentXY;
    vt.lastDistance = el._vueTouch.distance;
    const {x, y, length, distance} = getTouchCoords(event);
    vt.currentXY = [x, y];
    vt.multi = length;
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
        const coords = getCoords(el as HTMLElement);
        vt.shiftXY = [vt.currentXY[0] - coords[0], vt.currentXY[1] - coords[1]];
    }
};