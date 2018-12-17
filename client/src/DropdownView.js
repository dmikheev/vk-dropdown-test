import AddItemView from './addItemView/AddItemView';
import styles from './Dropdown.css';
import ListView from './listView/ListView';
import SelectedUsersView from './selectedUsersView/SelectedUsersView';
import isAncestor from './utils/isClosestElement';
import { elementClosest } from './utils/polyfills';

function renderArrow() {
    const arrow = document.createElement('div');
    arrow.classList.add(styles.arrow);

    return arrow;
}

/**
 * @typedef {Object} DropdownViewChildren
 * @property {AddItemView | null} addItem
 * @property {HTMLElement | null} arrow
 * @property {HTMLElement | null} input
 * @property {ListView | null} list
 * @property {SelectedUsersView | null} selectedUsers
 */

/**
 * @callback DropdownView~loadMoreUsers
 * @param {number} offset
 */

/**
 * @callback DropdownView~onInputChange
 * @param {string} value
 */

/**
 * @typedef {Object} DropdownViewOptions
 * @property {boolean} areAllUsersLoaded
 * @property {boolean} isSelectionMultiple
 * @property {DropdownView~loadMoreUsers} loadMoreUsers
 * @property {DropdownView~onInputChange} onInputChange
 * @property {UserView~onClick} onListUserClick
 * @property {SelectedUserItemView~onRemoveClick} onSelectedUserRemoveClick
 * @property {User | null} selectedUser
 * @property {User[]} selectedUsers
 * @property {User[]} users
 */

export default class DropdownView {
    /**
     * @param {DropdownViewOptions} options
     */
    constructor(options) {
        this.element = null;

        this.options = {
            isSelectionMultiple: options.isSelectionMultiple,
            loadMoreUsers: options.loadMoreUsers,
            onInputChange: options.onInputChange,
            onListUserClick: options.onListUserClick,
            onSelectedUserRemoveClick: options.onSelectedUserRemoveClick,
        };

        /**
         * @type {DropdownViewChildren}
         */
        this.children = {
            addItem: null,
            arrow: null,
            input: null,
            list: null,
            selectedUsers: null,
        };

        this.state = {
            areAllUsersLoaded: options.areAllUsersLoaded,
            isOpen: false,
            selectedUser: options.selectedUser,
            selectedUsers: options.selectedUsers,
            users: options.users,
        };

        this.onGlobalClick = this.onGlobalClick.bind(this);
        this.onInputChange = this.onInputChange.bind(this);
        this.onSelectedUserRemoveClick = this.onSelectedUserRemoveClick.bind(this);

        window.addEventListener('click', this.onGlobalClick, false);
    }

    destroy() {
        window.removeEventListener('click', this.onGlobalClick, false);
    }

    /**
     * @param {HTMLElement} element
     */
    renderTo(element) {
        this.element = element;

        // eslint-disable-next-line no-param-reassign
        element.innerHTML = '';

        element.classList.add(styles.wrap);

        const arrow = renderArrow();
        element.appendChild(arrow);
        this.children.arrow = arrow;

        this.renderSelectedUsers();

        this.renderInput();
    }

    /**
     * @param {MouseEvent} event
     * @private
     */
    onGlobalClick(event) {
        if (isAncestor(this.element, event.target)) {
            this.onWrapClick(event);
            return;
        }

        if (!this.state.isOpen) {
            return;
        }

        this.updateOpen(false);
    }

    onWrapClick(event) {
        if (!this.state.isOpen) {
            if (!this.options.isSelectionMultiple && this.state.selectedUser) {
                return;
            }

            if (elementClosest(event.target, `.${styles.js_selected_users_item}`)) {
                return;
            }

            this.updateOpen(true);
        } else if (event.target === this.children.arrow) {
            this.updateOpen(false);
        }
    }

    onInputChange(event) {
        const { value } = event.target;
        this.options.onInputChange(value);
    }

    updateOpen(isOpen) {
        this.state.isOpen = isOpen;

        if (isOpen) {
            this.toggleAddItemIfNeeded();
            this.toggleInputIfNeeded();
            this.renderList();
        } else {
            this.toggleAddItemIfNeeded();
            this.toggleInputIfNeeded();
            this.destroyList();
        }
    }

