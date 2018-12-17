import request from './utils/request';

/**
 * @typedef {Object} User
 * @property {number} id
 * @property {string} name
 * @property {string} lastName
 * @property {string} link
 * @property {string} photoPath
 * @property {string} occupation
 */

/**
 * @callback MapUsersFunc
 * @param {*} response
 * @returns User[]
 */

/**
 * @typedef {Object} UserLoadConfig
 * @property {string} [method=GET]
 * @property {string} url
 * @property {MapUsersFunc} mapUsersFunc
 */

export default class UsersLoader {
    /**
     * @param {UserLoadConfig} config
     */
    constructor(config) {
        this.config = config;
    }

    load(cb) {
        request({
            method: this.config.method,
            url: this.config.url,
            onSuccess: (response) => {
                cb(this.config.mapUsersFunc(response));
            },
        });
    }
}
