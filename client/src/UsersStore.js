import UsersLoader from './UsersLoader';

class UsersStore {
    constructor() {
        this.usersData = {};
    }

    /**
     * @param {UserLoadConfig} config
     */
    initLoader(config) {
        this.usersLoader = new UsersLoader(config);
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

export default new UsersStore();
