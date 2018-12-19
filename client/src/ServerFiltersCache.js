/**
 * @typedef {Object} FilterObject
 * @property {boolean} isFullyLoaded
 * @property {number[]} userIds
 */

export default class ServerFiltersCache {
    constructor() {
        this.filters = {};
    }

    /**
     * @param {string} query
     * @return {FilterObject}
     */
    getFilter(query) {
        return this.filters[query];
    }

    saveFilterUsers(userIds, query, offset = 0) {
        let filter = this.filters[query];

        if (!filter) {
            filter = {
                isFullyLoaded: false,
                userIds: [],
            };
        }

        const savedUserIds = filter.userIds.slice();
        savedUserIds.splice(offset, userIds.length, ...userIds);

        this.filters[query] = {
            isFullyLoaded: filter.isFullyLoaded || userIds.length === 0,
            userIds: savedUserIds,
        };
    }

    saveResponseData(response) {
        this.saveFilterUsers(
            response.users.map(user => user.id),
            response.query,
            response.offset,
        );
    }
}
