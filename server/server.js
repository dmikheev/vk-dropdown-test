const express = require('express');
const searchUsers = require('./searchUsers');

const app = express();

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    next();
});

app.get('/api/users/search', searchUsers);

app.listen(80, () => {
    console.log('Server started');
});
