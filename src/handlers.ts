import type {VueTouch} from "@/types";
import {addClass, clean, emit, isTouchScreenDevice, removeClass, setXYLD} from "./utils";

export const touchstart = (event: Event) => {
    const el = event.currentTarget as VueTouch.Element;
    const vt = el._vueTouch;
    vt.touchStarted = true;
    vt.touchMoved = false;
    vt.touchStartTime = event.timeStamp;
    emit(event, el, "press");
    addClass(el, "press", true);
    vt.multi > 1 && addClass(el, "multi", true);
    vt.touchHoldTimer = vt.touchHoldTimer || setTimeout(() => {
        emit(event, el, "hold");
        addClass(el, "hold");
    }, vt.opts.tolerance.hold);
};
export const touchmove = (event: Event) => {
    const el = event.currentTarget as VueTouch.Element;
    const vt = el._vueTouch;
    if(!vt.touchStarted) {
        return;
    }
    vt.requestAnimationFrameId && cancelAnimationFrame(vt.requestAnimationFrameId);
    vt.requestAnimationFrameId = requestAnimationFrame(() => {
        setXYLD(event, el);
        const move = Math.abs(vt.currentXY[0] - vt.lastXY[0]) >= vt.opts.tolerance.tap ||
            Math.abs(vt.currentXY[1] - vt.lastXY[1]) >= vt.opts.tolerance.tap;
        if(!vt.touchMoved && move) {
            vt.startXY = vt.currentXY;
        }
        vt.touchMoved = vt.touchMoved || move;
        if(vt.touchMoved) {
            vt.touchHoldTimer && clearTimeout(vt.touchHoldTimer);
            delete vt.touchHoldTimer;
            removeClass(el, "hold");
        }
        if(move) {
            emit(event, el, "rollover", false);
            addClass(el, "rollover");
            vt.multi > 1 && addClass(el, "multi");
            vt.touchRolloverTimer && clearTimeout(vt.touchRolloverTimer);
            vt.touchRolloverTimer = setTimeout(
                () => (removeClass(el, "rollover"), removeClass(el, "multi")),
                vt.opts.tolerance.timeout
            );
        }
        emit(event, el, "drag", false);
        addClass(el, "drag");
        vt.multi > 1 && addClass(el, "multi");
        vt.touchDragTimer && clearTimeout(vt.touchDragTimer);
        vt.touchDragTimer = setTimeout(
            () => (removeClass(el, "drag"), removeClass(el, "multi")),
            vt.opts.tolerance.timeout
        );
    });
};
export const touchcancel = (event: Event) => {
    const el = event.currentTarget as VueTouch.Element;
    clean(el);
};
export const touchend = (event: Event) => {
    const el = event.currentTarget as VueTouch.Element;
    const vt = el._vueTouch;

    vt.touchHoldTimer && clearTimeout(vt.touchHoldTimer);
    delete vt.touchHoldTimer;
    removeClass(el, "hold");
    if(!vt.touchMoved) {
        const time = event.timeStamp - (vt.touchStartTime as number);
        if(time < vt.opts.tolerance.hold) {
            if(time >= vt.opts.tolerance.longtap) {
                emit(event, el, "longtap");
                addClass(el, "longtap", true);
                vt.multi > 1 && addClass(el, "multi", true);
            } else {
                emit(event, el, "tap");
                addClass(el, "tap", true);
                vt.multi > 1 && addClass(el, "multi", true);
                if(vt.touchDbltapTimer && isTouchScreenDevice()) {
                    emit(event, el, "dbltap");
                    addClass(el, "dbltap", true);
                    vt.multi > 1 && addClass(el, "multi", true);
                }
                vt.touchDbltapTimer = setTimeout(() => vt.touchDbltapTimer = undefined,  vt.opts.tolerance.dbltap);
            }
        }
    } else {
        if(
            Math.abs(vt.currentXY[0] - vt.startXY[0]) >= vt.opts.tolerance.swipe
            || Math.abs(vt.currentXY[1] - vt.startXY[1]) >= vt.opts.tolerance.swipe
        ) {
            emit(event, el, "swipe", false);
            addClass(el, "swipe", true);
            vt.multi > 1 && addClass(el, "multi", true);
        }
    }

    vt.touchStarted = false;
    vt.touchMoved = false;

    emit(event, el, "release");
    addClass(el, "release", true);
};
export const mouseenter = (event: Event) => {
    const el = event.currentTarget as VueTouch.Element;
    addClass(el, "hover");
    emit(event, el, "hover");
};
export const mouseleave = (event: Event) => {
    const el = event.currentTarget as VueTouch.Element;
    const vt = el._vueTouch;
    removeClass(el, "hover");
    vt.touchHoldTimer && clearTimeout(vt.touchHoldTimer);
    delete vt.touchHoldTimer;
    removeClass(el, "hold");
    if(vt.touchMoved) {
        emit(event, el, "swipe");
        addClass(el, "swipe", true);
        vt.multi > 1 && addClass(el, "multi", true);
    }
    vt.touchStarted = false;
    vt.touchMoved = false;
    emit(event, el, "leave");
    addClass(el, "leave", true);
};
export const dblclick = (event: Event) => {
    const el = event.currentTarget as VueTouch.Element;
    emit(event, el, "dbltap");
    addClass(el, "dbltap", true);
};
export const scroll = (event: Event) => {
    const el = event.currentTarget as VueTouch.Element;
    emit(event, el, "scroll");
};