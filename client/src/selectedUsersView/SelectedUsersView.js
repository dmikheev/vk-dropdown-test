import SelectedUserItemView from './selectedUserItemView/SelectedUserItemView';

import styles from './SelectedUsersView.css';

/**
 * @typedef {Object} SelectedUsersViewOptions
 * @property {string} [className]
 * @property {string[]} [itemClassNames]
 * @property {User | null} selectedUsers
 */

export default class SelectedUsersView {
    /**
     * @param {SelectedUsersViewOptions} options
     */
    constructor(options) {
        this.options = {
            className: options.className,
            itemClassNames: options.itemClassNames,
            onUserRemoveClick: options.onUserRemoveClick,
        };
        this.state = {
            selectedUsers: options.selectedUsers,
        };
    }

    render() {
        const element = document.createElement('div');

        if (this.options.className) {
            element.classList.add(this.options.className);
        }

        this.element = element;

        this.renderUsers();
    }

    renderUsers() {
        this.element.innerHTML = '';

        const documentFragment = document.createDocumentFragment();

        const itemClassNames = [styles.item];
        if (this.options.itemClassNames) {
            itemClassNames.push(...this.options.itemClassNames);
        }
        this.state.selectedUsers.forEach((user) => {
            const itemView = new SelectedUserItemView({
                classNames: itemClassNames,
                onRemoveClick: this.options.onUserRemoveClick,
                user,
            });
            itemView.render();
            documentFragment.appendChild(itemView.element);
        });

        this.element.appendChild(documentFragment);
    }

    updateSelectedUsers(users) {
        this.state.selectedUsers = users;
        this.renderUsers();
    }
}
