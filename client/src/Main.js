import DropdownView from './DropdownView';
import UsersLoader from './UsersLoader';

function getFilteredUsers(users, query) {
    const normalizedQuery = query.toLowerCase();

    return users.filter((user) => {
        if (user.name.toLowerCase().indexOf(normalizedQuery) === 0) {
            return true;
        }
        if (user.lastName.toLowerCase().indexOf(normalizedQuery) === 0) {
            return true;
        }
        if (user.occupation.toLowerCase().indexOf(normalizedQuery) === 0) {
            return true;
        }

        return false;
    });
}

/**
 * @typedef {Object} DropdownMainOptions
 * @property {UserLoadConfig} usersLoadConfig
 */

export default class DropdownMain {
    /**
     * @param {HTMLElement} element
     * @param {DropdownMainOptions} options
     */
    constructor(element, options) {
        this.element = element;

        this.state = {
            filterQuery: '',
            totalUsersCount: 0,
            users: [],
        };

        this.children = {
            dropdownView: null,
        };

        this.loadMoreUsers = this.loadMoreUsers.bind(this);
        this.onFilterQueryChange = this.onFilterQueryChange.bind(this);

        this.usersLoader = new UsersLoader(options.usersLoadConfig);

        this.render();
        this.loadUsers();
    }

    render() {
        const dropdownView = new DropdownView({
            loadMoreUsers: this.loadMoreUsers,
            onInputChange: this.onFilterQueryChange,
            totalUsersCount: this.state.totalUsersCount,
            users: this.state.users,
        });
        dropdownView.renderTo(this.element);

        this.children.dropdownView = dropdownView;
    }

    filterUsers() {
        const filteredUsers = getFilteredUsers(this.state.users, this.state.filterQuery);

        this.children.dropdownView.replaceUsers(filteredUsers, filteredUsers.length);
    }

    updateUsers(users, totalCount) {
        this.state.totalUsersCount = totalCount;
        this.state.users = users;
        this.children.dropdownView.updateUsers(users, totalCount);
    }

    loadUsers() {
        this.usersLoader.load({ offset: 0, query: this.state.filterQuery }, (response) => {
            if (response.query !== this.state.filterQuery) {
                return;
            }

            this.updateUsers(response.users, response.totalCount);
        });
    }

    loadMoreUsers(offset) {
        this.usersLoader.load({ offset, query: this.state.filterQuery }, (response) => {
            if (response.query !== this.state.filterQuery) {
                return;
            }

            const users = this.state.users.slice(0);
            users.splice(response.offset, response.users.length, ...response.users);

            this.updateUsers(users, response.totalCount);
        });
    }

    onFilterQueryChange(value) {
        this.state.filterQuery = value;
        this.filterUsers();
        this.loadUsers();
    }
}
