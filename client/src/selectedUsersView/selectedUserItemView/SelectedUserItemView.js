import styles from './SelectedUserItemView.css';

/**
 * @callback SelectedUserItemView~onRemoveClick
 * @param {number} userId
 */

/**
 * @typedef {Object} SelectedUserItemViewOptions
 * @property {string[]} [classNames]
 * @property {SelectedUserItemView~onRemoveClick} onRemoveClick
 * @property {User} user
 */

export default class SelectedUserItemView {
    /**
     * @param {SelectedUserItemViewOptions} options
     */
    constructor(options) {
        this.options = options;

        this.onRemoveClick = this.onRemoveClick.bind(this);
    }

    render() {
        const element = document.createElement('div');

        element.classList.add(styles.wrap);
        if (this.options.classNames) {
            this.options.classNames.forEach((className) => {
                element.classList.add(className);
            });
        }

        element.innerHTML = (
            `<div class="${styles.name}">${this.options.user.name} ${this.options.user.lastName}</div>`
        );

        const crossIcon = document.createElement('div');
        crossIcon.classList.add(styles.cross);
        crossIcon.onclick = this.onRemoveClick;
        element.appendChild(crossIcon);

        this.element = element;
    }

    onRemoveClick() {
        this.options.onRemoveClick(this.options.user.id);
    }
}
