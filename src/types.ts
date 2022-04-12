import type {DirectiveBinding} from "vue";

export namespace VueTouch {
    export interface Options {
        classes?: OptionsClasses; // classes for all state of component
        tolerance?: OptionsTolerance; // in ms
    }
    export type events = "hover"|"leave"|"press"|"tap"|"multi"|"dbltap"|"longtap"|"hold"|"swipe"|"drag"|"dragstart"|"rollover"
        |"release"|"scroll";
    export interface OptionsClasses {
        hover?: string,
        leave?: string,
        press?: string,
        tap?: string,
        dbltap?:string,
        multi?:string,
        longtap?: string,
        hold?: string,
        rollover?: string,
        swipe?: string,
        drag?: string,
        dragstart?: string,
        release?: string,
    }
    export interface OptionsTolerance { // in ms
        tap?: number, // in min px to set move
        multi?: number, // in min px distance
        dbltap?: number, // on pc it auto // max inteval
        longtap?: number, // interval in ms
        hold?: number, // interval in ms
        timeout?: number, // timeout for remove classes from element
        debounce?: number, // interval in ms
        drag?: number // min distance in px
        swipe?: number // min distance in px
    }
    export interface VueTouchOpts {
        callbacks: Array<DirectiveBinding<(...args: any[]) => any|string>>,
        opts: Required<Options & {
            classes: Required<OptionsClasses>,
            tolerance: Required<OptionsTolerance>
        }>,
        touchStarted: boolean, // on click or tap start
        touchMoved: boolean, // if moved over
        touchStartTime?: number, // time of touch start
        requestAnimationFrameId?: number,
        touchDbltapTimer?:NodeJS.Timer, // Timer for dbltouch event for devices
        touchHoldTimer?: NodeJS.Timer,
        touchRolloverTimer?: NodeJS.Timer,
        touchDragTimer?: NodeJS.Timer,
        multi: number,
        currentXY: number[],
        startXY: number[],
        lastXY: number[],
        shiftXY: number[],
        distance: number,
        lastDistance?: number,
        direction?: "left"|"right"|"top"|"bottom",
        scale: 0|1|-1,
        scroll: number[]
    }
    export interface Element extends HTMLElement {
        _vueTouch: VueTouchOpts
    }
}
