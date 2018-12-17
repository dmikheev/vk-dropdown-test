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

    const lowerQuery = query.toLowerCase();
    return users.filter((user) => isUserSuitableForQuery(user, lowerQuery));
}

function isUserSuitableForQuery(user, query) {
    if (user.name.toLowerCase().indexOf(query) === 0) {
        return true;
    }
    if (user.lastName.toLowerCase().indexOf(query) === 0) {
        return true;
    }
    if (user.domain.toLowerCase().indexOf(query) === 0) {
        return true;
    }
    if (user.occupation.toLowerCase().indexOf(query) === 0) {
        return true;
    }

    return false;
}
