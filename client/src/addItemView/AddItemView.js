import styles from './AddItemView.css';

/**
 * @typedef {Object} AddItemViewOptions
 * @property {string} [className]
 */

export default class AddItemView {
    /**
     * @param {AddItemViewOptions} options
     */
    constructor(options) {
        this.options = options;
    }

    render() {
        const element = document.createElement('div');

        element.classList.add(styles.add_item);
        if (this.options.className) {
            element.classList.add(this.options.className);
        }

        element.innerHTML = (
`<div class="${styles.text}">Добавить</div>
<div class="${styles.icon}"></div>`
        );

        this.element = element;
    }
}
