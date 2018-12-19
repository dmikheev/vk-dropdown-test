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
 * @typedef {Object} LastRequestData
 * @property {Request} request
 * @property {string} [query]
 * @property {number} [offset]
 */

export default class UsersLoader {
    /**
     * @param {UserLoadConfig} config
     */
    constructor(config) {
        this.config = config;

        /** @type LastRequestData|null */
        this.lastRequestData = null;
    }

    /**
     * @param {string} [query]
     * @param {number} [offset]
     * @param cb
     * @return {Request}
     */
    load(query, offset, cb) {
        if (this.lastRequestData) {
            if (this.lastRequestData.query === query && this.lastRequestData.offset === offset) {
                return this.lastRequestData.request;
            }

            if (!this.lastRequestData.request.isCompleted()) {
                this.lastRequestData.request.abort();
            }
        }

        const request = new Request({
            method: this.config.method,
            url: this.config.url,
            params: {
                query,
                offset,
            },
        });

        request.addCallback((response) => {
            cb(response);
        });

        this.lastRequestData = {
            query,
            offset,
            request,
        };

        request.send();

        return request;
    }
}
