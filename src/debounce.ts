export function debounce(cb: CallableFunction, duration: number = 0): CallableFunction {
    let timer: any;

    return function(this: any) {

        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const context = this;

        // eslint-disable-next-line prefer-rest-params
        const args = arguments;

        clearTimeout(timer);
        timer = setTimeout(function() {

            // @ts-ignore
            cb.apply(context, args);
        }, duration);
    };
}