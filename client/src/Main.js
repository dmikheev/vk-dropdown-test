import DropdownView from './DropdownView';

export default class DropdownMain {
    /**
     * @param {HTMLElement} element
     */
    constructor(element) {
        this.element = element;

        this.render();
    }

    render() {
        const dropdownView = new DropdownView();
        dropdownView.renderTo(this.element);
    }
}
