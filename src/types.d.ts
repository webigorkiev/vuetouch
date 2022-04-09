import type {DirectiveBinding} from "vue";

export namespace VueTouch {
    export interface Options {
        click?: boolean; // is used click mode
        classes?: VueTouchOptionsClasses; // classes for all state of component
        tolerance?: VueTouchOptionsTolerance; // in ms
    }
    export type events = "hover"|"press"|"tap"|"multi"|"dbltap"|"longtap"|"hold"|"swipe"|"drag"|"rollover"|"release";
    export interface OptionsClasses {
        hover?: string,
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
        tap?: number,
        multi?: number,
        dbltap?: number,
        longtap?: number,
        swipe?: number,
        hold?: number,
        drag?: number,
        hover?: number,
        rollover?: number,
        timeout: 200
    }
    export interface Element extends HTMLElement {
        _vueTouch: {
            callbacks: Array<DirectiveBinding<CallableFunction|string>>,
            opts: Required<VueTouchOptions & {
                classes: Required<VueTouchOptionsClasses>,
                tolerance: Required<VueTouchOptionsTolerance>
            }>,
            touchStarted: boolean,
            touchMoved: boolean,
            touchDragTime?: number,
            swipeOutBounded: boolean,
            touchStartTime?: number,
            touchHoldTimer?: Timer,
            multi: number,
            currentXY: number[],
            lastXY: number[],
            shiftXY: number[],
        }
    }
}
