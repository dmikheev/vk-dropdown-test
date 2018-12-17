/**
 * @typedef {Object} QueryParam
 * @property {number} offset
 * @property {string} query
 */

/**
 * @typedef {Object} QueryCacheObject
 * @property {*} [data]
 * @property {boolean} isFetching
 * @property {Request|null} request
 */

function getCacheKey(query = '', offset = 0) {
    return `${query}_${offset}`;
}

export default class UsersCache {
    constructor() {
        if (!global.__vk_test_dropdown_cache) {
            global.__vk_test_dropdown_cache = {};
        }

        this.cache = global.__vk_test_dropdown_cache;
    }

    /**
     * @param {string} [query]
     * @param {number} [offset]
     * @return {QueryCacheObject|null}
     */
    getCacheObject(query, offset) {
        const key = getCacheKey(query, offset);

        return this.cache[key] || null;
    }

    onRequestStart(query, offset, request) {
        const key = getCacheKey(query, offset);

        this.cache[key] = {
            ...this.cache[key],
            isFetching: true,
            request,
        };
    }

    onRequestSuccess(query, offset, data) {
        const key = getCacheKey(query, offset);

        this.cache[key] = {
            data,
            isFetching: false,
            request: null,
        };
    }

    onRequestError(query, offset) {
        const key = getCacheKey(query, offset);

        this.cache[key] = {
            ...this.cache[key],
            isFetching: false,
            request: null,
        };
    }
}
