const users = require('./users.json');

function searchUsers(req, res) {
    res.json(users.slice(0, 1000));
}

module.exports = searchUsers;
