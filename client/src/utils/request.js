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
 * @property {RequestCallback} onSuccess
 * @property {RequestErrback} onError
 * @property {*} [params]
 * @property {string} url
 */

/**
 * @param {RequestOptions} options
 * @return {XMLHttpRequest}
 */
export default function request(options) {
    const method = options.method || 'GET';

    const xhr = new XMLHttpRequest();

    let { url } = options;
    if (options.params) {
        let queryString = '';
        Object.keys(options.params).forEach((key, idx) => {
            if (idx !== 0) {
                queryString += '&';
            }

            queryString += `${key}=${options.params[key]}`;
        });

        url += `?${queryString}`;
    }

    xhr.open(method.toUpperCase(), url, true);

    xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 400) {
            if (!options.onSuccess) {
                return;
            }

            if (xhr.responseText) {
                options.onSuccess(JSON.parse(xhr.responseText));
            } else {
                options.onSuccess();
            }
        } else {
            if (!options.onError) {
                return;
            }

            options.onError(xhr.status);
        }
    };

    if (options.onError) {
        xhr.onerror = options.onError;
    }

    if (options.data) {
        xhr.send(JSON.stringify(options.data));
    } else {
        xhr.send();
    }

    return xhr;
}
