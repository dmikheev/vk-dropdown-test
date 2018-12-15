import styles from './UserView.css';

/**
 * @typedef {Object} UserViewProps
 * @property {string} [className]
 * @property {User} user
 */

export default class UserView {
    constructor(props) {
        this.props = props;
    }

    render() {
        this.element = document.createElement('div');

        this.element.classList.add(styles.wrap);
        if (this.props.className) {
            this.element.classList.add(this.props.className);
        }

        this.element.innerHTML = (
`<div class="${styles.photo}" style="background-image: url(${this.props.user.photoPath})"></div>
<div class="${styles.content}">
    <div class="${styles.name}">${this.props.user.name} ${this.props.user.lastName}</div>
    <div class="${styles.occupation}">${this.props.user.occupation}</div>
</div>`
        );
    }
}
