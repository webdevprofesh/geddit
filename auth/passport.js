const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passportJWT = require("passport-jwt");
const login = require('./login');
const mongoUtil = require('../utils/mongo');

const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

passport.use(new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password'
    },
    login
));

passport.use(
    new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey   : process.env.SECRET
    },
    async function (jwtPayload, cb) {
        try {
            const user = await mongoUtil.read({collection: 'user', id: jwtPayload});
            return cb(null, user);
        } catch (err) {
            return cb(err);
        }
    }
));