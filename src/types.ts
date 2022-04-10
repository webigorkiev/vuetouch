import type {DirectiveBinding} from "vue";

export namespace VueTouch {
    export interface Options {
        classes?: OptionsClasses; // classes for all state of component
        tolerance?: OptionsTolerance; // in ms
    }
    export type events = "hover"|"leave"|"press"|"tap"|"multi"|"dbltap"|"longtap"|"hold"|"swipe"|"drag"|"rollover"
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
        release?: string,
    }
    export interface OptionsTolerance { // in ms
        tap?: number, // in px
        multi?: number, // in px
        dbltap?: number, // on pc it auto
        longtap?: number,
        hold?: number,
        timeout?: number,
        debounce?: number,
        swipe?: number
    }
    export interface VueTouchOpts {
        callbacks: Array<DirectiveBinding<CallableFunction|string>>,
        opts: Required<Options & {
            classes: Required<OptionsClasses>,
            tolerance: Required<OptionsTolerance>
        }>,
        touchStarted: boolean, // on click or tap start
        touchMoved: boolean, // if moved over
        touchStartTime?: number,
        requestAnimationFrameId?: number,
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
