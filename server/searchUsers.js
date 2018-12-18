const getSearchQueryVariants = require('../client/shared/getSearchQueryVariants').getSearchQueryVariants;

const users = require('./users.json');

const SEND_USERS_COUNT = 1000;

function searchUsers(req, res) {
    const offset = req.query.offset ? Number(req.query.offset) : 0;
    const query = req.query.query;

    const filteredUsers = filterUsers(query);

    res.json({
        offset: offset,
        query: query,
        users: filteredUsers.slice(offset, offset + SEND_USERS_COUNT),
    });
}

module.exports = searchUsers;

function filterUsers(query) {
    if (!query) {
        return users;
    }

    return users.filter((user) => isUserSuitableForQuery(user, query));
}

function isUserSuitableForQuery(user, query) {
    const normalizedQuery = query.toLowerCase();
    const queryVariants = getSearchQueryVariants(normalizedQuery);

    if (queryVariants.some(
        queryVariant => user.name.toLowerCase().indexOf(queryVariant) === 0,
    )) {
        return true;
    }
    if (queryVariants.some(
        queryVariant => user.lastName.toLowerCase().indexOf(queryVariant) === 0,
    )) {
        return true;
    }
    if (queryVariants.some(
        queryVariant => user.domain.toLowerCase().indexOf(queryVariant) === 0,
    )) {
        return true;
    }
    if (queryVariants.some(
        queryVariant => user.occupation.toLowerCase().indexOf(queryVariant) === 0,
    )) {
        return true;
    }

    return false;
}
