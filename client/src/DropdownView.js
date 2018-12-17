import styles from './Dropdown.css';
import ListView from './listView/ListView';
import isAncestor from './utils/isClosestElement';

function renderArrow() {
    const arrow = document.createElement('div');
    arrow.classList.add(styles.arrow);

    return arrow;
}

/**
 * @callback DropdownView~loadMoreUsers
 * @param {number} offset
 */

/**
 * @callback DropdownView~onInputChange
 * @param {string} value
 */

/**
 * @typedef {Object} DropdownViewProps
 * @property {DropdownView~loadMoreUsers} loadMoreUsers
 * @property {DropdownView~onInputChange} onInputChange
 * @property {number} totalUsersCount
 * @property {User[]} users
 */

export default class DropdownView {
    /**
     * @param {DropdownViewProps} options
     */
    constructor(options) {
        this.element = null;

        this.options = {
            loadMoreUsers: options.loadMoreUsers,
            onInputChange: options.onInputChange,
        };

        /**
         * @type {{arrow: null, list: ListView | null}}
         */
        this.children = {
            arrow: null,
            list: null,
        };

        this.state = {
            isOpen: false,
            totalUsersCount: options.totalUsersCount,
            users: options.users,
        };

        this.onGlobalClick = this.onGlobalClick.bind(this);
        this.onInputChange = this.onInputChange.bind(this);

        window.addEventListener('click', this.onGlobalClick, false);
    }

    destroy() {
        window.removeEventListener('click', this.onGlobalClick, false);
    }

    /**
     * @param {HTMLElement} element
     */
    renderTo(element) {
        // eslint-disable-next-line no-param-reassign
        element.innerHTML = '';

        element.classList.add(styles.wrap);

        const arrow = renderArrow();
        element.appendChild(arrow);
        this.children.arrow = arrow;

        const input = this.renderInput();
        element.appendChild(input);

        this.element = element;
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
            this.renderList();
        } else {
            this.destroyList();
        }
    }

    replaceUsers(users, totalCount) {
        this.state.totalUsersCount = totalCount;
        this.state.users = users;

        if (!this.children.list) {
            return;
        }

        this.children.list.replaceUsers(users, totalCount);
    }

    updateUsers(users, totalCount) {
        this.state.totalUsersCount = totalCount;
        this.state.users = users;

        if (!this.children.list) {
            return;
        }

        this.children.list.updateUsers(users, totalCount);
    }

    renderList() {
        const list = new ListView({
            className: styles.list,
            loadMoreUsers: this.options.loadMoreUsers,
            totalUsersCount: this.state.totalUsersCount,
            users: this.state.users,
        });
        list.render();
        this.element.appendChild(list.element);

        this.children.list = list;
    }

    destroyList() {
        this.element.removeChild(this.children.list.element);
        this.children.list = null;
    }

    renderInput() {
        const input = document.createElement('input');
        input.classList.add(styles.input);
        input.placeholder = 'Введите имя друга';
        input.type = 'text';
        input.oninput = this.onInputChange;

        return input;
    }
}
