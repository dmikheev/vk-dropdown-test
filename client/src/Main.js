import { isSomeSuitableForQuery } from '../shared/isSomeSuitableForQuery';

import DropdownView from './DropdownView';
import ServerFiltersCache from './ServerFiltersCache';
import UsersStore from './UsersStore';
import debounce from './utils/debounce';

const USERS_LOAD_ON_FILTER_DEBOUNCE_INTERVAL = 200;

function getUsersFilteredByQuery(users, query) {
    if (!query) {
        return users;
    }

    const normalizedQuery = query.toLowerCase();

    return users.filter(user => isSomeSuitableForQuery(
        [
            user.name.toLowerCase(),
            user.lastName.toLowerCase(),
            user.occupation.toLowerCase(),
        ],
        normalizedQuery,
    ));
}

/**
 * @typedef {Object} DropdownMainOptions
 * @property {boolean} [areUserPhotosDisabled]
 * @property {User[]} initialUsers
 * @property {boolean} isSelectionMultiple
 * @property {UserLoadConfig} usersLoadConfig
 */

/**
 * @typedef {Object} DropdownMainState
 * @property {string} filterQuery
 * @property {Request|null} lastRequest
 * @property {number} selectedUser
 * @property {number[]} selectedUsers
 * @property {User[]} users
 */

export default class DropdownMain {
    /**
     * @param {HTMLElement} element
     * @param {DropdownMainOptions} options
     */
    constructor(element, options) {
        this.element = element;

        this.options = {
            areUserPhotosDisabled: options.areUserPhotosDisabled,
            isSelectionMultiple: options.isSelectionMultiple,
        };

        /** @type {DropdownMainState} */
        this.state = {
            filterQuery: '',
            lastRequest: null,
            selectedUser: null,
            selectedUsers: [],
            users: options.initialUsers,
        };

        this.children = {
            dropdownView: null,
        };

        this.loadUsersForDebounce = this.loadUsersForDebounce.bind(this);
        this.loadMoreUsers = this.loadMoreUsers.bind(this);
        this.onFilterQueryChange = this.onFilterQueryChange.bind(this);
        this.onListUserClick = this.onListUserClick.bind(this);
        this.onSelectedUserRemoveClick = this.onSelectedUserRemoveClick.bind(this);

        this.loadUsersDebounced = debounce(
            this.loadUsersForDebounce,
            USERS_LOAD_ON_FILTER_DEBOUNCE_INTERVAL,
        );

        UsersStore.initLoader(options.usersLoadConfig);
        UsersStore.saveUsersData(options.initialUsers);

        this.serverFiltersCache = new ServerFiltersCache();
        this.serverFiltersCache.saveFilterUsers(options.initialUsers.map(user => user.id), '');

        this.render();
    }

    render() {
        const dropdownView = new DropdownView({
            areUserPhotosDisabled: this.options.areUserPhotosDisabled,
            isSelectionMultiple: this.options.isSelectionMultiple,
            loadMoreUsers: this.loadMoreUsers,
            onInputChange: this.onFilterQueryChange,
            onListUserClick: this.onListUserClick,
            onSelectedUserRemoveClick: this.onSelectedUserRemoveClick,
            selectedUser: UsersStore.getUser(this.state.selectedUser),
            selectedUsers: this.state.selectedUsers.map(id => UsersStore.getUser(id)),
            areAllUsersLoaded: false,
            users: this.state.users,
        });
        dropdownView.renderTo(this.element);

        this.children.dropdownView = dropdownView;
    }

    filterUsers() {
        const filteredUsers = this.getFilteredUsers();

        this.children.dropdownView.replaceUsers(filteredUsers, false);
    }

    updateUsers(users, areAllUsersLoaded) {
        this.state.users = users;

        const filteredUsers = this.getUsersFilteredFromSelected(users);
        this.children.dropdownView.updateUsers(filteredUsers, areAllUsersLoaded);
    }

    loadUsersForDebounce(originalQuery) {
        if (originalQuery !== this.state.filterQuery
            && this.state.lastRequest
            && !this.state.lastRequest.isCompleted()
        ) {
            this.state.lastRequest.abort();
        }

        if (this.serverFiltersCache.getFilter(this.state.filterQuery)) {
            return;
        }

        this.state.lastRequest = UsersStore.load(this.state.filterQuery, 0, (response) => {
            this.serverFiltersCache.saveResponseData(response);

            if (response.query !== this.state.filterQuery) {
                return;
            }

            this.updateUsers(response.users, response.users.length === 0);
        });
    }

    loadMoreUsers() {
        this.state.lastRequest = UsersStore.load(
            this.state.filterQuery,
            this.state.users.length,
            (response) => {
                this.serverFiltersCache.saveResponseData(response);

                if (response.query !== this.state.filterQuery) {
                    return;
                }

                const users = this.state.users.slice(0);
                users.splice(response.offset, response.users.length, ...response.users);

                this.updateUsers(users, response.users.length === 0);
            },
        );
    }

    onFilterQueryChange(value) {
        this.state.filterQuery = value;

        const savedFilter = this.serverFiltersCache.getFilter(value);
        if (savedFilter) {
            this.updateUsers(
                savedFilter.userIds.map(id => UsersStore.getUser(id)),
                savedFilter.isFullyLoaded,
            );

            return;
        }

        this.filterUsers();
        this.loadUsersDebounced(value);
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
            UsersStore.getAll(),
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