    replaceUsers(users, totalCount) {
        this.state.areAllUsersLoaded = totalCount;
        this.state.users = users;

        if (!this.children.list) {
            return;
        }

        this.children.list.replaceUsers(users, totalCount);
    }

    updateUsers(users, areAllUsersLoaded) {
        this.state.areAllUsersLoaded = areAllUsersLoaded;
        this.state.users = users;

        if (!this.children.list) {
            return;
        }

        this.children.list.updateUsers(users, areAllUsersLoaded);
    }

    renderList() {
        const list = new ListView({
            className: styles.list,
            loadMoreUsers: this.options.loadMoreUsers,
            onUserClick: this.options.onListUserClick,
            areAllUsersLoaded: this.state.areAllUsersLoaded,
            users: this.state.users,
        });
        list.render();
        this.element.appendChild(list.element);

        this.children.list = list;
    }

    destroyList() {
        if (!this.children.list) {
            return;
        }

        this.element.removeChild(this.children.list.element);
        this.children.list = null;
    }

    toggleInputIfNeeded() {
        if (!this.children.input) {
            this.renderInputIfNeeded();
        } else {
            this.removeInputIfNeeded();
        }
    }

    renderInputIfNeeded() {
        if (this.children.input) {
            return;
        }

        if (this.state.isOpen) {
            this.renderInput();
            this.children.input.focus();
            return;
        }

        if (this.getSelectedUsers().length === 0) {
            this.renderInput();
        }
    }

    renderInput() {
        const input = document.createElement('input');
        input.classList.add(styles.input);
        input.placeholder = 'Введите имя друга';
        input.type = 'text';
        input.oninput = this.onInputChange;

        this.element.appendChild(input);
        this.children.input = input;
    }

    removeInputIfNeeded() {
        if (!this.children.input) {
            return;
        }

        if (this.state.isOpen) {
            return;
        }

        if (this.getSelectedUsers().length === 0) {
            return;
        }

        this.removeInput();
    }

    removeInput() {
        this.element.removeChild(this.children.input);
        this.children.input = null;
    }

    toggleAddItemIfNeeded() {
        if (!this.children.addItem) {
            this.renderAddItemIfNeeded();
        } else {
            this.removeAddItemIfNeeded();
        }
    }

    renderAddItemIfNeeded() {
        if (this.children.addItem
            || !this.options.isSelectionMultiple
            || this.state.selectedUsers.length === 0
        ) {
            return;
        }

        this.renderAddItem();
    }

    renderAddItem() {
        const addItem = new AddItemView({
            className: styles.add_item,
        });
        addItem.render();

        const beforeElement = this.children.input
            || (this.children.list && this.children.list.element);

        if (beforeElement) {
            this.element.insertBefore(addItem.element, beforeElement);
        } else {
            this.element.appendChild(addItem.element);
        }

        this.children.addItem = addItem;
    }

    removeAddItemIfNeeded() {
        if (!this.children.addItem
            || (!this.state.isOpen && this.state.selectedUsers.length !== 0)
        ) {
            return;
        }

        this.element.removeChild(this.children.addItem.element);
        this.children.addItem = null;
    }

    updateSelectedUser(user) {
        this.state.selectedUser = user;
        this.updateOpen(false);
        this.children.selectedUsers.updateSelectedUsers(this.getSelectedUsers());
    }

    renderSelectedUsers() {
        const selectedUsers = new SelectedUsersView({
            className: styles.selected_users,
            itemClassNames: [styles.selected_users_item, styles.js_selected_users_item],
            onUserRemoveClick: this.onSelectedUserRemoveClick,
            selectedUsers: this.getSelectedUsers(),
        });
        selectedUsers.render();
        this.element.appendChild(selectedUsers.element);
        this.children.selectedUsers = selectedUsers;
    }

    getSelectedUsers() {
        if (this.options.isSelectionMultiple) {
            return this.state.selectedUsers;
        }

        return this.state.selectedUser ? [this.state.selectedUser] : [];
    }

    onSelectedUserRemoveClick(userId) {
        if (this.state.isOpen) {
            this.updateOpen(false);
        }

        this.options.onSelectedUserRemoveClick(userId);
    }

    updateSelectedUsers(users) {
        this.state.selectedUsers = users;
        this.updateOpen(false);
        this.children.selectedUsers.updateSelectedUsers(this.getSelectedUsers());
    }
}
