import DropdownView from './DropdownView';
import UsersLoader from './UsersLoader';

export default class DropdownMain {
    /**
     * @param {HTMLElement} element
     */
    constructor(element) {
        this.element = element;

        this.prevState = null;
        this.state = {
            users: [],
        };

        this.children = {
            dropdownView: null,
        };

        this.render();
        this.loadUsers();
    }

    render() {
        const dropdownView = new DropdownView({
            users: this.state.users,
        });
        dropdownView.renderTo(this.element);

        this.children.dropdownView = dropdownView;
    }

    update() {
        if (this.prevState) {
            if (this.prevState.users !== this.state.users) {
                this.updateUsers();
            }
        }
    }

    updateUsers() {
        this.children.dropdownView.updateProps({
            users: this.state.users,
        });
    }

    loadUsers() {
        UsersLoader.load((users) => {
            this.setState({
                users,
            });
        });
    }

    setState(partialState) {
        this.prevState = this.state;
        this.state = {
            ...this.state,
            ...partialState,
        };

        this.update();
    }
}
