import UserView from './userView/UserView';

import styles from './ListView.css';

const BOTTOM_USERS_TO_LOAD_MORE_COUNT = 100;
const ITEM_HEIGHT = 51;
const LIST_HEIGHT = 243;
const VIEWPORT_USERS_COUNT = 25;

/**
 * @callback ListView~loadMoreUsers
 * @param {number} offset
 */

/**
 * @typedef ListViewOptions
 * @property {string} [className]
 * @property {ListView~loadMoreUsers} loadMoreUsers
 * @property {User[]} users
 */

export default class ListView {
    /**
     * @param {ListViewOptions} options
     */
    constructor(options) {
        this.element = null;

        this.options = {
            className: options.className,
            loadMoreUsers: options.loadMoreUsers,
        };
        this.state = {
            areUsersLoading: false,
            topVisibleUserIdx: 0,
            totalUsersCount: 0,
            users: options.users,
        };

        this.scrollContainer = null;

        this.onScroll = this.onScroll.bind(this);
    }

    render() {
        this.element = document.createElement('div');

        this.element.classList.add(styles.list);
        if (this.options.className) {
            this.element.classList.add(this.options.className);
        }

        this.element.onscroll = this.onScroll;

        this.renderUsers();
    }

    onScroll() {
        this.reRenderUsersIfNeeded();
        this.loadUsersIfNeeded();
    }

    replaceUsers(users, totalCount) {
        this.state.totalUsersCount = totalCount;

        if (this.state.users === users) {
            return;
        }

        this.state.users = users;

        this.element.scrollTop = 0;
        this.renderUsers();
    }

    updateUsers(users, totalCount) {
        this.state.totalUsersCount = totalCount;

        if (this.state.users === users) {
            return;
        }

        this.state.users = users;

        this.renderUsers();
    }

    renderUsers() {
        const topVisibleUserIdx = this.getTopVisibleUserIndex();

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

        const lastUserIdx = Math.min(
            this.state.users.length - 1,
            topVisibleUserIdx + VIEWPORT_USERS_COUNT - 1,
        );
        for (let i = topVisibleUserIdx; i <= lastUserIdx; i++) {
            this.renderUser(i);
        }

        this.element.appendChild(this.scrollContainer);

        this.state.topVisibleUserIdx = topVisibleUserIdx;
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

    reRenderUsersIfNeeded() {
        const newTopVisibleUserIdx = this.getTopVisibleUserIndex();

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

    loadUsersIfNeeded() {
        if (this.state.users.length === this.state.totalUsersCount) {
            return;
        }

        const scrollTopToLoadUsers = (this.state.users.length - BOTTOM_USERS_TO_LOAD_MORE_COUNT)
            * ITEM_HEIGHT - LIST_HEIGHT;
        if (this.element.scrollTop > scrollTopToLoadUsers) {
            this.options.loadMoreUsers(this.state.users.length);
        }
    }

    getTopVisibleUserIndex() {
        const { scrollTop } = this.element;
        let newTopVisibleUserIdx = Math.floor(scrollTop / ITEM_HEIGHT) - 10;
        const lastTopUserIdx = this.state.users.length - VIEWPORT_USERS_COUNT;
        if (newTopVisibleUserIdx > lastTopUserIdx) {
            newTopVisibleUserIdx = lastTopUserIdx;
        }
        if (newTopVisibleUserIdx < 0) {
            newTopVisibleUserIdx = 0;
        }

        return newTopVisibleUserIdx;
    }
}
