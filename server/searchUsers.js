const isSomeSuitableForQuery = require('../client/shared/isSomeSuitableForQuery').isSomeSuitableForQuery;

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

    const normalizedQuery = query.toLowerCase();

    return users.filter(createQueryChecker(normalizedQuery));
}

const createQueryChecker = (query) => (user) => {
    const lastNameLower = user.lastName.toLowerCase();
    return isSomeSuitableForQuery(
        [
            user.name.toLowerCase() + ' ' + lastNameLower,
            lastNameLower,
            user.domain.toLowerCase(),
            user.occupation.toLowerCase(),
        ],
        query,
    )
};
