/**
 * @callback RequestCallback
 * @param {*} [data]
 */
/**
 * @callback RequestErrback
 * @param {number} [errorCode]
 */

/**
 * @typedef {Object} RequestOptions
 * @property {*} [data]
 * @property {string} [method=GET]
 * @property {*} [params]
 * @property {string} url
 */

export default class Request {
    /**
     * @param {RequestOptions} options
     */
    constructor(options) {
        this.options = options;
        this.callbacks = [];
        this.errbacks = [];

        this.result = null;

        const xhr = new XMLHttpRequest();

        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 400) {
                this.result = xhr.responseText ? JSON.parse(xhr.responseText) : undefined;

                this.runCallbacks(this.result);
            } else {
                this.runErrbacks(xhr.status);
            }
        };

        xhr.onerror = (error) => {
            this.runErrbacks(error);
        };

        this.xhr = xhr;
    }

    addCallback(cb) {
        if (this.xhr.readyState === 4) {
            if (this.xhr.status >= 200 && this.xhr.status < 400) {
                cb(this.result);
            }

            return;
        }

        this.callbacks.push(cb);
    }

    addErrback(eb) {
        if (this.xhr.readyState === 4) {
            if (this.xhr.status >= 200 && this.xhr.status < 400) {
                return;
            }

            eb(this.xhr.status);
            return;
        }

        this.errbacks.push(eb);
    }

    send() {
        const method = this.options.method || 'GET';
        let { url } = this.options;
        if (this.options.params) {
            const queryString = Object.keys(this.options.params)
                .filter(paramName => typeof this.options.params[paramName] !== 'undefined')
                .map(paramName => `${paramName}=${encodeURIComponent(this.options.params[paramName])}`)
                .join('&');

            if (queryString) {
                url += `?${queryString}`;
            }
        }

        this.xhr.open(method.toUpperCase(), url, true);

        if (this.options.data) {
            this.xhr.send(JSON.stringify(this.options.data));
        } else {
            this.xhr.send();
        }
    }

    abort() {
        this.xhr.abort();
        this.runErrbacks();
    }

    runCallbacks(result) {
        this.callbacks.forEach(cb => cb(result));
    }

    runErrbacks(result) {
        this.errbacks.forEach(eb => eb(result));
    }

    isCompleted() {
        return this.xhr.readyState === 4;
    }
}
