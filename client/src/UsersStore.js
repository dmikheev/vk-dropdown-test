import UsersLoader from './UsersLoader';

export default class UsersStore {
    /**
     * @param {{ loadConfig: UserLoadConfig }} options
     */
    constructor(options) {
        this.usersData = {};
        this.usersLoader = new UsersLoader(options.loadConfig);
    }

    /**
     * @param {string} [query]
     * @param {number} [offset]
     * @param cb
     * @return {Request}
     */
    load(query, offset, cb) {
        return this.usersLoader.load(query, offset, (response) => {
            this.saveUsersData(response.users);
            cb(response);
        });
    }

    getUser(id) {
        return this.usersData[id];
    }

    get1000() {
        return Object.keys(this.usersData).map(key => this.usersData[key]).slice(0, 1000);
    }

    saveUsersData(users) {
        users.forEach((user) => {
            this.usersData[user.id] = user;
        });
    }
}
