import type {DirectiveBinding} from "vue";

export namespace VueTouch {
    export interface Options {
        click?: boolean; // is used click mode
        classes?: VueTouchOptionsClasses; // classes for all state of component
        tolerance?: VueTouchOptionsTolerance; // in ms
    }
    export type events = "tap"|"multi"|"dbltap"|"longtap"|"swipe"|"hold"|"drug"|"hover"|"rollover";
    export interface OptionsClasses {
        tap?: string,
        dbltap?:string,
        multi?:string,
        longtap?: string,
        swipe?: string,
        hold?: string,
        drug?: string,
        hover?: string,
        rollover?: string
    }
    export interface OptionsTolerance { // in ms
        tap?: number,
        multi?: number,
        dbltap?: number,
        longtap?: number,
        swipe?: number,
        hold?: number,
        drug?: number,
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
