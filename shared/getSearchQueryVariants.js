const ruKeysMap = require('./ruKeysMap.json');
const ruTransliterationMap = require('./ruTransliterationMap.json');

function revertKeysAndValues(obj) {
    const result = {};

    Object.keys(obj).forEach((key) => {
        const value = obj[key];
        result[value] = key;
    });

    return result;
}

function revertKeysAndValuesArray(obj) {
    const result = {};

    Object.keys(obj).forEach((key) => {
        const values = obj[key];
        values.forEach((value) => {
            result[value] = result[value] || [];
            result[value].push(key);
        });
    });

    return result;
}

const enKeysMap = revertKeysAndValues(ruKeysMap);
const enTransliterationMap = revertKeysAndValuesArray(ruTransliterationMap);

function getWrongLanguageVariant(input) {
    return input.replace(/./g, (ch) => {
        if (ruKeysMap.hasOwnProperty(ch)) {
            return ruKeysMap[ch];
        }
        if (enKeysMap.hasOwnProperty(ch)) {
            return enKeysMap[ch];
        }

        return ch;
    });
}

function getTransliteratedVariants(input) {
    let variantPairs = [{
        input: '',
        output: '',
    }];

    for (let idx = 0; idx < input.length; idx++) {
        const suitableVariants = [];
        const nextVariantPairs = [];
        variantPairs.forEach((pair) => {
            if (pair.input.length === idx) {
                suitableVariants.push(pair);
            } else {
                nextVariantPairs.push(pair);
            }
        });
        variantPairs = nextVariantPairs;
        if (suitableVariants.length !== 0) {
            for (let i = 1; idx + i <= input.length; i++) {
                const currentSubstring = input.slice(idx, idx + i);

                const suitableRuKeys = Object.keys(ruTransliterationMap)
                    .filter(key => key.indexOf(currentSubstring) === 0);
                const suitableEnKeys = Object.keys(enTransliterationMap)
                    .filter(key => key.indexOf(currentSubstring) === 0);

                if (suitableRuKeys.length === 0 && suitableEnKeys.length === 0) {
                    break;
                }

                if (suitableRuKeys.length) {
                    if (ruTransliterationMap.hasOwnProperty(currentSubstring)) {
                        const values = ruTransliterationMap[currentSubstring];
                        // eslint-disable-next-line no-loop-func
                        suitableVariants.forEach((variantPair) => {
                            values.forEach((value) => {
                                variantPairs.push({
                                    input: variantPair.input + currentSubstring,
                                    output: variantPair.output + value,
                                });
                            });
                        });
                    }
                }

                if (suitableEnKeys.length) {
                    if (enTransliterationMap.hasOwnProperty(currentSubstring)) {
                        const values = enTransliterationMap[currentSubstring];
                        // eslint-disable-next-line no-loop-func
                        suitableVariants.forEach((variantPair) => {
                            values.forEach((value) => {
                                variantPairs.push({
                                    input: variantPair.input + currentSubstring,
                                    output: variantPair.output + value,
                                });
                            });
                        });
                    }
                }
            }
        }
    }

    return variantPairs.map(pair => pair.output);
}

/**
 * @param {string} input
 * @return {string[]}
 */
function getSearchQueryVariants(input) {
    let variants = [input];

    const wrongLanguageVariant = getWrongLanguageVariant(input);
    variants.push(wrongLanguageVariant);

    variants = variants.concat(getTransliteratedVariants(input));

    variants = variants.concat(getTransliteratedVariants(wrongLanguageVariant));

    return variants;
}

module.exports = {
    getSearchQueryVariants,
};
global.getSearchQueryVariants = getSearchQueryVariants;
