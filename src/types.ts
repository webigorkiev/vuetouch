import type {DirectiveBinding} from "vue";

export namespace VueTouch {
    export interface Options {
        click?: boolean; // is used click mode
        classes?: OptionsClasses; // classes for all state of component
        tolerance?: OptionsTolerance; // in ms
    }
    export type events = "hover"|"leave"|"press"|"tap"|"multi"|"dbltap"|"longtap"|"hold"|"swipe"|"drag"|"rollover"|"release";
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
        tap?: number,
        multi?: number,
        dbltap?: number,
        longtap?: number,
        swipe?: number,
        hold?: number,
        drag?: number,
        hover?: number,
        rollover?: number,
        timeout?: number
    }
    export interface VueTouchOpts {
        callbacks: Array<DirectiveBinding<CallableFunction|string>>,
        opts: Required<Options & {
            classes: Required<OptionsClasses>,
            tolerance: Required<OptionsTolerance>
        }>,
        touchStarted: boolean,
        touchMoved: boolean,
        touchDragTime?: number,
        swipeOutBounded: boolean,
        touchStartTime?: number,
        touchHoldTimer?: NodeJS.Timer,
        multi: number,
        currentXY: number[],
        lastXY: number[],
        shiftXY: number[],
    }
    export interface Element extends HTMLElement {
        _vueTouch: VueTouchOpts
    }
}
