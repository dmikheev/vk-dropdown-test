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

function isPrefix(input, query) {
    if (query.length > input.length) {
        return false;
    }

    for (let i = 0; i < query.length; i++) {
        if (input[i] !== query[i]) {
            return false;
        }
    }

    return true;
}

function isWrongLangPrefix(input, query, keysMap) {
    if (query.length > input.length) {
        return false;
    }

    for (let i = 0; i < query.length; i++) {
        if (input[i] !== query[i] && keysMap[input[i]] !== query[i]) {
            return false;
        }
    }

    return true;
}

function isTransliteratedPrefix(input, query, transliterationMap) {
    const inputLangKeys = Object.keys(transliterationMap);

    let inputLeftUnchecked = input;
    let queryLeftUnchecked = query;

    do {
        let isFound = false;
        for (let inputLangIdx = 0; inputLangIdx < inputLangKeys.length; inputLangIdx++) {
            const inputLangKey = inputLangKeys[inputLangIdx];
            if (isPrefix(inputLeftUnchecked, inputLangKey)) {
                const transliteratedVariants = transliterationMap[inputLangKey];
                for (let variantIdx = 0; variantIdx < transliteratedVariants.length; variantIdx++) {
                    const transliterated = transliteratedVariants[variantIdx];
                    if (isPrefix(queryLeftUnchecked, transliterated)) {
                        inputLeftUnchecked = inputLeftUnchecked.substr(inputLangKey.length);
                        queryLeftUnchecked = queryLeftUnchecked.substr(transliterated.length);
                        isFound = true;
                        break;
                    }
                }

                if (isFound) {
                    break;
                }
            }
        }

        if (!isFound) {
            return false;
        }
    } while (queryLeftUnchecked.length > 0);

    return true;
}

function getWrongLanguageVariant(input, keysMap) {
    const resultArray = [];
    for (let i = 0; i < input.length; i++) {
        const ch = input[i];
        resultArray.push(keysMap.hasOwnProperty(ch) ? keysMap[ch] : ch);
    }

    return resultArray.join('');
}

function isTransliteratedWrongLangPrefix(input, query, keysMap, transliterationMap) {
    return isTransliteratedPrefix(
        input,
        getWrongLanguageVariant(query, keysMap),
        transliterationMap,
    );
}

function isStringSuitableForQuery(input, query) {
    if (!query) {
        return true;
    }

    return isPrefix(input, query)
        || isWrongLangPrefix(input, query, ruKeysMap)
        || isWrongLangPrefix(input, query, enKeysMap)
        || isTransliteratedPrefix(input, query, ruTransliterationMap)
        || isTransliteratedPrefix(input, query, enTransliterationMap)
        || isTransliteratedWrongLangPrefix(input, query, enKeysMap, enTransliterationMap)
        || isTransliteratedWrongLangPrefix(input, query, ruKeysMap, ruTransliterationMap);
}

function isSomeSuitableForQuery(strings, query) {
    return strings.some(str => isStringSuitableForQuery(str, query));
}

module.exports = {
    isSomeSuitableForQuery,
};
global.isSomeSuitableForQuery = isSomeSuitableForQuery;
