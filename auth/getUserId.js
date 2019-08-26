const jwt = require('jsonwebtoken');

function getUserId(token) {
    const tokenArr = token.split('Bearer ');
    if (tokenArr[1]) return jwt.decode(tokenArr[1]);
}

module.exports = getUserId;
