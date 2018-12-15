import styles from './Dropdown.css';
import ListView from './listView/ListView';
import isAncestor from './utils/isClosestElement';

function _renderArrow() {
    const arrow = document.createElement('div');
    arrow.classList.add(styles.arrow);

    return arrow;
}

function _renderInput() {
    const input = document.createElement('input');
    input.classList.add(styles.input);
    input.placeholder = 'Введите имя друга';
    input.type = 'text';

    return input;
}

export default class DropdownView {
    constructor() {
        this.element = null;

        this.children = {};
        this.children.arrow = null;
        this.children.list = null;

        this.prevState = null;
        this.state = {
            isOpen: false,
        };

        this._onGlobalClick = this._onGlobalClick.bind(this);

        window.addEventListener('click', this._onGlobalClick, false);
    }

    destroy() {
        window.removeEventListener('click', this._onGlobalClick, false);
    }

    /**
     * @param {HTMLElement} element
     */
    renderTo(element) {
        // eslint-disable-next-line no-param-reassign
        element.innerHTML = '';

        element.classList.add(styles.wrap);

        const arrow = _renderArrow();
        element.appendChild(arrow);
        this.children.arrow = arrow;

        const input = _renderInput();
        element.appendChild(input);

        this.element = element;
    }

    update() {
        if (this.prevState && this.state.isOpen !== this.prevState.isOpen) {
            this._updateOpen();
        }
    }

    /**
     * @param {MouseEvent} event
     * @private
     */
    _onGlobalClick(event) {
        if (isAncestor(this.element, event.target)) {
            this._onWrapClick(event);
            return;
        }

        if (!this.state.isOpen) {
            return;
        }

        this._setState({
            isOpen: false,
        });
    }

    _onWrapClick(event) {
        if (!this.state.isOpen) {
            this._setState({
                isOpen: true,
            });
        } else if (event.target === this.children.arrow) {
            this._setState({
                isOpen: false,
            });
        }
    }

    _setState(partialState) {
        this.prevState = this.state;
        this.state = {
            ...this.state,
            ...partialState,
        };

        this.update();
    }

    _updateOpen() {
        if (this.state.isOpen) {
            const list = new ListView({ className: styles.list });
            list.render();
            this.element.appendChild(list.element);

            this.children.list = list;
        } else {
            this.element.removeChild(this.children.list.element);
            this.children.list = null;
        }
    }
}
