const bcrypt = require('bcrypt');
const mongoUtils = require('../utils/mongo');
const getUserId = require('../auth/getUserId');

const saltRounds = 10;


const User = {
    id: 'UID',
    userId: 'String',
    username: 'String',
    password: 'hashed String',
    dateCreated: 'date',
    lastLogin: 'date',
    image: 'String',
    posts: ['postIdRef'],
    comments: ['commentIdRef'],
    categories: ['categoryIdRef'],
    preferences: {}
}

async function createUser(req, res) {
    const {username, password, image = 'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909__340.png'} = req.body;
    const userExists = await mongoUtils.read({collection: 'user', username: username});
    const errors = [];

    if (userExists) {
        errors.push({msg: 'username already exists, please use another username'});
    }

    if (!username) {
        errors.push({msg: 'username required'});
    }

    if (!password) {
        errors.push({msg: 'password required'});
    }

    if (errors.length) {
        return res.json({errors});
    }

    const hashedPass = await bcrypt.hash(password, saltRounds);

    const result = await mongoUtils.create({
        collection: 'user',
        data: {
            username,
            password: hashedPass,
            dateCreated: new Date(),
            lastLogin: new Date(),
            image,
            posts: [],
            comments: [],
            categories: [],
            preferences: {}
        }
    });

    res.json({userId: result.insertedId});
}

async function readUser(req, res) {
    const {userId} = req.params;
    const result = await mongoUtils.read({collection: 'user', id: userId});

    res.json(result);
}

async function updateUser(req, res) {
    const userId = getUserId(req.get('authorization'));

    const data = {};
    const validFields = ['username', 'password', 'image', 'preferences'];
    validFields.forEach(field => {
        if (req.body[field]) {
            data[field] = req.body[field];
        }
    });

    if (!Object.keys(data).length) {
        return res.json({errors: [{msg: 'No valid fields to update'}]});
    }

    await mongoUtils.update({collection: 'user', id: userId, data});
    res.json(data);
}

async function deleteUser(req, res) {
    const userId = getUserId(req.get('authorization'));

    await mongoUtils.delete({collection: 'user', id: userId});

    res.json({userId});
}

module.exports = {
    createUser, readUser, updateUser, deleteUser
};
