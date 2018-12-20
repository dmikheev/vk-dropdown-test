import UserView from './userView/UserView';

import loaderStyles from './loader.css';
import styles from './ListView.css';

const BOTTOM_USERS_TO_LOAD_MORE_COUNT = 100;
const ITEM_HEIGHT = 51;
const MAX_LIST_HEIGHT = 243;
const VIEWPORT_USERS_COUNT = 11;

function getLoaderItemHtml(options) {
    const classNamesArr = [loaderStyles.loader];
    if (options.className) {
        classNamesArr.push(options.className);
    }

    return (
`<div class="${classNamesArr.join(' ')}">
    <div class="${loaderStyles.loader_circle} ${loaderStyles.loader_circle__1}"></div>
    <div class="${loaderStyles.loader_circle} ${loaderStyles.loader_circle__2}"></div>
    <div class="${loaderStyles.loader_circle} ${loaderStyles.loader_circle__3}"></div>
    <div class="${loaderStyles.loader_circle} ${loaderStyles.loader_circle__4}"></div>
    <div class="${loaderStyles.loader_circle} ${loaderStyles.loader_circle__5}"></div>
    <div class="${loaderStyles.loader_circle} ${loaderStyles.loader_circle__6}"></div>
    <div class="${loaderStyles.loader_circle} ${loaderStyles.loader_circle__7}"></div>
    <div class="${loaderStyles.loader_circle} ${loaderStyles.loader_circle__8}"></div>
    <div class="${loaderStyles.loader_circle} ${loaderStyles.loader_circle__9}"></div>
    <div class="${loaderStyles.loader_circle} ${loaderStyles.loader_circle__10}"></div>
</div>`
    );
}

/**
 * @callback ListView~loadMoreUsers
 * @param {number} offset
 */

/**
 * @typedef ListViewOptions
 * @property {boolean} areAllUsersLoaded
 * @property {boolean} areUserPhotosDisabled
 * @property {string} [className]
 * @property {boolean} isLoading
 * @property {ListView~loadMoreUsers} loadMoreUsers
 * @property {UserView~onClick} onUserClick
 * @property {User[]} users
 */

export default class ListView {
    /**
     * @param {ListViewOptions} options
     */
    constructor(options) {
        this.element = null;

        this.options = {
            areUserPhotosDisabled: options.areUserPhotosDisabled,
            className: options.className,
            loadMoreUsers: options.loadMoreUsers,
            onUserClick: options.onUserClick,
        };
        this.state = {
            areAllUsersLoaded: options.areAllUsersLoaded,
            areUsersLoading: false,
            isLoading: options.isLoading,
            topVisibleUserIdx: 0,
            users: options.users,
        };

        this.itemsContainer = null;
        this.scrollSentinel = null;

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
        this.state.areAllUsersLoaded = totalCount;

        if (this.state.users === users) {
            return;
        }
        if (users.length === 0 && this.state.users.length === 0) {
            return;
        }

        this.state.users = users;

        this.element.scrollTop = 0;
        this.renderUsers();
    }

    updateUsers(users, totalCount) {
        this.state.areAllUsersLoaded = totalCount;

        if (this.state.users === users) {
            return;
        }

        this.state.users = users;

        this.renderUsers();
    }

    renderUsers() {
        const topVisibleUserIdx = this.getTopVisibleUserIndex();

        if (this.state.users.length === 0) {
            this.element.style.height = null;
            this.element.innerHTML = this.state.isLoading
                ? (
                    `<div class="${styles.item__loader}">
                        ${getLoaderItemHtml({ className: styles.loader })}
                    </div>`
                ) : (
                    `<div class="${styles.item__no_results}">Пользователь не найден</div>`
                );
            return;
        }

        this.element.innerHTML = '';
        const listHeight = Math.min(
            this.state.users.length * ITEM_HEIGHT,
            MAX_LIST_HEIGHT,
        );
        this.element.style.height = `${listHeight}px`;

        this.scrollSentinel = document.createElement('div');
        this.scrollSentinel.classList.add(styles.scroll_sentinel);
        this.scrollSentinel.style.transform = `translateY(${this.state.users.length * ITEM_HEIGHT - 2}px)`;

        this.itemsContainer = document.createElement('div');
        this.itemsContainer.classList.add(styles.items_container);

        const lastUserIdx = Math.min(
            this.state.users.length - 1,
            topVisibleUserIdx + VIEWPORT_USERS_COUNT - 1,
        );
        for (let i = topVisibleUserIdx; i <= lastUserIdx; i++) {
            this.renderUser(i);
        }

        this.element.appendChild(this.itemsContainer);
        this.element.appendChild(this.scrollSentinel);

        this.state.topVisibleUserIdx = topVisibleUserIdx;
    }

