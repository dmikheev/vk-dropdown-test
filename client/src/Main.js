import DropdownView from './DropdownView';
import UsersStore from './UsersStore';

function getUsersFilteredByQuery(users, query) {
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
 * @property {boolean} isSelectionMultiple
 * @property {UserLoadConfig} usersLoadConfig
 */

export default class DropdownMain {
    /**
     * @param {HTMLElement} element
     * @param {DropdownMainOptions} options
     */
    constructor(element, options) {
        this.element = element;

        this.options = {
            isSelectionMultiple: options.isSelectionMultiple,
        };
        this.state = {
            areAllUsersLoaded: false,
            filterQuery: '',
            selectedUser: null,
            selectedUsers: [],
            users: [],
        };

        this.children = {
            dropdownView: null,
        };

        this.loadMoreUsers = this.loadMoreUsers.bind(this);
        this.onFilterQueryChange = this.onFilterQueryChange.bind(this);
        this.onListUserClick = this.onListUserClick.bind(this);
        this.onSelectedUserRemoveClick = this.onSelectedUserRemoveClick.bind(this);

        UsersStore.initLoader(options.usersLoadConfig);

        this.render();
        this.loadUsers();
    }

    render() {
        const dropdownView = new DropdownView({
            isSelectionMultiple: this.options.isSelectionMultiple,
            loadMoreUsers: this.loadMoreUsers,
            onInputChange: this.onFilterQueryChange,
            onListUserClick: this.onListUserClick,
            onSelectedUserRemoveClick: this.onSelectedUserRemoveClick,
            selectedUser: this.state.selectedUser,
            selectedUsers: this.state.selectedUsers,
            areAllUsersLoaded: this.state.areAllUsersLoaded,
            users: this.state.users,
        });
        dropdownView.renderTo(this.element);

        this.children.dropdownView = dropdownView;
    }

    filterUsers() {
        const filteredUsers = this.getFilteredUsers();

        this.children.dropdownView.replaceUsers(filteredUsers, filteredUsers.length);
    }

    updateUsers(users, areAllUsersLoaded) {
        this.state.areAllUsersLoaded = areAllUsersLoaded;
        this.state.users = users;

        const filteredUsers = this.getUsersFilteredFromSelected(users);
        this.children.dropdownView.updateUsers(filteredUsers, areAllUsersLoaded);
    }

    loadUsers() {
        UsersStore.load({ offset: 0, query: this.state.filterQuery }, (response) => {
            if (response.query !== this.state.filterQuery) {
                return;
            }

            this.updateUsers(response.users, response.users.length === 0);
        });
    }

    loadMoreUsers(offset) {
        UsersStore.load({ offset, query: this.state.filterQuery }, (response) => {
            if (response.query !== this.state.filterQuery) {
                return;
            }

            const users = this.state.users.slice(0);
            users.splice(response.offset, response.users.length, ...response.users);

            this.updateUsers(users, response.users.length === 0);
        });
    }

    onFilterQueryChange(value) {
        this.state.filterQuery = value;
        this.filterUsers();
        this.loadUsers();
    }

    onListUserClick(userId) {
        if (this.options.isSelectionMultiple) {
            this.updateSelectedUsers(this.state.selectedUsers.concat(userId));
        } else {
            this.updateSelectedUser(userId);
        }
    }

    updateSelectedUser(userId) {
        this.state.selectedUser = userId;
        this.children.dropdownView.updateSelectedUser(UsersStore.getUser(userId));
        this.filterUsers();
    }

    updateSelectedUsers(userIds) {
        this.state.selectedUsers = userIds;
        this.children.dropdownView.updateSelectedUsers(userIds.map(UsersStore.getUser, UsersStore));
        this.filterUsers();
    }

    onSelectedUserRemoveClick(userId) {
        if (this.options.isSelectionMultiple) {
            this.updateSelectedUsers(this.state.selectedUsers.filter(id => id !== userId));
        } else {
            this.updateSelectedUser(null);
        }
    }

    getFilteredUsers() {
        const queryFilteredUsers = getUsersFilteredByQuery(
            this.state.users,
            this.state.filterQuery,
        );
        return this.getUsersFilteredFromSelected(queryFilteredUsers);
    }

    getUsersFilteredFromSelected(users) {
        return users.filter(user => (
            this.options.isSelectionMultiple
                ? this.state.selectedUsers.indexOf(user.id) === -1
                : this.state.selectedUser !== user.id));
    }
}
