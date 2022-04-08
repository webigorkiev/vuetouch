import type {Plugin, Directive} from "vue";

export interface VueTouchOptions {
    click?: boolean; // is used click mode
    classes?: VueTouchOptionsClasses; // classes for all state of component
    tolerance?: VueTouchOptionsTolerance; // in ms
}
interface VueTouchOptionsClasses {
    tap?: string,
    longtap?: string,
    dubletap?:string,
    swipe?: string,
    hold?: string,
    drug?: string,
    hover?: string,
    rollover?: string
}
interface VueTouchOptionsTolerance {
    tap?: number,
    dubletap?: number,
    longtap?: number,
    swipe?: number,
    hold?: number,
    drug?: number,
    rollover?: number
}
interface TouchElement extends HTMLElement {
    _vueTouch: {
        events: string[] | ((...args: any[]) => void)[],
        opts: Required<VueTouchOptions>,
        touchStarted: boolean,
        touchMoved: boolean,
        touchDragTime: number|undefined,
        swipeOutBounded: boolean,
        touchStartTime: number|undefined
    }
}
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
const defaultListnerOptions: AddEventListenerOptions = {
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
                    touchStarted: false,
                    touchMoved: false,
                    touchDragTime: undefined,
                    swipeOutBounded: false,
                    touchStartTime: undefined,
                    events: [],
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
            console.log("touchcancel");
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

        app.directive('touch', {
            beforeMount(el, binding) {
                const touchEl = createTouchElement(el);
                const listnerOpts = Object.assign({}, defaultListnerOptions);

                touchEl.addEventListener('touchstart', touchstart, listnerOpts);
                touchEl.addEventListener('touchmove', touchmove, listnerOpts);
                touchEl.addEventListener('touchcancel', touchcancel, listnerOpts);
                touchEl.addEventListener('touchend', touchend, listnerOpts);

                if(touchEl._vueTouch.opts.click) {
                    touchEl.addEventListener('mousedown', touchstart, listnerOpts);
                    touchEl.addEventListener('mousemove', touchmove, listnerOpts);
                    touchEl.addEventListener('mouseup', touchend, listnerOpts);
                    touchEl.addEventListener('mouseenter', mouseenter, listnerOpts);
                    touchEl.addEventListener('mouseleave', mouseleave, listnerOpts);
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
                }
            }
        } as Directive<HTMLElement|TouchElement, (...args: any[]) => void|string>);
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