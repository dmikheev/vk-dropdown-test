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

    load(query, offset, cb) {
        return this.usersLoader.load(query, offset, (response) => {
            this.saveUsersData(response.users);
            cb(response);
        });
    }

    getUser(id) {
        return this.usersData[id];
    }

    getAll() {
        return Object.keys(this.usersData).map(key => this.usersData[key]);
    }

    saveUsersData(users) {
        users.forEach((user) => {
            this.usersData[user.id] = user;
        });
    }
}

export default new UsersStore();