    renderUser(idx, prepend = false) {
        const user = this.state.users[idx];

        const userView = new UserView({
            className: styles.item,
            arePhotosDisabled: this.options.areUserPhotosDisabled,
            onClick: this.options.onUserClick,
            style: `transform: translateY(${idx * ITEM_HEIGHT}px)`,
            user,
        });
        userView.render();

        if (!prepend) {
            this.itemsContainer.appendChild(userView.element);
        } else {
            this.itemsContainer.insertBefore(userView.element, this.itemsContainer.children[0]);
        }
    }

    reRenderUsersIfNeeded() {
        const newTopVisibleUserIdx = this.getTopVisibleUserIndex();

        if (newTopVisibleUserIdx > this.state.topVisibleUserIdx) {
            const delta = newTopVisibleUserIdx - this.state.topVisibleUserIdx;
            let firstUserToRenderIdx;
            const lastUserToRenderIdx = Math.min(
                newTopVisibleUserIdx + VIEWPORT_USERS_COUNT,
                this.state.users.length - 1,
            );
            if (delta > VIEWPORT_USERS_COUNT) {
                this.itemsContainer.innerHTML = '';
                firstUserToRenderIdx = newTopVisibleUserIdx;
            } else {
                for (let i = 0; i < delta; i++) {
                    this.itemsContainer.removeChild(this.itemsContainer.children[0]);
                }

                firstUserToRenderIdx = lastUserToRenderIdx - delta;
            }

            for (let i = firstUserToRenderIdx; i <= lastUserToRenderIdx; i++) {
                this.renderUser(i);
            }
        }

        if (newTopVisibleUserIdx < this.state.topVisibleUserIdx) {
            const delta = this.state.topVisibleUserIdx - newTopVisibleUserIdx;
            const firstUserToRenderIdx = newTopVisibleUserIdx;
            let lastUserToRenderIdx;
            if (delta > VIEWPORT_USERS_COUNT) {
                this.itemsContainer.innerHTML = '';
                lastUserToRenderIdx = newTopVisibleUserIdx + VIEWPORT_USERS_COUNT;
            } else {
                for (let i = 0; i < delta; i++) {
                    const lastChild = this.itemsContainer
                        .children[this.itemsContainer.children.length - 1];
                    this.itemsContainer.removeChild(lastChild);
                }

                lastUserToRenderIdx = newTopVisibleUserIdx + delta;
            }

            for (let i = lastUserToRenderIdx; i >= firstUserToRenderIdx; i--) {
                this.renderUser(i, true);
            }
        }

        this.state.topVisibleUserIdx = newTopVisibleUserIdx;
    }

    loadUsersIfNeeded() {
        if (this.state.areAllUsersLoaded) {
            return;
        }

        const scrollTopToLoadUsers = (this.state.users.length - BOTTOM_USERS_TO_LOAD_MORE_COUNT)
            * ITEM_HEIGHT - MAX_LIST_HEIGHT;
        if (this.element.scrollTop > scrollTopToLoadUsers) {
            this.options.loadMoreUsers(this.state.users.length);
        }
    }

    getTopVisibleUserIndex() {
        const { scrollTop } = this.element;
        const usersAboveListTopCount = Math.floor((VIEWPORT_USERS_COUNT - 5) / 2);
        let newTopVisibleUserIdx = Math.floor(scrollTop / ITEM_HEIGHT) - usersAboveListTopCount;
        const lastTopUserIdx = this.state.users.length - VIEWPORT_USERS_COUNT;
        if (newTopVisibleUserIdx > lastTopUserIdx) {
            newTopVisibleUserIdx = lastTopUserIdx;
        }
        if (newTopVisibleUserIdx < 0) {
            newTopVisibleUserIdx = 0;
        }

        return newTopVisibleUserIdx;
    }

    setIsLoading(value) {
        if (this.state.isLoading === value) {
            return;
        }

        this.state.isLoading = value;
        this.toggleLoaderIfNeeded();
    }

    toggleLoaderIfNeeded() {
        if (this.state.isLoading) {
            this.renderLoaderIfNeeded();
        } else {
            this.removeLoaderIfNeeded();
        }
    }

    renderLoaderIfNeeded() {
        if (!this.state.isLoading || this.state.users.length !== 0) {
            return;
        }

        this.renderUsers();
    }

    removeLoaderIfNeeded() {
        if (this.state.isLoading && this.state.users.length === 0) {
            return;
        }

        this.renderUsers();
    }
}
