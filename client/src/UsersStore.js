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

    load(options, cb) {
        this.usersLoader.load(options, (response) => {
            this.saveUsersData(response.users);
            cb(response);
        });
    }

    getUser(id) {
        return this.usersData[id];
    }

    saveUsersData(users) {
        users.forEach((user) => {
            this.usersData[user.id] = user;
        });
    }
}

export default new UsersStore();
