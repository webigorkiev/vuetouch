type func = (...args: any[]) => any;
export function debounce<T extends func>(cb: T, duration: number = 0): func {
    let timer: any;
    return function(this: any) {
        if(!timer) {
            cb.apply<typeof context, any, func>(this, arguments);
            timer = setTimeout(() => timer = undefined, duration);
        }
    };
}