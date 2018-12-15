import UserView from './userView/UserView';

import styles from './ListView.css';

/**
 * @typedef ListViewOptions
 * @property {string} [className]
 * @property {User[]} users
 */

export default class ListView {
    /**
     * @param {ListViewOptions} [props]
     */
    constructor(props = {}) {
        this.element = null;

        this.prevProps = null;
        this.props = props;
    }

    render() {
        this.element = document.createElement('div');

        this.element.classList.add(styles.list);
        if (this.props.className) {
            this.element.classList.add(this.props.className);
        }

        this.renderUsers();
    }

    update() {
        if (this.prevProps) {
            if (this.props.users !== this.prevProps.users) {
                this.updateUsers();
            }
        }
    }

    updateProps(props) {
        this.prevProps = this.props;
        this.props = props;

        this.update();
    }

    updateUsers() {
        this.element.innerHTML = this.renderUsers();
    }

    renderUsers() {
        if (this.props.users.length === 0) {
            this.element.innerHTML = (
                `<div class="${styles.item__no_results}">Пользователь не найден</div>`
            );
        }

        this.element.innerHTML = '';
        this.props.users.forEach((user) => {
            const userView = new UserView({
                className: styles.item,
                user,
            });
            userView.render();
            this.element.appendChild(userView.element);
        });
    }
}
