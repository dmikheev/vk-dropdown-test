import styles from './Dropdown.css';
import ListView from './listView/ListView';
import isAncestor from './utils/isClosestElement';

function renderArrow() {
    const arrow = document.createElement('div');
    arrow.classList.add(styles.arrow);

    return arrow;
}

function renderInput() {
    const input = document.createElement('input');
    input.classList.add(styles.input);
    input.placeholder = 'Введите имя друга';
    input.type = 'text';

    return input;
}

/**
 * @typedef {Object} DropdownViewProps
 * @property {User[]} users
 */

export default class DropdownView {
    /**
     * @param {DropdownViewProps} props
     */
    constructor(props) {
        this.element = null;

        /**
         * @type {{arrow: null, list: ListView | null}}
         */
        this.children = {
            arrow: null,
            list: null,
        };

        this.prevProps = null;
        this.props = props;

        this.prevState = null;
        this.state = {
            isOpen: false,
        };

        this.onGlobalClick = this.onGlobalClick.bind(this);

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

        const input = renderInput();
        element.appendChild(input);

        this.element = element;
    }

    updateProps(props) {
        this.prevProps = this.props;
        this.props = props;

        this.update();
    }

    update() {
        if (this.prevProps) {
            if (this.props.users !== this.prevProps.users) {
                this.updateUsers();
            }
        }

        if (this.prevState) {
            if (this.state.isOpen !== this.prevState.isOpen) {
                this.updateOpen();
            }
        }
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

        this.setState({
            isOpen: false,
        });
    }

    onWrapClick(event) {
        if (!this.state.isOpen) {
            this.setState({
                isOpen: true,
            });
        } else if (event.target === this.children.arrow) {
            this.setState({
                isOpen: false,
            });
        }
    }

    setState(partialState) {
        this.prevState = this.state;
        this.state = {
            ...this.state,
            ...partialState,
        };

        this.update();
    }

    updateOpen() {
        if (this.state.isOpen) {
            this.renderList();
        } else {
            this.destroyList();
        }
    }

    updateUsers() {
        if (!this.children.list) {
            return;
        }

        this.children.list.updateProps({
            users: this.props.users,
        });
    }

    renderList() {
        const list = new ListView({ className: styles.list, users: this.props.users });
        list.render();
        this.element.appendChild(list.element);

        this.children.list = list;
    }

    destroyList() {
        this.element.removeChild(this.children.list.element);
        this.children.list = null;
    }
}
