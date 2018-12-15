export function elementMatches(element, selector) {
    const matches = element.matches
        || element.mozMatchesSelector
        || element.msMatchesSelector
        || element.oMatchesSelector
        || element.webkitMatchesSelector;

    return matches.call(element, selector);
}

export function elementClosest(element, selector) {
    if (element.closest) {
        return element.closest(selector);
    }

    let currentElement = element;

    while (currentElement) {
        if (elementMatches(currentElement, selector)) {
            return currentElement;
        }

        currentElement = currentElement.parentElement;
    }

    return null;
}
