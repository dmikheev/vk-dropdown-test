export default function debounce(cb, interval, leading = false) {
    let timeoutId = null;

    return (...args) => {
        if (timeoutId !== null) {
            clearTimeout(timeoutId);
        } else if (leading) {
            cb(...args);
            timeoutId = setTimeout(() => {
                timeoutId = null;
            }, interval);

            return;
        }

        timeoutId = setTimeout(() => {
            timeoutId = null;
            cb(...args);
        }, interval);
    };
}
