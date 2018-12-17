import UserView from './userView/UserView';

import styles from './ListView.css';

const VIEWPORT_USERS_COUNT = 25;
const ITEM_HEIGHT = 51;

/**
 * @typedef ListViewOptions
 * @property {string} [className]
 * @property {User[]} users
 */

export default class ListView {
    /**
     * @param {ListViewOptions} options
     */
    constructor(options) {
        this.element = null;

        this.scrollContainer = null;
        this.state = {
            className: options.className,
            topVisibleUserIdx: 0,
            users: options.users,
        };

        this.onScroll = this.onScroll.bind(this);
    }

    render() {
        this.element = document.createElement('div');

        this.element.classList.add(styles.list);
        if (this.state.className) {
            this.element.classList.add(this.state.className);
        }

        this.element.onscroll = this.onScroll;

        this.renderUsers();
    }

    onScroll() {
        this.reRenderUsers();
    }

    updateUsers(users) {
        if (this.state.users === users) {
            return;
        }

        this.state.users = users;

        this.renderUsers();
    }

    renderUsers() {
        this.state.topVisibleUserIdx = 0;

        if (this.state.users.length === 0) {
            this.element.innerHTML = (
                `<div class="${styles.item__no_results}">Пользователь не найден</div>`
            );
            return;
        }

        this.element.innerHTML = '';

        this.scrollContainer = document.createElement('div');
        this.scrollContainer.classList.add(styles.scroll_container);
        this.scrollContainer.style.height = `${this.state.users.length * ITEM_HEIGHT}px`;

        for (let i = 0; i < VIEWPORT_USERS_COUNT; i++) {
            this.renderUser(i);
        }

        this.element.appendChild(this.scrollContainer);
    }

    renderUser(idx, prepend = false) {
        const user = this.state.users[idx];

        const userView = new UserView({
            className: styles.item,
            style: `transform: translateY(${idx * ITEM_HEIGHT}px)`,
            user,
        });
        userView.render();

        if (!prepend) {
            this.scrollContainer.appendChild(userView.element);
        } else {
            this.scrollContainer.insertBefore(userView.element, this.scrollContainer.children[0]);
        }
    }

    reRenderUsers() {
        const { scrollTop } = this.element;
        let newTopVisibleUserIdx = Math.floor(scrollTop / ITEM_HEIGHT) - 10;
        const lastTopUserIdx = this.state.users.length - VIEWPORT_USERS_COUNT;
        if (newTopVisibleUserIdx > lastTopUserIdx) {
            newTopVisibleUserIdx = lastTopUserIdx;
        }
        if (newTopVisibleUserIdx < 0) {
            newTopVisibleUserIdx = 0;
        }

        if (newTopVisibleUserIdx > this.state.topVisibleUserIdx) {
            const delta = newTopVisibleUserIdx - this.state.topVisibleUserIdx;
            if (delta > VIEWPORT_USERS_COUNT) {
                this.scrollContainer.innerHTML = '';
            } else {
                for (let i = 0; i < delta; i++) {
                    this.scrollContainer.removeChild(this.scrollContainer.children[0]);
                }
            }

            const firstUserToRenderIdx = this.state.topVisibleUserIdx + VIEWPORT_USERS_COUNT - 1;
            const lastUserToRenderIdx = newTopVisibleUserIdx + VIEWPORT_USERS_COUNT - 1;
            for (let i = firstUserToRenderIdx; i <= lastUserToRenderIdx; i++) {
                this.renderUser(i);
            }
        }

        if (newTopVisibleUserIdx < this.state.topVisibleUserIdx) {
            const delta = this.state.topVisibleUserIdx - newTopVisibleUserIdx;
            if (delta > VIEWPORT_USERS_COUNT) {
                this.scrollContainer.innerHTML = '';
            } else {
                for (let i = 0; i < delta; i++) {
                    const lastChild = this.scrollContainer
                        .children[this.scrollContainer.children.length - 1];
                    this.scrollContainer.removeChild(lastChild);
                }
            }

            const firstUserToRenderIdx = newTopVisibleUserIdx;
            const lastUserToRenderIdx = this.state.topVisibleUserIdx - 1;
            for (let i = lastUserToRenderIdx; i >= firstUserToRenderIdx; i--) {
                this.renderUser(i, true);
            }
        }

        this.state.topVisibleUserIdx = newTopVisibleUserIdx;
    }
}
