import DropdownView from './DropdownView';
import UsersLoader from './UsersLoader';

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
            users: [],
        };

        this.children = {
            dropdownView: null,
        };

        this.usersLoader = new UsersLoader(options.usersLoadConfig);

        this.render();
        this.loadUsers();
    }

    render() {
        const dropdownView = new DropdownView({
            users: this.state.users,
        });
        dropdownView.renderTo(this.element);

        this.children.dropdownView = dropdownView;
    }

    updateUsers(users) {
        this.state.users = users;
        this.children.dropdownView.updateUsers(users);
    }

    loadUsers() {
        this.usersLoader.load((users) => {
            this.updateUsers(users);
        });
    }
}
