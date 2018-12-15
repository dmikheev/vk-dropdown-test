import styles from './ListView.css';

/**
 * @typedef ListViewOptions
 * @property {string} [className]
 */

export default class ListView {
    /**
     * @param {ListViewOptions} [options]
     */
    constructor(options = {}) {
        this.element = null;
        this.options = options;
    }

    render() {
        this.element = document.createElement('div');

        if (this.options.className) {
            this.element.classList.add(this.options.className);
        }

        this.element.innerHTML = (
`<div class="${styles.item__no_results}">Пользователь не найден</div>`
        );
    }
}
