import UsersCache from './UsersCache';
import Request from './utils/Request';

/**
 * @typedef {Object} User
 * @property {number} id
 * @property {string} name
 * @property {string} lastName
 * @property {string} domain
 * @property {string} photoPath
 * @property {string} occupation
 */

/**
 * @typedef {Object} UserLoadConfig
 * @property {string} [method=GET]
 * @property {string} url
 */

/**
 * @typedef {Object} UsersLoader~requestOptions
 * @property {number} [offset]
 * @property {string} [query]
 */

export default class UsersLoader {
    /**
     * @param {UserLoadConfig} config
     */
    constructor(config) {
        this.cache = new UsersCache();
        this.config = config;
    }

    /**
     * @param {UsersLoader~requestOptions} options
     * @param cb
     */
    load(options, cb) {
        const cachedObject = this.cache.getCacheObject(options.query, options.offset);
        if (cachedObject) {
            if (cachedObject.data) {
                cb(cachedObject.data);
                return null;
            }

            if (cachedObject.isFetching) {
                cachedObject.request.addCallback((response) => {
                    cb(response);
                });
                return null;
            }
        }

        const request = new Request({
            method: this.config.method,
            url: this.config.url,
            params: options,
        });

        this.cache.onRequestStart(options.query, options.offset, request);

        request.addCallback((response) => {
            this.cache.onRequestSuccess(options.query, options.offset, response);
            cb(response);
        });
        request.addErrback(() => {
            this.cache.onRequestError(options.query, options.offset);
        });

        request.send();

        return request;
    }
}
