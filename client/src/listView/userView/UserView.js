import styles from './UserView.css';

/**
 * @typedef {Object} UserViewOptions
 * @property {string} [className]
 * @property {string} [style]
 * @property {User} user
 */

export default class UserView {
    /**
     * @param {UserViewOptions} options
     */
    constructor(options) {
        this.options = options;
    }

    render() {
        this.element = document.createElement('div');

        this.element.classList.add(styles.wrap);
        if (this.options.className) {
            this.element.classList.add(this.options.className);
        }
        if (this.options.style) {
            this.element.setAttribute('style', this.options.style);
        }

        this.element.innerHTML = (
`<div class="${styles.wrap_inner}">
    <div class="${styles.photo}" style="background-image: url(${this.options.user.photoPath})"></div>
    <div class="${styles.content}">
        <div class="${styles.name}">${this.options.user.name} ${this.options.user.lastName}</div>
        <div class="${styles.occupation}">${this.options.user.occupation}</div>
    </div>
</div>`
        );
    }
}
