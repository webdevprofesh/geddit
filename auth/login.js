const bcrypt = require('bcrypt');
const mongoUtils = require('../utils/mongo');

async function login(username, password, cb) {
    const user = await mongoUtils.read({collection: 'user', username});
    const hashEqualsPass = await bcrypt.compare(password, user.password);
    if (!hashEqualsPass) {
        return cb(null, false, {msg: 'Incorrect email or password.'});
    }

    return cb(null, user, {msg: 'Logged In Successfully'});
}

module.exports = login;
