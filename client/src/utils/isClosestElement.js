/**
 * @param {Element} child
 * @param {Element} checkingElement
 * @returns {boolean}
 */
export default function isAncestor(checkingElement, child) {
    let currentElement = child;

    while (currentElement) {
        if (currentElement === checkingElement) {
            return true;
        }

        currentElement = currentElement.parentElement;
    }

    return false;
}
