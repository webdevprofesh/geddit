const jwt = require('jsonwebtoken');

function getUserId(token) {
    const tokenArr = token.split('Bearer ');
    if (tokenArr[1]) {
        const decoded = jwt.decode(tokenArr[1]);
        return decoded._id;
    }
}

module.exports = getUserId;
